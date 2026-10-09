# OZROOMY Multirow Button Styling Fix Round — 2026-10-09

## 1. Executive Summary

本轮针对 Stage 7 Multirow custom button styling 的 merchant QA 问题完成了限定范围修复。

- 当前分支：`feature/multirow-button-seo-foundation`
- Stage 7 起点：`bdfb043ae5a4acd519c51e203109c3d40d74fcbf`
- 修复代码提交：`1029750` — `fix: decouple Multirow custom button styles`
- 代码修改文件：`sections/multirow.liquid`
- 新 Draft Theme：`145537990890`，`OZROOMY Multirow Button Fix QA - 2026-10-09`
- 当前 Live Theme：`145531568362`，保持不变
- 未 merge 到 `dev` 或 `main`
- 未 push GitHub
- 未 publish、未修改 Shopify Admin、未修改 Markets 或其他业务配置

修复采用现有功能的内部边界重构，没有回滚或重建 Multirow。Custom styling 关闭时继续使用原始 theme button；开启时不再携带全局 `.button` / `.button--…` classes，因此已从 global theme button colour/hover selectors 中解耦。

## 2. Root Cause Assessment

Stage 7 实现虽然为 custom button 设置了 scoped CSS variables，但 anchor 始终输出：

```text
button button--{{ section.settings.button_style }}
```

同时，`layout/theme.liquid` 会在 `<body>` 添加全局 hover architecture class：

```text
link-btns--{{ settings.link_btn_hover }}
```

`assets/base.css` 中以下类型的高 specificity selectors 仍会命中 custom anchor：

```text
.link-btns--left a.button
.link-btns--left a.button:hover
.link-btns--left a.button::before
.link-btns--left a.button::after
```

这些规则会重新设置 `background-color: transparent`、theme-derived hover text colour、pseudo-element fill、shadow 和 transition。由于 specificity 高于原有 `.multirow__button--custom`，会出现静态文字不可见、background/text 被 Theme Settings 影响及 outline button 不稳定的问题。

根因不是 colour picker 或 merchant input，而是 custom mode 仍参与 global `.button` architecture。

## 3. What Was Changed

### Default mode

当 `Enable custom button styling` 关闭时，仍精确输出：

```text
class="button button--{{ section.settings.button_style }}"
```

原有 theme colours、radius、shadow、hover、markup 和 missing-link behavior 均保留。

### Custom mode

当设置开启时：

- 不输出 `.button` 或 `.button--…`。
- 输出 `multirow__button--custom`、hover behavior class 及 `data-multirow-custom-button`。
- 使用 `.multirow [data-multirow-custom-button]` 提供完整的局部 button primitives：layout、appearance、typography、background、border、shadow、transition、focus 和 disabled state。
- 每个 anchor 继续使用自己的 inline CSS custom properties，因此多个 rows 可独立设置。
- normal / hover / focus-visible 不再读取 `--color-button`、`--color-button-text`、`--buttons-radius` 或 global button shadows。
- blank normal/hover backgrounds 明确转换为 `transparent`。
- blank text/border inputs 使用 black/current custom value fallback，避免无效 declaration 后继承 theme colour。
- custom pseudo-elements 使用 `content: none`，不会出现 global blur/fill layer。
- `color transition` 只改变 text、background 和 border colours，不改变尺寸，不产生 glow、blur 或 layout shift。
- `lift` 仍只在 merchant 明确选择时使用 `translateY(-2px)`；reduced-motion 会取消 lift。

### Paire-like default custom preset

开启 custom styling 后，schema defaults 现在直接支持目标组合：

| Setting | Default |
|---|---|
| Font size | 16px |
| Font weight | 600 |
| Text / hover text | `#000000` |
| Background | `#FFFFFF` |
| Hover background | `#E9E9E9` |
| Border / hover border | `#000000` |
| Border | 1px |
| Radius | 0px |
| Padding | 24px horizontal / 12px vertical |
| Shadow | none |
| Hover | colour transition |
| Alignment | left |

现有已保存 row settings 仍优先于 schema defaults。

## 4. Changed Files

| File | Change |
|---|---|
| `sections/multirow.liquid` | Internal custom-anchor class boundary, scoped CSS primitives, safe colour fallbacks and Paire-like hover defaults |
| `docs/feature-history/2026-10-09-multirow-button-styling-fix-round.md` | 本 QA handoff |

这是 follow-up fix commit；没有 amend、rebase 或改写 Stage 7 commits。

## 5. Validation Results

| Check | Result |
|---|---|
| JSON | 129/129 parsed successfully as UTF-8 |
| JavaScript | 17/17 pass `node --check` |
| Multirow schema | Parsed; 29 section settings / 29 row settings |
| Source acceptance assertions | 14/14 pass |
| `git diff --check` | Pass |
| Theme Check baseline | 83 errors / 174 warnings / 0 info |
| Theme Check final | 83 errors / 174 warnings / 0 info |
| Multirow offense delta | Zero new offenses; one existing `UndefinedObject quantity_rule_soldout` warning remains |
| Bundled Liquid validator | Unavailable because helper cannot resolve `@shopify/theme-check-common`; official Shopify CLI Theme Check used as the validation fallback |

Source assertions covered:

- default mode exact global classes;
- custom mode absence of conditional global classes;
- scoped data attribute;
- normal and hover transparent fallbacks;
- no `!important`;
- Paire text/background/shadow/border/radius/padding/hover/alignment defaults.

No global CSS, JavaScript, Add to Cart, Cart Drawer, Checkout, Product Information or other section file changed. No global button regression was intentionally introduced. The strongest isolation evidence is structural: custom anchors no longer match the theme's `a.button` selectors, while non-custom anchors keep the exact prior classes.

## 6. Draft Theme Delivery

| Item | Value |
|---|---|
| Theme name | `OZROOMY Multirow Button Fix QA - 2026-10-09` |
| Theme ID | `145537990890` |
| Role | `unpublished` |
| Preview URL | <https://zjna5j-hn.myshopify.com?preview_theme_id=145537990890> |
| Theme Editor URL | <https://zjna5j-hn.myshopify.com/admin/themes/145537990890/editor> |
| Upload result | Success |
| Previous Draft preserved | `145537368298`, still unpublished |
| Current Live | `145531568362`, still live |

Round-trip pull：

`D:\work\ozroomy-backups\2026-10-09-multirow-button-fix-draft-145537990890`

- Local deployable theme：348 files
- Shopify pull：347 files
- Only local-only file：empty `sections/header-group.context.eu.json`，属于已确认的 Shopify serialization omission
- 其余 347 files：统一 line endings 后零差异
- Uploaded `sections/multirow.liquid` 与 local commit 精确匹配
- Uploaded file 含 `data-multirow-custom-button`
- Uploaded custom-mode source 不再包含 conditional global `.button` class

Live safety：

- Pre-upload snapshot：`D:\work\ozroomy-backups\2026-10-09-multirow-fix-preupload-live-145531568362`
- Post-upload snapshot：`D:\work\ozroomy-backups\2026-10-09-multirow-fix-postupload-live-145531568362`
- 347 vs 347，零新增、零删除、零内容差异

## 7. Remaining Risks / Unverified Items

Browser discovery returned no available browser. Therefore this report does not claim the following passed：

- visual pixel matching;
- actual pointer hover transition;
- computed focus-visible presentation;
- keyboard tab order;
- mobile/tablet responsive appearance;
- Theme Editor live-update interaction;
- screenshots;
- contrast compliance for arbitrary merchant-selected colours.

The new Draft contains no saved custom-style instances because the previous QA Draft had no saved Theme Editor drift and Live configuration was preserved. Merchant must enable the option on a review row to exercise custom output.

Static and round-trip evidence confirms custom mode is code-level decoupled from global button colour behavior. Actual rendered appearance still requires merchant browser QA before any merge or publication.

## 8. Exact QA Notes For Merchant Review

1. Open Draft `145537990890` in Theme Editor.
2. Select a Multirow section with an existing CTA label and link.
3. With `Enable custom button styling` OFF, compare against Live; appearance should be unchanged.
4. Turn the setting ON. The default values should produce a square black outline button with white fill, black text, no shadow and light-grey hover fill.
5. Confirm static text is visible before hover.
6. Hover the button and confirm:
   - text remains black;
   - fill changes to `#E9E9E9`;
   - black 1px border remains defined;
   - no blur, glow, fuzzy pseudo-layer or width shift appears.
7. Clear Background and confirm normal state becomes transparent rather than using the global solid-button colour.
8. Clear Hover background and confirm hover remains transparent.
9. Test hover behavior `None`, `Color transition` and `Subtle lift` separately.
10. Test left, centre, right and full-width layouts on desktop and mobile.
11. Test one Multirow with multiple rows using different styles; confirm settings remain per-row.
12. Use keyboard Tab and confirm a visible outline appears without a glow.
13. Test a CTA without a link; confirm disabled appearance and no navigation.
14. Confirm Add to Cart, Cart Drawer buttons, navigation buttons and unrelated section CTAs remain visually unchanged.

停止点：corrected unpublished Draft 已准备供 merchant QA。未 merge、未 push、未 publish。
