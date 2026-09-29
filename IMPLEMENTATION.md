# DSH 0.2 early Jev pruning

Accepted scope: user-owned fork; DSH 0.2.0-rc.1; early first-layer pruning only; bounded Jev requests; existing key and egress; dry-run then real disposable-session/request check; enable through user profile without restarting DSH. Keep upstream provenance and original session events. Never alter user/assistant text or tool-call pairing. Receipt layer remains off.

Implementation: reuse existing judge, candidate cache, planner and native surface replacement. Add opt-in early mode, minimum fresh-result character budget, minimum step interval and maximum judge batches. In early mode, no native size fallback for unjudged results; any incomplete/failed judge pass produces no edits. Default working configuration: earlyPrune true, earlyMinChars 16000, earlyMinSteps 4, maxJudgeBatches 1, judgeOn always, alwaysTrimRatio 0.5, preserveRecent 4, compactReceipts false, timeout 5000 ms, retries 0. No alteration to advertised model window. Existing retained judgments are not automatically reevaluated.

Verification: existing short local checks, focused early scheduling regression, real DSH Session surface and rendered request verification in a disposable harness; no benchmark campaign. Runtime activation first dry-run, then first layer enabled after test evidence. Secrets only through existing credential service/profile references, explicit proxy with no direct fallback. GitHub destination approved: PavelLizunov/dsh-jev-prune; upstream yangyu666/dsh-jev-prune.

## Accepted completion scope
User requested a fully working, configurable DSH plugin, hosted in their GitHub for further commercial development. Finish runtime activation and native UI configuration including write-only API key management, thresholds/proxy controls and observable status. No server restart. Keep MIT license and upstream attribution. Only claim live behavior after consumer checks; do not equate menu visibility with execution.

## Settings host

`host-020.js` is the DSH 0.2 entry. It keeps receipt compaction off, resolves `DSH_JEV_PRUNE_API_KEY` before `TYPESAFE_API_KEY`, and exposes `/jev-prune/settings`. The namespace passed to `settings.update` is `ctx.fiber.entry.options.id`. `client.js` registers the form with slot key `@pavellizunov/dsh-jev-prune`. `lib/host-020-v10.js` is the bundled entry shipped as package main.

Live package replacement of an already loaded name returns `restart-required`. The running `web-015` process therefore keeps its previously loaded module until an explicitly authorized restart. Do not claim the new GUI is active in that process before the restarted process serves `judgeMaxStateTokens`.

## Evidence and remaining activation
- Actual 0.2 tool results are direct tool-role content, not nested tool-result blocks; adapted state extraction and replacement while preserving original events.
- Real Cordis activation initially failed because the upstream tried to access compaction even with layer 2 off. Fixed by not installing that hook when compactReceipts=false.
- Host pruner was disabled because standard preset realms own private pruners; enabled Host dependency in user profile for our early hook. Global pre-step delivery added; live execution remains unverified.
- node check.js and node smoke_apply.mjs passed before final global event option; node test-020.mjs passed after it. Dry-run unchanged, failure unchanged, budget below threshold sends no call, original events remain addressable.
- One real Jev call through required egress: 1000 input / 76 output tokens. Real Session.deriveMessages serialized size 46351 -> 25643 characters. This proves disposable Session representation, not actual provider wire delivery; provider request capture and live scoped hook still require verification.
- Installed local.4 tarball through native live manager: exitCode 0, changed true, application restart-required, enabled false. Stop here under no-restart agreement. Earlier local.2 component displayed Running but no pre-step observations (not evidence of working pruning). Profile remains dryRun:true and receipt layer off. No production pruning enabled or claimed.
- 2026-09-29: authenticated live settings from the previously loaded module returned HTTP 200, dryRun true, fallback credential configured, and no key material. Saving any field returned HTTP 400 because that loaded module used the wrong settings namespace. Package local.10 fixes the namespace. Its install changed the manifest and reported application restart-required; enabling it did not replace the loaded module. A direct patch to the new file specifier unloaded the working route and was reverted. The unscoped bundle was re-enabled so the previous dry-run route returned HTTP 200 again.
- Disposable real-prune check, not the live profile: `node test-020.mjs` with a deterministic judge reduced one DSH Session `deriveMessages()` serialization from 46351 to 25643 characters, retained original events, left dry-run unchanged, made no edit after a failed judge, and sent no request below the character budget.
- Next required live step: one authorized DSH restart, then confirm `/jev-prune/settings` includes `judgeMaxStateTokens`, save and read back one numeric field, and only then run one disposable real session with dryRun false. Do not restart without fresh permission.
- Independent model review unavailable through permitted explicit-model tools; coordinator checks only.

