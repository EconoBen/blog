# Arrival review

## Coverage inventory

- First home visit shows a large resting grebe, waking eye/head, irregular shake, continuous wingbeats and vertical lift. Inspect desktop and phone frames at 400, 1600, 2400, 3150 and 3550ms, then real playback.
- Pond has natural vegetation and reflected water; splash begins at contact, keeps expanding after takeoff. Inspect launch and post-launch frames, alpha edges and horizon.
- One feather drifts visibly, touches water and produces a small ripple. Inspect 5200, 6100, 6700ms and uninterrupted playback.
- Left-to-right flight reveals the actual site, then one bird arcs into the resident pond. Inspect 7800, 9000, 9800, 10100ms and resident alignment.
- Skip and Escape immediately reveal a usable page; Tab stays on Skip, focus/scroll restore, replay works. Exercise real keyboard/clicks plus actual React integration suite.
- Replay from a scrolled homepage ends at the original reading position. Phone camera exposes the actual landing target and returns home without a final jump.
- Reduced motion, repeated visits, deep links, Back/Forward, missing/slow assets and hidden tabs never trap the visitor. Use lifecycle fixtures and browser checks for reduced motion, reload, missing assets and route history.
- Existing pond remains interactive after landing; roaming resumes immediately with the prior timing and at most two visitors. Verify real click discovery after arrival, source lifecycle and scheduler tests.
- No horizontal overflow or clipped controls at 320, 390 and 1440px. Inspect screenshots and geometry; landing target visible during contact.
- New art/controller is homepage-only; prose route delivery remains within existing gate. Test source/build/served checks in a fresh local release snapshot.

## Evidence

Complete locally on September 9, 2026. Preview is http://localhost:3112/ and runs the verified production build locally. No publishing is authorized.

The final Node 22.23.2 preparation passed all 25 source regression scripts, TypeScript, production build, byte-preservation, build-identity and six served checks. Internal links passed across 227 routes; 28 in-page links passed across 19 articles. The build generated 164 static pages.

- Source manifest `a21fead8dc9ad920f0dfa0c1867f39b4e8c316f4f5019b0b4c1d0e8c2f87efdf`.
- Build identifier `Vz_XH998flmL8BjLfuEfV`.
- Retained snapshot `/var/folders/17/b7kp7zcd0xbc4vr9sm2w848h0000gn/T/econoben-release-04B6Oq/source`.
- Evidence copied to `release-artifacts/2026-09-09-grebe-arrival/`, including the release record, exact source manifest, per-check logs, browser review and representative frames.
- Final complete recordings are `video/desktop-opening.webm` and `video/phone-opening.webm` within that evidence directory. Both were captured from the identified production build, without development chrome.

Chromium playback at 1440×900 and 390×844 completed with zero page errors, no horizontal overflow, restored scroll/inert state and exactly one immediate swimmer. Reviewed wake, eye opening, shake droplets, takeoff, water exit, feather, contact ripple, crossing, landing and return frames. A 320×568 phone has a fully visible 44px Skip target. Intentional wing movement outside the viewport is clipped by the animation layer rather than changing the document width.

Native browser interactions verified Tab containment, Escape, touch Skip, replay focus restoration, the existing article-discovery dive after arrival, no repeat after reload, and reduced motion both initially and mid-playback. Missing artwork fails open; deep links load directly; without JavaScript, the server-rendered writing remains available and the writing link navigates normally. Actual React lifecycle tests additionally cover storage denial, hidden elapsed time, preload/decode deadlines, StrictMode and cleanup.

Independent adversarial review reproduced and fixed lost replay focus, hash navigation scroll restoration, and late phone rotation leaving the landing outside the viewport. Rotation now adjusts the camera continuously and places the waterline at approximately 226px in a 390px-high landscape view. A separate choreography review caught the final wingbeat switching abruptly when the body became upright; the regression evaluates actual rendered wing-corner movement. No Must Address findings remain.

The last visual pass corrected an older universal mobile width cap, opaque image-background trials, clipped wing edges, the global waterline during takeoff and an overly long body crossfade on return. All shipped sprites retain real alpha. The three new WebPs total 781,062 bytes; the pond reuses existing artwork. Visible, cached and temporary canvas buffers are each capped at four million pixels and explicitly released.

WebKit is not installed in this environment, so this is desktop/mobile Chromium review rather than Safari or physical-iPhone signoff. No sound was added. No environment files or credentials were copied into the review snapshot. No Git push, hosted preview, Vercel mutation or deployment occurred. Read-only Vercel inspection reconfirmed the existing Ready deployment `dpl_69RwYg9oEMF5i6Bru4mjwykJHcjo` at the production domain.

Application source is unchanged since the final preparation. This completion record and task status were updated afterward as documentation only. Earlier preparation records remain historical; this build is the selected arrival review candidate. OpenSpec remains unarchived while the local work awaits Ben’s review.

## September 10 completion audit

An independent review recomputed the manifest hash and verified all 865 retained snapshot files and all 590 current application, asset, test and configuration files. Application source still matches the selected build; subsequent changes are completion documentation only. Five arrival/controller/choreography/field/scheduler verification suites passed again under Node 22.23.2.

| Requested behavior | Completion evidence |
| --- | --- |
| A giant grebe appears on first arrival and wakes | Desktop/phone opening frames show the large resting bird and opening eye; session eligibility is covered by controller tests. |
| It shakes off water and launches vertically | Reviewed shake and launch frames show droplets, continuous articulated wings, vertical lift and expanding water disturbance. |
| A feather falls into the pond and makes a light ripple | Reviewed feather/contact frames and the timeline place feather contact before the quiet ripple beat. |
| It swoops left to right to reveal the real website | Crossing frames and the reveal mask show the actual homepage beneath the opening. |
| It lands in the existing pond | Desktop/phone landing frames and measured contact tests verify the handoff to the resident bird, including late rotation. |
| Visitors can continue using the site | Lifecycle and browser evidence covers Skip/Escape, focus restoration, reduced motion, asset failure, navigation, no JavaScript and the retained pond interaction. |

The previous local server had stopped. The verified production snapshot was restarted in the detached tmux session `econoben-arrival-preview` at http://localhost:3112/. A fresh served-identity check returned build `Vz_XH998flmL8BjLfuEfV`, matching the retained release record.

A new uninterrupted desktop browser run observed every phase in order: wake, shake, launch, feather, ripple, swoop, land and settle. It finished with no page errors, overlay, inert page or horizontal overflow and restored the original scroll position. Two swimmers were present when inspected after completion, within the established two-slot limit. Replay followed by Escape restored focus to Replay opening, and reloading did not repeat the opening automatically. This audit found no unmet implementation requirement. Deployment remains held for explicit approval.
