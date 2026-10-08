# OZROOMY live configuration reconciliation — 2026-10-09

## Purpose

Capture Theme Editor changes made after the `production-stable-2026-10-08` closeout before beginning the Multirow button and SEO development cycle. Shopify production remained read-only.

## Verified baseline

- Repository baseline: `3e31341428e8c64c9bfe06b15ef629112bc43821`
- Production tag: `production-stable-2026-10-08`
- Shopify store: `zjna5j-hn.myshopify.com`
- Live theme: `145531568362`, `OZROOMY Final Prelaunch QA - 2026-10-08`
- Live pull: `D:\work\ozroomy-backups\2026-10-09-predev-live-145531568362`
- Live pull files: 347
- Theme-file aggregate SHA-256: `3394E9E5E08D27AE00D8A33D5C0E4C34E257779020E83D603C98FF5FB598D586`
- Archive: `D:\work\ozroomy-backups\2026-10-09-predev-live-145531568362.zip`
- Archive SHA-256: `1D13A68D7F4D2BED11C419FB9752013AED30C2DD2B3420161C3EBBB5DBF74D21`

## Reconciled merchant configuration

### `config/settings_data.json`

- `current.continue_shopping_url`: `/collections` -> `shopify://collections`.
- Classification: Shopify Theme Editor resource-link serialization. Both values resolve to the collections root; the current Live value is retained.

### `templates/index.json`

- `editorial_message_banner_validation.settings.heading`: `Try it at home for 30 days` -> `Try it at home for 60 days`.
- `flexible_hero_banner_rkH3Qt.settings.text`: `water-resistant, hard-wearing fabric` -> `our pet friendly fabric`.
- Shopify added empty `heading_with_line_breaks` defaults to the two Flexible Hero instances.
- Shopify added `heading_tag: h2` defaults to eight existing Multirow blocks.
- The slideshow remains disabled; its raw property ordering changed in the Live serialization but its semantic value did not.

### `templates/product.vantopia.json`

- Main buy button `enable_custom_color`: `false` -> `true`.
- Main buy button `custom_color`: `#53af01` -> `#000000`.
- Shopify added `heading_tag: h2` defaults to the disabled collapsible section and four Multirow blocks.

## Preservation and classification

- `config/markets.json` is unchanged.
- The post-publish Shipping FAQ reconciliation remains unchanged.
- No Liquid, JavaScript, CSS, asset, section ordering, media reference, app block or product data changed.
- No block or section was removed.
- `sections/header-group.context.eu.json` remains a known local-only empty context file that Shopify omits during serialization.
- All three reconciled JSON documents are semantically identical to the isolated Live pull after this change.

## Git and deployment safety

The configuration is reconciled on `chore/live-config-reconciliation-20261009` before feature development. This reconciliation may be merged locally into `dev` and `main` to establish the production baseline. The upcoming Multirow/SEO feature must remain on its own unmerged branch.

GitHub push remains deferred because the available repository files and Shopify CLI theme listing cannot prove that `main` or `dev` is not connected to a Shopify theme deployment. No production theme file was uploaded or changed during this reconciliation.
