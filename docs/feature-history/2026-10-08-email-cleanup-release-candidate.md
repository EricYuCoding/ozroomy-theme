# Email Cleanup and Shopify Configuration Reconciliation - 2026-10-08

Status: authorised fixes committed, current merchant configuration reconciled, unpublished validation theme created and technically verified. Production publication is not authorised and was not performed.

## Purpose and approved scope

The audit found the legacy support address `support@ozdesignsofa.com` in deployable storefront content and an old-domain Continue Shopping destination in `config/settings_data.json`. The approved changes were limited to:

1. Replace `support@ozdesignsofa.com` with `support@ozroomy.com`.
2. Replace `https://ozdesignsofa.com/pages/products` with `/collections`.

No SEO, performance, accessibility, JavaScript, CSS, branding, layout or unrelated content changes were included.

## Git history

- Fix commit: `328dad84b11493173d78ceabbd2f6a9d5c4f67fc` - 17 repository email replacements and one Continue Shopping URL change.
- Reconciliation commit: `61d90f437bd0fc0e3990e1d291a61fe6a710481f` - reviewed live-derived merchant configuration.
- Feature-to-dev merge: `0ef46c9461090cd60614214a175d248cff576c47`.
- Dev-to-main merge: `49ae17391f40dae9b56ea761ea9f4b90e477b7dc`.

Feature branch: `feature/email-continue-shopping-reconciliation`. The branch is retained for review and rollback reference.

## Shopify themes

- Store: `zjna5j-hn.myshopify.com`.
- Production theme: `145517838570`, `Header country selector review - 2026-10-07`, role `live`.
- Validation theme: `145528717546`, `OZROOMY Email Cleanup RC - 2026-10-08`, role `unpublished`.
- Preview: https://zjna5j-hn.myshopify.com?preview_theme_id=145528717546
- Editor: https://zjna5j-hn.myshopify.com/admin/themes/145528717546/editor

The validation theme was created as a new unpublished theme. The production theme was not targeted, overwritten or published over.

## Merchant configuration reconciliation

The live theme was re-pulled immediately before closeout. It contained 348 files and had not changed since the release candidate was prepared. Git and Shopify differed in nine merchant-controlled JSON/configuration files. The final repository was reconciled to the reviewed candidate rather than pushing older Git JSON over Shopify.

| File | Preserved live configuration |
| --- | --- |
| `config/markets.json` | Current Shopify serialization; no market keys were guessed or restored from stale Git data |
| `config/settings_data.json` | Brand colour `#435743`, hover settings, product-specific cart upsell and block order; only Continue Shopping changed |
| `sections/footer-group.json` | Current footer and disabled footer country selector |
| `sections/header-group.json` | 60-Day Home Trial, green announcement bar, sticky-on-scroll-up and enabled header country selector |
| `templates/index.json` | Current homepage sections, media and ordering |
| `templates/page.about-us.json` | Current About copy, videos and images |
| `templates/page.contact.json` | Current Contact content and merchant-updated email |
| `templates/product.pebble.json` | Advanced Collapsible Content, 60-Day Trial, Sleep+ content, media and metafield bindings |
| `templates/product.vantopia.json` | Advanced Collapsible Content and current section ordering |

The live-derived candidate contained 18 legacy-email replacements because current Pebble content has additional merchant-authored email references not present in the older Git template. The final draft contains 19 `support@ozroomy.com` occurrences including the Contact page's pre-existing update, zero legacy-email occurrences, and `/collections` as the Continue Shopping destination.

## Validation

- Re-pulled draft: 348 files; zero differences from the reviewed candidate.
- Repository after reconciliation: 348 theme files; zero differences from the reviewed candidate after line-ending normalization.
- JSON: 129 of 129 files parsed.
- JavaScript: 17 of 17 files passed `node --check`.
- Static references: 465 snippet references, 6 section references and 66 asset references; zero missing targets.
- Theme Check: 83 errors and 174 warnings, exactly matching the established baseline with zero new signatures.
- The bundled validation helper could not run because its own `@shopify/theme-check-common` dependency is absent. Shopify CLI Theme Check supplied Liquid and schema validation.
- Draft homepage, Pebble product, Contact and cart routes returned HTTP 200.
- AU and international storefronts retained their canonical and hreflang mappings.
- Pebble draft output contains the new support email, 60-Day Trial and Sleep+ content.
- Anonymous draft cart checks added Pebble and Roomy Maxi Cushion as two distinct lines, rendered the `Complete with` upsell region, and confirmed all Continue Shopping links use `/collections`. The test cart was cleared to zero.

These are source, server-render and HTTP validations. No connected interactive browser was available, so visual layout, keyboard/focus, responsive overflow, drawer animation and Theme Editor interaction remain human-review items.

## Known issues outside this release

The broader audit remains open for mobile LCP, missing meta descriptions and headings, accessibility labels and contrast, legacy brand-content review, duplicate IDs, Arabic translation coverage, third-party tracking-script review, and inherited Theme Check technical debt. None were changed during this closeout.

## Rollback and future publication

Git rollback should be performed with normal revert commits on a development branch, followed by validation and an unpublished review theme. Do not reset, rebase shared history or force push.

Shopify rollback before publication is simply to leave validation theme `145528717546` unpublished. The current production theme remains available and unchanged. Do not delete either theme without separate authorisation.

Before any future publication:

1. Confirm the current live role and recheck for merchant Theme Editor changes.
2. Complete human desktop/mobile, keyboard and cart review using the unpublished preview.
3. Re-run Theme Check and exact source comparison.
4. Obtain explicit merchant approval to publish validation theme `145528717546`.
5. Publish only that reviewed theme, then verify roles, storefront routes, cart behavior and Markets immediately afterward.
