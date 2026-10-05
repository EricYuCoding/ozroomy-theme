# Editorial Message Banner and Cart Drawer Upsells — 2026-10-05

Status: implemented, unpublished review theme uploaded, ready for human review. Production publication and dev-to-main merge remain pending approval.

## Production and reconciliation

Store: `zjna5j-hn.myshopify.com`. Live theme: `145467834602`, `Editorial Rail final validation - 2026-10-02`.

The isolated fresh production pull matched all 344 audit files. The production homepage and footer merchant configuration were reconciled in `5a71b34` on `reconcile/production-2026-10-05`, after merging origin/main lineage in `3e8ca8b`. There were no unresolved conflicts. Live homepage settings, the intentionally cleared footer Information menu, and footer background `#435743` were preserved. Repository disabled app embed records in `config/settings_data.json` and `config/markets.json` were retained. Snapshot reference: `snapshot/production-2026-10-05-editorial-rail-live` at `5a71b34`.

## Review theme

- Name: `Editorial Banner + Cart Upsell review - 2026-10-05`
- ID: `145495195882`; role: unpublished
- Preview: https://zjna5j-hn.myshopify.com/?preview_theme_id=145495195882
- Editor: https://zjna5j-hn.myshopify.com/admin/themes/145495195882/editor
- Isolated upload directory: `D:\work\ozroomy-validation-theme-20261005`

Exactly one review theme was created. The initial upload rejected a block label longer than Shopify's 25-character limit; the label was shortened to `Product-specific upsells`, and the same unpublished theme was updated successfully. The block type remains `product_specific_upsells`.

Review-only homepage content uses heading “Free Shipping & Return” and the requested 60-day body. The Cart Drawer block uses heading “Complete with”, maximum 2, description off, and fallback products `roomy-maxi-cushion` and `roomy-pillows`. Initially prepared fallback handles did not resolve; public product reads identified these valid handles. These review settings were applied only in the isolated upload copy, not repository production JSON. No production product mappings were changed.

## Feature 1: merchant use and architecture

Open Online Store → Themes → the review theme → Customize → Add section → **Editorial message banner**. This feature requires no metafield.

Controls include heading, h2/h3/h1 tag, rich text body, optional CTA label and URL, primary/secondary CTA style, full/page width, desktop/mobile minimum height, content maximum width, separate desktop/mobile horizontal and vertical alignment, colour scheme, optional background and heading/body colours, borders and border colour, device visibility and section ID display.

Typography controls include heading/body font role, desktop/mobile sizes, supported weights, line heights and letter spacing. Spacing controls include desktop/mobile top/bottom padding, heading/body gap and CTA gap. Defaults include 360/260px minimum height, 760px content maximum, 52/34px heading, 20/17px body, and 72/48px padding.

The standalone `sections/editorial-message-banner.liquid` uses scoped CSS, theme fonts/buttons/page width, and 750/990px breakpoints. It adds no JavaScript. Empty content and incomplete CTA settings do not introduce blank content gaps. Heading hierarchy remains the merchant's responsibility when selecting h1.

## Feature 2: merchant use and architecture

Open Online Store → Themes → the review theme → Customize → Cart Drawer → Add block → **Product-specific upsells**. The new block is separate from legacy `product_upsells` and limited to one instance.

Set heading (default “Complete with”), fallback product list, maximum recommendations (1–3, default 2), and optional short description (default off). Keep the cart type set to Drawer.

The primary relationship is product metafield `custom.cart_upsells`, type `list.product_reference`. Rendering reads `item.product.metafields.custom.cart_upsells.value`. The last-added product ID from the successful Ajax response is held in the drawer instance. After reload, the first eligible rendered source group is selected. Source groups are bounded to eight; each group and fallback is bounded to three cards. No localStorage is used.

Product-specific recommendations take priority. If none remain, use the global fallback; hide the upsell region if no valid recommendation exists. Exclude the source product, products already anywhere in the cart, duplicates and unavailable products. Product ordering follows the merchant's list.

One directly purchasable variant uses the existing ProductForm/cart AJAX flow, bundled `cart-drawer` and `cart-icon-bubble` sections, and keeps the drawer open. Multiple variants use an internal options state within the existing drawer. It fetches only `product URL + section_id=cart-upsell-options`, caches markup by product, and matches variants locally. It uses the shared price component and native swatch data. It does not load main-product, QuickAddModal or another drawer.

Back restores focus to the trigger. Escape returns from options to cart, then closes the normal drawer. Close closes the whole drawer. Successful add returns to normal cart and deliberately focuses the drawer heading; add errors retain options and use existing alert semantics. Normal checkout footer is hidden during options and restored afterward. Existing dialog/focus trap and scroll lock are retained. Swatches receive meaningful option/value labels, unavailable states and live status. The product-page empty swatch label was fixed additively.

## Metafield setup

Definition existence was not verified and no definition was created. Creating it through the available Admin tooling would require new app authentication, which was out of scope. Missing metafields are handled gracefully through fallback products.

1. Shopify Admin → Settings → Custom data → Products → Add definition.
2. Name: **Cart upsells**.
3. Namespace and key: `custom.cart_upsells`.
4. Type: **Product**; enable **List of values** (List of products / `list.product_reference`).
5. Save. If the key already exists, confirm its type; do not overwrite an incompatible definition.
6. Products → select a product → Metafields → Cart upsells → choose and order upsell products → Save.

Example relationships, subject to actual catalogue availability: Pebble Sofa Bed → Maxi Cushion → Replacement Cover; Loopa Sofa Bed → Maxi Cushion → Loopa Cover. No mappings were populated automatically.

## Performance and validation

- Theme Check baseline: 83 errors / 173 warnings. Final: 83 errors / 174 warnings. New errors: 0. New warnings: 1.
- The added `OrphanedSnippet` warning on `snippets/cart-product-upsells.liquid` is a false positive: `snippets/cart-drawer.liquid:700` statically renders it. No restructuring was done to silence it.
- `node --check assets/main.js`, JSON/schema parsing and `git diff --check` pass. Schema labels were also checked against the server block-name limit.
- Previous full cart logic harness passed 26 cases covering missing/enabled block, absent/empty metafield, fallback, limits, filtering, source selection, reload, quantity/removal, direct/multiple variants, sold-out/unavailable, add failure and section failure/cache behavior. Final current-source harness passed 14 additional source-selection, variant-matching and request-path checks.
- HTTP preview: homepage banner and options-state shell render; compact sections for Loopa and both review fallback products render with no Liquid errors. A private test cart add returned bundled drawer markup with both fallback products and updated quantity/total; that isolated cart was cleared afterward. This verifies server rendering, not browser interaction.
- Compact uncompressed UTF-8 responses: Loopa 38,594 bytes; Roomy Maxi Cushion 25,954 bytes; Roomy Pillows 25,936 bytes. Loopa is roughly 95% smaller than the previously audited ~791 KB configured main-product response. Compression transfer size was not reliably measurable with available clients.
- Main JS adds 16,204 raw bytes (208,363 → 224,567). Registrations are global; feature listener/cache initialization requires the new block and a drawer instance. No feature instance initializes on pages without a drawer.
- Code review confirms zero new data-fetch HTTP requests on normal load/drawer open, no third-party dependency or recommendation/Storefront API request. Direct add uses the existing cart add request. First options open uses one compact GET, cached reopen uses zero; option changes perform zero GETs. Browser network tracing was unavailable.
- Card images use lazy loading, width-240 URLs, explicit dimensions/aspect ratio and deferred URLs for inactive groups. Compact imagery uses width 480 and lazy loading. Image loading may still occur when images become visible; zero drawer-open request refers to data-fetch requests.

No connected browser was available (browser discovery returned an empty list). Visual layout, keyboard/focus behavior, responsive overflow, contrast and interactive regressions have not been browser-verified. Static review preserved legacy upsells, product pages, cart page/popup modes, quantities/removal/note/checkout/icon and unrelated homepage/header code; human confirmation remains required.

## Files

| File | Purpose |
| --- | --- |
| `sections/editorial-message-banner.liquid` | Standalone no-JS merchant banner |
| `sections/cart-upsell-options.liquid` | Compact section/variant data |
| `snippets/cart-product-upsells.liquid` | Recommendations, fallback and cards |
| `sections/cart-drawer.liquid` | New block schema |
| `snippets/cart-drawer.liquid` | Block placement, internal state and scoped CSS |
| `snippets/product-variant-options.liquid` | Accessible swatch label |
| `assets/main.js` | Drawer state, last-added source, cache, local variant matching |
| This document | Validation and merchant handoff |

## Git and rollback

Reconciliation: `3e8ca8b`, `5a71b34`. Feature 1: `e0fcc75`. Feature 2: `4f1fd3a` (`fcfc7a6` was amended locally before push to include the server-required shorter schema label). Feature branch: `feature/editorial-banner-cart-upsell`, retained and merged into dev. Feature/dev are pushed; main remains `4493bfcd1543c179fea02bdfa83ebdd0d3616b16`. Reconciliation and snapshot references remain local at `5a71b34`.

Merchant rollback: remove/disable the new banner section and upsell block in the theme editor. Developer rollback: revert the feature commits and associated documentation on a development branch, validate, and create an unpublished review theme. Preserve production configuration; do not publish a rollback without approval. The review theme can be deleted manually after review if desired. Existing production is available throughout.

## Human review: about 5–10 minutes

Desktop at 1024/1440px: inspect the homepage banner, then use Customize to toggle full/page width, alignment, colours/borders, typography and optional CTA. Add Loopa to cart; confirm “Complete with” shows Cushion/Pillows. Choose options, change swatches, add, check quantity/subtotal and that the new item disappears from recommendations. Test Back, Escape twice, Close and keyboard focus. Test normal product swatches/add, quantity/removal/note and checkout entry without completing payment.

Mobile at 320/375/390/430px and a short viewport: check banner wrapping, swatch wrapping, absence of horizontal overflow, body scrolling, usable Total/Checkout in normal state, option Add control and Back/Close. Current catalogue fallback products are multi-variant; direct Add was logic-tested but requires a single-variant available product configured for human review.

Production is not published; dev is not merged to main; metafield creation and product-specific mappings remain merchant tasks. Next action: open the review preview, run the short checks, and report any issues before requesting production promotion.
