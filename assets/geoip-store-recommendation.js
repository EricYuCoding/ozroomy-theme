(function (root, factory) {
  'use strict';

  const api = factory();

  if (typeof module === 'object' && module.exports) {
    module.exports = api;
  }

  if (root && root.document) {
    api.boot(root);
  }
})(typeof window !== 'undefined' ? window : null, function () {
  'use strict';

  const STORAGE_KEY = 'oz-cross-store-recommendation:v1';
  const STORAGE_VERSION = 1;
  const DAY_MS = 24 * 60 * 60 * 1000;
  const STAY_DAYS = 30;
  const REQUEST_TIMEOUT_MS = 3000;
  const MARKER_PARAM = 'oz_geo_switch';
  const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
  const ELIGIBLE_PAGE_TYPES = new Set(['index', 'collection', 'product', 'page', 'blog', 'article', 'search']);
  const EXCLUDED_PATH_PREFIXES = ['/cart', '/checkout', '/account', '/challenge', '/password', '/orders', '/gift_cards'];
  const ROUTES = Object.freeze([
    Object.freeze({
      id: 'ozd_to_ozr',
      profile: 'ozdesignsofa',
      sourceHosts: Object.freeze(['ozdesignsofa.com', 'www.ozdesignsofa.com']),
      triggerCountry: 'AU',
      destination: 'https://www.ozroomy.com.au/',
      destinationHosts: Object.freeze(['ozroomy.com.au', 'www.ozroomy.com.au']),
    }),
    Object.freeze({
      id: 'ozr_to_ozd',
      profile: 'ozroomy',
      sourceHosts: Object.freeze(['ozroomy.com.au', 'www.ozroomy.com.au']),
      triggerCountry: 'GB',
      destination: 'https://www.ozdesignsofa.com/',
      destinationHosts: Object.freeze(['ozdesignsofa.com', 'www.ozdesignsofa.com']),
    }),
  ]);

  function normalizeHost(value) {
    return typeof value === 'string' ? value.trim().toLowerCase().replace(/\.$/, '') : '';
  }

  function normalizeCountryCode(value) {
    if (typeof value !== 'string') return '';
    const country = value.trim().toUpperCase();
    return /^[A-Z]{2}$/.test(country) ? country : '';
  }

  function readDetectedCountry(payload) {
    const country = normalizeCountryCode(payload && payload.detected_values && payload.detected_values.country && payload.detected_values.country.handle);
    return country === 'AU' || country === 'GB' ? country : '';
  }

  function getEditorPreviewState(element, win) {
    const dataset = element && element.dataset ? element.dataset : {};
    const liquidDesignMode = dataset.designMode === 'true';
    const javascriptDesignMode = Boolean(win && win.Shopify && win.Shopify.designMode);
    const active = liquidDesignMode && javascriptDesignMode;
    const requestedMode = active && typeof dataset.editorPreviewMode === 'string'
      ? dataset.editorPreviewMode.trim().toLowerCase()
      : 'automatic';
    const mode = ['automatic', 'show', 'hide'].includes(requestedMode) ? requestedMode : 'automatic';
    const requestedCountry = normalizeCountryCode(dataset.editorPreviewCountry);
    const country = requestedCountry === 'GB' ? 'GB' : 'AU';

    return Object.freeze({
      active: active,
      mode: mode,
      country: country,
      forcedVisible: active && mode === 'show',
      forcedHidden: active && mode === 'hide',
    });
  }

  function resolvePreviewRoute(country) {
    const normalizedCountry = normalizeCountryCode(country);
    return ROUTES.find(function (route) {
      return route.triggerCountry === normalizedCountry;
    }) || null;
  }

  function getRecommendationContent(element, country) {
    const normalizedCountry = normalizeCountryCode(country) === 'GB' ? 'gb' : 'au';
    const dataset = element && element.dataset ? element.dataset : {};
    return Object.freeze({
      heading: dataset[normalizedCountry + 'Heading'] || '',
      description: dataset[normalizedCountry + 'Description'] || '',
      ctaText: dataset[normalizedCountry + 'CtaText'] || '',
    });
  }

  function updateTopContent(element, country) {
    const topContent = element.querySelector('[data-geoip-top-content]');
    if (!topContent) return;

    const textOptions = Array.from(topContent.querySelectorAll('[data-geoip-top-text]'));
    if (textOptions.length === 0) return;

    let hasVisibleText = false;
    textOptions.forEach(function (option) {
      const matchesCountry = option.dataset.geoipTopText === country;
      const hasText = option.textContent.trim() !== '';
      option.hidden = !matchesCountry || !hasText;
      if (!option.hidden) hasVisibleText = true;
    });
    topContent.hidden = !hasVisibleText;
  }

  function resolveRoute(profile, hostname) {
    const normalizedProfile = typeof profile === 'string' ? profile.trim().toLowerCase() : '';
    const host = normalizeHost(hostname);

    return ROUTES.find(function (route) {
      const profileMatches = normalizedProfile === 'auto' || normalizedProfile === route.profile;
      return profileMatches && route.sourceHosts.includes(host);
    }) || null;
  }

  function isEligiblePage(pageType, pathname) {
    const normalizedType = typeof pageType === 'string' ? pageType.trim().toLowerCase() : '';
    const normalizedPath = typeof pathname === 'string' ? pathname.trim().toLowerCase() : '';

    if (!ELIGIBLE_PAGE_TYPES.has(normalizedType)) return false;
    return !EXCLUDED_PATH_PREFIXES.some(function (prefix) {
      return normalizedPath === prefix || normalizedPath.startsWith(prefix + '/');
    });
  }

  function validateDestination(configuredUrl, route) {
    const fallback = new URL(route.destination);
    if (typeof configuredUrl !== 'string' || configuredUrl.trim() === '') return fallback;

    try {
      const candidate = new URL(configuredUrl.trim());
      const host = normalizeHost(candidate.hostname);
      const hasRootPath = candidate.pathname === '/' || candidate.pathname === '';
      const isAllowed = candidate.protocol === 'https:'
        && candidate.username === ''
        && candidate.password === ''
        && candidate.port === ''
        && route.destinationHosts.includes(host)
        && hasRootPath
        && candidate.search === ''
        && candidate.hash === '';

      return isAllowed ? candidate : fallback;
    } catch (error) {
      return fallback;
    }
  }

  function buildDestinationUrl(configuredUrl, route, currentHref) {
    const destination = validateDestination(configuredUrl, route);

    try {
      const current = new URL(currentHref);
      UTM_KEYS.forEach(function (key) {
        const value = current.searchParams.get(key);
        if (value && value.length <= 200 && !/[\u0000-\u001F\u007F]/.test(value)) {
          destination.searchParams.set(key, value);
        }
      });
    } catch (error) {
      destination.search = '';
    }

    destination.searchParams.set(MARKER_PARAM, route.id);
    return destination.href;
  }

  function createStorage(win) {
    const candidates = ['localStorage', 'sessionStorage'];

    for (let index = 0; index < candidates.length; index += 1) {
      try {
        const candidate = win[candidates[index]];
        if (!candidate) continue;
        const testKey = STORAGE_KEY + ':test';
        candidate.setItem(testKey, '1');
        candidate.removeItem(testKey);

        return {
          type: index === 0 ? 'localStorage' : 'sessionStorage',
          get: function () {
            try {
              return candidate.getItem(STORAGE_KEY);
            } catch (error) {
              return null;
            }
          },
          set: function (value) {
            try {
              candidate.setItem(STORAGE_KEY, value);
              return true;
            } catch (error) {
              return false;
            }
          },
          remove: function () {
            try {
              candidate.removeItem(STORAGE_KEY);
            } catch (error) {
              return false;
            }
            return true;
          },
        };
      } catch (error) {
        continue;
      }
    }

    return null;
  }

  function emptyPreference() {
    return {
      version: STORAGE_VERSION,
      dismissedUntil: 0,
      stayUntil: 0,
      manualCountry: '',
      manualUntil: 0,
      lastRoute: '',
    };
  }

  function readPreference(storage, now) {
    const fallback = emptyPreference();
    if (!storage) return fallback;

    try {
      const raw = storage.get();
      if (!raw) return fallback;
      const parsed = JSON.parse(raw);
      if (!parsed || parsed.version !== STORAGE_VERSION) {
        storage.remove();
        return fallback;
      }

      const preference = {
        version: STORAGE_VERSION,
        dismissedUntil: Number.isFinite(parsed.dismissedUntil) ? parsed.dismissedUntil : 0,
        stayUntil: Number.isFinite(parsed.stayUntil) ? parsed.stayUntil : 0,
        manualCountry: normalizeCountryCode(parsed.manualCountry),
        manualUntil: Number.isFinite(parsed.manualUntil) ? parsed.manualUntil : 0,
        lastRoute: typeof parsed.lastRoute === 'string' ? parsed.lastRoute : '',
      };

      if (preference.dismissedUntil <= now) preference.dismissedUntil = 0;
      if (preference.stayUntil <= now) preference.stayUntil = 0;
      if (preference.manualUntil <= now) {
        preference.manualUntil = 0;
        preference.manualCountry = '';
      }

      return preference;
    } catch (error) {
      storage.remove();
      return fallback;
    }
  }

  function writePreference(storage, patch, now) {
    if (!storage) return false;
    const next = Object.assign(readPreference(storage, now), patch, { version: STORAGE_VERSION });
    return storage.set(JSON.stringify(next));
  }

  function isSuppressed(preference, now) {
    return preference.dismissedUntil > now || preference.stayUntil > now || preference.manualUntil > now;
  }

  function consumeArrivalMarker(win, storage, now) {
    let url;

    try {
      url = new URL(win.location.href);
    } catch (error) {
      return false;
    }

    if (!url.searchParams.has(MARKER_PARAM)) return false;

    const marker = url.searchParams.get(MARKER_PARAM);
    const host = normalizeHost(url.hostname);
    const route = ROUTES.find(function (candidate) {
      return candidate.id === marker && candidate.destinationHosts.includes(host);
    });

    if (route && storage) {
      writePreference(storage, {
        stayUntil: now + STAY_DAYS * DAY_MS,
        lastRoute: route.id,
      }, now);
    }

    url.searchParams.delete(MARKER_PARAM);
    const cleanUrl = url.pathname + (url.search ? url.search : '') + (url.hash ? url.hash : '');

    try {
      win.history.replaceState(win.history.state, '', cleanUrl);
    } catch (error) {
      return Boolean(route);
    }

    return Boolean(route);
  }

  function buildSuggestionEndpoint(origin, routesRoot) {
    const rootPath = typeof routesRoot === 'string' && routesRoot.startsWith('/') ? routesRoot : '/';
    const normalizedRoot = rootPath.endsWith('/') ? rootPath : rootPath + '/';
    const endpoint = new URL(normalizedRoot + 'browsing_context_suggestions.json', origin);
    endpoint.searchParams.set('country[enabled]', 'true');
    endpoint.searchParams.set('language[enabled]', 'false');
    return endpoint.href;
  }

  async function requestDetectedCountry(options) {
    const win = options.window;
    const fetchImpl = options.fetchImpl || win.fetch.bind(win);
    const timeoutMs = Number.isFinite(options.timeoutMs) ? options.timeoutMs : REQUEST_TIMEOUT_MS;
    const setTimeoutImpl = options.setTimeoutImpl || win.setTimeout.bind(win);
    const clearTimeoutImpl = options.clearTimeoutImpl || win.clearTimeout.bind(win);
    const controller = new AbortController();
    const timeoutId = setTimeoutImpl(function () {
      controller.abort();
    }, timeoutMs);

    try {
      const endpoint = buildSuggestionEndpoint(win.location.origin, win.Shopify && win.Shopify.routes && win.Shopify.routes.root);
      const response = await fetchImpl(endpoint, {
        credentials: 'same-origin',
        headers: { Accept: 'application/json' },
        signal: controller.signal,
      });

      if (!response || !response.ok) return '';
      const payload = await response.json();
      return readDetectedCountry(payload);
    } catch (error) {
      return '';
    } finally {
      clearTimeoutImpl(timeoutId);
    }
  }

  function extractManualCountry(target) {
    if (!target || typeof target.closest !== 'function') return '';

    if (target.matches && target.matches('select[name="country_code"]')) {
      return normalizeCountryCode(target.value);
    }

    const option = target.closest('[data-country-option], localization-form [data-value], .localization-form [data-value]');
    if (!option) return '';
    const form = option.closest('form');
    if (!form || !form.querySelector('input[name="country_code"], select[name="country_code"]')) return '';
    return normalizeCountryCode(option.dataset && (option.dataset.value || option.dataset.countryOption));
  }

  function installManualPreferenceHooks(win, storage, onPreference) {
    if (!storage || win.__ozGeoIPManualHooksInstalled) return;
    win.__ozGeoIPManualHooksInstalled = true;

    const save = function (country) {
      const normalizedCountry = normalizeCountryCode(country);
      if (!normalizedCountry) return;
      const now = Date.now();
      writePreference(storage, {
        manualCountry: normalizedCountry,
        manualUntil: now + STAY_DAYS * DAY_MS,
        stayUntil: now + STAY_DAYS * DAY_MS,
      }, now);
      if (typeof onPreference === 'function') onPreference(normalizedCountry);
    };

    win.document.addEventListener('click', function (event) {
      if (!event.isTrusted) return;
      save(extractManualCountry(event.target));
    }, true);

    win.document.addEventListener('change', function (event) {
      if (!event.isTrusted || !event.target.matches('select[name="country_code"]')) return;
      save(event.target.value);
    }, true);

    win.document.addEventListener('submit', function (event) {
      if (!event.isTrusted || !event.target.matches('form')) return;
      const input = event.target.querySelector('input[name="country_code"], select[name="country_code"]');
      if (input) save(input.value);
    }, true);
  }

  function hasCompetingModal(doc) {
    return Boolean(doc.querySelector('dialog[open], .popup-modal--active, .popup-overlay--active'));
  }

  function getFocusableElements(dialog) {
    return Array.from(dialog.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])')).filter(function (element) {
      return !element.hidden && element.getAttribute('aria-hidden') !== 'true';
    });
  }

  function showRecommendation(element, win, storage, route, country, options) {
    const settings = options || {};
    const editorPreview = settings.editorPreview === true;
    const dialog = element.querySelector('.geoip-store-recommendation__dialog');
    const heading = element.querySelector('.geoip-store-recommendation__heading');
    const description = element.querySelector('.geoip-store-recommendation__description');
    const cta = element.querySelector('[data-geoip-store-recommendation-cta]');
    const closeButton = element.querySelector('[data-geoip-close]');
    const continueButton = element.querySelector('[data-geoip-continue]');

    if (!dialog || !heading || !description || !cta || !closeButton || !continueButton) return null;

    const content = getRecommendationContent(element, country);
    const destination = buildDestinationUrl(element.dataset.targetUrl, route, win.location.href);
    heading.textContent = content.heading;
    description.textContent = content.description;
    cta.textContent = content.ctaText;
    updateTopContent(element, country);
    cta.href = destination;
    cta.target = '_self';
    cta.removeAttribute('rel');
    if (editorPreview) cta.setAttribute('data-editor-preview', 'true');

    let open = true;
    const previousFocus = win.document.activeElement;
    const dismissDays = Math.max(1, Math.min(30, Number(element.dataset.dismissDays) || 14));

    const close = function (reason) {
      if (!open) return;
      open = false;
      const now = Date.now();

      if (!editorPreview && reason === 'dismiss') {
        writePreference(storage, { dismissedUntil: now + dismissDays * DAY_MS }, now);
      } else if (!editorPreview && reason === 'stay') {
        writePreference(storage, { stayUntil: now + STAY_DAYS * DAY_MS }, now);
      }

      win.document.removeEventListener('keydown', onKeyDown, true);
      win.document.body.classList.remove('geoip-store-recommendation-open');

      if (typeof dialog.close === 'function' && dialog.open) {
        dialog.close();
      } else {
        dialog.removeAttribute('open');
      }

      dialog.removeAttribute('data-fallback-open');
      dialog.hidden = true;
      if (win.__ozGeoIPActiveController && win.__ozGeoIPActiveController.close === close) {
        win.__ozGeoIPActiveController = null;
      }

      if (previousFocus && previousFocus.isConnected && typeof previousFocus.focus === 'function') {
        previousFocus.focus({ preventScroll: true });
      }
    };

    const onKeyDown = function (event) {
      if (!open) return;

      if (event.key === 'Escape') {
        event.preventDefault();
        close('dismiss');
        return;
      }

      if (event.key !== 'Tab') return;
      const focusable = getFocusableElements(dialog);
      if (focusable.length === 0) {
        event.preventDefault();
        heading.focus({ preventScroll: true });
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && win.document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && win.document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    closeButton.addEventListener('click', function () {
      close('dismiss');
    }, { once: true });

    continueButton.addEventListener('click', function () {
      close('stay');
    }, { once: true });

    cta.addEventListener('click', function (event) {
      if (editorPreview) {
        event.preventDefault();
        return;
      }
      const now = Date.now();
      writePreference(storage, {
        stayUntil: now + STAY_DAYS * DAY_MS,
        lastRoute: route.id,
      }, now);
    }, { once: true });

    dialog.addEventListener('cancel', function (event) {
      event.preventDefault();
      close('dismiss');
    }, { once: true });

    dialog.addEventListener('click', function (event) {
      if (event.target === dialog) close('dismiss');
    });

    win.document.addEventListener('keydown', onKeyDown, true);
    dialog.hidden = false;
    win.document.body.classList.add('geoip-store-recommendation-open');

    try {
      if (typeof dialog.showModal === 'function') {
        dialog.showModal();
      } else {
        dialog.setAttribute('open', '');
        dialog.setAttribute('data-fallback-open', 'true');
      }
    } catch (error) {
      dialog.setAttribute('open', '');
      dialog.setAttribute('data-fallback-open', 'true');
    }

    heading.focus({ preventScroll: true });
    return { close: close, element: element, editorPreview: editorPreview };
  }

  async function initializeElement(element, win, storage) {
    if (!element || element.dataset.initialized === 'true') return false;
    element.dataset.initialized = 'true';

    const editorPreview = getEditorPreviewState(element, win);
    if (editorPreview.forcedHidden) {
      if (win.__ozGeoIPActiveController) win.__ozGeoIPActiveController.close('replace');
      return false;
    }

    if (editorPreview.forcedVisible) {
      const previewRoute = resolvePreviewRoute(editorPreview.country);
      if (!previewRoute) return false;
      if (win.__ozGeoIPActiveController) win.__ozGeoIPActiveController.close('replace');
      const previewController = showRecommendation(element, win, null, previewRoute, editorPreview.country, { editorPreview: true });
      if (!previewController) return false;
      win.__ozGeoIPActiveController = previewController;
      return true;
    }

    if (!storage || element.dataset.enabled !== 'true') return false;

    if (!isEligiblePage(element.dataset.pageType, element.dataset.pagePath || win.location.pathname)) return false;

    const route = resolveRoute(element.dataset.storeProfile, win.location.hostname);
    if (!route) return false;

    const now = Date.now();
    if (isSuppressed(readPreference(storage, now), now)) return false;

    const delayMs = Math.max(0, Math.min(10000, Number(element.dataset.displayDelayMs) || 0));
    const countryPromise = requestDetectedCountry({ window: win });
    const delayPromise = new Promise(function (resolve) {
      win.setTimeout(resolve, delayMs);
    });
    const result = await Promise.all([countryPromise, delayPromise]);
    const country = result[0];

    if (country !== route.triggerCountry) return false;
    const currentTime = Date.now();
    if (isSuppressed(readPreference(storage, currentTime), currentTime)) return false;
    if (hasCompetingModal(win.document)) return false;
    if ('isConnected' in element && !element.isConnected) return false;

    const controller = showRecommendation(element, win, storage, route, country);
    if (!controller) return false;
    win.__ozGeoIPActiveController = controller;
    return true;
  }

  function boot(win) {
    if (win.__ozGeoIPRecommendationBooted) return;
    win.__ozGeoIPRecommendationBooted = true;

    const start = function () {
      const storage = createStorage(win);
      consumeArrivalMarker(win, storage, Date.now());
      installManualPreferenceHooks(win, storage, function () {
        if (win.__ozGeoIPActiveController) {
          win.__ozGeoIPActiveController.close('manual');
        }
      });

      win.document.querySelectorAll('geoip-store-recommendation').forEach(function (element) {
        initializeElement(element, win, storage);
      });

      win.document.addEventListener('shopify:section:load', function (event) {
        const element = event.target.matches && event.target.matches('geoip-store-recommendation')
          ? event.target
          : event.target.querySelector && event.target.querySelector('geoip-store-recommendation');
        if (!element) return;
        if (win.__ozGeoIPActiveController) win.__ozGeoIPActiveController.close('replace');
        element.dataset.initialized = 'false';
        initializeElement(element, win, storage);
      });

      win.document.addEventListener('shopify:section:select', function (event) {
        const element = event.target.matches && event.target.matches('geoip-store-recommendation')
          ? event.target
          : event.target.querySelector && event.target.querySelector('geoip-store-recommendation');
        if (!element || !getEditorPreviewState(element, win).forcedVisible) return;
        if (win.__ozGeoIPActiveController) win.__ozGeoIPActiveController.close('replace');
        element.dataset.initialized = 'false';
        initializeElement(element, win, storage);
      });

      win.document.addEventListener('shopify:section:unload', function (event) {
        const controller = win.__ozGeoIPActiveController;
        if (!controller || !controller.element) return;
        const containsController = event.target === controller.element
          || (event.target.contains && event.target.contains(controller.element));
        if (containsController) controller.close('replace');
      });
    };

    if (win.document.readyState === 'loading') {
      win.document.addEventListener('DOMContentLoaded', start, { once: true });
    } else {
      start();
    }
  }

  return Object.freeze({
    DAY_MS: DAY_MS,
    MARKER_PARAM: MARKER_PARAM,
    ROUTES: ROUTES,
    STORAGE_KEY: STORAGE_KEY,
    buildDestinationUrl: buildDestinationUrl,
    buildSuggestionEndpoint: buildSuggestionEndpoint,
    consumeArrivalMarker: consumeArrivalMarker,
    createStorage: createStorage,
    emptyPreference: emptyPreference,
    extractManualCountry: extractManualCountry,
    getEditorPreviewState: getEditorPreviewState,
    getRecommendationContent: getRecommendationContent,
    initializeElement: initializeElement,
    isEligiblePage: isEligiblePage,
    isSuppressed: isSuppressed,
    normalizeCountryCode: normalizeCountryCode,
    readDetectedCountry: readDetectedCountry,
    readPreference: readPreference,
    requestDetectedCountry: requestDetectedCountry,
    resolvePreviewRoute: resolvePreviewRoute,
    resolveRoute: resolveRoute,
    validateDestination: validateDestination,
    writePreference: writePreference,
    boot: boot,
  });
});
