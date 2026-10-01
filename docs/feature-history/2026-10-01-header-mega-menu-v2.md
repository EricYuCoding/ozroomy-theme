# Header / Mega Menu v2

## Status

Released to production, technically verified, archived, merged to the stable source branch, and tagged on 2026-10-01.

- Feature branch: `feature/header-mega-menu-v2`
- Initial feature commit: `13409b8bf272fef96aa5ac2b149c2ea08d916bfd`
- Initial documentation commit: `8b24c69fcbda6ccfee79b2b28f9eb88366c17c9a`
- Presentation revision commit: `537b164493e1b76e09557c7be5162bc439329c55`
- Presentation revision documentation commit: `7f8f9eec9b20bcd6d110b32f976c41c60dfa65e5`
- Final visual-fix commit: `6726760a282a71205613ebe9c52d8cf044c54d0e`
- Final visual-revision documentation commit: `0da702c98e289e30ef11d6af6598582db0f7578e`
- Validation theme: `Mega Menu v2 validation - 2026-10-01`
- Validation theme ID: `145456267498`
- Preview: `https://zjna5j-hn.myshopify.com?preview_theme_id=145456267498`
- Theme editor: `https://zjna5j-hn.myshopify.com/admin/themes/145456267498/editor`

The reviewed validation theme was promoted directly and is now the live theme. The previous live theme remains unpublished and available for rollback.

## Final visual revision

- Removed the automatic desktop `View all {{ trigger }}` destination. The merchant-configured CTA is now the only desktop panel-wide destination beneath the navigation links.
- Retained mobile drawer parent `View all` destinations for drill-down navigation.
- Kept the feature-card arrow setting for saved-schema compatibility, changed its default to disabled, and disabled it in the reviewed Shop configuration.
- Set the reviewed Shop navigation-column heading to `A better way to sofa bed`.
- Confirmed in Shopify-rendered output that the Shop panel contains Loopa and Pebble navigation links, one boxed `View all products` CTA, three clickable image/collection/product cards, no desktop `View all Shop`, no card arrows, no interior panel title, and no top-level trigger chevron.

## Objective

Upgrade the existing Shopify header instead of replacing it. Shopify menus remain the navigation source, while Header blocks independently control zero to three link columns and zero to three feature cards. The result supports deterministic desktop mega menus, the existing three-level mobile hierarchy, optional lightweight feature cards, and backwards compatibility with the specialised products mega menu.

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

Each block independently controls:

- zero to three link columns, each sourced from a selected Shopify menu;
- zero to three image, collection, or product feature cards;
- balanced, link-columns-wider, or feature-cards-wider distribution;
- whether the interior panel title is visible;
- whether the first feature card appears in the mobile drawer;
- text-link or boxed CTA presentation.

When Column 1 has no selected menu, it falls back to the matched trigger's nested links. This preserves the Main Menu as the default navigation source while allowing reusable Shopify menus to create Paire-style multi-column compositions.

If no block matches, the same upgraded renderer falls back to the Shopify Menu hierarchy without presentation content. The specialised products mega menu remains available as a backwards-compatible fallback when its legacy setting is configured.

### Lightweight card rendering

`snippets/header-mega-menu-card.liquid` renders only image, title, optional description, optional product price, link, and optional arrow. Collection/product selectors supply canonical titles, prices, images, and URLs. Configured image/title/link values can override presentation while the selected resource supplies missing values. Leaving a card description empty hides it.

## Files changed

Added:

- `snippets/header-mega-menu-card.liquid`
- `snippets/header-mega-menu-column.liquid`
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
4. Choose whether to show the interior panel title. This never changes the top-level trigger label.
5. Select the number of link columns. For each enabled column, add an optional heading and Shopify menu. Column 1 falls back to the trigger's nested links when its menu is empty.
6. Select the number of feature cards. For each enabled card, choose image, collection, or product, then configure optional image/title/description/link overrides.
7. Select balanced, link-columns-wider, or feature-cards-wider distribution.
8. Configure the CTA as a text link or boxed outline. Boxed CTA controls include corner radius, border width, and border color.
9. Enable card arrows only when explicitly wanted; they are disabled by default. Enable the single compact mobile feature card when wanted.
10. Leave the block absent to get navigation-only rendering.

The released configuration uses a hidden panel title, the `A better way to sofa bed` fallback-navigation heading, feature-cards-wider distribution, three mixed cards (image, collection, product), a boxed square-corner CTA, card descriptions, no card arrows, and the first card on mobile.

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
3. In a duplicate unpublished test theme only, select `Mega Menu v2 QA` in Header → Menu.
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
- Desktop mega-menu triggers show labels and underlines without dropdown chevrons.
- Configured text-style CTAs use underline interaction without inline arrows; the automatic desktop parent `View all` destination is not rendered.
- Boxed CTA style uses merchant-configured radius, border width, and border color.
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
- Normalized `assets/base.css` source: 397,147 to 398,840 bytes (`+1,693` bytes) for the complete feature, including removal of the duplicated drawer rules. The second-review iteration added 1,250 normalized source bytes.
- Current Shopify CDN CSS response: 330,370 to 337,098 bytes (`+6,728` bytes).
- Rendered header for the current menu: `+7,563` bytes and `+55` elements compared with the current live render.
- Script and stylesheet reference counts are unchanged (11 scripts and 3 styles on the tested homepage).
- The validation configuration emits four menu image elements (three desktop and one repeated compact mobile card), all with transparent inline `src` placeholders. It emits zero external mega-menu image `src` values before opening.
- Real Shopify image URLs and responsive `srcset` values are moved into data attributes and hydrated only when the associated desktop/mobile disclosure opens. All three unique CDN image URLs return HTTP 200.
- Intrinsic dimensions plus fixed media aspect ratios reduce CLS risk.

## Validation completed

- Header group JSON parsed successfully after removing Shopify's standard leading comment.
- Header JavaScript passed `node --check` locally.
- Shopify's generated `compiled_assets/scripts.js` returned HTTP 200 and passed `node --check`.
- Theme Check result after revision: 83 errors / 173 warnings. The 83 errors are the audited repository baseline. The three warnings added by the complete feature are `OrphanedSnippet` warnings for the three new snippets; all are directly rendered in Shopify output, so these are checker graph false positives.
- `git diff --check` passed (only the repository's expected CRLF conversion notices were printed).
- No `console.log`, `debugger`, TODO, or FIXME markers remain in changed source.
- All eight implementation files pulled back from validation theme `145456267498` match the local source.
- Shopify accepted and rendered the feature on homepage, Pebble product, Loopa product, and Pebble collection URLs with HTTP 200, the expected theme ID, upgraded header, and no rendered Liquid errors.
- Final validation markup contains one link column, three mixed card types, a hidden panel title, correctly styled boxed CTA, four correctly deferred image elements, no `#` card links, no duplicate menu IDs, and no missing menu ARIA targets.
- A temporary three-column/one-image configuration rendered three independent columns, one card, visible panel title, link-columns-wider distribution, and CTA values of 12 px radius, 2 px border, and `#9c6037`.
- A temporary text-CTA/card-arrow-off configuration rendered the underline CTA class with zero CTA or card arrows. The final boxed/card-arrow-off example was restored afterward.
- Final Shopify-rendered output contains zero desktop automatic parent-link classes and zero feature-card arrow elements. The single `View all Shop` string is confined to the mobile drawer.
- The Header schema has exactly 40 settings with IDs and introduces no `ExcessiveSettingsCount` finding.
- Both `Shop` and fallback `About us` desktop mega triggers render without chevrons.
- All three deferred CDN image resources return HTTP 200.
- Before promotion, live theme `145433886954` had no meaningful drift from reconciliation commit `7222c7760f9e82b5147d76a64364b93a81d09611`. After promotion, theme `145456267498` rendered the same technically validated output as the reviewed candidate.

## Human QA remaining

The in-app browser was unavailable in this workspace, so visual and true interaction testing was not fabricated. Human review must cover:

- Desktop: approximately 1920, 1440, 1280, and 1024 px.
- Mobile/tablet: approximately 375, 390, 430, and 768 px.
- Hover tolerance, trigger-to-panel movement, underline/open state, links/cards/CTA, outside click, Escape, and keyboard traversal.
- Drawer open/close, body lock, drill-down, Back, Close, long scrolling, reopening, focus return, and resize in both directions.
- Logo, announcement/ticker, search/predictive search, account, cart, homepage, product, and collection regressions.
- One-column/three-card and three-column/one-card visual layout at practical widths, plus zero-column/zero-card empty-module states and the temporary three-level QA Menu.
- Default, EU, and Japan market presentation in a signed-in Shopify preview session.

## Known issues and limitations

- The current Main Menu has no Level 3 item, so Level 3 output is implemented but not rendered by current production data. Use the temporary QA Menu steps above.
- EU and Japan context files explicitly provide empty Header blocks, so those contexts inherit the upgraded navigation renderer but not the default mixed-card presentation block unless configured separately.
- Japan still maps to `header-menu-eu`; this predates the feature and was intentionally left unchanged.
- Browser console, visual layout, pointer behavior, and real keyboard focus behavior remain part of the human review checkpoint because no interactive browser was connected.
- Duplicate Mega menu blocks with the same trigger are not useful; the first exact match in block order wins.

## Release closeout

- Production reconciliation commit: `7222c7760f9e82b5147d76a64364b93a81d09611`.
- Reconciled `dev`: `57469ebb432cef4e7024c80481b3f17acd3d44fe`.
- Feature-to-`dev` merge and release-source `dev` SHA: `614181f1975b55f91d5f94bc7bbc90fad39bd608`.
- `dev`-to-`main` release merge and stable release-source SHA: `f7358bbd0c4f3793a7addd2e16d7d153fab0ecfb`.
- Annotated release tag: `v1.1.0`, message `OZROOMY v1.1.0 - Header Mega Menu v2`, targeting `f7358bbd0c4f3793a7addd2e16d7d153fab0ecfb`.
- Reviewed validation and new live theme: `Mega Menu v2 validation - 2026-10-01` (`145456267498`).
- Previous live and rollback theme: `Feature 1 validation - 2026-09-29` (`145433886954`); retained unpublished and not deleted.
- Deployment: 2026-10-01 at approximately 21:42 AEST by direct promotion of the reviewed theme.
- Production smoke test: passed all technically inspectable checks. Homepage, Pebble product, Loopa product, and Pebble collection returned HTTP 200 with live theme ID `145456267498` and no Liquid errors. Search, cart, card, collection, and CTA destinations returned HTTP 200. The account endpoint returned its expected initial Shopify HTTP 302; automated redirect following was rejected by Shopify with HTTP 406.
- Production header output: Shop and About us triggers, brand/home link, search/account/cart utilities, desktop panel, boxed CTA, three clickable mixed card types, deferred images, and mobile drawer/child/Back/Close markup were present. Desktop `View all Shop`, feature-card arrows, panel title, and top-level trigger chevrons were absent. Mobile parent `View all` remained present.
- Asset smoke test: all 11 rendered script/stylesheet URLs and all three deferred card images returned HTTP 200; Shopify's compiled JavaScript passed `node --check`.
- Post-deployment live pull: every Shopify-returned source, template, and Header file matched final `dev` after line-ending normalization. The only differences were the known Shopify omission of repository-controlled `config/markets.json` and removal of disabled app-embed records from `config/settings_data.json`.
- Production snapshot branch: `snapshot/production-2026-10-01-mega-menu-v2`.
- Production snapshot commit: `f78ef56da609b832acace5ab052fc0f8adb86db3`.
- Snapshot verification: 341 theme files and zero normalized differences from the isolated post-deployment live pull.
- No Shopify themes or Git branches were deleted.

The release-source SHAs above identify the exact theme source promoted and tagged. Any later closeout documentation-only commits do not alter that source baseline.

## Starting the next development cycle

Merchant Theme Editor work after this release is expected and may legitimately change `templates/*.json`, `sections/header-group.json`, `config/settings_data.json`, and other Shopify-generated configuration.

1. Do not assume Git `dev` equals the then-current Shopify live configuration.
2. Pull the then-current live theme into a new isolated directory; never pull it over the repository working tree.
3. Compare that pull with both `dev` and `snapshot/production-2026-10-01-mega-menu-v2`.
4. Identify and classify Theme Editor JSON/configuration drift separately from source-code drift.
5. Reconcile intentional Theme Editor changes into Git before starting new code development.
6. Never blindly overwrite live JSON/configuration with older Git versions.
