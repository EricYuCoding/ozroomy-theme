# Feature 1 – Advanced Collapsible Rows

## Date

2026-09-29

## Feature

Advanced Collapsible Rows

## Goal

Add reusable advanced accordion rows supporting styled headings, rich text, and images in both standalone sections and Product Information.

## Architecture

- Reusable snippet
- Standalone Advanced Collapsible section
- Product Information `advanced_collapsible_row` block
- Scoped CSS
- No JavaScript
- Existing collapsible implementations unchanged

## Files added

- `snippets/advanced-collapsible-row.liquid`
- `assets/component-advanced-collapsible.css`
- `sections/advanced-collapsible-content.liquid`

## Files modified

- `sections/main-product.liquid`

## Key capabilities

- Heading colour
- Heading size
- Heading weight
- Material or custom icon
- Caret or plus disclosure icon
- Default-open state
- Rich text
- One image
- Image above or below content
- Image alignment
- Image width
- Product Information spacing
- Dynamic-source-compatible settings

## Edge-case behaviour

- A completely empty row renders nothing.
- A heading-only row renders as static, non-interactive content.
- Body content without a heading uses an accessible fallback label.

## Validation

- `git diff --check` passed.
- Theme Check baseline: 83 errors / 170 warnings.
- The final fix introduced no new diagnostics.
- Shopify accepted all four Feature 1 files.
- `sections/main-product.liquid` was accepted despite its large file size.
- Manual Shopify preview review passed.

## Shopify validation environment

Store: `zjna5j-hn.myshopify.com`

Validation theme: `145433886954` – `Feature 1 validation - 2026-09-29`

Production theme: `145425170666` – `OZROOMY v1.0.0 RC1 - 2026-09-28`

The production theme was not modified or published. The validation theme remains unpublished.

## Commits

- `a694fe0` – `feat: add reusable advanced collapsible rows`
- `be42a22` – `fix: handle empty advanced collapsible rows`
- `bf0c6ca5771ca5354e6cbecec65c143c0354b299` – `merge: advanced collapsible rows`

## Known non-blocking notes

- The `OrphanedSnippet` Theme Check warning is believed to be a false positive.
- Content open/close uses native disclosure behaviour and is not height-animated.
- Image alt text relies on Shopify media alt metadata.
- Product Information responsive image sizes use an approximate maximum width.
- `sections/main-product.liquid` remains large and should be monitored for future additions.

## Future notes

Do not redesign or extend this feature during Feature 2 unless Feature 2 specifically depends on it.
