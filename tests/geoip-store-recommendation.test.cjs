const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const api = require('../assets/geoip-store-recommendation.js');

function detectedPayload(country) {
  return { detected_values: { country: { handle: country } } };
}

function shouldRecommend(profile, hostname, country) {
  const route = api.resolveRoute(profile, hostname);
  return Boolean(route && api.readDetectedCountry(detectedPayload(country)) === route.triggerCountry);
}

function memoryStorage() {
  const values = new Map();
  return {
    getItem(key) {
      return values.has(key) ? values.get(key) : null;
    },
    setItem(key, value) {
      values.set(key, String(value));
    },
    removeItem(key) {
      values.delete(key);
    },
  };
}

function wrapperStorage() {
  const storage = memoryStorage();
  return {
    get: () => storage.getItem(api.STORAGE_KEY),
    set: (value) => {
      storage.setItem(api.STORAGE_KEY, value);
      return true;
    },
    remove: () => {
      storage.removeItem(api.STORAGE_KEY);
      return true;
    },
  };
}

function markerWindow(href) {
  let replaced = '';
  return {
    location: new URL(href),
    history: {
      state: null,
      replaceState(state, title, value) {
        replaced = value;
      },
    },
    replaced: () => replaced,
  };
}

function requestWindow(fetchImpl) {
  return {
    fetch: fetchImpl,
    location: {
      origin: 'https://ozdesignsofa.com',
    },
    Shopify: {
      routes: { root: '/' },
    },
    setTimeout,
    clearTimeout,
  };
}

test('AU on OZDESIGN recommends OZROOMY', () => {
  assert.equal(shouldRecommend('ozdesignsofa', 'www.ozdesignsofa.com', 'AU'), true);
});

test('AU on OZROOMY does not recommend another store', () => {
  assert.equal(shouldRecommend('ozroomy', 'ozroomy.com.au', 'AU'), false);
});

test('GB on OZROOMY recommends OZDESIGN', () => {
  assert.equal(shouldRecommend('ozroomy', 'www.ozroomy.com.au', 'GB'), true);
});

test('GB on OZDESIGN does not recommend another store', () => {
  assert.equal(shouldRecommend('ozdesignsofa', 'ozdesignsofa.com', 'GB'), false);
});

test('US and other countries never trigger either route', () => {
  for (const country of ['US', 'DE', 'FR', 'JP']) {
    assert.equal(shouldRecommend('ozdesignsofa', 'ozdesignsofa.com', country), false);
    assert.equal(shouldRecommend('ozroomy', 'ozroomy.com.au', country), false);
  }
});

test('unknown and malformed detected countries fail closed', () => {
  assert.equal(api.readDetectedCountry({}), '');
  assert.equal(api.readDetectedCountry({ detected_values: { country: { handle: 'Australia' } } }), '');
  assert.equal(api.readDetectedCountry({ detected_values: { country: { handle: 123 } } }), '');
});

test('failed GeoIP request fails silently', async () => {
  const country = await api.requestDetectedCountry({
    window: requestWindow(async () => {
      throw new Error('network failure');
    }),
    timeoutMs: 20,
  });
  assert.equal(country, '');
});

test('GeoIP timeout fails silently', async () => {
  const country = await api.requestDetectedCountry({
    window: requestWindow((url, options) => new Promise((resolve, reject) => {
      options.signal.addEventListener('abort', () => reject(new Error('aborted')));
    })),
    timeoutMs: 5,
  });
  assert.equal(country, '');
});

test('invalid JSON fails silently', async () => {
  const country = await api.requestDetectedCountry({
    window: requestWindow(async () => ({
      ok: true,
      json: async () => {
        throw new SyntaxError('invalid JSON');
      },
    })),
    timeoutMs: 20,
  });
  assert.equal(country, '');
});

test('unexpected response schema fails closed', async () => {
  const country = await api.requestDetectedCountry({
    window: requestWindow(async () => ({ ok: true, json: async () => ({ suggestions: [] }) })),
    timeoutMs: 20,
  });
  assert.equal(country, '');
});

test('HTTP error response fails closed', async () => {
  const country = await api.requestDetectedCountry({
    window: requestWindow(async () => ({ ok: false, json: async () => detectedPayload('AU') })),
    timeoutMs: 20,
  });
  assert.equal(country, '');
});

test('missing browser storage returns null', () => {
  assert.equal(api.createStorage({ localStorage: null, sessionStorage: null }), null);
});

test('storage exceptions fall back from localStorage to sessionStorage', () => {
  const sessionStorage = memoryStorage();
  const win = { sessionStorage };
  Object.defineProperty(win, 'localStorage', {
    get() {
      throw new Error('blocked');
    },
  });
  const storage = api.createStorage(win);
  assert.equal(storage.type, 'sessionStorage');
});

test('close-button cooldown suppresses for the configured period', () => {
  const storage = wrapperStorage();
  const now = 1_000_000;
  api.writePreference(storage, { dismissedUntil: now + 14 * api.DAY_MS }, now);
  assert.equal(api.isSuppressed(api.readPreference(storage, now), now), true);
});

test('continue-shopping cooldown suppresses for 30 days', () => {
  const storage = wrapperStorage();
  const now = 2_000_000;
  api.writePreference(storage, { stayUntil: now + 30 * api.DAY_MS }, now);
  assert.equal(api.isSuppressed(api.readPreference(storage, now), now), true);
});

test('expired preference becomes eligible again', () => {
  const storage = wrapperStorage();
  const now = 3_000_000;
  api.writePreference(storage, { dismissedUntil: now - 1, stayUntil: now - 1 }, now - 2);
  assert.equal(api.isSuppressed(api.readPreference(storage, now), now), false);
});

test('manual country preference takes precedence', () => {
  const storage = wrapperStorage();
  const now = 4_000_000;
  api.writePreference(storage, { manualCountry: 'GB', manualUntil: now + 30 * api.DAY_MS }, now);
  const preference = api.readPreference(storage, now);
  assert.equal(preference.manualCountry, 'GB');
  assert.equal(api.isSuppressed(preference, now), true);
});

test('valid cross-domain marker suppresses the destination and preserves other URL state', () => {
  const storage = wrapperStorage();
  const win = markerWindow('https://www.ozroomy.com.au/?utm_source=email&oz_geo_switch=ozd_to_ozr#offer');
  const now = 5_000_000;
  assert.equal(api.consumeArrivalMarker(win, storage, now), true);
  assert.equal(win.replaced(), '/?utm_source=email#offer');
  assert.equal(api.isSuppressed(api.readPreference(storage, now), now), true);
});

test('reverse recommendation is prevented after intentional arrival', () => {
  const storage = wrapperStorage();
  const win = markerWindow('https://ozdesignsofa.com/?oz_geo_switch=ozr_to_ozd');
  const now = 6_000_000;
  api.consumeArrivalMarker(win, storage, now);
  assert.equal(api.isSuppressed(api.readPreference(storage, now), now), true);
});

test('invalid marker is cleaned without creating suppression', () => {
  const storage = wrapperStorage();
  const win = markerWindow('https://ozdesignsofa.com/?oz_geo_switch=ozd_to_ozr&keep=1');
  const now = 7_000_000;
  assert.equal(api.consumeArrivalMarker(win, storage, now), false);
  assert.equal(win.replaced(), '/?keep=1');
  assert.equal(api.isSuppressed(api.readPreference(storage, now), now), false);
});

test('destination URL keeps only approved UTM parameters and the internal marker', () => {
  const route = api.resolveRoute('ozdesignsofa', 'ozdesignsofa.com');
  const result = new URL(api.buildDestinationUrl(
    'https://www.ozroomy.com.au',
    route,
    'https://ozdesignsofa.com/products/test?utm_source=google&utm_campaign=sale&gclid=secret&fbclid=secret&_gl=secret&customer_token=secret',
  ));
  assert.equal(result.searchParams.get('utm_source'), 'google');
  assert.equal(result.searchParams.get('utm_campaign'), 'sale');
  assert.equal(result.searchParams.get('oz_geo_switch'), 'ozd_to_ozr');
  assert.equal(result.searchParams.has('gclid'), false);
  assert.equal(result.searchParams.has('fbclid'), false);
  assert.equal(result.searchParams.has('_gl'), false);
  assert.equal(result.searchParams.has('customer_token'), false);
});

test('unapproved target URLs fall back to the allowlisted destination', () => {
  const route = api.resolveRoute('ozroomy', 'ozroomy.com.au');
  const malicious = api.validateDestination('https://example.com/phish', route);
  const pathOverride = api.validateDestination('https://www.ozdesignsofa.com/collections/all', route);
  assert.equal(malicious.href, route.destination);
  assert.equal(pathOverride.href, route.destination);
});

test('unsupported hostname including ozroomy.com has no route', () => {
  assert.equal(api.resolveRoute('ozroomy', 'ozroomy.com'), null);
  assert.equal(api.resolveRoute('auto', 'preview.example.com'), null);
});

test('eligible content pages exclude cart and sensitive flows', () => {
  assert.equal(api.isEligiblePage('product', '/products/pebble'), true);
  assert.equal(api.isEligiblePage('collection', '/collections/all'), true);
  assert.equal(api.isEligiblePage('page', '/pages/about'), true);
  assert.equal(api.isEligiblePage('page', '/cart'), false);
  assert.equal(api.isEligiblePage('page', '/account/login'), false);
  assert.equal(api.isEligiblePage('password', '/password'), false);
});

test('Shopify endpoint is same-origin with country-only discovery enabled', () => {
  const endpoint = new URL(api.buildSuggestionEndpoint('https://ozroomy.com.au', '/en'));
  assert.equal(endpoint.origin, 'https://ozroomy.com.au');
  assert.equal(endpoint.pathname, '/en/browsing_context_suggestions.json');
  assert.equal(endpoint.searchParams.get('country[enabled]'), 'true');
  assert.equal(endpoint.searchParams.get('language[enabled]'), 'false');
  assert.equal(endpoint.searchParams.has('country[exclude]'), false);
});

test('duplicate boot is prevented', () => {
  let listeners = 0;
  const win = {
    document: {
      readyState: 'loading',
      addEventListener() {
        listeners += 1;
      },
    },
  };
  api.boot(win);
  api.boot(win);
  assert.equal(listeners, 1);
});

test('disabled popup setting prevents initialization', async () => {
  const element = { dataset: { initialized: 'false', enabled: 'false' } };
  assert.equal(await api.initializeElement(element, {}, wrapperStorage()), false);
  assert.equal(element.dataset.initialized, 'true');
});

test('CTA is a same-tab anchor exempted only from the existing external-link rule', () => {
  const root = path.resolve(__dirname, '..');
  const section = fs.readFileSync(path.join(root, 'sections', 'geoip-store-recommendation.liquid'), 'utf8');
  const layout = fs.readFileSync(path.join(root, 'layout', 'theme.liquid'), 'utf8');
  assert.match(section, /<a[\s\S]*data-geoip-store-recommendation-cta/);
  assert.doesNotMatch(section, /data-geoip-store-recommendation-cta[\s\S]{0,120}target="_blank"/);
  assert.match(layout, /!links\[i\]\.hasAttribute\('data-geoip-store-recommendation-cta'\)/);
});

test('mobile and reduced-motion safeguards are present', () => {
  const css = fs.readFileSync(path.resolve(__dirname, '..', 'assets', 'geoip-store-recommendation.css'), 'utf8');
  assert.match(css, /max-width: 749px/);
  assert.match(css, /min-height: 4\.8rem/);
  assert.match(css, /100dvh/);
  assert.match(css, /prefers-reduced-motion: reduce/);
});

test('keyboard focus trapping, Escape close, and focus restoration are present', () => {
  const js = fs.readFileSync(path.resolve(__dirname, '..', 'assets', 'geoip-store-recommendation.js'), 'utf8');
  assert.match(js, /event\.key === 'Escape'/);
  assert.match(js, /event\.key !== 'Tab'/);
  assert.match(js, /previousFocus\.focus/);
  assert.match(js, /aria-hidden/);
});
