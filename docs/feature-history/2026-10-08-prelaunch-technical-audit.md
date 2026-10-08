# OZROOMY Pre-Launch Technical Audit and Validation Theme

Date: 2026-10-08 (Australia/Sydney)

Scope: full theme and representative storefront audit, autonomous GREEN fixes, local feature-branch commits, and one unpublished Shopify validation theme. No production publish, Git push, merge, Admin write, Markets write, policy rewrite, pricing change, or visual redesign was performed.

## A. Executive Summary

The storefront is technically operational and no confirmed P0 launch-blocking theme defect was found. The live theme, Git baseline, and merchant-controlled configuration were reconciled before implementation. The candidate closes 11 grouped low-risk issues and leaves 16 grouped findings for merchant or higher-risk engineering review. Counts are grouped findings, not raw Theme Check offenses.

- Confirmed grouped findings: 27
- GREEN findings fixed: 11
- Open grouped findings: 16
- Theme Check raw baseline: 83 errors and 174 warnings
- Theme Check raw candidate: 83 errors and 174 warnings, with zero added or removed signature groups
- Current sitemap URLs: 25; all returned HTTP 200 in the final read-only status pass
- Critical launch blockers: none confirmed by available tooling
- Publication gate: human visual, responsive, keyboard, and interaction QA is still required because the in-app browser was unavailable

The largest measured improvement came from correcting LCP discovery and priority. On the same AU URLs and Lighthouse mobile configuration, homepage LCP changed from 7.07/7.00 seconds to 4.53/5.69 seconds, Pebble from 7.53 to 4.06 seconds, Loopa from 6.16 to 4.78 seconds, and the Pebble collection from 9.10 to 5.12 seconds. These are laboratory results and should not be presented as real-user Core Web Vitals.

## B. Git and Shopify Status

### Git

- Repository: `D:\work\ozroomy`
- Starting commit: `e7b4578eb26be25f2f3e406c8a0bef32d7edfcca`
- Starting refs: `main`, `dev`, `origin/main`, and `origin/dev` all at `e7b4578`
- Feature branch: `feature/prelaunch-technical-audit`
- Final implementation commit before this report: `3382d6765cb668017fa0d9062d63ff64b85a8b7b`
- The documentation commit containing this report becomes the feature-branch HEAD at handover; use `git rev-parse HEAD` for its exact hash
- Remote: `origin https://github.com/EricYuCoding/ozroomy-theme.git`
- No Git branch was pushed, merged, rebased, squashed, force-updated, or deleted
- GitHub-to-Shopify connection status could not be confirmed: Shopify CLI did not expose it and no signed-in interactive browser was available. This created no production risk because no Git push occurred.

### Local commits

| Commit | Purpose |
|---|---|
| `465854b` | Reconcile current live merchant configuration |
| `5b36730` | Repair storefront collection and support links |
| `e155e4c` | Prioritize verified LCP images |
| `5eca6be` | Label media controls and correct heading semantics |
| `5649a33` | Use secure Open Graph image URLs |
| `3382d67` | Hide empty upsell editor prompt on the storefront |

### Shopify

- Store: `zjna5j-hn.myshopify.com`
- Shopify CLI: 4.8.5
- Current live theme: `145528717546`, `OZROOMY Email Cleanup RC - 2026-10-08`, role `live`
- Previous production theme: `145517838570`, role `unpublished` at preflight
- New validation theme: `145529700586`, `OZROOMY Prelaunch Tech QA - 2026-10-08`, role `unpublished`
- Preview: <https://zjna5j-hn.myshopify.com?preview_theme_id=145529700586>
- Theme Editor: <https://zjna5j-hn.myshopify.com/admin/themes/145529700586/editor>
- Production was not uploaded to, overwritten, or published

### Live reconciliation evidence

The live theme was pulled twice into separate temporary directories. Both snapshots contained 348 files and were byte-identical, proving that no Theme Editor drift occurred during the audit.

Two live-versus-Git differences existed at the start and were preserved before fixes:

1. `config/settings_data.json`
   - Live logo: `OZROOMY-logo.svg`, replacing the older Git reference `NO_OZDESIGN.webp`.
   - Live cart product-specific upsell included `options_button_label: "Choose options"`.
2. `templates/page.return-policy.json`
   - Live contained the merchant's newer 60-Day Home Trial/return-policy structure rather than the older Git page.
   - The policy wording was preserved exactly except for the objectively obsolete support email and missing `mailto:` behavior.

The reconciled branch matched live 348/348 before implementation. The final draft was pulled back after upload and matched the local candidate 348/348 after CRLF/LF normalization. `config/markets.json` and `config/settings_data.json` parsed identically before and after Shopify serialization. AU/international configuration was not edited.

## C. Automatically Completed Fixes

| Issue | Root cause | Files changed | Fix | Validation | Risk |
|---|---|---|---|---|---|
| Obsolete support email in the new live Return Policy | A merchant page update reintroduced `support@ozdesignsofa.com` | `templates/page.return-policy.json` | Replaced only the address with `support@ozroomy.com` | Repository scan: zero obsolete email matches; draft rendered source clean | GREEN |
| Visible support addresses were not links | Several rich-text anchors lacked `href` | Ten page/product JSON templates | Added `mailto:support@ozroomy.com` without rewriting copy | JSON parse; rendered link source; no old email remains | GREEN |
| Broken Pebble collection links | Eight references used removed handle `pebble-collections` | Six JSON templates including `templates/index.json` | Pointed to verified live handle `pebble-modular-sofa-beds` | Old route was 404; destination is 200; zero stale-handle matches | GREEN |
| Homepage LCP image was lazy/auto | An enabled slideshow with all blocks disabled still occupied section index 1, so the first visible hero failed its existing priority condition | `templates/index.json` | Marked the empty slideshow section disabled while preserving its blocks, settings, and order | Draft source shows hero `loading="eager" fetchpriority="high"`; no lazy/high collision | GREEN |
| Product LCP lacked priority hint | First product image was eager but no high fetch priority was passed | `snippets/product-thumbnail.liquid` | Set high priority only for position 1 when it is already non-lazy | Draft product has exactly one high-priority image; Lighthouse improvement measured | GREEN |
| Collection LCP lacked priority hint | First product card did not accept/pass a fetch-priority value | `sections/main-collection-product-grid.liquid`, `snippets/card-product.liquid` | Passed `high` only to the first card image | Draft collection has exactly one high-priority image; Lighthouse improvement measured | GREEN |
| Image-slider links had no accessible name | Linked image/video slides could contain no text alternative exposed on the anchor | `sections/image-slider.liquid` | Derived an escaped label from image alt, description, section title, then URL fallback | Draft homepage outputs named Instagram slide links; Lighthouse `link-name` defect removed | GREEN |
| Video play controls had no accessible name | Custom play buttons contained only an icon | `snippets/video-player.liquid`, `snippets/product-thumbnail.liquid` | Added `type="button"` and existing localized `play_video` label | Draft rendered controls are named; product Lighthouse `button-name` defect removed | GREEN |
| Sticky ATC title broke heading hierarchy | A visual title used `h4` even though it was not a document subsection | `sections/main-product.liquid` | Changed element to `p` while retaining classes and styling | Draft source has no sticky-title `h4`; Lighthouse defect removed | GREEN |
| Public page exposed empty upsell editor prompt | Empty product-list block rendered `Assign upsell products in block settings` to customers | `snippets/upsell-block.liquid` | Limited prompt to `request.design_mode` and retained visual `h4` styling on a `p` | Public draft source no longer contains prompt; Theme Editor retains guidance | GREEN |
| Primary Open Graph image used HTTP | `og:image` was hardcoded to `http:` while secure URL was HTTPS | `snippets/meta-tags.liquid` | Changed primary `og:image` scheme to HTTPS | Draft product source has HTTPS OG image and no HTTP OG image | GREEN |

### Exact changed paths versus starting commit

The final branch changes 24 tracked paths when this report is included:

- Merchant reconciliation: `config/settings_data.json`, `templates/page.return-policy.json`
- Liquid: `sections/image-slider.liquid`, `sections/main-collection-product-grid.liquid`, `sections/main-product.liquid`, `snippets/card-product.liquid`, `snippets/meta-tags.liquid`, `snippets/product-thumbnail.liquid`, `snippets/upsell-block.liquid`, `snippets/video-player.liquid`
- JSON content/link repair: `templates/collection.products.json`, `templates/index.json`, `templates/page.contact.json`, `templates/page.products.json`, `templates/page.refund-and-warranty.json`, `templates/page.return-policy.json`, `templates/page.shipping-policy.json`, `templates/page.shipping-process.json`, `templates/product.cloud-chair.json`, `templates/product.json`, `templates/product.nest.json`, `templates/product.pebble-in-stock-2.json`, `templates/product.pebble.json`, `templates/product.poochcouch.json`
- Documentation: `docs/feature-history/2026-10-08-prelaunch-technical-audit.md`

No CSS, global JavaScript, analytics, app embed, price, product claim, policy term, media asset, or Markets value was changed.

## D. SEO Audit

### Resolved

- Primary Open Graph images now use HTTPS.
- Eight stale collection references now target a verified 200 destination.
- Obsolete support email is removed from deployable theme files.
- Product, Organization, and WebSite JSON-LD parsed successfully on representative rendered pages; no fabricated schema data was added.

### Current rendered status

- Canonicals were present and self-consistent on audited representative pages.
- Hreflang was present. Observed mapping was `x-default`/`en` to `.com.au`, with `en-DE`, `en-FR`, `en-GB`, and `en-NL` on `.com`.
- Requests are location-routed; an AU-origin request to `.com` can redirect to `.com.au`. This is Shopify Markets behavior and was not changed.
- Current sitemap exposed 25 non-empty URLs; every URL returned HTTP 200 during the final status pass.
- Homepage, Contact, and Why OZROOMY rendered without an H1.
- Homepage, Contact, Why OZROOMY, collections, and the news blog lacked a rendered meta description in representative checks.
- Pebble and Loopa product meta descriptions were approximately 320 characters, suggesting fallback/overlong Admin content rather than a theme-rendering failure.
- Sitemap and `robots.txt` are Shopify-generated and available.
- The theme contains 11 dormant hardcoded product URLs that currently return 404. They were not present in the audited rendered link set, so automatic replacement was unsafe. Most are in dormant `templates/index.json` content; `swatches` is in `templates/page.customization.json`, and `vantopiasofabed` is in `templates/index.context.eu.json`.
- There are 46 deployable-file matches for OZDESIGN/OZ Design. They mix intentional rebrand history, old social identity, media filenames, product/policy claims, and dormant templates. Bulk replacement would be commercially unsafe.

### Shopify Admin recommendations (read-only)

No Admin write was performed. Current Shopify guidance supports these navigation paths:

| Affected item | Verified issue | Recommended action | Admin path | API automation | Priority |
|---|---|---|---|---|---|
| Homepage | Missing meta description and no visible H1 | Merchant supplies AU-focused title/description and approves an on-page H1 strategy | `Online Store > Preferences > Social sharing image and SEO`; H1 requires Theme Editor/content decision | SEO values can be automated, but copy approval is required | P1 |
| Contact and Why OZROOMY | Missing meta description and H1 | Add unique descriptions; decide whether existing visual copy can be promoted semantically | `Online Store > Pages > [page] > Search engine listing preview > Edit website SEO` | Possible for SEO fields; content decision required | P1 |
| Collections and blog | Missing descriptions on sampled pages | Add unique intent-led descriptions | `Products > Collections > [collection] > Search engine listing`; `Content > Blog posts > [post] > Search engine listing` | Possible, but not without approved copy | P1/P2 |
| Pebble and Loopa products | Rendered description about 320 characters | Create a concise, unique search description; do not truncate blindly in Liquid | `Products > [product] > Search engine listing > Edit` | Possible; merchant-approved copy required | P1 |
| Dormant 404 product handles | Eleven source URLs have no live resource | Decide whether each should be removed, replaced, reactivated, or redirected before its section is enabled | `Content > Menus` for navigation; `Online Store > Navigation > URL Redirects` for redirects | Redirect creation is technically automatable; destination decisions are not | P1 |
| Product media ALT | Theme preserves Shopify media alt; coverage was not available from Theme CLI | Review launch products manually and add concise descriptive alt text | `Products > [product] > click media > Add alt text` | Technically possible; visual interpretation/approval required | P2 |
| OZDESIGN references | 46 mixed references including old Instagram URL and policy/product statements | Classify intentional rebrand history versus obsolete branding and legal/product claims | Theme Editor plus affected Products/Pages/Policies; social URL in theme settings | Do not bulk automate | P1 |
| Domains/Markets | `.com`/`.com.au` routing and hreflang work, but Admin assignments were not inspectable | Merchant verifies intended country, currency, language, domain, and automatic-redirection matrix | `Markets > [market] > Domain / language`; domain connectivity under `Settings > Domains`; automatic routing under `Online Store > Preferences` | No automation recommended | P1 release check |
| Search Console | Access unavailable | Verify both domain properties as appropriate and submit each applicable `/sitemap.xml`; inspect coverage after launch | External Google Search Console | Not through theme code | P1 |
| Merchant Center | Access unavailable | Verify feed, product identifiers, policy URLs, shipping/returns alignment, and market destinations | Shopify `Google & YouTube` sales channel and Google Merchant Center | App/feed dependent | P1 |

Official references used for navigation verification:

- <https://help.shopify.com/en/manual/promoting-marketing/seo/adding-keywords>
- <https://help.shopify.com/en/manual/products/product-media/add-alt-text>
- <https://help.shopify.com/en/manual/markets/customizations/domains-and-languages>
- <https://help.shopify.com/en/manual/markets/seo>

### AU keyword opportunities for merchant research

These are hypotheses, not approved copy: `modular sofa bed Australia`, `sofa bed in a box Australia`, `small-space modular sofa bed`, `washable-cover modular sofa`, and product-led Pebble/Loopa queries. Validate demand and intent in Search Console/Keyword Planner before changing page copy. Avoid claims about delivery, trials, warranties, sustainability, or performance unless business-approved.

## E. Performance Audit

### Test configuration and limitations

- Lighthouse 13.5.0 via `npx`
- Mobile form factor, simulated throttling
- Categories: Performance, Accessibility, SEO, Best Practices
- Chrome headless on the same workstation
- Baseline: current live AU URLs
- After: unpublished theme `145529700586` on the same AU URLs with `preview_theme_id`
- Preview results include Shopify preview-bar overhead. Lighthouse results are noisy laboratory samples, not CrUX/RUM, and INP was not measurable.

### AU before/after results

| Page | Run | Perf | FCP | LCP | TBT | CLS | A11y | SEO |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| Home live | 1 | 67 | 3.84s | 7.07s | 10ms | 0 | 97 | 92 |
| Home live | 2 | 67 | 3.88s | 7.00s | 2ms | 0 | 97 | 92 |
| Home draft | 1 | 80 | 2.16s | 4.53s | 34ms | 0 | 97 | 92 |
| Home draft | 2 | 75 | 2.15s | 5.69s | 16ms | 0 | 97 | 92 |
| Pebble live | 1 | 63 | 3.93s | 7.53s | 7ms | 0 | 91 | 100 |
| Pebble final draft | 1 | 82 | 2.30s | 4.06s | 82ms | 0 | 94 | 100 |
| Loopa live | 1 | 68 | 3.58s | 6.16s | 13ms | 0 | 96 | 100 |
| Loopa final draft | 1 | 78 | 2.15s | 4.78s | 23ms | 0 | 94* | 100 |
| Pebble collection live | 1 | 65 | 3.70s | 9.10s | 2ms | 0 | 100 | 92 |
| Pebble collection draft | 1 | 78 | 1.37s | 5.12s | 84ms | 0 | 97* | 92 |
| Contact live | 1 | 65 | 4.00s | 8.30s | 10ms | 0 | 100 | 92 |

`*` Draft accessibility scores are depressed by Shopify's preview-bar iframe lacking a title. On Loopa, the live sticky-heading failure disappeared; the preview iframe replaced it. Collection had no theme accessibility failure in the baseline, and its draft-only failure was the preview iframe.

### Root-cause observations

- Homepage LCP was the first visible flexible hero image. It was incorrectly lazy because an empty-but-enabled slideshow consumed section index 1.
- Pebble/Loopa LCP was the lead product image. It was already not lazy but lacked high fetch priority.
- Collection LCP was the first product card image. It was not lazy but lacked high fetch priority.
- Contact LCP was a text paragraph with about 1.99 seconds of element-render delay, likely influenced by the page animation system. A global animation change was not safe in this cycle.
- Direct homepage TTFB was about 0.51 seconds in one curl sample; Lighthouse server timing varied materially by run.
- Render-blocking analysis identified the global `base.css` path, with estimated savings varying roughly 0.35–1.34 seconds.
- Lighthouse estimated roughly 41–45 KiB unused CSS and 34–60 KiB unused JavaScript on representative pages.
- Image delivery opportunities were roughly 252 KiB on home and up to 264 KiB on product pages in sampled runs.
- Best Practices remained 73, driven by third-party/cookie findings and a root `/favicon.ico` console 404.
- No broad CSS/JS removal, analytics removal, video behavior change, image composition change, or global animation change was made because regression risk exceeded GREEN scope.

## F. Theme Check

- Configuration: Shopify CLI default; no repository `.theme-check.yml`/`.yaml`
- CLI: Shopify CLI 4.8.5
- Live baseline: 83 errors, 174 warnings, 257 total
- Final candidate: 83 errors, 174 warnings, 257 total
- Added signature groups: 0
- Removed signature groups: 0
- The standalone bundled validator could not start because its local `@shopify/theme-check-common` dependency was unavailable; Shopify CLI Theme Check was the authoritative fallback.

| Rule | Count | Assessment |
|---|---:|---|
| `OrphanedSnippet` | 88 | Requires usage/dependency review; deletion was unsafe |
| `MatchingTranslations` | 83 | Missing Arabic translation keys; all raw errors are in this group |
| `VariableName` | 32 | Maintainability |
| `UndefinedObject` | 14 | Mostly reusable section placeholders; needs context review |
| `ExcessiveSettingsCount` | 9 | Architectural/schema refactor |
| `UnusedAssign` | 7 | Must confirm alternate rendering paths |
| `LiquidComplexity` | 6 | Architectural refactor |
| `AssetPreload` | 6 | Performance, but preload changes can regress LCP |
| `RemoteAsset` | 3 | Third-party/integration review |
| `LiquidNestingDepth` | 3 | Maintainability |
| `DeprecatedFontsOnSettingsData` | 3 | Merchant visual/font decision |
| `DeprecatedFontsOnSettingsSchema` | 2 | Schema migration |
| `DeprecatedTag` | 1 | Isolated but not launch-critical |

No check was disabled, downgraded, or suppressed. The GREEN fixes targeted rendered defects rather than warning-count reduction.

## G. Medium/High-Risk Backlog

| Finding | Severity | Evidence / location | Root cause | Recommendation and expected benefit | Regression risk / validation |
|---|---|---|---|---|---|
| Missing H1 on home, Contact, Why OZROOMY | P1 SEO | Rendered source | Page composition uses styled text without a primary semantic heading | Merchant selects visible copy that can be the single H1; improves topical clarity | Medium visual/SEO risk; compare desktop/mobile and headings across markets |
| Missing meta descriptions | P1 SEO | Home, Contact, Why OZROOMY, sampled collections/blog | Admin SEO fields/content absent | Add unique approved descriptions | Low technical, high content risk; re-crawl rendered output |
| Overlong product descriptions | P1 SEO | Pebble/Loopa about 320 chars | Admin fallback or long SEO field | Write concise unique descriptions | Content/conversion risk; inspect SERP preview and rendered tags |
| Inventory badge contrast | P1 accessibility | Pebble/Loopa Lighthouse; about 4.38:1 vs 4.5:1 requirement | Merchant color combination | Approve a minimally adjusted accessible token | Brand visual risk; contrast tooling plus visual regression |
| Duplicate DOM IDs | P1 accessibility/JS | Repeated numeric product/menu/payment/variant IDs and `Subscribe` in rendered pages | Reused snippets emit non-unique IDs | Inventory each producer and namespace by section/block/item | High selector/label/JS risk; browser event, label, modal, and cart regression suite |
| Dormant 404 product URLs | P1 readiness | Eleven explicit template handles return 404 | Historical/dormant configuration | Merchant maps each to current resource, redirect, or intentional removal | Content/market risk; enable affected sections only in draft, crawl all markets |
| Legacy OZDESIGN content | P1 brand/legal | 46 code/config matches | Rebrand history mixed with claims, filenames, old social URL | Merchant classifies intentional narrative versus obsolete reference | High commercial/legal risk; content approval and market preview |
| Root favicon 404 | P2 UX/Best Practices | Browser console/Lighthouse `/favicon.ico` | Theme favicon does not provide a root server route for all clients | Verify Admin branding/domain behavior; consider platform-supported favicon handling | Low-medium; multi-browser request/visual test |
| Contact text LCP delay | P2 performance | Contact LCP 8.30s; about 1.99s render delay | Global entrance animation/render timing | Isolate above-fold text animation before changing globals | Medium visual risk; repeated Lighthouse and reduced-motion/browser testing |
| Render-blocking/unused CSS | P2 performance | `base.css`, 41–45 KiB unused estimate | Monolithic global styles | Profile template-critical CSS and defer only proven non-critical rules | High cross-template risk; full visual regression at five widths |
| Unused/global JavaScript | P2 performance | 34–60 KiB estimate | Global bundles and section code | Build dependency map; load section-specific code conditionally | High interaction risk; Theme Editor reload, cart, menus, variants, localization |
| Image delivery opportunity | P2 performance | 252–264 KiB estimates | Responsive size candidates and source assets | Tune only after visual/source-size review | Medium visual/LCP risk; DPR/viewport matrix and repeated lab tests |
| Third-party/Best Practices findings | P2 | Score 73, cookie/console findings | Platform or third-party scripts | Attribute each request before any removal | High analytics/app risk; consent, analytics, conversion regression |
| Arabic translation parity | P2 if Arabic launches; P3 otherwise | 83 `MatchingTranslations` errors in `locales/ar.json` | Locale lags default keys | Commission accurate translation or disable unpublished language through merchant workflow | High localization risk; native-language QA and market preview |
| Orphan/complex Liquid debt | P3 | 88 orphan warnings plus complexity/nesting/settings rules | Long-lived theme evolution | Trace runtime/editor references before phased cleanup | High deletion/schema risk; per-template visual and Theme Editor tests |
| Deprecated font/schema and naming debt | P3 | Remaining Theme Check categories | Older schema conventions | Plan a separate migration, preserving setting IDs and merchant choices | Medium-high configuration risk; schema migration and rollback snapshot |

## H. Merchant Decisions Required

1. Approve the homepage, page, collection, blog, and product SEO copy; no commercial copy was invented.
2. Decide the visible H1 strategy for homepage, Contact, and Why OZROOMY without changing the intended design.
3. Approve an accessible inventory-badge color adjustment.
4. Classify all 46 OZDESIGN references, including rebrand history, old Instagram identity, media filenames, policy text, and product claims.
5. Map the 11 dormant 404 product handles to replacement URLs, redirects, reactivated products, or intentional deletion.
6. Confirm the AU/international market matrix, currencies, languages, `.com.au`/`.com` domain assignments, and automatic redirection in Admin. No Markets setting was assumed or changed.
7. Confirm the intended return/trial/policy wording. The live merchant policy was preserved; only contact mechanics were corrected.
8. Decide whether Arabic will be offered at launch; if yes, the 83 missing translations become a release issue.
9. Confirm Google Search Console and Merchant Center ownership/feed readiness.
10. Perform and sign off visual, keyboard, responsive, Theme Editor, and conversion-flow QA on unpublished theme `145529700586`.

## I. Regression Test Results

| Test | Result | Notes |
|---|---|---|
| Git/live preflight | PASS | Starting refs aligned and clean; live ID verified before both uploads |
| Live drift recheck | PASS | Two independent live pulls, 348 files each, byte-identical |
| JSON validation | PASS | 129/129 parsed after stripping Shopify leading comments |
| JavaScript syntax | PASS | 17/17 passed `node --check` |
| Snippet/section/asset references | PASS | Missing snippets 0, sections 0, assets 0 |
| `git diff --check` | PASS | No whitespace errors |
| Theme Check comparison | PASS with inherited debt | 83 errors/174 warnings; zero signature differences from live |
| Old email/stale collection scans | PASS | Zero `support@ozdesignsofa.com`; zero `pebble-collections` |
| Draft upload verification | PASS | Role `unpublished`; live remained `145528717546` |
| Draft pullback comparison | PASS | 348/348 normalized file match |
| AU/international config preservation | PASS within theme scope | `markets.json` and `settings_data.json` semantic equality; rendered hreflang retained |
| Homepage/product/collection/cart HTTP/source smoke | PASS | Candidate ID rendered; priority, OG, a11y, email, and Continue Shopping assertions passed |
| Sitemap URL status | PASS | 25/25 returned 200 |
| Search | PASS at HTTP/source level | Search returned 17 results in representative baseline check |
| Cart add | PASS | Anonymous Pebble variant added |
| Cart quantity update | PASS | Quantity changed from 1 to 2 |
| Second product add | PASS | Available Loopa variant added in same anonymous cart |
| Cart clear | PASS | Final item count 0 |
| Cart item removal | INCONCLUSIVE | First script assumed line order incorrectly; the corrected retry was blocked by Cloudflare verification. This is not recorded as a theme failure. |
| Actual upsell UI click | NOT PERFORMED | API-level second-product add passed; no interactive browser was available |
| Lighthouse AU same-URL comparison | PASS | Metrics recorded in Section E |
| JSON-LD syntax | PASS on representative pages | Organization/WebSite/Product JSON parsed |
| Interactive header/mega menu/mobile menu | NOT PERFORMED | In-app browser inventory was empty |
| Variant UI, drawer focus trap, keyboard navigation | NOT PERFORMED | Requires real interactive browser |
| 375/390/768/1024/1440 visual layout | NOT PERFORMED | No visual browser; HTTP/Lighthouse is not a substitute |
| Theme Editor dynamic section reload | NOT PERFORMED | Requires signed-in Theme Editor browser session |
| Checkout/order/payment | NOT PERFORMED | Out of scope; no financial transaction attempted |

The browser limitation is material. Lighthouse and rendered-source checks validate technical output, but do not prove visual correctness, touch behavior, keyboard focus, hover menus, responsive overflow, or Theme Editor lifecycle behavior.

## J. Recommended Next Development Cycle

### P0 — publication gates, not confirmed code blockers

- Complete merchant visual and interaction sign-off on draft `145529700586` across 375, 390, 768, 1024, and 1440 px.
- Verify add/update/remove/upsell/Continue Shopping through the actual drawer UI, plus variant selection and country selector.
- Verify AU and international domains/currencies/languages from appropriate geolocations.

### P1 — launch-impact work

- Approve and enter missing/overlong SEO descriptions and visible H1 strategy.
- Resolve dormant 404 handles before enabling affected sections or EU context.
- Approve accessible inventory-badge colors.
- Classify OZDESIGN references and old Instagram identity.
- Inspect duplicate IDs with an interaction-focused refactor plan.
- Complete Search Console and Merchant Center launch checks.

### P2 — measured improvements

- Prototype contact-page above-fold animation reduction.
- Profile `base.css`, unused CSS/JS, and section-level loading without removing analytics/apps.
- Tune responsive image delivery after viewport/DPR visual QA.
- Resolve third-party console/cookie findings by ownership, not by blanket removal.
- Complete Arabic translations if the language is launching.

### P3 — technical debt

- Audit 88 orphan snippet warnings before deletion.
- Refactor high-complexity/settings-count sections in isolated cycles.
- Migrate deprecated font/schema patterns while preserving setting IDs.
- Clean naming, unused assignments, and the isolated deprecated `include` only after dependency tests.

## K. Final Handover

Copyable review context:

> OZROOMY pre-launch technical audit is complete on local branch `feature/prelaunch-technical-audit`, based on `e7b4578`. The final implementation commit is `3382d67`; the documentation commit containing this report is the branch HEAD. The unpublished Shopify validation theme is `145529700586` (`OZROOMY Prelaunch Tech QA - 2026-10-08`) at <https://zjna5j-hn.myshopify.com?preview_theme_id=145529700586>. Production remains theme `145528717546` and was not modified. Review the repaired contact/collection links, LCP image priorities, secure OG image, image/video accessible names, sticky ATC semantics, and empty-upsell behavior. Before publication, manually test desktop/mobile navigation, variant selection, cart drawer add/update/remove/upsell, country selector, responsive layouts, keyboard/focus behavior, and Theme Editor reloads. Merchant decisions remain for SEO copy/H1s, inventory contrast, OZDESIGN references, dormant 404 handles, Markets/domain mapping, Arabic translations, Search Console, and Merchant Center.

## Safe publication procedure after merchant approval

1. Preview unpublished theme `145529700586`; do not edit it during review without reconciling changes back to Git.
2. Complete the P0 manual QA matrix and record evidence.
3. Re-run `shopify theme list`, confirm live is still `145528717546`, and pull live to a new isolated directory.
4. If live drift exists, classify and reconcile merchant JSON before any release decision.
5. Review `git diff e7b4578..feature/prelaunch-technical-audit`, commit history, and this report.
6. With separate explicit approval, merge the feature branch into `dev` using a readable non-squashed history; validate again.
7. With separate explicit approval, merge `dev` into `main`; no force push or rebase.
8. Publish only the reviewed unpublished theme ID, not a name-based ambiguous target, and only after a final live-ID check.
9. Immediately smoke-test home, both product pages, collection, search, contact, cart drawer, country selector, canonical/hreflang, and analytics.
10. Keep the prior live theme and feature branch available for rollback until post-launch monitoring is complete.

No merge, push, or publication is included in this audit.
