# Editorial Collection Rail and Flexible Hero Banner

## Status

Development and technical validation completed on 2026-10-02. The final Editorial Rail refinement is available in a new unpublished Shopify review theme and is awaiting final human visual review.

- Development branch: `dev`
- Editorial feature branch: `feature/editorial-home-sections`
- Visual-refinement branch: `fix/editorial-visual-refinement`
- Final text-controls branch: `fix/editorial-rail-text-controls`
- Final implementation commit: `69a1ca5a02c6bd8491ff26b9df9e7a78733393f4`
- Feature-to-`dev` merge and final theme-source SHA: `ab2cb43fc81a044a616a1a358437a6ed51fe5328`
- Review theme: `Editorial Rail final validation - 2026-10-02`
- Review theme ID: `145467834602`
- Review preview: `https://zjna5j-hn.myshopify.com?preview_theme_id=145467834602`
- Theme editor: `https://zjna5j-hn.myshopify.com/admin/themes/145467834602/editor`

The review theme is unpublished. It has not replaced or modified the live theme. Production merge, release tag, and production snapshot are intentionally deferred until visual approval.

## Initial and reconciled state

The cycle began from `dev` SHA `1355d0b579e5c82736b09a1008309e50b1f721be` and `main` SHA `4493bfcd1543c179fea02bdfa83ebdd0d3616b16`.

Before the final refinement, Shopify theme roles had changed:

- Current live: `Editorial Sections validation - 2026-10-02` (`145466556650`).
- Previous live / primary Shopify rollback: `Mega Menu v2 validation - 2026-10-01` (`145456267498`), retained unpublished.
- Older rollback: `Feature 1 validation - 2026-09-29` (`145433886954`), retained unpublished.

An isolated pull of the current live theme was compared with `dev`. All Liquid, CSS, and JavaScript source matched. The only meaningful merchant drift was in `templates/index.json`:

- slideshow block `slide_hezjkf` was disabled;
- configured Flexible Hero Banner section `flexible_hero_banner_PTJQ48` was added after Content tabs;
- its content was set to `A better way to sofa bed`, `A proper sofa by day. A proper bed by night.`, a `Shop now` link to the Pebble collection, desktop image `ozroomy-banner-1.webp`, and classic presentation.

Those changes were preserved through:

- Reconciliation branch: `reconcile/shopify-editor-2026-10-02-final`.
- Reconciliation commit: `e1db69bc2dcf31d468354c2fb8ca859dc5f0520d`.
- Reconciliation-to-`dev` merge: `0122544196edfed37ff6956260bde75fb96252d5`.

Shopify's removal of disabled Loox, Selleasy, Klaviyo, and Triple Whale app-embed records from `config/settings_data.json` was classified as normalization and was not imported. Repository-controlled `config/markets.json` was preserved.

## Editorial Collection Rail

Initial implementation commit: `e9cc5b0` (`feat: add editorial collection rail`).

The section supports:

- independently configured Collection and Product resource cards;
- a horizontally scrolling desktop/tablet rail with scroll snap;
- 3, 4, or 5 full desktop cards and an intentional partial next-card treatment when more cards exist;
- an editorial vertical stack on mobile;
- square, portrait, and landscape media ratios;
- optional navigation arrows;
- responsive Shopify images and per-card image overrides;
- a clean white media background without full-image gradients, haze, vignettes, filters, or box shadows;
- one semantic destination per card with keyboard focus styling and `block.shopify_attributes` retained.

### Final text-display system

Both Collection and Product blocks now use the same display-title hierarchy: Custom display title, selected resource title, then a generic resource-type fallback for an unconfigured block.

Each block independently controls its overlay title:

- show/hide toggle, defaulting to shown for backwards compatibility;
- heading or body font using existing theme font variables;
- Small, Medium, Large, or Extra large responsive size;
- Regular, Medium, Semibold, or Bold weight;
- Shopify color setting, defaulting to the previous white presentation;
- left, center, or right text alignment without changing the existing vertical placement.

Each block also independently controls an opt-in below-image region:

- show/hide toggle, defaulting to hidden so existing cards do not gain duplicate text;
- heading or body font;
- Small, Medium, Large, or Extra large title size;
- Regular, Medium, Semibold, or Bold title weight;
- optional Shopify color with fallback to the section foreground color;
- left, center, or right alignment.

Collection cards render only the title below the image. Product cards can also render the selected product's current price. The product-only price toggle defaults to enabled, applies only while below-image content is shown, uses the theme currency-code preference, and uses the theme's concise translated `From` pattern for varying prices. Price inherits the below-image family, color, and alignment and is visually smaller than the title.

The image, overlay title/CTA, below-image title, and product price remain inside a single card anchor. When both visible title regions are disabled, an accessible card name is supplied with `aria-label`. When both are visible, the repeated overlay title is hidden from assistive technology. Long titles wrap without forcing a page-width overflow.

## Flexible Hero Banner

Initial implementation commit: `925fa0b` (`feat: add flexible hero banner`).

The section provides:

- classic overlay and desktop split-content modes;
- Shopify image or Shopify-hosted video media;
- separate desktop and mobile images, focal-point-aware positioning, and video poster fallback;
- adaptive, fixed large, and full-viewport responsive heights;
- independent desktop/mobile vertical placement and text alignment;
- mobile video behavior controls;
- heading, body copy, and up to two theme-native buttons;
- section-scoped primary and secondary button hover/focus refinements;
- reduced-motion-safe video handling in `assets/section-flexible-hero-banner.js`.

The final Editorial Rail refinement did not modify the Flexible Hero Banner.

## Files changed in the final pass

Reconciliation:

- `templates/index.json`

Final implementation:

- `sections/editorial-collection-rail.liquid`

Cycle documentation:

- `docs/feature-history/2026-10-02-editorial-sections.md`

No global stylesheet, `main.js`, `secondary.js`, existing slider, Collection List, Product Card section, or button system was changed by the final rail refinement.

## Validation

- Theme Check before final refinement: 83 errors / 173 warnings.
- Theme Check after final refinement: 83 errors / 173 warnings.
- New rail-file Theme Check offences: zero.
- `git diff --check`: passed; only the repository's expected line-ending conversion notice appeared.
- Section schema JSON: parsed successfully.
- Liquid/schema structure: unique setting IDs, Collection/Product settings present, Product-only price control confined to the Product block, and no unsupported conditional schema added.
- Link/accessibility structure: exactly one anchor in the card loop, no nested anchors, preserved block editor attributes, focus-visible styling, accessible fallback naming, and decorative duplicate CTA/title treatment verified.
- Display-state matrix: Overlay on/off crossed with Below image on/off passed structurally for both block types.
- Title cases: custom title and resource-title fallback paths verified for both block types.
- Money cases: `money`, optional `money_with_currency`, translated varying-price output, and price on/off logic verified.
- Responsive source checks: mobile vertical grid and the existing 750 px / 990 px rail behavior, 3/4/5-card variables, partial-card formula, and scroll snap remain intact.
- Visual-integrity source checks: white media background preserved; no gradient, filter, blend mode, vignette, or full-image overlay introduced.
- JavaScript delta for the final rail refinement: zero.
- Unrelated-section delta for the final rail refinement: zero.
- Review-theme pullback: `sections/editorial-collection-rail.liquid` and `templates/index.json` SHA-256 hashes exactly match local `dev`.
- Shopify smoke tests: homepage, representative Loopa product, representative Pebble collection, and direct Editorial Rail section-render endpoint all returned HTTP 200 with no rendered Liquid errors. The section endpoint contained the expected rail markup.

The Theme Editor schema was accepted by Shopify during upload. A connected interactive browser was not available, so the settings panel, live editor changes, card combinations, responsive visual layout, and interactive behavior were not claimed as visually tested.

## Development and review closeout

- Feature branch commit: `69a1ca5a02c6bd8491ff26b9df9e7a78733393f4`.
- Feature-to-`dev` merge: `ab2cb43fc81a044a616a1a358437a6ed51fe5328`.
- `origin/fix/editorial-rail-text-controls` and `origin/dev` contain the completed source.
- Review theme `145467834602` is unpublished.
- Live theme `145466556650` was not changed by this final pass.
- Stable `main` remains `4493bfcd1543c179fea02bdfa83ebdd0d3616b16`.
- Main release SHA: not created; visual approval is pending.
- Release tag `v1.2.0`: not created.
- Production snapshot branch/SHA: not created; an unpublished review theme is not a production state.
- Post-deployment production reconciliation: not applicable until approval and deployment.

The SHA `ab2cb43fc81a044a616a1a358437a6ed51fe5328` is the exact completed theme-source state uploaded for review. A later documentation-only closeout commit does not change theme source.

## Rollback

Git rollback options:

- Exact pre-refinement, reconciled live-source state: `0122544196edfed37ff6956260bde75fb96252d5`.
- Stable pre-editorial release source on `main`: `4493bfcd1543c179fea02bdfa83ebdd0d3616b16` (`v1.1.0` lineage).
- The final refinement can also be reversed through the `dev` merge commit `ab2cb43fc81a044a616a1a358437a6ed51fe5328` without rewriting history.

Shopify rollback options:

- Current live and exact pre-final-review storefront: `Editorial Sections validation - 2026-10-02` (`145466556650`).
- Previous release rollback: `Mega Menu v2 validation - 2026-10-01` (`145456267498`), retained unpublished.
- Older rollback: `Feature 1 validation - 2026-09-29` (`145433886954`), retained unpublished.

No 2026-10-02 production snapshot exists because production closeout has not occurred. No theme or rollback branch was deleted.

## Human QA remaining

Review the unpublished theme in Shopify Theme Editor and storefront preview:

- confirm both block types expose the new Overlay title, Below image, and Product-only settings in the intended order;
- exercise all four overlay/below combinations on Collection and Product cards;
- verify custom titles and resource-title fallback, price on/off, and a varying-price product if available;
- visually compare font family, all four sizes, all four weights, colors, and left/center/right alignment per card;
- inspect 3-, 4-, and 5-card desktop rails, a partial next card, mobile vertical stacking, long titles, and mixed Collection/Product blocks;
- inspect white-background, transparent cut-out, and lifestyle images for the clean-image treatment;
- test multiple section instances, Theme Editor live block changes, arrow/scroll behavior, pointer hover, keyboard focus, and link destinations;
- regression-check the reconciled homepage Flexible Hero Banner on common desktop and mobile widths.

## Known limitations

- No interactive browser was connected during final QA, so no browser screenshots, visual approval, real Theme Editor interaction, pointer interaction, keyboard traversal, or viewport-specific layout approval is claimed.
- The Editorial Rail is available as a section but is not currently placed in `templates/index.json`; the direct Shopify section-render endpoint was used for the render smoke check. It can be added to the unpublished review theme for visual QA without altering the live theme.
- Theme Check's repository-wide 83 errors / 173 warnings remain the established baseline; the final rail file contributes zero offences.

## Production closeout after approval

After human visual approval, verify the approved Shopify state, then merge `dev` to `main`, tag the actual release merge as `v1.2.0`, publish only the approved theme, perform an isolated post-deployment pull/reconciliation, and create `snapshot/production-2026-10-02-editorial-sections` from the confirmed production state. Do not use the unpublished review theme as a production snapshot before those steps are complete.
