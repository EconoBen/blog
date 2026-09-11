> Status — LOCAL IMPLEMENTATION AND VERIFICATION COMPLETE, September 10, 2026. The selected sectioned wings passed independent isolated and integrated review, the 43-suite production gate, final Chromium/WebKit desktop and phone playback, scoped lifecycle checks and current performance measurement. Ben has approved pushing all reviewed changes to the feature branch. Deployment and merge still require approval; archive is deferred until the approved release workflow is complete. The branch-specific Vercel rule prevents an automatic preview during this push.

## 1. Baseline and diagnosis

- [x] 1.1 Read Ben's latest objective, local instructions, the prior wing-proportions comparison and current rig/choreography/material/renderer. Create this focused proposal/spec/design/tasks/QA record; explicitly supersede earlier artistic acceptance without discarding valid baseline functional evidence.
- [x] 1.2 Verify and preserve production 3112 build `QsI2QzDIQ1r87XsztmOSc`, snapshot 1Wilcd and the existing desktop/phone MP4s. Record before-study source/art hashes and current elapsed landmarks; keep unrelated dirty work intact.
- [x] 1.3 Review actual baseline normal-speed and adjacent early-opening frames against authentic retained references. Record concrete contributions of nested easing, projection, feather area, near/far overlap and material timing, distinguishing observed anatomy from design inference.

## 2. Bounded isolated studies

- [x] 2.1 Define two materially different candidates and their predicted visual improvement before iterating. Keep body/camera/timing comparable; retain the rejected simple enlargement as history. Do not create a long series of minor numeric variations.
- [x] 2.2 Add meaningful failing geometry/material regressions for diagnosed defects, then implement isolated candidates. Preserve full-length folding, fixed body-relative shoulders, continuous elbow/wrist/feather motion and occupied geometry; coordinate material coverage so there is neither a second closed wing nor a wingless/sliver interval.
- [x] 2.3 Watch and record both candidates at normal speed on 1440×900 and 390×844 through unfolding plus two full strokes/recoveries. Retain native adjacent frames and a few labeled critical poses, source/art hashes and actual capture times; inspect head/shoulder overlap and projected feather fullness throughout.
- [x] 2.4 Obtain independent visual critique. Select the candidate that visibly resolves the complaint; if necessary make one focused follow-up and repeat affected evidence. If that still fails, reassess the diagnosis/artwork instead of parameter churn. Record a clear visual PASS before integrating; passing numerical tests alone is insufficient. **Earlier geometry and first sectioned reviews FAILED; revised sectioned study now PASS** in `sectioned-study-review-v2.md`, with matching source/art hashes and fresh desktop/phone native/adjacent evidence.
- [x] 2.5 Complete the justified artwork reassessment with separate proximal, inner-secondary and outer-primary feather sections. The accepted v3 implementation uses cropped sections and five prepared blends, the fuller fold, 960-source-unit lengths and .9 chord for the broader inner fan. Verify registration, opaque white feathers, section overlap, finite geometry and preparation/failure ownership. Repeat desktop/phone normal and adjacent review of early emergence and 4000–4140 ms recovery; retain a clear independent PASS before task 3.1.

## 3. Shared-film integration and invariants

- [x] 3.1 Integrate only the accepted rig/material changes into the shared renderer and directly necessary deployment channel. Preserve the 17600 ms clock, both book passes, 10000–13300 ms hold, body/neck/bill, wake/water/feather, continuous landing and exact resting engraving.
- [x] 3.2 Review complete desktop/phone normal playback independently and capture adjacent hero/crossing/landing frames. Verify revised wings at both crossing scales, no clipping/head/book overlap, no duplicate body/material jump, and readable 320 px/short-landscape composition, including 844×390 and 568×320. Any compact landscape book/Skip arrangement must preserve the full publication, quiet hold, 44 px action target and actual side clearance. Resolve concrete new findings and repeat affected captures.
- [x] 3.3 Run relevant regression suites for actual current wing/rig/material/body/choreography and renderer ownership. Preserve failing-first evidence; revise old absolute thresholds only when a documented scale-aware contract catches the real defect. Do not weaken tests solely to accept larger wings.
- [x] 3.4 Verify lifecycle/scheduler invariants through exact source cases and native browser smoke. Cover loading/failure, early/mid/late Skip, Escape during hold, replay below fold, reduced motion, navigation/history, late rotation, focus/scroll and resident pointer/dive/article behavior. Distinguish real native visibility from source-clock fixtures and retain untested-device limitations.
- [x] 3.5 Check changed asset bytes/alpha, static preparation, cached coverage/reflection, hidden-work guards, Canvas caps and disposal. If no art/resource contract changed, record reuse explicitly; measure fresh unrecorded production phase intervals and startup work after final freeze.
- [x] 3.6 Verify the final compact-card focus-gap correction at 568×320 against the production candidate. The card uses viewport width minus 192 rather than 176, keeping the same content/height/hold. Confirm the full text, cover and Skip focus outline remain separate; retain the qualification that Skip can cover the still-inert pond invitation during the opening but not after completion.

## 4. Production verification and local delivery

- [x] 4.1 Freeze app/test/art source, run the complete discovered source suite, types and local production `release:prepare` gate with verified rollback metadata. Retain source manifest, logs, resource inventory and exact source/art identity; do not publish.
- [x] 4.2 Replace only the owned 3112 preview with the verified snapshot and confirm served manifest bytes. Capture final independent Chromium/WebKit desktop/phone/short-landscape playback plus relevant replay/rotation/Skip/failure checks against that exact candidate. Preserve the baseline snapshot.
- [x] 4.3 Produce fresh desktop and phone MP4s from the verified candidate's complete normal-speed opening through landing. Use H.264/yuv420p and faststart; verify duration, dimensions, playable decoding and first/last content. Retain original recordings and encode provenance; keep earlier MP4s labeled as the rejected-proportion baseline.
- [x] 4.4 Update this change's QA inventory/design/tasks with actual candidate choice, independent critique, resolved defects, final source/build/video identity and honest startup/visual/native-device limits. Pass strict OpenSpec validation and record any documentation-only differences after source freeze.
- [x] 4.5 Prepare current local 3112 preview, new desktop/phone MP4 links and the delivery guide for the parent’s final response, explaining what visibly changed and retained limits. Leave push/merge, hosted preview and deployment for separate approval; close owned review browsers and spare servers.

## Validation and execution notes

Use `/Users/blabaschin/.local/share/mise/installs/node/22.14.0/bin` for the verified Node 22 runtime. Existing relevant scripts include `verify-flight-rig.mjs`, `verify-flight-body.mjs`, `verify-arrival-wings.mjs`, `verify-arrival-artwork.mjs`, `verify-flight-artwork.mjs`, `verify-arrival-choreography.mjs`, `verify-flight-rendering.mjs`, `verify-flight-preparation.mjs`, `verify-grebe-arrival.mjs`, `verify-grebe-arrival-integration.mjs`, `verify-arrival-preparation.mjs` and `verify-grebe-field-lifecycle.mjs`. Add a focused regression only for a meaningful new contract; `npm test` discovers current verify scripts automatically.

```sh
npm test
npm run typecheck
npm run release:prepare -- --rollback-url https://blog-f15m2kk7r-bens-projects-0b44e0e4.vercel.app --rollback-source 608f879b1fe3b6376eb3e9e094f0b39b7e5524e4
openspec validate refine-grebe-wing-proportions --strict --no-interactive
```

Reconfirm rollback metadata read-only if production changed. Run the full release gate only after coordinated source freeze; it does not deploy. Current evidence belongs under `release-artifacts/2026-09-10-wing-refinement/` in clearly named study/final subdirectories. Preserve the earlier `release-artifacts/2026-09-10-two-pass/wing-proportions/` comparison as rejected history. The root owns application integration and final delivery; planning/review agents keep their bounded scopes and report source freezes before shared snapshots.

## Historical execution record — first studies rejected

The following entries preserve the state at each review. The final verification record below supersedes their then-pending tasks.

The existing production 3112 build/snapshot and earlier shareable clips remain the functional baseline. Pre-study source copies are retained in the new evidence directory's `baseline/`; the initial candidate rig remains in `study/arrivalFlightRig-first-candidates.ts`. The source/reference diagnosis is in `references.md`, and `study/README.md` distinguishes the initial reverse-elbow experiment from the focused gentler-fold refinement.

Independent review in `study-review.md` rejected both revised geometry candidates after native desktop and phone playback. Fuller area improves body balance, but the 3180 ms pointed near-root plate, the 4100 ms straight recovery strip, articulated's neck-side hook and equally emphasized scalloped tips remain visible. The first extreme 3280 ms collapse was corrected before that review; this did not close the gate. The reviewer recommends fuller proportions with separately overlapping feather sections, not another global enlargement. `wing-v3-prompt.md` records the resulting artwork reassessment.

Root reports all 40 current source checks and type checking pass for the preserved default profile and candidate mechanics. This is source-contract evidence, not acceptance of task 2.2's complete material transition, a new release build or a visual PASS. New sectioned-art coverage and its independent review remain open.

`integration-clearance.md` and its data retain actual-ink measurements for the rejected articulated rig. They identify provisional desktop book and short-landscape wing/Skip/landing constraints. They are reusable analysis, not evidence that the new v3 candidate fits or that framing changes have been implemented. All integration and final production/MP4 tasks remain pending.

### Sectioned visual gate accepted

The first sectioned review found a recovery needle at 4080/4500 ms and visible triangle facets during 3110/3125 ms emergence. The revised renderer fades each completed wing once; the rig adds curvature and a broader joint transition with recovery fold `[20,-15,65]`, camber 65 and radius 110. Independent `sectioned-study-review-v2.md` records PASS for integration on desktop and phone. Native recordings and 29 staged poses per layout are retained in `sectioned-independent-v2/`; all recorded input hashes match before/after.

A short initial crossfade and stylized foreshortened inner fold remain explicit artistic limits. This PASS does not close resource/source contracts in 2.2/2.5 or the full-film, lifecycle, production and MP4 tasks. The older clearance data still concern the rejected articulated rig and must be reassessed with the accepted sectioned geometry.

### Integrated development visual gate

`release-artifacts/2026-09-10-wing-refinement/integrated-independent-v2/README.md` records full-film PASS at 1440×900,390×844,320×568,844×390 and568×320. All five native recordings completed without application page errors, and 24 separately staged poses per viewport record actual elapsed values. The before/after application/art hashes match. An earlier mixed-source capture is explicitly superseded.

The accepted framing uses a .77-height hero cap, the full feather envelope to reserve the crossing corridor, a compact 162 px landscape book reservation and a 44 px-high compact Skip beside it. One universal wing fold 720–160 ms before contact prevents a view-dependent reopening on rotation. The complete 17.6 s story and readable quiet hold remain intact. The focused Skip outline slightly touched the 568 px card border; root then changed the card width allowance to 192 px. Task 3.6 tracks that final affected-layout check without repeating unrelated development captures.

Root reports all 43 current source checks pass and the final local release gate is running. Task 3.3 is complete for source regressions, while final production, native lifecycle, performance and shareable exports remain open. No final build identity or performance claim is inferred from the development visual PASS.


### Final frozen production verification and local delivery

All 43 discovered source suites, type checking, locked installation, production build and six served checks passed in `final/release-record.json`. The verified build is `S-f02umZXzcU71qc9NRDg`, snapshot `econoben-release-pGdpjA/source`, manifest `49d6cece35ac4ac9bcd11cf9f24e7b1131e5117cb39d074a87a5cc7653064f71`. The 922-file snapshot is retained. Parent `final/identity.json` records zero changes among 618 application/public/script inputs; the final source/art/tests stayed frozen through native review and recording. Planning/evidence updates and the subsequently reviewed branch-specific Vercel automatic-deployment restriction followed that freeze; application/public/script bytes remain unchanged.

`final/independent/README.md` records four native Chromium/WebKit desktop/phone full plays, the corrected376px card with11.703px side clearance at 568×320, below-fold Replay with late rotation, and exact Replay/Skip scroll/focus restoration. The selected v3 section/readiness/failure and material ownership contracts passed the source gate. Six scoped native lifecycle cases passed; a separate partial-alpha click missed its intended narrow interval, so that exact timing remains covered only by source fixtures. Final resident pointer/dive, the actual article link, navigation to Book and browser Back passed in `final/lifecycle/pond-and-navigation.json`. Native hidden-tab pause and physical-device/Safari-application behavior remain unverified.

`resource-inventory.md` records the six opening assets totaling 2,725,528 bytes, a 47,284-byte wing increase, cropped material buffers, coverage tables, caps and disposal. Serial unrecorded production runs measured powered-flight scheduling p95 of 17.5ms desktop and 16.8ms phone viewport, with no interval above 25ms after the initial rest phase. Startup long tasks were 145ms and 141ms. These are host Chromium/DPR1 desktop and DPR3 phone-viewport measurements, not physical-phone or GPU-presented-frame guarantees.

`final/share/` contains the complete current desktop 1440×90020.08s and phone 390×84420.04s MP4s, originals, encode logs and SHA-256/decoder/faststart verification. Both are H.264/yuv420p25fps with no audio. Parent `final/README.md` is the concise local delivery guide. All review browsers and the spare 3113 server are closed; the verified 3112 preview remains. No push, merge, hosted preview or deployment occurred.

`openspec validate refine-grebe-wing-proportions --strict --no-interactive` passed after the final documentation update. Archive remains deferred while publication requires Ben's approval.
