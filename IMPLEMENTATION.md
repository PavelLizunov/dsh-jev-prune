# DSH 0.2 early Jev pruning

Accepted scope: user-owned fork; DSH 0.2.0-rc.1; early first-layer pruning only; bounded Jev requests; existing key and egress; dry-run then real disposable-session/request check; enable through user profile without restarting DSH. Keep upstream provenance and original session events. Never alter user/assistant text or tool-call pairing. Receipt layer remains off.

Implementation: reuse existing judge, candidate cache, planner and native surface replacement. Add opt-in early mode, minimum fresh-result character budget, minimum step interval and maximum judge batches. In early mode, no native size fallback for unjudged results; any incomplete/failed judge pass produces no edits. Default working configuration: earlyPrune true, earlyMinChars 16000, earlyMinSteps 4, maxJudgeBatches 1, judgeOn always, alwaysTrimRatio 0.5, preserveRecent 4, compactReceipts false, timeout 5000 ms, retries 0. No alteration to advertised model window. Existing retained judgments are not automatically reevaluated.

Verification: existing short local checks, focused early scheduling regression, real DSH Session surface and rendered request verification in a disposable harness; no benchmark campaign. Runtime activation first dry-run, then first layer enabled after test evidence. Secrets only through existing credential service/profile references, explicit proxy with no direct fallback. GitHub destination approved: PavelLizunov/dsh-jev-prune; upstream yangyu666/dsh-jev-prune.

## Evidence and remaining activation
- Actual 0.2 tool results are direct tool-role content, not nested tool-result blocks; adapted state extraction and replacement while preserving original events.
- Real Cordis activation initially failed because the upstream tried to access compaction even with layer 2 off. Fixed by not installing that hook when compactReceipts=false.
- Host pruner was disabled because standard preset realms own private pruners; enabled Host dependency in user profile for our early hook. Global pre-step delivery added; live execution remains unverified.
- node check.js and node smoke_apply.mjs passed before final global event option; node test-020.mjs passed after it. Dry-run unchanged, failure unchanged, budget below threshold sends no call, original events remain addressable.
- One real Jev call through required egress: 1000 input / 76 output tokens. Real Session.deriveMessages serialized size 46351 -> 25643 characters. This proves disposable Session representation, not actual provider wire delivery; provider request capture and live scoped hook still require verification.
- Installed local.4 tarball through native live manager: exitCode 0, changed true, application restart-required, enabled false. Stop here under no-restart agreement. Earlier local.2 component displayed Running but no pre-step observations (not evidence of working pruning). Profile remains dryRun:true and receipt layer off. No production pruning enabled or claimed.
- Next user-approved action: activate installed package with supported runtime lifecycle (if restart, fresh permission), observe dry-run hooks and credential resolution, then switch dryRun:false and verify actual request reduction. Do not blindly repeat installation or enable unknown state.
- Independent model review unavailable through permitted explicit-model tools; coordinator checks only.

