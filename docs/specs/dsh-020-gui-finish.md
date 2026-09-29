# Finish DSH 0.2 Jev settings and first-layer pruning

## Intended result

`@pavellizunov/dsh-jev-prune` is a working DSH 0.2 plugin: GUI settings persist, the optional plugin key is write-only, dry-run status is observable, and one bounded real prune on a disposable session reduces tool-result text while originals stay in the log. The finished source is pushed to `PavelLizunov/dsh-jev-prune` on `task/dsh-020-local-trial`.

## Scope and invariants

- Change only this repository and the user profile `web-015` rows that belong to this plugin.
- Keep receipt compaction off, MIT license, and upstream authorship.
- Do not print, commit, or replace `TYPESAFE_API_KEY`. Plugin key `DSH_JEV_PRUNE_API_KEY` stays optional and write-only.
- Jev traffic stays on the configured HTTP proxy. No direct fallback.
- Do not restart `dsh-web.service`. Publish a new package version when Node would keep a cached module.
- Remove the duplicate unscoped `jev-prune` profile row only after the scoped package is the live one.
- Do not prune the current user conversation. Real pruning is checked on a disposable session.

## Verification

- `node test-settings.mjs` and `node test-020.mjs` pass.
- Authenticated `GET /jev-prune/settings` returns `judgeMaxStateTokens` and no key material.
- A GUI save changes a harmless numeric field and a second read returns that value.
- Disposable real-prune check with `dryRun: false` shows fewer derived characters and retained original events.

## Observed result

- Local settings and disposable Session checks pass on `local.10`.
- Live process PID 1227835 kept the previously loaded module. HMR documents that replacing an installed package version requires restart, and Plugin Manager returned `restart-required`.
- The live GUI save and disposable real prune inside the running profile remain blocked on one authorized restart.
