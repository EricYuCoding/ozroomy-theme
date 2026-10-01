# Header / Mega Menu v2

## Status

Ready for human visual review. Production deployment has not started.

- Feature branch: `feature/header-mega-menu-v2`
- Feature commit: `13409b8bf272fef96aa5ac2b149c2ea08d916bfd`
- Validation theme: `Mega Menu v2 validation - 2026-10-01`
- Validation theme ID: `145456267498`
- Preview: `https://zjna5j-hn.myshopify.com?preview_theme_id=145456267498`
- Theme editor: `https://zjna5j-hn.myshopify.com/admin/themes/145456267498/editor`

The validation theme is unpublished. The live theme was not modified.

## Objective

Upgrade the existing Shopify header instead of replacing it. The Shopify Menu remains the canonical navigation tree, while Header blocks control a small set of presentation layouts. The result supports deterministic desktop mega menus, the existing three-level mobile hierarchy, optional lightweight feature cards, and backwards compatibility with the specialised products mega menu.

## Initial production state

- Live theme at the start of work: `Feature 1 validation - 2026-09-29` (`145433886954`)
- Starting `dev`: `b5f506f626973fdd683b4845f68899f935a9e73a`
- The pre-development audit found no meaningful Liquid, CSS, JavaScript, locale, layout, snippet, or binary drift.
- The meaningful drift was merchant configuration serialized by Shopify after deployment.
- The live Main Menu contained `Shop` with `Loopa` and `Pebble` children, but no third navigation level.

## Production reconciliation

Branch: `reconcile/production-2026-10-01`

Reconciliation commit:

`7222c7760f9e82b5147d76a64364b93a81d09611` — `chore: reconcile production theme configuration before mega menu`

Resulting reconciled `dev`:

`57469ebb432cef4e7024c80481b3f17acd3d44fe`

Decisions applied:

- Used the current live `sections/header-group.json`, homepage, Pebble, swatches, Vantopia, and other deployed template configuration.
- Retained repository-controlled `config/markets.json`.
- Preserved disabled Loox, Selleasy, Klaviyo, and Triple Whale app embed entries in `config/settings_data.json`; no app was enabled.
- Left EU and Japan header context mappings unchanged.
- Confirmed that reconciliation changed JSON/configuration only and retained the audited Theme Check baseline of 83 errors and 170 warnings.
- Pushed the reconciliation branch separately, merged it to `dev` with a merge commit, and pushed `dev` before creating this feature branch.

## Architecture

### Navigation data

`section.settings.menu` is the only navigation hierarchy. Liquid renders Level 1, Level 2, and Level 3 labels, order, and URLs directly from the selected Shopify Menu. Product and collection names are not hardcoded in the renderer.

### Presentation data

The Header section supports up to eight `Mega menu` blocks. A block is associated with a Level 1 item by trimmed, case-insensitive exact label matching. The legacy `products_mega_menu_links` setting now uses comma-separated exact matches as well, so `Shop` cannot match `Workshop`.

Supported layouts:

- `Collection showcase`: navigation plus up to four collection resource cards.
- `Editorial`: navigation, heading, rich text, CTA, and up to two image/resource cards.
- `Navigation columns`: the nested Shopify Menu plus one optional image, collection, or product feature card.

If no block matches, the same upgraded renderer falls back to the Shopify Menu hierarchy without presentation content. The specialised products mega menu remains available as a backwards-compatible fallback when its legacy setting is configured.

### Lightweight card rendering

`snippets/header-mega-menu-card.liquid` renders only image, title, optional product price, and link. Collection/product selectors supply canonical titles, prices, and URLs. A configured image or heading can override presentation while the selected resource continues to supply missing values.

## Files changed

Added:

- `snippets/header-mega-menu-card.liquid`
- `snippets/header-mega-menu-v2.liquid`

Modified:

- `sections/header.liquid`
- `sections/header-group.json`
- `snippets/header-drawer.liquid`
- `snippets/products-mega-menu.liquid`
- `assets/base.css`

The feature also removed the second of two identical 257-line mobile drawer CSS regions from `assets/base.css`.

## Theme Editor setup

1. Open the validation theme editor and select the Header section.
2. Add or select a `Mega menu` block.
3. Set `Trigger menu item` to the exact Level 1 label in the selected Shopify Menu. Matching ignores case and surrounding whitespace but does not use substrings.
4. Choose `Collection showcase`, `Editorial`, or `Navigation columns`.
5. Configure only the fields needed by that layout:
   - heading, rich text, CTA label, and CTA link;
   - collection and/or product resources;
   - up to two Shopify images and optional image headings/links.
6. Enable `Show first featured card on mobile` only when one compact card helps the mobile experience.
7. Leave a presentation field empty to use its selected Shopify resource as a fallback. Leave the block absent to get navigation-only rendering.

The validation theme includes an editorial `Shop` block using two existing Shopify images and the Loopa/Pebble collection resources. This configuration exists only in the unpublished theme source until approval and deployment.

## Shopify Main Menu setup

Edit navigation under Shopify Admin → Content → Menus. Reordering or renaming items there updates desktop and mobile because both consume the same selected Menu.

The production Main Menu has only two levels at review time. To validate Level 3 without changing live navigation:

1. Create a new menu named `Mega Menu v2 QA`.
2. Add this temporary hierarchy (destinations may use existing collections):
   - Shop
     - Sofa Beds
       - 1.5m Sofa Beds
       - 2m Sofa Beds
       - Corner Sofa Beds
     - Collections
       - Pebble
       - Loopa
     - Accessories
3. In the unpublished validation theme only, select `Mega Menu v2 QA` in Header → Menu.
4. Keep the Mega menu block trigger set to `Shop`.
5. Test desktop columns and mobile drill-down, then switch the validation theme back to `Main Menu` if the QA menu should not remain selected.

Creating the unused menu is store-level, but it does not affect production unless it is assigned to the live theme or linked elsewhere.

## Desktop behaviour

- Full-width panel with the theme's existing `page-width`, typography, colors, and breakpoints.
- Pointer hover opens after 150 ms and closes after 220 ms, while retaining focus-safe tolerance between trigger and panel.
- Focus opens the panel; native disclosure behavior preserves Enter/Space operation on touch-capable desktop devices.
- Escape closes and returns focus to the trigger.
- Outside click and opening another disclosure close the active panel.
- Hover, focus, and open state share the same underline treatment.
- Theme Editor block selection opens the associated panel for editing.

## Mobile behaviour

- Extends the existing off-canvas `header-drawer`; it does not render a compressed desktop grid.
- Uses the same Shopify Menu for up to three levels.
- Child panels have Back, centered panel title, Close, and parent `View all` links.
- Existing focus trapping, body scroll locking, slide transitions, and focus return are retained.
- Drawer scroll positions reset only after the root drawer has fully closed.
- Moving to the desktop breakpoint closes an open drawer and removes scroll-lock state.
- At most one configured lightweight feature card is shown after navigation.

## Accessibility

- Controls remain native `summary`/`details` or `button` elements; destinations remain anchors.
- Added `aria-expanded` and matching `aria-controls` to desktop, drawer, and legacy mega disclosures.
- Rendered validation markup has zero duplicate relevant IDs and zero missing relevant `aria-controls` targets.
- Current-page links continue to expose `aria-current`.
- Escape, focus opening/closing, outside click, focus return, and reduced-motion behavior are implemented.
- Images expose intrinsic width/height, responsive sizing, lazy loading, asynchronous decoding, and resource-derived alt text.

Real Tab/Shift+Tab/Enter/Space/Escape interaction still requires human browser review because no interactive browser was connected to this workspace during the final QA pass.

## Performance

- No new library, framework, stylesheet request, script request, or theme asset request was introduced.
- `assets/main.js` delta: 0 bytes.
- `assets/secondary.js` delta: 0 bytes.
- Header compiled JavaScript delivered by Shopify: 5,179 → 12,402 bytes (`+7,223` bytes).
- Normalized `assets/base.css` source: 397,147 → 397,590 bytes (`+443` bytes) after removing the duplicated drawer rules.
- Current Shopify CDN CSS response: 330,370 → 336,024 bytes (`+5,654` bytes).
- Rendered header for the current menu: `+5,390` bytes and `+38` elements compared with live.
- Script and stylesheet reference counts are unchanged (11 scripts and 3 styles on the tested homepage).
- The validation configuration emits three menu image elements (two desktop and one repeated compact mobile card), all with transparent inline `src` placeholders. It emits zero external mega-menu image `src` values before opening.
- Real Shopify image URLs and responsive `srcset` values are moved into data attributes and hydrated only when the associated desktop/mobile disclosure opens. The two unique CDN image URLs both return HTTP 200.
- Intrinsic dimensions plus fixed media aspect ratios reduce CLS risk.

## Validation completed

- Header group JSON parsed successfully after removing Shopify's standard leading comment.
- Header JavaScript passed `node --check` locally.
- Shopify's generated `compiled_assets/scripts.js` returned HTTP 200 and passed `node --check`.
- Theme Check result: 83 errors / 172 warnings. The 83 errors are the audited repository baseline. The two additional warnings are `OrphanedSnippet` warnings for the two new snippets; both are directly rendered and present in Shopify's compiled output, so these are checker graph false positives.
- `git diff --check` passed (only the repository's expected CRLF conversion notices were printed).
- No `console.log`, `debugger`, TODO, or FIXME markers remain in changed source.
- All seven feature files pulled back from validation theme `145456267498` match the local source.
- Shopify accepted and rendered the feature on homepage, Pebble product, Loopa product, and Pebble collection URLs with HTTP 200, the expected theme ID, upgraded header, and no rendered Liquid errors.
- Validation markup contains three correctly deferred images, no `#` card links, no duplicate relevant IDs, and no missing relevant ARIA targets.
- Both deferred CDN image resources return HTTP 200.
- Live theme `145433886954` remains live; validation theme `145456267498` remains unpublished.

## Human QA remaining

The in-app browser was unavailable in this workspace, so visual and true interaction testing was not fabricated. Human review must cover:

- Desktop: approximately 1920, 1440, 1280, and 1024 px.
- Mobile/tablet: approximately 375, 390, 430, and 768 px.
- Hover tolerance, trigger-to-panel movement, underline/open state, links/cards/CTA, outside click, Escape, and keyboard traversal.
- Drawer open/close, body lock, drill-down, Back, Close, long scrolling, reopening, focus return, and resize in both directions.
- Logo, announcement/ticker, search/predictive search, account, cart, homepage, product, and collection regressions.
- Collection showcase, editorial, navigation columns, product-card fallback, image-card fallback, empty-field fallback, and the temporary three-level QA Menu.
- Default, EU, and Japan market presentation in a signed-in Shopify preview session.

## Known issues and limitations

- The current Main Menu has no Level 3 item, so Level 3 output is implemented but not rendered by current production data. Use the temporary QA Menu steps above.
- EU and Japan context files explicitly provide empty Header blocks, so those contexts inherit the upgraded navigation renderer but not the default editorial presentation block unless configured separately.
- Japan still maps to `header-menu-eu`; this predates the feature and was intentionally left unchanged.
- Browser console, visual layout, pointer behavior, and real keyboard focus behavior remain part of the human review checkpoint because no interactive browser was connected.
- Duplicate Mega menu blocks with the same trigger are not useful; the first exact match in block order wins.

## Production deployment procedure (after explicit approval only)

1. Confirm this branch is clean and its remote commit matches the reviewed validation theme.
2. Confirm live is still theme `145433886954` and validation is still unpublished theme `145456267498`.
3. Pull current live into a new isolated directory and compare configuration with the reconciled baseline. Stop and reconcile if merchants changed production during review.
4. Merge the approved feature branch to `dev` without squashing useful history and push `dev`.
5. Promote the already-reviewed validation theme `145456267498` rather than rebuilding from an older theme.
6. Retain the previous live theme as rollback.
7. Smoke-test desktop/mobile navigation, search, cart, homepage, Pebble, another product, and a collection; inspect the production console.
8. If a serious navigation or checkout regression appears, roll back to the previous live theme before attempting risky live debugging.
9. Pull the new live theme into an isolated directory, reconcile any expected Shopify serialization, and verify source alignment.
10. Create and push `snapshot/production-2026-10-01-mega-menu-v2`, then create and push annotated tag `v1.1.0` on the final intended source commit.
11. Update this document with approval, merge/final `dev` SHAs, deployment time, new live theme, smoke results, snapshot SHA, tag, and validation-theme disposition.

## Post-approval records (pending)

- Human approval: pending
- Merge commit: pending
- Final `dev` SHA: pending
- New live theme/name: pending
- Deployment time: pending
- Production smoke test: pending
- Production snapshot SHA: pending
- Release tag: pending (`v1.1.0` proposed)

