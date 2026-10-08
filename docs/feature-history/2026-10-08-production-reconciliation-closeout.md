# OZROOMY production reconciliation closeout — 2026-10-08

## A. Executive summary

The merchant published Shopify theme `145531568362` and then intentionally updated the Shipping Policy page in the Theme Editor. The current live theme was pulled into a new isolated backup and compared against both local `main` and the previously verified draft pull.

Only one new production configuration change was found: `templates/page.shipping-policy.json`. That file has been reconciled into Git without changing Liquid, JavaScript, CSS, Markets, header/footer configuration, product templates or other merchant settings. Production remained read-only throughout this closeout.

The final deployable Git source matches the pulled live theme after line-ending normalization, except for the previously documented Shopify serialization omission of the redundant empty `sections/header-group.context.eu.json` file. The local file intentionally remains because it records that the EU context has no header override and therefore inherits the working parent menu.

GitHub push is deferred. Local repository files and the public GitHub repository expose no workflow that deploys the theme, but the available Shopify CLI output does not identify GitHub-connected theme branches. Because a push to a Shopify-connected branch can update that theme immediately, the absence of local workflows is not sufficient evidence that pushing `main` or `dev` is production-safe.

## B. Production theme status

| Item | Verified state |
|---|---|
| Store | `zjna5j-hn.myshopify.com` |
| Current live theme | `145531568362` |
| Name | `OZROOMY Final Prelaunch QA - 2026-10-08` |
| Role | `live` |
| Previous live theme | `145528717546`, now `unpublished` |
| Production mutation by Codex | None |
| Theme upload/publish/unpublish | None |

Theme roles were queried before the pull and must be queried again before any future rollback or publication action.

## C. Merchant changes reconciled

### Exact changed file

`templates/page.shipping-policy.json`

### Exact Theme Editor changes

- Section `main`: removed `disabled: true`, so the Shopify Page title/content section now renders.
- Section `9c121ec4-42cd-4c8e-82a2-935e073db7d7`: title changed from `Shipping Policy` to `FAQs` while preserving `heading_tag: h1` and all layout/color settings.
- Existing eight-row Shipping Policy content was replaced with six merchant-authored FAQ rows, while retaining the existing block identifiers for the six retained positions:
  - `collapsible_row_X8Ae7c`: `How much does delivery cost?`
  - `collapsible_row_RMY4Rr`: `What does standard delivery include?`
  - `template--19742927749415__9c121ec4-42cd-4c8e-82a2-935e073db7d7-16889993318614e07a-0`: `How will I know when my sofa is arriving?`
  - `collapsible_row_Cc3RMT`: `Can I order a sofa that's currently on pre-order?`
  - `collapsible_row_N7hFQN`: `Can I change my delivery address?`
  - `template--19742927749415__9c121ec4-42cd-4c8e-82a2-935e073db7d7-16889993318614e07a-1`: `Can items in the same order arrive separately?`
- Old blocks `collapsible_row_3wUmGT` and `collapsible_row_qhRXQ6` were removed by the merchant.
- The old link to the unpublished `/pages/shipping-process` page is no longer present in the new Shipping FAQ content.

The reconciled file matches the pulled live file exactly after CRLF/LF normalization. No whole-theme or older-backup overwrite was performed.

Shopify Admin Page body, policy, navigation, product and Markets records are not theme files and are outside this reconciliation. No claim is made that the theme pull backed up those records.

## D. Theme comparison

| Comparison | Result |
|---|---|
| Local pre-reconciliation `main` vs current Live | Shipping Policy template differs; empty EU context exists only locally |
| Previous verified draft pull vs current Live | Shipping Policy template differs only |
| Reconciled Git source vs current Live | All 347 pulled live files match after newline normalization |
| Remaining path difference | `sections/header-group.context.eu.json` exists only in Git |
| Remaining difference classification | Verified Shopify serialization of redundant empty contextual section-group configuration |
| `config/settings_data.json` | Exact normalized match |
| `config/markets.json` | Exact normalized match |

No unexpected code drift, missing live file, new app block, media-reference change or ambiguous merchant configuration was detected.

## E. Git status and history

| Item | Commit/ref |
|---|---|
| Original production-development baseline | `e7b4578eb26be25f2f3e406c8a0bef32d7edfcca` |
| Previous local `dev` before reconciliation | `9ad6055ee448ab58e8ea39cecb3dbcdc846c6075` |
| Previous local `main` before reconciliation | `97da7f391cdd4c6389d7541aff031b98f079ed88` |
| Reconciliation branch | `chore/postpublish-merchant-reconciliation-20261008` |
| Merchant configuration commit | `0ef236de08f844dc80d4f5dd57d768fffd54d655` |
| Stable release reference | Annotated tag `production-stable-2026-10-08` points to final verified local `main` |

The final merge commit identifiers are available from `git rev-parse dev`, `git rev-parse main`, and `git rev-list -n 1 production-stable-2026-10-08`; they are also recorded in the end-of-day handover generated after the merges. The tracked report cannot embed the hash of the later merge commit that contains the report itself.

History rules used: explicit staging, normal commits, `--no-ff` merges, no squash, no rebase, no reset and no force-push. The reconciliation and earlier feature branches are retained.

## F. GitHub push

Push is deferred unless Shopify Admin confirms that neither `main` nor `dev` is connected to a theme whose update would be unauthorised.

- Remote: `https://github.com/EricYuCoding/ozroomy-theme.git`
- Remote `main` and `dev` at preflight: `e7b4578eb26be25f2f3e406c8a0bef32d7edfcca`
- Repository workflow/config evidence: no `.github/workflows` or repository Shopify deployment configuration found.
- Remaining uncertainty: Shopify's theme card GitHub branch connection is not exposed by the available CLI theme-list data.
- Required check: Shopify Admin > Online Store > Themes; inspect the current live and unpublished theme cards for GitHub-connected repository/branch details.
- Safe action after confirmation: fetch, recheck remote SHAs, then ordinary non-force pushes of `dev` and `main`. Do not push the release tag until the same deployment-safety check passes.

## G. Backup manifest

| Item | Value |
|---|---|
| Backup directory | `D:\work\ozroomy-backups\2026-10-08-postpublish-live-145531568362` |
| Theme files | 347 |
| Theme-file aggregate SHA-256 | `E4459DCAEF926FFAF2694C7CD000EC4FD666B58542E5252C347E5CC98DBB06B2` |
| Archive | `D:\work\ozroomy-backups\2026-10-08-postpublish-live-145531568362.zip` |
| Archive SHA-256 | `8E3C80DBEC6B7A5736A8B2A6E3BDA88D20BC4444DF7422E6345B2BBFFA475404` |
| Manifest | `D:\work\ozroomy-backups\2026-10-08-postpublish-live-145531568362-manifest.md` |
| Capture time | `2026-10-08T22:54:22+11:00` |

The directory and archive were read successfully. Earlier backups and tags were not overwritten. These files back up theme code/configuration only, not Shopify Admin business records.

## H. Validation and production smoke test

### Local validation

- JSON: 129/129 parsed.
- JavaScript: 17/17 passed `node --check`.
- Theme Check: 83 errors / 174 warnings / 257 total, identical to the inherited baseline and categories.
- Static Liquid references: no missing snippet, section or asset targets.
- `git diff --check`: pass.
- Live comparison: only the documented empty EU context serialization difference remains.

### Read-only public production checks

| Check | Result |
|---|---|
| AU homepage | PASS — HTTP 200, `.com.au` canonical, navigation and mobile drawer markup present |
| Germany/international homepage | PASS — HTTP 200 with `country=DE`, `.com` canonical, EUR, navigation and drawer markup present |
| Pebble product | PASS — HTTP 200, one H1, expected product/form markup |
| Shipping Policy | PASS content — HTTP 200 and all six new FAQ headings present |
| Contact | PASS — HTTP 200, expected H1 present |
| Cart page | PASS static — HTTP 200 and Continue Shopping content present; no cart mutation performed |
| Collection retry | UNVERIFIED — first connection closed and later attempts returned HTTP 429 |
| Interactive navigation/cart | UNVERIFIED — no browser session was available |
| Live role | PASS — `145531568362` remained `live` at preflight |

The current Shipping Policy HTML contains two H1 elements after the merchant enabled the `main-page` section while retaining the FAQ section's `heading_tag: h1`. This is preserved as intentional production configuration and is a tomorrow-review item, not silently changed during reconciliation.

## I. Recovery instructions

### Shopify recovery

Before any rollback, re-query theme roles and visually inspect the intended target.

- Current production theme: `145531568362`.
- Previous production theme: `145528717546`, currently unpublished.
- If a serious storefront problem is found, review `145528717546` in Shopify Admin and explicitly publish it only after confirming it remains the intended previous state.
- Publishing the older theme restores that theme's stored files/settings. It does not roll back independently stored Pages, Policies, Navigation, products, Markets or orders.
- Do not delete either theme or the isolated backups.

### Git recovery

Create a new recovery branch from the current shared branch and use `git revert` for any already-shared reconciliation or merge commit. Do not reset or force-push shared branches.

Suggested inspection:

```powershell
git show production-stable-2026-10-08
git diff 97da7f391cdd4c6389d7541aff031b98f079ed88..production-stable-2026-10-08
git log --graph --oneline --decorate --all
```

If the merchant Shipping reconciliation alone must be reversed after sharing, revert `0ef236de08f844dc80d4f5dd57d768fffd54d655` on a new recovery branch, validate, and merge normally. That Git revert does not change Shopify until a separately authorised deployment occurs.

### Consistency boundary

Re-publishing a Shopify theme, reverting Git, restoring Theme Editor JSON and restoring Shopify Admin records are four separate operations. None automatically guarantees the other three.

## J. Outstanding issues

1. Confirm the Shipping page's two-H1 presentation and visual spacing; do not change it without deciding whether the Page title or FAQ title is the intended primary heading.
2. Confirm Shopify GitHub integration status before pushing local `dev`, `main` or the stable tag.
3. Re-run the collection-page smoke test after Shopify rate limiting clears.
4. Interactive menu, mobile drawer, country selector, variant/cart and Theme Editor tests remain human QA items.

## K. Tomorrow's recommended QA

1. Inspect Shipping Policy on desktop and mobile: Page title, FAQ title, all six accordions and support email link.
2. Test AU and Germany desktop Mega Menu, mobile drawer and country selector.
3. Test Pebble and Loopa variants, Add to Cart, cart drawer, quantity change, removal, upsell and Continue Shopping.
4. Confirm homepage, collection, Contact and Shipping responsive layout with no overflow.
5. Inspect the live and previous theme cards before any GitHub push or rollback.
