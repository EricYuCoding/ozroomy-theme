# OZROOMY Final Pre-Launch Technical and SEO Audit

Date: 2026-10-08 (Australia/Sydney)

## 1. Executive summary

The final pre-launch candidate is technically prepared on `feature/prelaunch-final-stabilisation` and has been uploaded to a new unpublished Shopify theme for merchant review.

- Live Shopify theme: `145528717546` (`OZROOMY Email Cleanup RC - 2026-10-08`), still `live`.
- New review theme: `145531568362` (`OZROOMY Final Prelaunch QA - 2026-10-08`), `unpublished`.
- Preview: <https://zjna5j-hn.myshopify.com?preview_theme_id=145531568362>
- Theme editor: <https://zjna5j-hn.myshopify.com/admin/themes/145531568362/editor>
- Git starting baseline: `e7b4578eb26be25f2f3e406c8a0bef32d7edfcca`.
- Preserved previous audit head: `0bd814f59e3d7605bbca8397b2301861041a2dd7`.
- Protected local recovery tag: `prelaunch-final-start-2026-10-08`.
- Confirmed P0/P1 regressions introduced by this work: none.
- Publication status: not published. Human visual and interactive QA is still mandatory.

The primary Header/Mega Menu defect was caused by the EU section-group context assigning the unavailable menu handle `header-menu-eu`. The candidate removes only that override, so the EU context inherits the already configured parent `main-menu`. Server-rendered draft output now contains desktop navigation and the mobile drawer for both Australia/AUD and Germany/EUR. No menu items were hardcoded and no Markets or Navigation Admin data was changed.

Additional safe changes add semantic H1 tags to existing visible headings on Contact, Why OZROOMY, Shipping Policy and Warranty, and eliminate the rendered duplicate `Subscribe` and payment-icon IDs. Existing styling, wording, forms and scripts are unchanged.

The public SEO audit found healthy HTTPS/canonical/hreflang/JSON-LD fundamentals, but launch content work remains: missing descriptions on the homepage, collections and important pages; overlong product descriptions; structured-data brand value `My Store`; an international-domain redirect that needs Markets verification; two indexable support pages omitted from the sitemap; one enabled Shipping Policy link to a 404 page; unapproved dormant-product redirects; and an old Instagram handle.

## 2. Verified baseline and recovery points

| Item | Verified state |
|---|---|
| Repository | `D:\work\ozroomy` |
| Original `main`, `dev`, `origin/main`, `origin/dev` | `e7b4578eb26be25f2f3e406c8a0bef32d7edfcca` |
| Previous feature head | `0bd814f59e3d7605bbca8397b2301861041a2dd7` |
| Final-cycle branch | `feature/prelaunch-final-stabilisation` |
| Pre-work tag | `prelaunch-final-start-2026-10-08` -> `0bd814f` |
| Live theme | `145528717546`, role `live` |
| Previous QA theme | `145529700586`, role `unpublished` |
| New final QA theme | `145531568362`, role `unpublished` |
| Live backup | `D:\work\ozroomy-backups\2026-10-08-live-145528717546` |
| Git archive | `D:\work\ozroomy-backups\prelaunch-final-start-0bd814f.zip` |
| Previous QA pull | `D:\work\ozroomy-backups\2026-10-08-qa-draft-145529700586` |
| Final QA verified pull | `D:\work\ozroomy-backups\2026-10-08-final-qa-verified2-145531568362` |
| Post-operation live pull | `D:\work\ozroomy-backups\2026-10-08-live-postfinal-145528717546` |

The pre- and post-operation live pulls both contain 348 files, have zero normalized differences and share normalized aggregate SHA-256 `7634221543C99D95AB8CDC9427EB67896BAFC281A098113FFD493DC95D27BC1D`. This is direct evidence that the live theme code was not modified.

The final draft pull contains 347 files and differs from the 348-file local candidate only because Shopify omits the redundant empty `sections/header-group.context.eu.json`. The runtime meaning is unchanged: no EU override exists, so the parent section-group configuration is inherited. All other 347 files match after line-ending normalization. Draft normalized aggregate SHA-256 is `D4A7FEEC8C1D283F796BD9A0E6BA1B8349C497C49F0615245965705C7464E241`.

`config/markets.json` and `config/settings_data.json` are semantically identical across the local candidate, pre-work live pull, post-work live pull and final draft pull. AU and international theme-scoped market configuration was preserved.

## 3. Mega Menu root cause and fix

### Root cause

`sections/header-group.json` assigns the working `main-menu` and contains the `Shop` Mega Menu trigger. `sections/header-group.context.eu.json` overrode the header menu with `header-menu-eu`. In the Germany/EUR market that handle did not resolve to usable links, so `section.settings.menu` was blank and the header Liquid emitted neither desktop navigation nor the mobile drawer. The menu was absent from the DOM; it was not hidden by CSS and was not a JavaScript race.

The Theme Editor screenshot used the AU context, which inherited `main-menu`, while the standalone preview used Germany/EUR, which activated the faulty EU override. This explains the apparent Theme Editor-versus-preview discrepancy. The current live Germany context was affected as well; live was deliberately left untouched.

### Candidate change

`sections/header-group.context.eu.json` now has no section override. Shopify serializes that as omission of the context file in the uploaded draft. The section group therefore inherits the parent `main-menu` without changing the menu structure, responsive styling, Mega Menu blocks, localization selector, Liquid, CSS or JavaScript.

The Japan context also references `header-menu-eu`, but a Japan market/domain state could not be reproduced reliably. It remains a merchant review item rather than an assumed change.

### Reproduction and validation matrix

| Environment | Market | Desktop navigation | Mobile drawer DOM | Evidence/status |
|---|---|---:|---:|---|
| Live `145528717546` | AU/AUD | Present | Present | Rendered HTML |
| Live `145528717546` | Germany/EUR | Missing | Missing | Rendered HTML; confirms root cause affects live international output |
| Previous QA `145529700586` | AU/AUD | Present | Present | Rendered HTML |
| Previous QA `145529700586` | Germany/EUR | Missing | Missing | Rendered HTML |
| Final QA `145531568362` | AU/AUD | Present | Present | Candidate marker plus `Shop` links in authenticated preview session |
| Final QA `145531568362` | Germany/EUR | Present | Present | Candidate marker plus `Shop` links in authenticated preview session |
| Theme Editor | AU | Present | Merchant screenshot | Merchant evidence |
| Theme Editor | Germany | Unverified | Unverified | No signed-in interactive browser was available |

The final draft returned HTTP 200 and the correct currencies (`AUD` and `EUR`). Interactive hover/open/close behavior, focus management, link clicking, responsive overflow, selector changes and Theme Editor reload events remain mandatory manual tests.

## 4. Additional technical changes

### New changes in this final cycle

| Commit | Change | Before | Candidate | Risk |
|---|---|---|---|---|
| `d6d761d` | EU menu inheritance | EU menu/drawer DOM absent | Parent `main-menu` inherited | Low; configuration-only and reversible |
| `ecc8be0` | Contact and Why H1 semantics | Visible titles were H2 | Existing visible titles are H1 | Low; tag only, styles unchanged |
| `8455451` | Unique newsletter/payment IDs | 7 duplicated `pi-*` IDs on all samples; `Subscribe` duplicated on `/collections` | Zero duplicate IDs on sampled draft URLs | Low; old IDs had no theme CSS/JS references |
| `23776f8` | Shipping/Warranty H1 semantics | Existing visible titles were H2 | Existing visible titles are H1 | Low; tag only, styles unchanged |

No LCP, broad CSS/JS, analytics, app, contrast, Markets Admin, navigation content, product data, redirect or business-copy changes were made in this final cycle.

### Exact final-cycle theme paths

- `sections/collapsible-content.liquid`
- `sections/custom-columns.liquid`
- `sections/email-signup-banner.liquid`
- `sections/footer.liquid`
- `sections/header-group.context.eu.json`
- `sections/multirow.liquid`
- `sections/newsletter.liquid`
- `sections/promo-popup.liquid`
- `sections/rich-text.liquid`
- `snippets/cart-drawer.liquid`
- `templates/page.about-us.json`
- `templates/page.contact.json`
- `templates/page.shipping-policy.json`
- `templates/page.warranty.json`

The previous 11 safe-fix groups remain in branch ancestry, including live configuration reconciliation, email/link repairs, LCP image priority, accessible media controls, heading correction, secure Open Graph image URL and Theme Editor-only upsell guidance.

## 5. Mandatory SEO readiness checklist

| # | Requirement | Status | Evidence and next action |
|---:|---|---|---|
| 1 | H1 structure | **FIXED / PARTIAL** | Draft has one H1 on Contact, Why, Shipping and Warranty; product/collection/blog/article templates are semantically correct. Homepage H1 contains the logo image with alt `OZROOMY` but no text node. No separate About Us URL exists; `/pages/why-ozroomy` uses the About Us template. Manual visual confirmation required. |
| 2 | Title, description, canonical | **PASS canonical / NEEDS MERCHANT ACTION content** | One title and one canonical on samples. Important descriptions are missing or overlong; edit Admin SEO fields. |
| 3 | Product structured data | **PASS syntax / NEEDS MERCHANT ACTION brand** | Pebble and Loopa Product/Offer JSON-LD parses; AU offers use AUD, Germany offers EUR, URLs and availability are present. Brand is `My Store`, reviews are absent, and Google Rich Results Test was unavailable. |
| 4 | Indexing and links | **PARTIAL** | No unexpected `noindex` across 24 storefront sitemap URLs. Candidate repairs the live homepage Pebble 404 link. Shipping Policy still links to 404 `/pages/shipping-process`; international-domain behavior and sitemap omissions need merchant review. |
| 5 | Mobile LCP | **PASS retained improvement / UNVERIFIED current rerun** | Prior same-machine Lighthouse improvements remain in code. PageSpeed API returned HTTP 429 and no browser was available, so no new numbers are claimed. |
| 6 | Theme Check severity | **PASS with inherited debt** | 83 errors/174 warnings, identical to baseline and with no new signature groups. Errors are Arabic translation parity, not runtime Liquid parse failures. |
| 7 | Shopify Admin SEO action list | **PROVIDED** | See Section 11 and the separate 30-day plan. No Admin data was written. |
| 8 | Draft validation and production safety | **PASS technical / UNVERIFIED interactive** | New theme is unpublished; pullback verified; live role and content unchanged. Browser interaction and Theme Editor QA remain open. |

## 6. H1 audit

| Template/page | Public live output | Final draft output | Status |
|---|---|---|---|
| Homepage `/` | One H1 wrapping logo image; extracted text empty, image alt `OZROOMY` | Same | PASS with quality note; do not add hidden duplicate wording without design review |
| Pebble product | `Pebble Sofa Bed` | `Pebble Sofa Bed` | PASS |
| Loopa product | `Loopa Sofa Bed` | `Loopa Sofa Bed` | PASS |
| Collections | `Collection: ...` | Same | PASS |
| Contact | None | `How Can We Help?` | FIXED |
| Why OZROOMY / About template | None | `Started in Melbourne` | FIXED using existing visible copy |
| Shipping Policy | None | `Shipping Policy` | FIXED |
| Warranty | None | `Warranty Policy` | FIXED |
| Blog index | `News` | Same | PASS |
| Article template | Code outputs article title as H1; no article URLs are currently in the sitemap | Same | PASS code / UNVERIFIED live instance |

## 7. Titles, descriptions, canonicals and international mapping

### Metadata coverage

| URL group | Verified title state | Meta description | Priority |
|---|---|---|---:|
| `/` | `OZROOMY` (7 characters; weak topical signal) | Missing | P1 |
| `/pages/contact` | `Contact – OZROOMY` | Missing | P1 |
| `/pages/why-ozroomy` | `Why OZROOMY` | Missing | P1 |
| `/pages/shipping-policy` | `Shipping Policy – OZROOMY` | 328 characters | P1 |
| `/pages/warranty` | `Warranty – OZROOMY` | Missing | P1 |
| Pebble/Loopa collections | Clear branded titles | Missing | P1 |
| Accessories collection | `Accessories – OZROOMY` | Missing | P1 |
| Blog index | `News – OZROOMY` | Missing | P2 until content exists |
| 16 product URLs in sitemap | Unique product-based titles | 271–324 characters, usually Shopify's 320-character fallback | P1 for commercial products |

Canonical tags are singular and self-referential on the tested AU and international pages. HTTP redirects to HTTPS; `www` redirects by 301 to the apex domains. AU content returns AUD on `.com.au`. The `.com` domain returns Germany/EUR when forced with `country=DE`, but an unaffiliated request to `.com/` returned a 302 to `.com.au/`. Confirm the intended default international domain mapping in Shopify Admin and Google Search Console before launch.

Hreflang output maps `x-default` and `en` to `.com.au`, and `en-DE`, `en-FR`, `en-GB`, and `en-NL` to `.com`. The markup is reciprocal in sampled output, but the shared `.com` target and default redirect need external indexing verification; no Markets/domain changes were made.

## 8. Product structured data

Pebble and Loopa each output one Organization and one Product JSON-LD block. All sampled JSON parsed.

- Pebble AU offers: AUD, prices and variant URLs present, availability `InStock` on sampled variants.
- Loopa AU offers: AUD, prices and variant URLs present, availability `InStock` on sampled variants.
- Germany samples: EUR and variant URLs present; availability was `OutOfStock`, consistent with the rendered market data.
- Product `name`, canonical product URL, description and image are present.
- Product `brand.name` is `My Store`, sourced from Shopify product Vendor. This is inaccurate for OZROOMY and should be corrected in product Admin data after confirming all stocked brands.
- No aggregate rating/review markup was present. Do not invent ratings.
- No BreadcrumbList markup was detected. This is an enhancement, not a launch blocker.

Google Rich Results Test could not be operated because no browser session was available. JSON syntax and field inspection are not a substitute for Google's validator; run both representative products manually after publication.

## 9. Crawlability, internal links, sitemap and images

- Both `/robots.txt` files return HTTP 200 and advertise their domain-specific sitemap.
- Both `/sitemap.xml` files return HTTP 200.
- AU sitemap inventory: 25 child URLs including `agents.md`; 24 storefront content URLs. All 24 returned HTTP 200.
- No unexpected robots `noindex` tag was found on those 24 storefront URLs.
- A crawl of those pages found 27 unique internal AU URLs. The only true storefront 404 was `/collections/pebble-collections` from the live homepage; the candidate already points to `/collections/pebble-modular-sofa-beds`.
- `/customer_authentication/redirect` returned 406 to automation after redirecting to Shopify Accounts and is not classified as a broken customer link.
- The enabled Shipping Policy page links to `/pages/shipping-process`, which returns 404. The page template exists but the Shopify page resource is not published. Merchant must publish/map the destination or approve removal/replacement.
- `/pages/shipping-policy` and `/pages/warranty` return 200 and are indexable but were absent from the page sitemap. Check page publication/search visibility and `seo.hidden` settings in Admin.
- Every sampled image tag had an `alt` attribute, but empty-alt counts were high: home 13/20, Pebble 14/36, Loopa 66/142, Pebble collection 7/22, Why 4/11. Some are intentional duplicate/decorative media; product media require manual review rather than bulk filling.

## 10. Public site audit by domain

### `https://www.ozroomy.com.au`

- Redirects: HTTP -> HTTPS; `www` -> `https://ozroomy.com.au/` by 301.
- Primary AU market output: AUD, self-canonical `.com.au`, expected AU navigation.
- Product, collection, page, blog, robots and sitemap samples return 200.
- Main risks: missing/overlong metadata, structured-data brand, support-page sitemap visibility, Shipping Process 404, image alt review and content depth.

### `https://www.ozroomy.com`

- Redirects: HTTP -> HTTPS; `www` -> `https://ozroomy.com/` by 301.
- A request without market context returned 302 to `.com.au`; `?country=DE` returned 200, EUR and `.com` canonical.
- Live Germany header lacked navigation because of the EU menu override. The final unpublished draft fixes it.
- Canonical/hreflang output correctly switches to `.com` under forced international context, but default-domain behavior must be reviewed in Markets and Search Console.
- International structured data uses EUR and market-specific availability.

## 11. Shopify Admin SEO action list

No Shopify Admin business data was changed. The following tasks require merchant approval or manual account access.

### P1 — Homepage metadata

- URL: `https://ozroomy.com.au/`
- Current: title `OZROOMY`; description missing.
- Problem: weak topical relevance and no controlled search snippet.
- Suggested draft title: `Modular Sofa Beds Australia | OZROOMY`
- Suggested draft description: `Discover OZROOMY modular sofa beds designed for everyday comfort, flexible living and compact Australian homes. Explore Pebble, Loopa and accessories.`
- Admin path: `Online Store > Preferences > Title and meta description`.
- Codex automation: possible only through separately authorised Admin API access; not performed.
- Time: 20 minutes.
- Verify: view source on AU and international domains; confirm one title/description and inspect Search Console after recrawl.

### P1 — Contact, Why, Shipping and Warranty metadata

- URLs: `/pages/contact`, `/pages/why-ozroomy`, `/pages/shipping-policy`, `/pages/warranty`.
- Current: Contact/Why/Warranty descriptions missing; Shipping description 328 characters.
- Suggested Contact description: `Contact OZROOMY for help with sofa beds, fabrics, customisation, delivery and existing orders. Our team will help you find the right next step.`
- Suggested Why description: `Meet OZROOMY, a Melbourne-born sofa bed brand designing modular furniture for real homes, everyday lounging and flexible overnight comfort.`
- Suggested Shipping description: `Review OZROOMY delivery areas, timelines, tracking, preparation and international duties before ordering your sofa bed.`
- Suggested Warranty description: `Read the OZROOMY limited warranty, what is covered, exclusions and how to request service for your sofa or accessory.`
- Admin path: `Online Store > Pages > [page] > Search engine listing preview > Edit website SEO`.
- Codex automation: possible with authorised Admin API/page mutations; not performed.
- Time: 45 minutes total.
- Verify: source inspection plus URL Inspection after Google recrawls.

### P1 — Collection metadata and on-page introductions

- URLs: `/collections/pebble-modular-sofa-beds`, `/collections/loopa-modular-sofa-beds`, `/collections/accessories`.
- Current: descriptive H1/title, missing meta descriptions, minimal crawl context.
- Recommendation: approve 80–150 words of useful collection copy and unique descriptions. Primary keyword hypotheses: `Pebble modular sofa bed`, `Loopa modular sofa bed`, `sofa bed accessories`; validate in Search Console/Keyword Planner.
- Admin path: `Products > Collections > [collection] > Description` and `Search engine listing > Edit`.
- Codex automation: possible with authorised Admin API; commercial copy approval required.
- Time: 60–90 minutes per collection.
- Verify: one unique title/description, visible useful copy, internal links and no keyword duplication.

### P1 — Pebble and Loopa product SEO

- URLs: `/products/pebble-sofa-bed`, `/products/loopa-sofa-bed`.
- Current: correct H1/title; descriptions around 320 characters; Product/Offer schema valid; Vendor/brand is `My Store`.
- Recommendation: write unique 140–160 character descriptions based only on approved claims; set Vendor to `OZROOMY` if all relevant products are the house brand; keep visible product copy richer than the snippet.
- Admin path: `Products > [product] > Search engine listing > Edit`; Vendor in product Organization/Product organization fields or bulk editor.
- Codex automation: possible with authorised Admin API; not performed because vendor and claims are business data.
- Time: 45 minutes per product.
- Verify: source JSON-LD brand, title and description; Rich Results Test; Merchant Center diagnostics.

### P1 — Broken Shipping Process link

- Source URL: `/pages/shipping-policy`.
- Broken destination: `/pages/shipping-process` (404).
- Recommendation: either create/publish the intended Shipping Process page using the existing template, or approve a replacement destination/removal. Do not redirect until the intended content is confirmed.
- Admin path: `Online Store > Pages`, then the Shipping Policy content/template; redirects are under `Content > Menus > View URL Redirects` only if a discontinued URL has an approved successor.
- Codex automation: possible with authorised Admin API after destination approval.
- Time: 20–60 minutes.
- Verify: click from Shipping Policy in AU/international sessions and receive the intended 200 page.

### P1 — Markets/domain verification

- URLs: `https://ozroomy.com.au/`, `https://ozroomy.com/`.
- Current: `.com` without explicit country context redirected to `.com.au`; hreflang uses `.com` for DE/FR/GB/NL.
- Recommendation: confirm domain assignment and redirect behavior under `Settings > Markets > [market] > Domains and languages`; verify both domain properties and submitted sitemaps in Search Console.
- Codex automation: no automatic change; domain/market architecture is merchant-controlled and high risk.
- Time: 30–45 minutes.
- Verify: anonymous tests from target regions, Search Console URL Inspection, correct currency/canonical/hreflang.

### P1 — Product structured-data brand

- URLs: all product URLs; confirmed on Pebble and Loopa.
- Current: `brand.name = "My Store"`.
- Recommendation: audit product Vendor values and change only house-brand products to `OZROOMY`.
- Admin path: `Products > [product] > Product organization > Vendor`, or Products bulk editor.
- Codex automation: possible with authorised Admin API after brand-scope confirmation.
- Time: 30 minutes for the current catalogue.
- Verify: JSON-LD and Rich Results Test show the approved brand.

### P1 — Sitemap visibility for support pages

- URLs: `/pages/shipping-policy`, `/pages/warranty`.
- Current: 200 and indexable, but absent from the page sitemap.
- Recommendation: check page publication visibility and any `seo.hidden` metafield; either intentionally hide them or make them consistently discoverable and link them from the footer.
- Admin path: `Online Store > Pages > [page]` and page metafields; menu links under `Content > Menus`.
- Codex automation: possible only after merchant decides visibility.
- Time: 30 minutes.
- Verify: page sitemap membership, footer link, URL Inspection.

### P2 — Image ALT review

- URLs: homepage, Pebble, Loopa, Pebble collection, Why page.
- Current: all tags have an alt attribute, but many are empty.
- Recommendation: leave decorative duplicates empty; add concise factual alt text to unique product/detail imagery, ideally under 125 characters.
- Admin path: `Products > [product] > media item > Add alt text`; other theme images via `Online Store > Themes > Customize` or `Content > Files`.
- Codex automation: possible via authorised APIs for identified media, but human image review is required.
- Time: 2–4 hours, staged by Pebble then Loopa.
- Verify: inspect rendered `alt`, run accessibility tooling and ensure decorative duplicates stay silent.

### P2 — Search Console, Merchant Center and measurement

- Current: account data was unavailable; no impressions, queries, coverage or product diagnostics were invented.
- Recommendation: verify both apex domain properties, submit both `sitemap.xml` files, inspect priority URLs, connect Merchant Center, and record weekly baselines.
- Admin locations: Google Search Console; Google Merchant Center; Shopify `Settings > Customer events`/analytics only if already configured.
- Codex automation: not without explicit account connections and authorisation.
- Time: 2–3 hours initial setup, then 30 minutes weekly.
- Verify: ownership, successful sitemap status, indexed URLs and Merchant Center diagnostics.

## 12. Keyword-to-page hypotheses

These are hypotheses for validation, not search-volume claims or approved copy.

| Page | Primary hypothesis | Secondary hypotheses | Cannibalisation guardrail |
|---|---|---|---|
| Homepage | modular sofa beds Australia | sofa bed in a box; sofa beds for small homes | Keep brand/category overview; do not duplicate product-detail intent |
| Pebble collection | Pebble modular sofa beds | compact modular sofa bed; flexible sofa bed | Collection covers range/comparison; product page covers exact model purchase |
| Pebble product | Pebble Sofa Bed | compact sofa bed; modular sofa bed | One canonical product URL; avoid competing copy on `pebble-sofa-copy*` handles |
| Loopa collection | Loopa modular sofa beds | rounded modular sofa bed; everyday sofa bed | Collection covers range; Loopa product targets exact model |
| Loopa product | Loopa Sofa Bed | lounge-first sofa bed; modular sleeper sofa | Avoid duplicating generic homepage copy |
| Accessories | sofa bed accessories | sofa cushions; sofa covers; ottoman | Use product-led subtopics and internal links |
| Why OZROOMY | OZROOMY sofa beds | Melbourne sofa bed brand | Brand story, not commercial category repetition |

## 13. Legacy OZDESIGN review

The current repository contains 46 matching lines across 23 non-documentation files. No automatic replacements were made because the matches span different risk classes.

| Class | Evidence | Decision |
|---|---|---|
| Confirmed public old identity | `config/settings_data.json` points Instagram to `instagram.com/ozdesign_sofa`; rendered on sampled public pages | Merchant confirms whether the social account is intentionally retained or has an OZROOMY replacement |
| Legitimate history | Why page says customers may have known the brand as OZDESIGN SOFA | Retain unless legal/brand review requests a rewrite |
| Product/legal copy | Trial, delivery and brand copy in product/policy templates | Requires merchant/legal approval; several dormant templates are not current storefront content |
| Internal filenames/handles | `ozdesign-base`, `OZDESIGN_LOGO.webp`, `box-pebble-ozdesign...` | Do not rename without dependency and media migration work |
| Dormant template content | Old product templates not attached to current sitemap products | Classify when products are reactivated; no launch code change |

## 14. Dormant product URL decision list

All eleven routes returned 404 on AU. They are not in the current sitemap and were not found as exact rendered links on the sampled homepages. Most references are in disabled or dormant template configuration.

| 404 handle | Source | Plausible successor | Decision required |
|---|---|---|---|
| `castle-sofa` | `templates/index.json` | None proven | Discontinued, renamed or future product? |
| `cloud-chair` | `templates/index.json` | None proven | Confirm product status |
| `cloud-couchboneless-version` | `templates/index.json` | None proven | Confirm product status |
| `kashima-sofa` | `templates/index.json` | None proven | Confirm product status |
| `loopa-sofa` | `templates/index.json` | `/products/loopa-sofa-bed` | Strong candidate; approve redirect before creation |
| `nest-sofa` | `templates/index.json` | None proven | Confirm product status |
| `pebble-ottoman` | `templates/index.json` | `/products/ottoman` | Plausible but not proven; approve mapping |
| `pebble-sofabed` | `templates/index.json` | `/products/pebble-sofa-bed` | Strong candidate; approve redirect before creation |
| `pillow` | `templates/index.json` | `/products/roomy-pillows` | Plausible but not proven; approve mapping |
| `swatches` | `templates/page.customization.json` | No current swatch product in sitemap | Decide whether to publish swatches or link to Contact/customisation |
| `vantopiasofabed` | `templates/index.context.eu.json` | None proven | Confirm EU product/market intent |

Approved redirects can be created in `Content > Menus > View URL Redirects`. Do not redirect discontinued products to unrelated pages merely to eliminate 404s.

## 15. Theme Check and technical debt

### Results

- Theme Check: 83 errors, 174 warnings, 257 total.
- Baseline: 83 errors, 174 warnings.
- Added/removed signature groups: zero.
- JSON: 129/129 parsed.
- JavaScript: 17/17 passed `node --check`.
- Static references: 383 snippet references, 5 section references and 67 asset references; zero missing targets.
- `git diff --check`: pass.
- Bundled Liquid validator: blocked because its own `@shopify/theme-check-common` dependency is missing; Shopify CLI Theme Check supplied the authoritative fallback.

| Check | Count | Business assessment |
|---|---:|---|
| MatchingTranslations | 83 errors | Arabic locale parity; P2 if Arabic launches, otherwise inherited localisation debt |
| OrphanedSnippet | 88 | Deletion unsafe without runtime/editor dependency mapping |
| VariableName | 32 | Maintainability, not a launch blocker |
| UndefinedObject | 14 | Reviewed individually below |
| ExcessiveSettingsCount | 9 | Architectural/editor debt |
| UnusedAssign | 7 | Requires alternate-path verification |
| LiquidComplexity | 6 | Refactor debt, not safe for pre-launch |
| AssetPreload | 6 | Performance opportunity; indiscriminate preloads can regress LCP |
| RemoteAsset | 3 | Third-party/integration review |
| LiquidNestingDepth | 3 | Maintainability |
| DeprecatedFontsOnSettingsData | 3 | Merchant typography migration |
| DeprecatedFontsOnSettingsSchema | 2 | Schema migration |
| DeprecatedTag | 1 | Low-priority compatibility debt |

### All 14 UndefinedObject warnings

| File:line | Object | Classification |
|---|---|---|
| `sections/comparison-table.liquid:94` | `quantity_rule_soldout` | Real uninitialised placeholder in optional generic product-page ATC path; no affected generic button rendered on sampled live pages. Fix requires inventory-rule duplication and interactive cart testing; deferred. |
| `sections/multicolumn.liquid:263` | `quantity_rule_soldout` | Same classification. |
| `sections/shoppable-image.liquid:130` | `quantity_rule_soldout` | Same classification. |
| `sections/comparison-slider.liquid:64` | `quantity_rule_soldout` | Same classification. |
| `sections/rich-text.liquid:100` | `quantity_rule_soldout` | Same classification. |
| `sections/results.liquid:132` | `quantity_rule_soldout` | Same classification. |
| `sections/insta-stories.liquid:61` | `quantity_rule_soldout` | Same classification. |
| `sections/image-banner.liquid:157` | `quantity_rule_soldout` | Same classification. |
| `sections/multirow.liquid:150` | `quantity_rule_soldout` | Same classification. |
| `sections/image-with-text.liquid:147` | `quantity_rule_soldout` | Same classification. |
| `sections/slideshow.liquid:207` | `quantity_rule_soldout` | Same classification. |
| `sections/main-product.liquid:770` | `sizing_chart_append` | Cross-block state assigned later when sizing-chart block is present; block-order behavior needs product UI regression before refactor. |
| `sections/main-product.liquid:771` | `sizing_chart_html` | Same cross-block state classification. |
| `sections/main-product.liquid:1024` | `continue` | False positive: `offset: continue` is valid Liquid pagination/loop syntax. |

### Duplicate ID audit

Live samples consistently contained duplicate payment-title IDs `pi-american_express`, `pi-apple_pay`, `pi-google_pay`, `pi-master`, `pi-paypal`, `pi-shopify_pay`, and `pi-visa` because hidden Cart Drawer badges and Footer badges coexist. `/collections` also contained two `Subscribe` IDs from separate newsletter forms.

The candidate scopes Cart Drawer payment-title IDs and each newsletter submit ID by its section/block. Home, `/collections`, Contact, Why, Pebble and Loopa draft samples now have zero duplicate IDs. Product-specific IDs previously suspected by static review were not duplicated in current rendered Pebble/Loopa output.

## 16. Performance

No new performance code was added in this cycle. The previous audited improvements are retained.

| Page | Previous live mobile LCP | Previous QA mobile LCP | Method |
|---|---:|---:|---|
| Home | 7.07s / 7.00s | 4.53s / 5.69s | Lighthouse 13.5.0, mobile simulated throttling |
| Pebble | 7.53s | 4.06s | Same |
| Loopa | 6.16s | 4.78s | Same |
| Pebble collection | 9.10s | 5.12s | Same |

Final draft source confirms one `fetchpriority="high"` image on the homepage and representative product pages, with no duplicate high-priority image in those samples. A new PageSpeed Insights API attempt returned HTTP 429 quota exceeded, and no browser executable was available for Lighthouse. The numbers above are historical laboratory results, not current CrUX/RUM and not a guarantee of Core Web Vitals.

Remaining measured opportunities from the prior audit are global `base.css`, 41–45 KiB estimated unused CSS, 34–60 KiB estimated unused JavaScript, 252–264 KiB image delivery opportunities, Contact text render delay, and third-party/cookie work. These require a separate interaction/visual regression cycle.

## 17. Draft regression evidence and limitations

### Passed technical checks

- Final draft AU homepage, collections, Contact, Why, Shipping, Warranty, Pebble and Loopa returned HTTP 200 in an authenticated preview session.
- Germany/EUR homepage and Pebble returned HTTP 200 with `.com` canonical and restored navigation DOM.
- AU/AUD and Germany/EUR header navigation plus mobile drawer markup is present.
- Contact, Why, Shipping and Warranty each output one intended H1.
- Sampled draft pages contain zero duplicate IDs.
- Pebble/Loopa Product JSON-LD parses.
- Anonymous cart API: add available Pebble variant -> item count 1; change quantity -> 2; remove -> 0; all HTTP 200.
- Final draft role is unpublished; live theme role/content unchanged.

### Not verified

The in-app browser inventory was empty. Therefore no claim is made for pixel-level layout, Mega Menu hover/click behavior, mobile drawer animation, keyboard/focus behavior, country-selector interaction, variant UI, sticky ATC, upsell click flow, responsive overflow, JavaScript console state or Theme Editor dynamic reload. HTTP 200 and rendered DOM are not substitutes for these tests.

## 18. Prioritised remaining issue register

| Priority | Issue | Owner/action |
|---:|---|---|
| P0 release gate | Manual desktop/mobile/keyboard/cart/Markets/Theme Editor QA not yet performed | Merchant tomorrow; do not publish until passed |
| P1 | `.com` default redirects to `.com.au`; verify intended Markets/domain behavior | Merchant in Shopify Markets + Search Console |
| P1 | Missing/overlong SEO descriptions and weak homepage title | Merchant-approved Admin content |
| P1 | Product JSON-LD brand `My Store` | Merchant confirms Vendor values, then update products |
| P1 | Shipping Policy -> `/pages/shipping-process` returns 404 | Publish/map page or approve replacement |
| P1 | Shipping/Warranty 200 but absent from page sitemap | Check visibility/`seo.hidden` and intended indexation |
| P1 | 11 dormant product handles | Approve product-by-product mapping before redirects |
| P1 | Old Instagram handle | Confirm whether account is intentional or supply new URL |
| P1 | Inventory badge contrast from prior audit | Approve brand-safe accessible color |
| P2 | Product/section image alt review | Manual media review |
| P2 | Google Rich Results/Search Console/Merchant Center checks | Merchant account access |
| P2 | 83 Arabic translation errors | Translate before Arabic launch or keep language unpublished |
| P2/P3 | CSS/JS/image/third-party performance debt | Separate measured development cycle |
| P3 | Orphan snippets, complexity, deprecated fonts/schema | Planned refactor with full regression suite |

## 19. GitHub push safety

The public repository contains no `.github/workflows` files and no Shopify config file that declares deployment. GitHub CLI is not installed, unauthenticated hook/app data was unavailable, and Shopify CLI theme listings do not reveal GitHub-connected branch metadata. Shopify documents that pushing a connected branch immediately updates its connected theme, including a published theme. Therefore absence of local workflows is not enough to prove that `main` or `dev` is not connected to live theme `145528717546`.

Local feature -> `dev` -> `main` merges may proceed after validation, but remote `dev` and `main` must remain unchanged until the merchant confirms on `Online Store > Themes` that no published theme card is connected to either branch.

## 20. Rollback and recovery

### Git

Stable starting point: `e7b4578eb26be25f2f3e406c8a0bef32d7edfcca`. Preserved previous audited point: tag `prelaunch-final-start-2026-10-08` at `0bd814f59e3d7605bbca8397b2301861041a2dd7`.

Inspect the release before any rollback:

```powershell
git log --graph --oneline --decorate e7b4578..main
git diff --stat e7b4578..main
git diff e7b4578..main
```

If the final merge must be undone after it is shared, create a recovery branch and use `git revert -m 1 <main-merge-sha>`, then validate and merge the revert normally. Do not reset shared branches or force-push. Reverting Git does not change Shopify merchant settings or automatically restore a Shopify theme unless a branch connection exists.

### Shopify before publication

Do nothing to production. Leave `145528717546` published and continue reviewing unpublished `145531568362`. A defect in the draft cannot affect live unless a connected Git branch or explicit publication action changes it.

### Shopify after a future publication

If the merchant later publishes `145531568362` and discovers a serious issue, first verify that previous theme `145528717546` still exists and has not been edited. In Shopify Admin, use `Online Store > Themes`, review the previous theme, then publish it explicitly. The isolated pre/post live backups provide code evidence, but a local backup alone does not make rollback instantaneous and does not restore orders, products, menus, Markets or other Admin data.

After a Shopify rollback, reconcile the chosen stable theme back into Git on a dedicated branch. After a Git revert, create another unpublished validation theme before changing production. Never assume Shopify publication updates Git, or Git rollback updates merchant configuration.

## 21. Tomorrow's manual QA checklist

Mandatory before publication:

1. Desktop AU: open `Shop` Mega Menu, every top-level link and focus/escape behavior.
2. Desktop Germany/international: repeat Mega Menu checks and verify EUR/canonical domain.
3. Mobile AU and international: open/close nested navigation and country selector at 375/390 px.
4. Theme Editor AU and Germany contexts: verify header, save/reload a harmless test setting only in the unpublished draft, then reconcile if retained.
5. Homepage hero at 375, 768, 1024 and 1440 px: crop, text, CTA, no horizontal overflow.
6. Pebble and Loopa: media, swatches/variants, price/availability, sticky ATC and sizing chart.
7. Add to Cart: drawer opens; quantity update/remove; Continue Shopping reaches `/collections`; upsell selection/add.
8. Contact form layout and error/success states without sending sensitive test data.
9. Shipping and Warranty H1 visual appearance; Shipping Process link decision.
10. View source or an SEO extension: title, description, canonical, hreflang, one H1 and Product JSON-LD.

Optional after the release gate: inventory contrast, alt text improvements, performance profiling, content refinements and legacy-template cleanup.

## 22. Sources and standards used

- Shopify GitHub theme integration: <https://shopify.dev/docs/storefronts/themes/tools/github>
- Shopify contextual section groups: <https://shopify.dev/docs/storefronts/themes/architecture/section-groups>
- Shopify Theme Check: <https://shopify.dev/docs/storefronts/themes/tools/theme-check>
- Shopify SEO titles/descriptions: <https://help.shopify.com/en/manual/promoting-marketing/seo/adding-keywords>
- Shopify sitemaps: <https://help.shopify.com/en/manual/promoting-marketing/seo/find-site-map>
- Shopify URL redirects: <https://help.shopify.com/en/manual/online-store/menus-and-links/url-redirect>
- Shopify image alt text: <https://help.shopify.com/en/manual/products/product-media/add-alt-text>
- Google ecommerce structured data: <https://developers.google.com/search/docs/specialty/ecommerce/include-structured-data-relevant-to-ecommerce>
