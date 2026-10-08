# OZROOMY 30-Day Manual SEO Action Plan

Date prepared: 2026-10-08

This plan is designed for a new Australian DTC sofa-bed brand with approximately 1–2 hours available per day and no paid SEO software. Total planned effort is approximately 36 hours. It prioritises launch correctness, the Pebble and Loopa commercial pages, useful content and measurement. It does not assume rankings or meaningful organic growth within 30 days.

## Working rules

1. Do not publish SEO text containing delivery, trial, warranty, sustainability, stock or performance claims until the merchant confirms them.
2. Record every before/after title, description, URL and publication date in one simple sheet.
3. Use Search Console data when it exists; until then, treat keyword ideas as hypotheses.
4. Prefer improving an existing high-value page over publishing generic AI-written articles.
5. Preview changes, then verify rendered source on both `ozroomy.com.au` and `ozroomy.com`.
6. Do not create redirects for the 11 dormant product handles until the product-by-product mapping is approved.

## Week 1 — Technical SEO foundations

Goal: establish measurement, correct launch metadata, confirm domains/indexation and close critical broken-link decisions.

| Day | Priority | Exact task | URL / Admin location | Time | Deliverable | Verification |
|---:|---:|---|---|---:|---|---|
| 1 | P0 | Complete the unpublished-theme manual release checklist: AU/Germany desktop Mega Menu, mobile menu, country selector, Pebble/Loopa variants, cart drawer, quantity/remove, upsell, responsive layouts and Theme Editor reload. Do not publish unless mandatory checks pass. | Theme `145531568362`; preview and Theme Editor links in the audit | 2h | Signed QA checklist with pass/fail screenshots | Reproduce each journey; confirm live remains `145528717546` |
| 2 | P1 | Add/verify Google Search Console properties for `https://ozroomy.com.au/` and `https://ozroomy.com/`. Use URL-prefix or domain verification appropriate to current DNS access. | Google Search Console > Add property | 1.5h | Both properties verified, owner recorded | Search Console shows verified ownership; do not remove verification token |
| 3 | P1 | Submit `sitemap.xml` for both domains and save the initial status/date. | Search Console > Indexing > Sitemaps; `https://ozroomy.com.au/sitemap.xml`, `https://ozroomy.com/sitemap.xml` | 1h | Two submitted sitemaps | Status becomes Success or a documented actionable error |
| 4 | P1 | Confirm Shopify Markets domain assignment, especially why a context-free `.com/` request redirects to `.com.au`. Do not change settings unless the intended regional behavior is documented. | Shopify Admin > Settings > Markets > each market > Domains and languages | 1.5h | Domain/market mapping table for AU, DE, FR, GB, NL and Japan | Anonymous/incognito checks show expected domain, currency, canonical and hreflang |
| 5 | P1 | Approve and enter homepage SEO title and description. Start from the audit draft, then edit for the final brand voice. | Shopify Admin > Online Store > Preferences | 1h | Approved homepage title <=60 characters and description near 150–160 characters | View source on AU/international; one title and one description |
| 6 | P1 | Approve and enter Contact and Why OZROOMY descriptions; confirm candidate H1s look correct on mobile/desktop. | Online Store > Pages > Contact / Why OZROOMY > Search engine listing > Edit website SEO | 1.5h | Two approved descriptions and H1 visual sign-off | Source has descriptions and one H1 per page; no layout shift |
| 7 | P1 | Decide the Shipping Process 404: publish the intended page, replace the link, or remove it. Also decide whether Shipping/Warranty should be in sitemap and footer. | `/pages/shipping-policy`; Online Store > Pages; Content > Menus | 1.5h | Written decision and implemented approved path | Link returns intended 200; sitemap/footer behavior matches decision |

Week 1 dependency: do not request indexing for a URL until its canonical destination, publication state, title, description and primary heading are correct.

## Week 2 — Product and collection SEO

Goal: give the highest-value product/collection pages unique search snippets, accurate structured data and a clear keyword purpose.

| Day | Priority | Exact task | URL / Admin location | Time | Deliverable | Verification |
|---:|---:|---|---|---:|---|---|
| 8 | P1 | Create a one-page keyword map using Search Console (if data exists), Google autocomplete and the actual catalogue. Assign one primary hypothesis per homepage, Pebble collection/product, Loopa collection/product and Accessories. Do not record invented volume. | Search Console > Performance; audit Section 12 | 1.5h | Keyword-to-page map with intent and exclusions | No two pages target the same exact primary intent without a clear collection/product distinction |
| 9 | P1 | Rewrite Pebble product SEO title/description from approved facts. Keep the visible product description useful and more detailed than the meta description. | Products > Pebble Sofa Bed > Search engine listing > Edit | 1.5h | Approved Pebble title/description | Source length review; no unsupported claim; canonical unchanged |
| 10 | P1 | Rewrite Loopa product SEO title/description using the same controls but distinct intent/copy. | Products > Loopa Sofa Bed > Search engine listing > Edit | 1.5h | Approved Loopa title/description | Source review; compare against Pebble to avoid duplication |
| 11 | P1 | Audit all active product Vendor values. If these are OZROOMY house-brand products, replace `My Store` with `OZROOMY`; preserve genuine third-party vendors. | Products > bulk editor or each product > Product organization > Vendor | 1h | Approved vendor mapping applied | Pebble/Loopa JSON-LD `brand.name` is approved; no unrelated vendor overwritten |
| 12 | P1 | Write Pebble collection introduction and SEO description: range overview, who it suits, meaningful links to the collection's products; avoid repeating the product page. | Products > Collections > Pebble Modular Sofa Beds | 1.5h | 80–150 useful words plus unique SEO listing | Visible copy, title/description, product links and mobile layout checked |
| 13 | P1 | Write Loopa collection introduction and SEO description with its own intent. | Products > Collections > Loopa Modular Sofa Beds | 1.5h | 80–150 useful words plus unique SEO listing | Compare with Pebble; no interchangeable boilerplate |
| 14 | P1 | Improve Accessories collection description/title and ensure every listed product has a useful unique name, image alt and internal destination. | Products > Collections > Accessories | 1h | Updated collection listing and issue list | Crawl/click every visible product; no 404 or misleading anchor |

Week 2 dependency: product/collection claims must be checked against the current delivery, returns, warranty and stock policies before publication.

## Week 3 — Content and site architecture

Goal: make the store easier to understand and navigate while resolving legacy/dormant content deliberately.

| Day | Priority | Exact task | URL / Admin location | Time | Deliverable | Verification |
|---:|---:|---|---|---:|---|---|
| 15 | P1 | Review the 11 dormant handles with product/operations knowledge. Mark each as renamed, discontinued, temporarily unavailable or future. Approve a successor only when equivalent. | Audit Section 14; Products; Content > Menus > URL redirects | 1.5h | Signed redirect decision table | Every approved redirect goes to a relevant 200 page; unresolved handles remain documented 404s |
| 16 | P1 | Implement only approved redirects, starting with likely exact renames `loopa-sofa` and `pebble-sofabed`. Export redirects before and after. | Content > Menus > View URL Redirects | 1h | Redirect CSV and implemented approved mappings | Test AU and international URLs in a fresh session; one 301 hop to canonical destination |
| 17 | P1 | Review 46 legacy OZDESIGN lines by the five audit classes. Decide the public Instagram URL first; preserve the legitimate history paragraph unless brand/legal rejects it. | Theme settings social media; Why page; audit Section 13 | 1.5h | Approved keep/change matrix | Public page/source contains only approved historical/social references |
| 18 | P2 | Improve internal links: homepage -> Pebble/Loopa collections, collections -> products, products -> relevant Shipping/Warranty/Contact pages. Use descriptive natural anchors. | Theme Editor and page/product rich-text editors | 1.5h | Internal-link map and implemented links | Click crawl returns 200; no repetitive keyword stuffing |
| 19 | P2 | Review Pebble images first. Add concise alt text only to meaningful product/detail images; leave decorative/duplicate media empty. | Products > Pebble Sofa Bed > each media item > Add alt text | 1.5h | Pebble media alt inventory | Rendered source/accessibility review; descriptions match visible image content |
| 20 | P2 | Review Loopa images using the same rule. Prioritise the lead image and images that explain sofa/bed modes, modules or materials. | Products > Loopa Sofa Bed > media | 1.5h | Loopa media alt inventory | Rendered source/accessibility review; no filename-style alt text |
| 21 | P2 | Draft one useful evergreen guide outline based on real customer decisions, such as measuring for a modular sofa bed or choosing between Pebble and Loopa. Do not publish a generic article yet. | Content > Blog posts (draft only) or shared document | 1h | Approved outline, sources and intended internal links | Merchant confirms accuracy and search intent before writing |

Week 3 dependency: redirect and legacy-brand tasks require merchant decisions. If decisions are not ready, spend the session on image alt review or internal-link QA instead of guessing.

## Week 4 — Useful content, validation and measurement

Goal: publish one genuinely useful asset, validate rich results/indexing and establish a repeatable monthly review.

| Day | Priority | Exact task | URL / Admin location | Time | Deliverable | Verification |
|---:|---:|---|---|---:|---|---|
| 22 | P2 | Write the approved guide in the merchant's voice. Include original measurements/process advice, helpful headings and links to relevant products/collections. | Content > Blog posts > new draft | 1.5h | Complete draft, not yet published | Fact/claim review; no generic filler; clear reader outcome |
| 23 | P2 | Edit and publish the guide only if it passes merchant review. Add a unique title/description, one H1 and a descriptive featured-image alt. | Content > Blog posts > Search engine listing | 1.5h | One quality published article or an approved held draft | Source/canonical/H1/links/mobile layout; article appears in sitemap if published |
| 24 | P1 | Run Google Rich Results Test on AU and international Pebble/Loopa URLs. Save screenshots/results. Address data errors only after confirming the source. | <https://search.google.com/test/rich-results> | 1h | Four validation records | Product/Offer detected; approved brand, currency, availability and URL match page |
| 25 | P1 | Use Search Console URL Inspection for homepage, Pebble, Loopa, both collections, Contact, Why, Shipping and Warranty. Request indexing only for final canonical URLs. | Search Console > URL Inspection | 1.5h | Inspection log for nine priority URLs | URL is Google-accessible; declared/user canonical reviewed; request recorded |
| 26 | P2 | Run PageSpeed Insights mobile twice for homepage, Pebble, Loopa and Contact. Record both runs; do not average away large variance. | <https://pagespeed.web.dev/> | 1.5h | Eight lab-result links/screenshots | Note date, region/device, LCP element, score, LCP, CLS, INP/TBT availability |
| 27 | P2 | Review Search Console Page indexing and sitemap status. Triage real errors; do not treat “Discovered/Crawled – currently not indexed” as proof of a theme bug without URL inspection. | Search Console > Indexing > Pages / Sitemaps | 1h | Prioritised indexing issue list | Each issue has example URL, state, owner and next check date |
| 28 | P2 | Review Merchant Center diagnostics and product data for Pebble/Loopa: URL, price, currency, availability, image, brand and shipping/returns alignment. | Google Merchant Center > Products > Needs attention | 1.5h | Diagnostics log and owner per issue | Storefront, structured data and feed agree; no unsupported policy claims |

## Days 29–30 — Baseline and next-month decisions

| Day | Priority | Exact task | URL / Admin location | Time | Deliverable | Verification |
|---:|---:|---|---|---:|---|---|
| 29 | P2 | Export the first Search Console baseline: total clicks, impressions, CTR, average position, top queries and top pages. If data is sparse, record that rather than interpreting noise. | Search Console > Performance > Search results | 1h | Dated CSV/export and short factual notes | Filters/date/property are recorded; AU and international are not accidentally mixed |
| 30 | P2 | Conduct the month-end review and choose at most three priorities for the next 30 days: one technical, one commercial page and one useful content item. | This plan, audit register, Search Console and Merchant Center | 1.5h | Next-month backlog with owner/time/success measure | Every priority is linked to evidence; no paid tool purchase without a demonstrated gap |

## Suggested title and description drafts for review

These are starting drafts, not automatically approved copy.

| Page | Suggested title | Suggested description |
|---|---|---|
| Homepage | `Modular Sofa Beds Australia | OZROOMY` | `Discover OZROOMY modular sofa beds designed for everyday comfort, flexible living and compact Australian homes. Explore Pebble, Loopa and accessories.` |
| Contact | `Contact OZROOMY | Sofa Bed Help` | `Contact OZROOMY for help with sofa beds, fabrics, customisation, delivery and existing orders. Our team will help you find the right next step.` |
| Why | `Why OZROOMY | Modular Sofa Beds for Real Homes` | `Meet OZROOMY, a Melbourne-born sofa bed brand designing modular furniture for real homes, everyday lounging and flexible overnight comfort.` |
| Shipping | `Shipping and Delivery | OZROOMY` | `Review OZROOMY delivery areas, timelines, tracking, preparation and international duties before ordering your sofa bed.` |
| Warranty | `Warranty Policy | OZROOMY` | `Read the OZROOMY limited warranty, what is covered, exclusions and how to request service for your sofa or accessory.` |

Before use, compare these drafts with the final approved policy, market availability and brand voice.

## Free tool stack

- Google Search Console: indexing, queries, pages, countries, devices and Core Web Vitals field reports.
- Google PageSpeed Insights: repeatable Lighthouse lab tests plus CrUX when enough field data exists.
- Google Rich Results Test: Product/Offer validation.
- Shopify Admin: titles, descriptions, product Vendor, page/collection copy, image alt text, redirects and Markets.
- Google Merchant Center: product/feed diagnostics.
- Browser developer tools and page source: headings, metadata, canonical, hreflang, JSON-LD and broken network requests.
- Codex: draft analysis, code fixes, source audits and comparison reports; Admin writes require separate explicit authorisation.

## Weekly measurement template

Record the following every seven days in the same sheet:

| Field | Value to record |
|---|---|
| Date range and property | Exact Search Console property and dates |
| Sitemap status | Success/error and discovered URL count |
| Indexed priority URLs | Homepage, Pebble, Loopa, collections, Contact, Why, Shipping, Warranty |
| Search performance | Clicks, impressions, CTR and average position; note low-data uncertainty |
| Top queries/pages | Export, do not infer intent from one impression |
| Rich results | Pebble/Loopa pass, warning or error |
| Merchant Center | Product count and actionable diagnostics |
| Mobile lab performance | Two runs per selected page with LCP/CLS and test date |
| Changes shipped | Exact page, old value, new value and publication date |
| Next check | Owner and date |

## End-of-month success criteria

- Both domain properties and sitemaps are verified in Search Console.
- Priority URLs have approved titles/descriptions and clear H1s.
- Pebble and Loopa structured data show the approved brand and pass Google's available checks.
- The Shipping Process link and support-page sitemap visibility have deliberate outcomes.
- Only approved dormant URLs are redirected.
- One useful, reviewed content asset is published or ready to publish.
- A factual baseline exists for month two; no ranking improvement is promised.

