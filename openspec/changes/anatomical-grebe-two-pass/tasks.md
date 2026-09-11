> Status — DEPLOYED WITH APPROVAL, September 10, 2026. The reviewed site, including subsequent wing refinements, is live at https://econoben.dev from commit `e221eab7878402d012c3a4ff930bbecf318ad07b` through Vercel deployment `dpl_HopkTX98TsxzzYAAGa2kXcoqc9iS`. Local and live release checks pass; see `docs/releasing.md` for final evidence and retained limitations. Earlier local-only delivery notes below are historical. Merge into `main` and OpenSpec archive remain deferred until branch reconciliation.

## 1. Scope and baseline

- [x] 1.1 Read Ben's complete goal, local instructions, existing film source/design/QA, book data and release workflow; define the new requirements without modifying historical records.
- [x] 1.2 Verify the preserved baseline on port 3112. Build `bbTrs4g9kljfX6-Ec1gvs` serves its retained snapshot's build manifest byte for byte; record its source identity in the QA inventory.
- [x] 1.3 Inspect authentic Cornell, Flickr, Tinsley and Audubon references and record their observations and limits in `release-artifacts/2026-09-10-two-pass/reference-research.md`. Compare the current study against them at the visual gate in 2.4; the references do not establish measured joint coordinates or wingbeat frequency.

## 2. Isolated anatomy gate

- [x] 2.1 Create the local isolated study at `/pond-studies/flight`, with Play/Pause/scrubbing over unfolding and multiple complete cycles. It uses candidate `AnatomicalBird` and paired wing art without an entry in public navigation/sitemap. A failing-first child-route test now verifies its Vercel-production 404 guard. Motion acceptance is recorded separately in 2.4.
- [x] 2.2 Implement and test connected near/far articulation, unfolding/recovery and coordinated body response. The accepted moderate neck lean replaces the collapsing row translations; `verify-flight-body.mjs` checks transverse width, recognizable bill proportions, shared subtle stroke response and 3,465 occupied mesh triangles with minimum area ratio 0.720. Meaningful failing regressions preceded the fixes; focused rig/body checks pass.
- [x] 2.3 Inspect the paired wing plate and retain original PNG, exact prompt, encoded asset hashes/alpha and native-composition evidence in `release-artifacts/2026-09-10-two-pass/artwork/`. Verify native feather masks, exact interior ink, five cached view textures and failure-safe disposal; full renderer readiness/resources remain in section 4.
- [x] 2.4 Pass independent isolated review before main integration. `anatomy-critique/final-review.md` records two normal-speed plays each at 1440×900 and 390×844, adjacent/staged unfolding plus two full 420 ms cycles, zero application errors and identical before/after hashes for all 13 source/art inputs. The neck and phone clipping findings were resolved; compact engraving motion and brief edge-on wing profiles remain artistic limits.

## 3. Book presentation and shared choreography

- [x] 3.1 In parallel with the anatomy study, test and implement pure `ArrivalBookFeature` using canonical title/author/publisher/release label/cover and a chapter-status-derived update. The focused regression covers changed live statuses, empty/singular/noncontiguous cases, parent-owned pose and no temporary controls.
- [x] 3.2 Inspect book composition at desktop, 390/320 px portrait and short landscape. Historical book-only recordings and geometry in `release-artifacts/2026-09-10-two-pass/book-review/` establish readable cover/update, stable hold, no overflow or temporary controls and usable return to the existing site. The later `integrated-review/README.md` independently confirms composition with the accepted anatomy.
- [x] 3.3 Independently construct and test shared two-pass timeline/pure poses while the anatomy study continues. The implemented 17.6-second clock, 3.3-second stationary hold and continuous second-pass/bank tangent pass focused checks. Initial book evidence used the previous renderer; subsequent integration followed the independent anatomy gate.
- [x] 3.4 Integrate the accepted `AnatomicalBird` through the `ArrivalBird` compatibility export, using one persistent actor and shared reflection. The two passes deliver and remove the same book instance. Focused renderer tests cover preparation reuse, hidden intervals without drawing, reflection reuse and cleanup; integrated review confirms one coherent character.
- [x] 3.5 Keep the pond opaque through the 10000–13300 ms hold, then remove the book and reveal the actual site with the second passage. Independent four-viewport review confirms distinct left-to-right paths, separation of cover/beak/feet/wings and continuous bank/descent. Pure boundary/tangent regressions pass.
- [x] 3.6 Preserve single-resident contact, waterline and visible invitation through normal completion at 1440×900, 390×844, 320×568 and 844×390. The independent follow-up accepts the resting single-image minification fix and bracketing handoff frames; a slight final-fold detail change remains minor. Late rotation and replay-below-fold interruption are retained in the final lifecycle/served checklist rather than inferred from normal completion.

## 4. Lifecycle and bounded work

- [x] 4.1 Use the exact anatomical registry and actual cover in readiness, with renderer `onError` routed to Skip. Production `fallbacks.json` verifies missing, malformed, decode-rejected and delayed wing/cover resources recover without dialog/book/canvas or locks; all 11 cases have no application errors. Native pre-hydration Skip with denied storage also prevents late scripts from starting the film.
- [x] 4.2 Verify lifecycle ownership through focused source cases and production-native interruption checks. `production-review/lifecycle/results.json` records first-pass Skip, hold Escape, removal Skip, bank Skip, hold resize, hold reduced-motion change and hold navigation. `source-lifecycle-coverage.md` maps exact cases for replay/focus/scroll, unmount, timers/listeners and hidden-time preservation. Actual tab switching did not produce `document.hidden` in this runtime, so native pause remains unverified; source-clock evidence is explicitly distinguished and no synthetic native pass is claimed.
- [x] 4.3 Verify native preparation, no-JavaScript/blocked-bundle access, session reload/Back, direct hash and storage-denied early Skip. Production `fallbacks.json` and `native-preparation-history.json` confirm readable unlocked content, no dead Replay before hydration, reduced-motion bypass and no unsolicited late start. Source tests cover blocked-storage session fallback and manual replay respecting reduced motion.
- [x] 4.4 Preserve the original two-slot scheduler, first swimmer and peeker. Current source checks verify unchanged styles/delays, one scheduler and repeated-visit density; native completion/interruption resumes ordinary motion. Final independent browser review includes the resident pointer/dive/article interaction; see the QA inventory for exact evidence scope.
- [x] 4.5 Record resource ownership and fresh production performance. Six readiness assets total 2,678,244 encoded bytes; native maxima are 1,998,630 desktop and 1,199,968 phone-viewport Canvas pixels, below the two-million cap. Current tests verify one preparation, five cached wing materials, shared reflection, hidden-work guards and disposal. Unrecorded phase medians are 8.3 ms, desktop launch p95 16.7 ms and all other p95 values at most 9.3 ms. The measured initial 128/126 ms long tasks are retained as startup limits; no zero-stutter or physical-phone claim is made.

## 5. Independent visual review and local delivery

- [x] 5.1 Record normal-speed full playback and native adjacent/staged frames at 1440×900, 390×844, 320×568 and 844×390 in `integrated-review/`. All four runs have zero application errors and finish on the visible article action with scrolling restored. Source records identify 18 inputs and the sole during-review hydration-only replay change; a separate source-paired handoff follow-up covers the later rendering fix.
- [x] 5.2 Obtain independent integrated artistic approval in `integrated-review/README.md`, including the subsequent handoff follow-up. Remaining minor limits are brief bird/Skip overlap at 320 px and a small detail change as the last wing fold reaches single-image resting sampling. Final production smoke is a separate open gate, not implied by development review.
- [x] 5.3 Freeze and verify the complete source. `release-record.json` records all 39 source regressions, whole-source types, locked install, production build, preservation of 910 files and served identity/cache/social/reader/topic/fragment/link checks. Build `QsI2QzDIQ1r87XsztmOSc` uses source manifest `bb9cb299a1fa46e8aa5c98eb28900b8de26985dba6b75bc32c5b7208eb4d1be7` from retained snapshot `econoben-release-1Wilcd/source`. The initial obsolete old-wing assertion was migrated to the actual shared rig before this successful gate. Rollback metadata is retained; no publishing occurred.
- [x] 5.4 Serve the verified snapshot at port 3112 with matching manifest bytes. Final independent Chromium desktop/phone and WebKit phone/short-landscape runs pass, as do native below-fold replay, late bank rotation, full finish and subsequent Replay/Skip restoring scroll/focus. The first WebKit landscape 21-second wait expired before a successful state read; its recording is retained and a fresh repeat passed. Final fallback/reduced-motion checks pass. The baseline snapshot remains retained, spare development 3113 is stopped and all reviewer browsers are closed.
- [x] 5.5 Complete the QA inventory with exact source/build identity, current source/native evidence, timing, artwork provenance and candid limits. Strict OpenSpec validation passes. Document 128/126 ms startup tasks, minor last-fold/320 px Skip overlap, local analytics console noise and the unverified native visibility transition. This documentation-only update postdates the frozen application snapshot.
- [x] 5.6 Deliver the verified preview at localhost:3112 with Replay opening and the concise guide in `release-artifacts/2026-09-10-two-pass/REVIEW.md`, including current desktop/phone recordings. The final response links the preview and explains changes, validation and limits. Git push/merge, hosted preview, remote settings and deployment remain subject to separate explicit approval.

## Validation commands

Use the verified Node 22 runtime, presently `/Users/blabaschin/.local/share/mise/installs/node/22.14.0/bin`, ahead of the host runtime in the command environment. `npm test` discovers current `verify-*.mjs` source regressions; update focused checks where contracts changed instead of adding brittle source-string assertions.

```sh
node scripts/verify-arrival-wings.mjs
node scripts/verify-arrival-rig.mjs
node scripts/verify-arrival-artwork.mjs
node scripts/verify-arrival-choreography.mjs
node scripts/verify-arrival-rendering.mjs
node scripts/verify-arrival-preparation.mjs
node scripts/verify-arrival-book-feature.mjs
node scripts/verify-flight-artwork.mjs
node scripts/verify-flight-rig.mjs
node scripts/verify-flight-body.mjs
node scripts/verify-flight-rendering.mjs
node scripts/verify-flight-preparation.mjs
node scripts/verify-grebe-arrival.mjs
node scripts/verify-grebe-arrival-integration.mjs
node scripts/verify-grebe-field-lifecycle.mjs
npm test
npm run typecheck
npm run release:prepare -- --rollback-url https://blog-f15m2kk7r-bens-projects-0b44e0e4.vercel.app --rollback-source 608f879b1fe3b6376eb3e9e094f0b39b7e5524e4
openspec validate anatomical-grebe-two-pass --strict --no-interactive
```

The rollback pair above was reconfirmed read-only on September 10; reconfirm it before final preparation if production has changed. `release:prepare` runs locked installation, source tests, types, isolated production build, source preservation, served build identity and served cache/social/reader/topic/fragment/link checks; it does not deploy. Run it only after coordinated source freeze. The final gate includes the checks above, so avoid repeating a full build without a new change or failed check. The final 39-script gate and all served checks passed. Retained logs are in `release-artifacts/2026-09-10-two-pass/production-review/`; this final documentation update is deliberately later than the frozen application snapshot.
