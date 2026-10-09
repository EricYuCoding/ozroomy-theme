# Email Signup Advanced production release — 2026-10-09

## Release summary

The approved Email Signup Advanced footer block was released to production after merchant visual QA. The merchant published the validation theme manually. This closeout did not publish, overwrite, or delete a Shopify theme.

The release preserves the legacy `email_signup` block schema while enabling one Shopify-native `email_signup_advanced` customer form in the production Footer. It also records the merchant-approved production configuration that existed when the new Live theme was snapshotted.

## Release references

| Item | Value |
|---|---|
| Store | `zjna5j-hn.myshopify.com` |
| Current Live theme | `145542709482` — `OZROOMY Email Signup Advanced QA - 2026-10-09` |
| Previous Live rollback theme | `145537990890` — retained as unpublished |
| Feature branch | `feature/email-signup-advanced` |
| Approved feature commit | `5a61828fe1d7fcbb70104d18152a8bf6fe59b60e` |
| Production configuration commit | `4743a02e934dd489c37b0e85f8e0bd5884c8f570` |
| Dev merge commit | `620137ea60f3f9137fb3ca168ed5ed8eaa20ce76` |
| Validated release commit | `8913118069aea92444b523d54a6c678049aee4e3` |
| Annotated release tag | `ozroomy-v1.0.1-email-signup-advanced` |
| Previous stable Git tag | `production-stable-2026-10-08` → `3e31341428e8c64c9bfe06b15ef629112bc43821` |
| Production backup | `D:\work\ozroomy-backups\2026-10-09-email-signup-advanced-production-release` |

## Changed theme files

- `sections/footer.liquid` — advanced native newsletter form, scoped styling, responsive rules, accessibility state, and Theme Editor schema.
- `sections/footer-group.json` — production Footer configuration with the advanced block, preserved block ID, menus, hidden INFO block, social settings, and payment settings.
- `config/settings_data.json` — merchant-approved production font configuration.
- `templates/index.json` — merchant-approved production homepage and Shopify-serialized Multirow settings.

The release document itself is stored at `docs/releases/2026-10-09-email-signup-advanced.md`.

## Production configuration

The final Git configuration was reconciled from the isolated current-Live snapshot after explicit merchant approval. It records:

- Header font `rasa_n4` and body font `system_ui_n4`.
- Empty Email Signup Advanced eyebrow and microcopy values, as approved in production.
- Production homepage Multirow heading, CTA enablement, alignment, radius, text, and serialized defaults.
- Footer menus `Explore` / `footer` and `Help & Information` / `information`.
- Disabled INFO block and one active advanced newsletter block using ID `24f208fd-0898-43eb-af23-d74f8420ab37`.

`sections/header-group.context.eu.json` remains source-controlled even though Shopify pull omits this empty context file. This is treated as Shopify serialization behavior, not production merchant drift.

## Validation

- Complete current-Live backup: 347 theme files, 7,652,989 bytes.
- Shopify Liquid/schema validation: all four release theme files valid; two existing deprecated-font warnings remain in stored presets.
- JSON parsing: passed for `config/settings_data.json`, `sections/footer-group.json`, and `templates/index.json`.
- Theme Check: 83 errors and 173 warnings. The Stage 2 baseline was 83 errors and 174 warnings, so this release introduced zero new errors and zero new warnings.
- `git diff --check`: passed.
- Approved feature and production configuration commits are ancestors of the validated release commit.
- Legacy newsletter schema retained; one active advanced Footer newsletter form configured.
- No new JavaScript dependency or JavaScript file was introduced.
- Merchant visual QA was confirmed before this closeout. Automated browser screenshots and a real customer subscription submission were not repeated during release closeout.

## Known technical debt

- 83 existing `MatchingTranslations` Theme Check errors remain outside this feature.
- 173 existing warnings remain, including two deprecated Harmonia font values stored in non-current preset data.
- Shopify CLI `theme list` and `theme info` did not expose the theme's platform `updated_at`; the local snapshot verification time is recorded in backup metadata.
- Git code rollback and Shopify Theme Editor configuration rollback are separate operations.

## Rollback option A — Shopify theme rollback

Theme `145537990890` is the former Live theme and is retained as an unpublished rollback option.

1. Obtain explicit merchant approval before publishing any rollback theme.
2. Confirm the intended rollback theme ID and preview it at desktop, tablet, and mobile widths.
3. Confirm Footer menus, newsletter form, header, product pages, cart drawer, localization, social links, and payment icons.
4. Publish only through the approved Shopify release procedure.
5. Re-query theme roles and create a fresh post-rollback production backup.

The complete backup at `D:\work\ozroomy-backups\2026-10-09-email-signup-advanced-production-release\theme` preserves the configuration of the Email Signup Advanced production release independently of the retained rollback theme.

## Rollback option B — Git rollback

The release is fixed at tag `ozroomy-v1.0.1-email-signup-advanced`, pointing to commit `8913118069aea92444b523d54a6c678049aee4e3`. The previous verified stable reference is `production-stable-2026-10-08`, pointing to `3e31341428e8c64c9bfe06b15ef629112bc43821`.

Use a reviewable rollback branch and revert commits; do not reset or force-push production branches. A typical starting point is:

```powershell
git switch -c rollback/email-signup-advanced main
git revert -m 1 8913118069aea92444b523d54a6c678049aee4e3
```

Alternatively, create a comparison branch from `production-stable-2026-10-08` and review its full difference from current `main` before integrating anything. Reverting Git does not restore Shopify Theme Editor settings by itself.

## Post-rollback verification

- Confirm Shopify Live theme ID and role.
- Confirm local and remote branch SHAs and a clean working tree.
- Run JSON parsing, Liquid/schema validation, Theme Check, and `git diff --check`.
- Confirm the Footer menus and exactly one active newsletter form.
- Confirm header, homepage, product templates, cart drawer, localization, social links, and payment icons.
- Compare the rollback target with the appropriate full Shopify backup.
- Record whether Shopify configuration, Git source, or both were rolled back.
