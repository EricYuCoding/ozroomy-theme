# OZROOMY Multirow Button + Technical SEO Foundation — 2026-10-09

## A. Executive Summary

本轮已完成以下授权范围：

- 在不覆盖 Shopify Theme Editor 商家配置的前提下，读取并隔离备份最新 Live Theme `145531568362`。
- 将 2026-10-09 新发现的三项 Live 配置漂移安全同步到本地基线，并分别以合并提交更新本地 `dev` 与 `main`；未推送 GitHub。
- 从已同步的本地 `dev` 创建 `feature/multirow-button-seo-foundation`。
- 为现有 Multirow row/block 增加独立、默认关闭的高级 CTA 样式系统；未改动 Product Information、Add to Cart、Cart Drawer 或 Checkout CTA。
- 完成低风险 SEO 修正：主页语义 H1、Shipping 页重复 H1、Organization JSON-LD 空社交链接及实体 URL。
- 对 Draft 的 28 个 sitemap 店面 URL 完成 rendered-source crawl：28/28 返回 HTTP 200，canonical 全部匹配，无意外 `noindex`，JSON-LD 全部可解析。
- 创建并校验新的 unpublished Draft Theme `145537368298`。
- 再次拉取 Live 并与开发前快照比较：347/347 文件完全一致，确认本轮未修改生产主题。

当前候选版本已达到技术交付状态，但发布前仍必须由商家在 Theme Editor/真实浏览器完成视觉、hover、键盘、移动端、导航、产品与购物车回归。没有执行发布、feature 合并、GitHub push、Shopify Admin 内容修改或 Markets 修改。

当前没有确认的 P0 问题。主要未完成项为 Shopify Admin SEO 内容：产品 Vendor 仍为 `My Store`、产品 SEO description 存在重复/错配、10 个索引页缺少 meta description，以及一个页面正文含第二个 H1。

## B. Git Safety

### 开发前状态

| 项目 | 已验证值 |
|---|---|
| 开发前本地 `main` | `3e31341428e8c64c9bfe06b15ef629112bc43821` |
| 开发前本地 `dev` | `e7bf856301559e3bf72f3a076c80895fe5011bf2` |
| Production tag | `production-stable-2026-10-08` -> `3e31341428e8c64c9bfe06b15ef629112bc43821` |
| `origin/main` | `e7b4578eb26be25f2f3e406c8a0bef32d7edfcca` |
| `origin/dev` | `e7b4578eb26be25f2f3e406c8a0bef32d7edfcca` |
| 开发前工作树 | Clean |

仓库中未发现 `.github/workflows` 或本地可验证的部署配置，但 Shopify/GitHub 或第三方平台侧的 branch connection 无法从本地仓库证明不存在。因此遵循安全优先原则：没有 push `main`、`dev`、tag 或 feature branch。

### Live 保护与本地基线同步

- 当前 Live：`145531568362`，`OZROOMY Final Prelaunch QA - 2026-10-08`，role `live`。
- 开发前隔离目录：`D:\work\ozroomy-backups\2026-10-09-predev-live-145531568362`
- ZIP：`D:\work\ozroomy-backups\2026-10-09-predev-live-145531568362.zip`
- ZIP SHA-256：`1D13A68D7F4D2BED11C419FB9752013AED30C2DD2B3420161C3EBBB5DBF74D21`
- 主题文件 aggregate SHA-256：`3394E9E5E08D27AE00D8A33D5C0E4C34E257779020E83D603C98FF5FB598D586`
- Manifest：`D:\work\ozroomy-backups\2026-10-09-predev-live-145531568362-manifest.md`
- Reconciliation branch：`chore/live-config-reconciliation-20261009`
- Reconciliation commit：`ea0e0f2946a114742c1af92855ee4abbb50d291a`
- 本地 `dev` reconciliation merge：`3743cdd4e9d974e5fad7489afd145bb6d021f1d8`
- 本地 `main` reconciliation merge：`9ef08cb5042e36b043b2281ce6c718c9d3c5ea7a`

安全同步的 Live 配置只有：

- `config/settings_data.json`：保留 Shopify 对 Collections root resource link 的序列化。
- `templates/index.json`：保留商家更新的 60-day 文案、pet-friendly hero 文案及 Shopify 新增 heading defaults。
- `templates/product.vantopia.json`：保留商家 Main Buy Button 黑色自定义设置及 Shopify 新增 heading defaults。

`sections/header-group.context.eu.json` 继续保留在 Git；Shopify pull 会省略该空 context 文件，这是已确认的序列化差异。AU/international context、Markets、currency、domain 和 routing 均未改动。

### Feature 分支

| 项目 | 值 |
|---|---|
| Branch | `feature/multirow-button-seo-foundation` |
| Base | `3743cdd4e9d974e5fad7489afd145bb6d021f1d8` |
| Multirow commit | `fbe769c` — `feat: add per-row Multirow button styling` |
| SEO code HEAD | `48822f2` — `seo: improve primary headings and organization schema` |
| Documentation commit | 本报告的独立提交；最终 SHA 记录在交付消息及 `git log` |
| GitHub push | 未执行：平台侧自动部署风险未能从本地证明安全 |
| Merge to `dev`/`main` | 未执行 |

## C. Multirow Button Feature

### Architecture

唯一功能代码文件为 `sections/multirow.liquid`。

- 复用原有 CTA `<a>`、`button` class、label 和 link settings。
- 新增每个 row 独立的 `enable_custom_cta`，默认 `false`。
- 关闭时仍只输出原有 `button button--{{ section.settings.button_style }}`，不输出 custom class 或 inline CSS variables，原有颜色、padding、radius、shadow 和 hover 继续由全局主题控制。
- 开启时才增加 section-scoped class 与 CSS custom properties。
- 未新增 JavaScript、外部字体、依赖、`!important` 或全局 button override。
- Add to Cart block 和相关业务逻辑未改动。

### Theme Editor options（每个 row 独立）

- Font size：12–24px
- Font weight：400 / 500 / 600 / 700
- Text / hover text colour
- Background / hover background；可清空为 transparent
- Border / hover border colour
- Border thickness：0–6px
- Border radius：0–40px
- Horizontal padding：12–48px
- Vertical padding：8–24px
- Shadow：none / subtle / medium / strong
- Hover：none / colour transition / subtle lift
- Alignment and width：left / centre / right / full width

Transition 固定为 200ms，避免增加低价值 schema 设置。`prefers-reduced-motion` 会取消 lift 并将 transition 缩短到 0.01ms；`focus-visible` 保留清晰 outline。未增加独立 mobile override：同一组 alignment/full-width 设置在响应式布局中继续生效。

### Validation and limitations

- Custom-disabled output path 已进行代码级回归：class、style 与原实现一致。
- Missing label：继续不输出按钮；missing link：继续输出 `role="link" aria-disabled="true"`。
- Minimal outline、solid black、rounded/elevated 与多 row 独立组合均可由 schema/CSS variables 表达。
- Theme schema 可解析；row settings 共 29，未触发 Theme Check schema/settings offense。
- 由于自动化浏览器 runtime 不可用，未声称实际点击、hover、键盘、Theme Editor live update、移动断点或截图通过。
- 商家选择任意颜色时仍需自行检查 WCAG contrast；主题不强制改写商家颜色。

## D. SEO Fixes

| URL / scope | Before | After | File |
|---|---|---|---|
| `/` | Logo wrapper 是无文字 H1；可见 hero 是 H2 | Logo wrapper 改为语义中性的 `div`；现有可见 hero “A better way to sofa bed” 改为 H1；视觉 class/文字不变 | `sections/header.liquid`, `templates/index.json` |
| `/pages/shipping-policy` | Page title 与 FAQ title 均为 H1，共 2 个 | Page title 保留 H1，FAQ title 改为 H2，共 1 个 | `templates/page.shipping-policy.json` |
| Organization JSON-LD | `sameAs` 输出 9 个值，其中 7 个为空；`url` 随当前页面变化 | 只输出 2 个非空已配置社交 URL；`url` 固定为当前 market origin root | `sections/header.liquid` |

Draft rendered-source 验证：

- Homepage H1：`A better way to sofa bed`，count 1。
- Shipping H1：`Shipping & Delivery`，count 1。
- Organization：`url=https://ozroomy.com.au`，`sameAs=2`，blank values 0。
- Homepage 同时输出可解析的 `Organization` 与 `WebSite` JSON-LD。
- Product 页面输出可解析的 `Product` JSON-LD；brand 值仍来自 `product.vendor`，未硬编码。
- `.com.au` 与 `.com` candidate homepage 均为 HTTP 200、self-canonical、H1 count 1、hreflang count 6。

没有新增 BreadcrumbList 或 AggregateRating：前者需要统一导航/模板架构；后者必须有真实、合规、可见的 review 数据，当前没有足够证据安全生成。

## E. Manual SEO Review

以下内容没有写入主题或 Shopify Admin，均为明日商家审核项。

### 1. 必须修正：Product vendor / JSON-LD brand

28-URL crawl 中的 16 个产品全部输出：

```json
"brand": { "@type": "Brand", "name": "My Store" }
```

来源已确认是 `sections/main-product.liquid` / `sections/featured-product.liquid` 中的 `product.vendor`，不是 theme fallback。建议操作：

1. Shopify Admin -> Products -> Bulk editor。
2. 添加 `Vendor` 列。
3. 逐项确认真实品牌归属；只有经确认属于 OZROOMY 的产品才将 `My Store` 改为 `OZROOMY`。
4. 不要批量覆盖第三方或未来保留的 OZDESIGN 品牌产品。
5. 保存后预览一个产品的 Product JSON-LD，再使用 Google Rich Results Test 验证。

### 2. Duplicate H1：Admin page body

| URL | Previous/current rendered values | Recommended change | Location |
|---|---|---|---|
| `/pages/try-it-at-home-for-60-days` | H1 #1 `Try It at Home for 60 Days`; H1 #2 `60-Day Home Trial` | 在 Shopify Admin page rich text 中将正文开头的 `60-Day Home Trial` 从 Heading 1 改为 Heading 2；保留 page title H1 | Shopify Admin content |

未在 theme 中做 handle-specific replace，因为全局改写 `page.content` 会影响其他页面并隐藏真实内容结构。

### 3. Missing meta descriptions（provisional copy）

以下 10 个索引 URL 的 description 为空。建议在对应 Shopify Admin SEO field 中审核后填写：

| URL | Provisional description |
|---|---|
| `/` | Discover OZROOMY modular sofa beds designed for everyday living, with flexible configurations for Australian homes. Explore the collection online. |
| `/pages/contact` | Contact OZROOMY for help with products, orders, delivery, returns or warranty questions. Our support team is here to help. |
| `/pages/why-ozroomy` | Learn how OZROOMY started in Melbourne and why we create practical, comfortable sofa beds for modern homes. |
| `/pages/returns-refunds` | Read OZROOMY returns and refunds information, including the 60-Day Home Trial, product condition requirements and how to request a return. |
| `/pages/warranty` | Read the OZROOMY warranty policy, what is covered, what is excluded and how to contact our team if you need assistance. |
| `/collections/frontpage` | Browse the OZROOMY range of sofa beds, seating and accessories for flexible everyday living. |
| `/collections/loopa-modular-sofa-beds` | Explore Loopa modular sofa beds and seating from OZROOMY, with flexible configurations and a soft, rounded design. |
| `/collections/pebble-modular-sofa-beds` | Explore Pebble modular sofa beds and seating from OZROOMY, designed for flexible everyday living where space matters. |
| `/collections/accessories` | Shop OZROOMY sofa accessories, including cushions, covers and bases, and view current product and delivery details online. |
| `/blogs/news` | Read the latest updates from OZROOMY, including brand news and practical information about our products and services. |

Homepage title 目前只是 `OZROOMY`。可审核的建议值：`OZROOMY | Modular Sofa Beds for Everyday Living`。未自动写入，因为 title positioning 属于品牌/营销决策。

### 4. Product descriptions requiring Admin SEO fields

16 个产品的 fallback descriptions 均超过 160 characters（大多数被 Shopify 截至 320）。更重要的是，多项产品复用了错误的 Loopa/Pebble sofa copy。建议不要继续依赖正文 fallback；在每个产品的 Search engine listing 中填写经审核的独立 description。

| URL | Confirmed issue | Provisional description |
|---|---|---|
| `/products/loopa-sofa-bed` | 320 chars | Discover the Loopa Sofa Bed, combining a soft, rounded sofa design with a generous sleeping space for flexible everyday living. |
| `/products/loopa-sofa-l-corner-closed` | Duplicate Loopa fallback | Explore the Loopa Sofa L Corner Closed configuration, with Loopa's soft, rounded design and flexible sofa-bed functionality. |
| `/products/loopa-sofa-l-corner-open` | Duplicate Loopa fallback | Explore the Loopa Sofa L Corner Open configuration, with Loopa's soft, rounded design and flexible sofa-bed functionality. |
| `/products/ottoman` | Incorrect Loopa Sofa Bed copy | Explore the Roomy Ottoman from OZROOMY. View product details, available options and current delivery information online. |
| `/products/loopa-chair` | Sofa Bed fallback used for chair | Explore the Loopa Chair from OZROOMY, featuring the collection's soft, rounded design. View options and product details online. |
| `/products/roomy-pillows` | 271 chars | Add comfort and support with Roomy Pillows. Each set includes one square pillow and one lumbar pillow in matching or contrasting colours. |
| `/products/roomy-maxi-cushion` | Incorrect Loopa Sofa Bed copy | Explore the Roomy Maxi Cushion from OZROOMY. View available colours, product details and current delivery information online. |
| `/products/pebble-sofa` | Extra Covers product uses Pebble Sofa Bed copy | Refresh your Pebble Sofa with an extra cover. View available colours, compatibility details and current delivery information. |
| `/products/pebble-sofa-copy` | Duplicate Pebble fallback; legacy `copy` handle | Explore the Pebble L Corner Open configuration from OZROOMY. View product options, dimensions and current delivery information. |
| `/products/pebble-l-corner-closed` | Duplicate Pebble fallback | Explore the Pebble L Corner Closed configuration from OZROOMY. View product options, dimensions and current delivery information. |
| `/products/pebble-chair-l-arm` | Sofa Bed fallback used for chair | Explore the Pebble Chair with L Arm from OZROOMY. View product options, dimensions and current delivery information online. |
| `/products/pebble-chair-tube-arm` | Sofa Bed fallback used for chair | Explore the Pebble Chair with Tube Arm from OZROOMY. View product options, dimensions and current delivery information online. |
| `/products/pebble-sofa-copy-1` | Duplicate Pebble fallback; legacy `copy-1` handle | Explore Pebble XL from OZROOMY. View the configuration, product dimensions, available options and current delivery information. |
| `/products/roomy-base` | 320-char body fallback | Lift your floor sofa with the Roomy Base to support airflow underneath. View compatibility, product details and available options. |
| `/products/extra-coverloopa-sofa` | 320 chars | Refresh your Loopa or Vantopia Sofa Bed with an extra cover. View available colours, compatibility and product details. |
| `/products/pebble-sofa-bed` | 320 chars | Discover the Pebble Sofa Bed, a compact design for everyday living in homes where space matters. View configurations and options. |

另外建议在 Admin 审核两个显示标题的标点：`Extra Covers(Pebble Sofa)` 与 `Extra Cover(Loopa Sofa)`；以及决定是否将含 `copy` 的 legacy handles 迁移到可读 URL 并建立 verified redirects。未自动修改 URL 或 redirect。

### 5. Social profile decision

Organization JSON-LD 当前两个已配置 profile：

- Facebook：`https://www.facebook.com/profile.php?id=61564224396241`
- Instagram：`https://www.instagram.com/ozdesign_sofa/`

Instagram 属于 OZDESIGN legacy identity。考虑到 OZDESIGN 仍独立运营且品牌迁移尚未完成，本轮没有替换。商家需决定 OZROOMY 官方 Instagram URL 后再在 Theme settings 中更新。

## F. Technical SEO Backlog

| Priority | URL | Issue | Cause | Code Fix Applied | Merchant Review | Verification |
|---|---|---|---|---|---|---|
| P1 | All 16 indexed product URLs | Product JSON-LD brand is `My Store` | Shopify product `vendor` data | No; hardcode would be unsafe | Verify brand per product and update Vendor in Admin | 16/16 candidate Product JSON-LD values inspected |
| P1 | Multiple product URLs | Duplicate or product-mismatched meta descriptions | Missing custom SEO field causes product body fallback | No; Admin content | Approve/write unique descriptions | 16/16 descriptions inspected; all >160 chars |
| P2 | 10 indexed URLs listed above | Missing meta description | Shopify Admin SEO fields empty | No | Review provisional copy and enter in Admin | Candidate source crawl |
| P2 | `/pages/shipping-policy`, `/pages/try-it-at-home-for-60-days` | Meta description is 320 chars | Body fallback or overlong Admin value | No | Replace with concise page-specific copy | Candidate source crawl |
| P2 | `/pages/try-it-at-home-for-60-days` | Two H1 elements | Page body starts with H1 below template page-title H1 | No; Admin content | Demote body heading to H2 | Rendered source inspected |
| P2 | `/collections/frontpage` | Generic, indexable `Products` collection | Merchant collection naming/content | No | Rename/improve or decide whether it should remain indexed | Sitemap + rendered source |
| P2 | Product handles containing `copy` | Weak legacy URLs | Duplicated-product handles | No | Approve target handles and redirects before changing | Product sitemap |
| P2 | Organization Instagram | Legacy `ozdesign_sofa` identity | Current Theme setting | Empty-value fix only | Confirm future OZROOMY profile | Candidate JSON-LD |
| P3 | `/pages/shipping-process` | Returns 404, but no active theme/template link now points to it | Page resource not published / legacy URL | No speculative redirect | Redirect only if analytics/backlinks justify it | HTTP 404; repository refs only exist in historical docs |
| P3 | Product/collection hierarchy | No BreadcrumbList JSON-LD | No unified breadcrumb implementation | No | Plan with visible breadcrumb UX | Source audit |
| P3 | Product rich results | No AggregateRating | Eligibility/review source not verified | No | Add only when genuine visible reviews are eligible | Source audit |
| P3 | Performance | No new lab measurement | Browser/Lighthouse runtime unavailable | No performance code change | Run mobile Lighthouse/WebPageTest after merchant QA | Hero source shows eager + `fetchpriority=high`; no score claimed |

Markets output was preserved. Candidate homepage currently outputs:

- `x-default` and `en` -> `https://ozroomy.com.au/`
- `en-DE`, `en-FR`, `en-GB`, `en-NL` -> `https://ozroomy.com/`

Both origins render self-canonical candidate pages. No Markets, currency, domain routing, redirects or locale settings were changed. Before broader international migration, merchant should review the language/market strategy in Shopify Markets rather than add theme-level overrides.

## G. QA Results

### Static validation

| Check | Result |
|---|---|
| `git diff --check` | Pass |
| JSON | 129/129 parsed as UTF-8 after stripping Shopify's leading JSON comment where present |
| JavaScript | 17/17 pass `node --check` |
| Multirow schema | Parsed; 29 section settings, 29 row settings |
| Theme Check baseline | 83 errors / 174 warnings / 0 info |
| Theme Check final | 83 errors / 174 warnings / 0 info; no new offense |
| Changed files | `header.liquid`, `index.json`, `page.shipping-policy.json`: no offenses; `multirow.liquid`: one pre-existing `UndefinedObject quantity_rule_soldout` warning |
| Liquid static refs | 466 snippet refs, 6 section-tag refs, 67 asset refs; zero missing targets |
| JSON section instances | 344 total; 339 resolve to local section files; 5 pre-existing Shopify-generated `_blocks` types preserved and accepted by Theme Check |
| Shopify Liquid skill validator | Helper could not load local `@shopify/theme-check-common`; Shopify CLI Theme Check used as fallback and limitation recorded |

未 suppress Theme Check rule。83 errors 来自既有 `locales/ar.json` MatchingTranslations；其余 warnings 也是基线问题。本轮没有修复无关 Theme Check debt。

### Rendered-source / functional boundary

- Sitemap：6 个 child sitemaps；28 个实际 storefront URLs（不含 `agents.md`）全部 HTTP 200。
- H1：27/28 页面恰好一个非空 H1；唯一例外为上述 Admin-authored trial page。
- Titles：28/28 非空且均不超过 65 characters。
- Canonical：28/28 与当前 URL 匹配。
- Robots meta：28/28 无意外 `noindex`；`robots.txt` HTTP 200 并声明 sitemap。
- Hreflang：代表性 AU/international 页面各 6 条。
- JSON-LD：crawl 中所有 JSON-LD 可解析，无 parse errors。
- Homepage hero image：rendered source 含 `loading="eager"`、`fetchpriority="high"` 和 width/height；没有声称 LCP 分数改善。
- `/pages/shipping-process`：仍为 HTTP 404；当前 deployable code 无 active reference。

由于 browser discovery 返回空列表，以下未验证，必须人工 QA：视觉像素、Theme Editor live update、pointer hover、键盘 focus 顺序、真实 mobile breakpoints、Mega Menu/移动导航交互、variant selection、Add to Cart、Cart Drawer、upsell、country selector、Contact form submission，以及 Lighthouse/真实性能。

## H. Shopify Draft

| Item | Value |
|---|---|
| Draft name | `OZROOMY Multirow SEO QA - 2026-10-09` |
| Draft ID | `145537368298` |
| Role | `unpublished` |
| Preview | <https://zjna5j-hn.myshopify.com?preview_theme_id=145537368298> |
| Theme Editor | <https://zjna5j-hn.myshopify.com/admin/themes/145537368298/editor> |
| Current Live | `145531568362` — `OZROOMY Final Prelaunch QA - 2026-10-08` |

Draft pull：`D:\work\ozroomy-backups\2026-10-09-draft-145537368298`

Round-trip comparison：local deployable theme 348 files，Draft pull 347 files；唯一 local-only 文件是 Shopify 已知会省略的空 `sections/header-group.context.eu.json`。其余 347 文件在统一 line endings 后零差异。

Post-upload Live control pull：`D:\work\ozroomy-backups\2026-10-09-postdraft-live-145531568362`

开发前 Live 与 post-upload Live：347 vs 347，零缺失、零新增、零内容差异。Live ID 与 role 均未变化。

## I. Tomorrow's Merchant Checklist

- [ ] 在 Draft Theme Editor 打开含 Multirow 的页面，确认原有 rows 在 custom styling 关闭时完全不变。
- [ ] 分别测试 minimal outline、black solid、rounded white + soft shadow。
- [ ] 在同一 Multirow 中为多个 rows 设置不同样式，确认互不影响。
- [ ] 测试 hover none / colour / lift；再用 reduced-motion OS preference 检查 lift 被取消。
- [ ] 使用键盘 Tab 检查 focus outline；检查 missing link 的 disabled state。
- [ ] 检查 desktop、tablet、mobile 的 left/centre/right/full-width；确认长 label 不溢出。
- [ ] 检查主页 H1 视觉无变化，Shipping FAQ heading 视觉无变化。
- [ ] 在 Admin 将 trial page 正文首个 H1 改为 H2。
- [ ] 审核 Product Vendor、10 个 missing descriptions、16 个 product descriptions、homepage title 建议。
- [ ] 确认 OZDESIGN Instagram 是否继续作为 OZROOMY Organization profile。
- [ ] 回归 desktop/mobile navigation、Mega Menu、country selector。
- [ ] 回归 representative product variants、Add to Cart、Cart Drawer、upsell 与 checkout handoff。
- [ ] 回归 Contact 与 Shipping 页面链接、表单和 accordion。
- [ ] 商家确认后再运行 Rich Results Test 与 mobile performance test；不要把本报告的 source validation 当作人工 QA。

## J. Stage 7 Final Local Closeout — 2026-10-09

Merchant manual QA is complete and the approved result is **PASS**. The approved feature head remains `a80dbf4744cdfa6fd4ede8b8379985f3c51d449e`; correction commit `1029750bada618c3f5714f6d505700e3908d0e3d` is reachable from it.

Local Git closeout evidence:

- Pre-merge `dev`: `3743cdd4e9d974e5fad7489afd145bb6d021f1d8`.
- Pre-merge `main`: `9ef08cb5042e36b043b2281ce6c718c9d3c5ea7a`.
- Feature → `dev` no-fast-forward merge: `389d5c83dacdfb39d76af0be6f2335186a14b454`.
- Local annotated recovery tag: `pre-stage7-closeout-2026-10-09`, targeting pre-merge `main` `9ef08cb5042e36b043b2281ce6c718c9d3c5ea7a`.
- Existing recovery/release tags were preserved without replacement.
- No squash, rebase, reset, force push or history rewrite was used.

Post-merge `dev` validation matched the approved baseline:

- JSON: 129/129 parsed.
- JavaScript: 17/17 passed `node --check`.
- Multirow schema: 29 section settings / 29 row settings.
- Multirow acceptance assertions: 14/14.
- Technical SEO source assertions: 6/6.
- Theme Check: 83 errors / 174 warnings / 0 info, identical to baseline; no new offense.
- `multirow.liquid`: one existing `UndefinedObject quantity_rule_soldout` warning and no error.
- `git diff --check`: pass.

Shopify safety state immediately before local closeout:

- Live Theme `145531568362`, `OZROOMY Final Prelaunch QA - 2026-10-08`, role `MAIN`; unchanged timestamp `2026-10-08T22:52:17Z`.
- Approved Draft `145537990890`, `OZROOMY Multirow Button Fix QA - 2026-10-09`, role `UNPUBLISHED`.
- Previous QA Draft `145537368298`, role `UNPUBLISHED`, retained.
- Approved Draft snapshot contains 347 theme files and matches the 348-file approved source tree except Shopify's known omission of empty `sections/header-group.context.eu.json`.
- Pre/post Live snapshots contain 347 files each with zero normalized content differences.

Production publication remains pending merchant action. Shopify's official GitHub Integration connection is still **UNKNOWN** because theme-card repository/branch metadata and authenticated GitHub App/hook data are unavailable. GitHub has zero Actions workflows, zero deployment records and zero open pull requests, but those facts do not prove that Shopify's GitHub App is disconnected. Therefore no remote `dev`/`main` push, tag push or remote branch deletion is authorized until the integration state is conclusively verified.

Remaining Shopify Admin SEO backlog is unchanged: product vendor values showing `My Store`, missing meta descriptions, duplicate fallback descriptions, the 60-Day Trial duplicate H1, the legacy Instagram reference and the obsolete Shipping Process URL. None were modified during closeout.

The final local `dev` documentation commit, `dev` → `main` merge and local Stage 7 release tag are recorded by the final closeout handoff because their hashes cannot be self-referentially embedded in this commit.

## K. Next Release Instructions

只有收到商家明确发布批准后，建议按以下顺序执行：

1. 重新运行 `shopify theme list`，确认 Live ID/role。
2. 将最新 Live 再次 pull 到新的隔离目录，不覆盖 repo。
3. 将 Live 与 feature candidate 做语义 drift 分类；优先保留新的 merchant JSON/config changes，遇到不明确项停止并请求确认。
4. 确认 Draft `145537368298` 仍为 unpublished，并完成上方人工 checklist。
5. 在 feature branch 上补充任何经批准的修正，重新跑 JSON、JS、Theme Check、refs、rendered-source 与 Draft round-trip。
6. 使用 `git merge --no-ff feature/multirow-button-seo-foundation` 合并到本地 `dev`，验证。
7. 使用 `git merge --no-ff dev` 合并到本地 `main`，验证；不 squash、不 rebase、不 force-push。
8. 只有在 Shopify/GitHub/第三方自动部署连接已由平台侧确认安全后，才 ordinary-push `dev`、`main` 和经批准的 release tag。
9. 只有在商家再次明确批准发布后，才将已验证 Draft 发布为 Live；发布前保留旧 Live 作为 rollback。
10. 发布后立即核对 Live ID、关键路由、H1/canonical/hreflang/JSON-LD、navigation、product/cart 与 Markets；再 pull 新 Live 创建 production snapshot/tag。

本轮停在 unpublished merchant review candidate；以上 release sequence 未执行。
