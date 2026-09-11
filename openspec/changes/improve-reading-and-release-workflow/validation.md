# Execution record

> Current status: REVISED LOCAL IMPLEMENTATION VERIFIED. The rejected interactive example is completely removed. Six retained improvement areas pass fresh validation. No deployment, Git push/merge or Vercel mutation is approved.

## Current scope and verification

Retain caching, release preparation, mobile navigation, reading/discovery, book experience, and current editorial corrections. Removed the `/memory` route, dedicated components, CSS and test, plus all homepage/book/navigation/sitemap links. The accepted grebe behavior and existing publication identity remain part of the retained site.

The removal is complete. Source searches found no stale feature imports, styles, menu entries or links. Home and book return 200 with no example sections/links, the sitemap omits it, and /memory returns the normal 404. Actual browser checks at 390px show no overflow or page errors; desktop home retains its related-article section. The previously reviewed article/tag layouts are untouched, and their served checks pass again.

The fresh local gate passed all 12 checks: 22 source regression scripts, type checks, production build (164 static routes), source preservation (843 files), exact served build identity, cache/social/reader/topic checks, 28 article fragments and 227 internal URLs. Build ID: yArr7SzfK0nbUYOdQdoRx. Manifest SHA256: 400f769f6d9c9d1c176b198596bf333d9ecb2ed1e51960b79248b321d8bf7100. Durable evidence: release-artifacts/2026-09-06-without-memory-example/release-record.json and adjacent source manifest/logs. Snapshot: /var/folders/17/b7kp7zcd0xbc4vr9sm2w848h0000gn/T/econoben-release-KI7H9L/source. The temporary verification server stopped; the local homepage remains available at http://localhost:3112/.

This selected snapshot supersedes the earlier memory-example build below. Only execution documents changed after verification; application files still match. No push, commit, merge or deployment occurred. Existing GitHub/Vercel reconciliation remains held for approval. The rest of this document preserves the earlier implementation as historical evidence.

## Original authorization (historical)

September 6, 2026: User approved every recommendation in the preceding seven-area review and explicitly withheld deployment approval. This supersedes previous deployment authorization. Local worktree baseline is `8b8c4485`, production application remains `608f879b`. Existing generated dirty files are preserved. No new deployment, Git push/merge, or remote Vercel mutation is authorized in this implementation phase. Existing issues #81 and #82 track the defects addressed here; #80 remains separate dependency work.

## Historical implementation before the scope revision

- Mobile header exposes Writing, Book, Search and Menu; all eleven menu destinations remain available. Actual React tests and phone browser checks verify Escape/focus restoration, outside-click and route closure.
- Canonical topics merge only conservative aliases; LLM/LLMs each find seven posts, Agents/AI Agents four, and Career Journeys/Career two. Related suggestions use parsed references or shared topics and describe the connection honestly. Authored article bodies remain unchanged.
- Audio appears once near reading time, without autoplay. Long articles use the same heading transformation for rendered IDs and section links. The TTS article has fourteen sections; the private-LLM article has sixteen; short posts have no empty index/player. Clicked sections appear about 148px below the viewport top, clear of the fixed header.
- Book keeps the exact cover, ten chapters, three live chapters and Chapter 4 next. Chapters 1–3 point to verified O’Reilly destinations. Feedback drafts identify the chapter. Signup and success text truthfully include occasional writing/talk updates; browser submission was intercepted locally, with no real subscriber request.
- Current Home/About customer classification and recurring-topic summaries corrected. Contact and chapter feedback use the existing About address, `benjaminlabaschin@gmail.com`, through one shared setting; the optional user question has not received a different choice. RSS contact fields use the same setting.
- `/memory` demonstrates a timed-out purchase, a first proposed retry, retrieved incident and three simulated vendor outcomes. The prior incident never establishes the current charge by itself. All outcomes, backtracking, reset, focus and reduced-motion behavior are tested. No model/payment calls run. A quiet homepage illustration and secondary book link introduce it.
- Release preparation uses verified Node 22.23.2, installs the exact lockfile, snapshots source and preserves its hashes through the build. Mutable responses revalidate, and framework fingerprinted assets retain immutable caching. Generated output is removed from the Git index only: 329 entries, with all 181 preexisting local files preserved (148 were already absent). The accepted old local server remains untouched.

## Historical independent review and corrections

- Release agent reviewed root navigation/demo/contact. Root added missing RSS central contact and removed its conflicting route-level cache header.
- Phone demo advancement initially left the new explanation above the viewport. A regression failed first; stage changes now focus and scroll to the explanation, without scrolling on initial render or outcome selection. Controls sit alongside the decision. A 320px min-content overflow was found visually and corrected.
- Root reviewed reading changes. New font shorthands gained robust fallbacks; guarded route decoding protects application code from malformed percent signs. Valid spaced and alias URLs are verified.
- Reading agent reviewed the book slice and found no remaining actionable defects.
- Book agent found that an occupied local port could let release checks certify an older server. Reproduced independently, fixed, and re-reviewed: port checks, owned-child readiness, bounded requests and exact build-manifest identity now prevent that failure. Six focused release-safety tests pass.
- Book agent re-reviewed the revised demo focus flow and confirmed the visibility issue is resolved. All identified must-fix findings are addressed.
- Final semantic review corrected the diagram's unavailable-lookup state: it now uses a rust question mark and “Lookup unavailable,” with only the retrieved incident marked known. The new UI assertion failed before the fix and passes afterward; the final build includes this correction.

## Historical visual evidence

Local preview is `http://localhost:3112/`, with isolated `.next-review` output. Home, navigation, book, tags, long/short/audio articles and demo were reviewed on desktop 1440px and phones 390/320px. Actual code/API, keyboard, audio play/pause and mocked signup behavior were checked; no page errors were observed. The demo's reduced-motion paths have no animation. Browser cache was disabled for final CSS inspection because previously cached development styles could mask edits.

Root screenshots: `/Users/blabaschin/.codex/visualizations/2026/09/05/01a0732f-8805-7692-a91a-e5cc1ba15962/reading-round-three/` (`home-desktop.png`, `home-memory-example.png`, `mobile-menu.png`, `memory-desktop.png`, `memory-mobile.png`). Book screenshots: `/tmp/book-experience-*.png`. Reading fallback screenshot: `/tmp/reading-index-font-fallback.png`.

## Scope and residuals

- Production and remote branches/settings are unchanged; reconciliation and deployment remain explicitly held. The dashboard still has the older framework/install preset until approval permits changing it.
- Previously cached year-fresh browser responses cannot be recalled by new headers; a prior visitor may need a cache-bypassing reload once. Future editable responses revalidate. Production headers require a post-deployment check before closing #81.
- A nonexistent malformed-percent tag URL (`/tags/50%25`) can fail in Next's route matcher before application code; valid published tags and aliases work. This framework issue is outside the reading change; no valid route depends on it.
- The existing dependency-maintenance issue #80 and absent functioning ESLint installation remain separate. Validation reports only checks actually run. No full cross-browser/accessibility certification is claimed.

## Historical full local gate — superseded

**Passed for the original seven-area implementation; superseded after the user rejected the demonstration.** This snapshot includes the rejected feature and is not eligible for the current review or deployment. Historical retained snapshot: `/var/folders/17/b7kp7zcd0xbc4vr9sm2w848h0000gn/T/econoben-release-pTftj0/source`. Full logs, source manifest and release record are also copied to local ignored `release-artifacts/2026-09-06-reading-round/` for durable review. Manifest SHA256: `40d53b9c2dc2eb475df64e134784eb0b53bb82a13b95100ac7cb58ce8e1a6023`; build ID: `4g8_xrFqcG-_VqOgGPSal`. Node 22.23.2, npm 10.9.8.

- All 23 source regression scripts pass, including six release-safety cases and actual navigation/demo/book interactions.
- Type generation and TypeScript pass; production build generates 165 static routes.
- All 849 snapshot source files survive install/build byte-for-byte. The served build identifier and manifest match the prepared snapshot.
- Served article/RSS/media/social/icon caching and conditional requests pass; hashed framework assets retain immutable caching.
- Social identity, article delivery and five served topic alias/count/canonical fixtures pass. Prose-page client JavaScript is 520,464 bytes, below the existing 750,000-byte bound.
- All 28 in-page fragments across 19 articles resolve; the internal-link crawl passes across 228 URLs.
- Final whitespace checks and strict OpenSpec validation pass. Independent review is complete; no unresolved must-fix finding remains.

The first cache fixture incorrectly assumed Node `fetch` would preserve a raw conditional request; it adds `Cache-Control: no-cache` with `If-None-Match`, which legitimately produces a fresh 200 response. A bounded raw HTTP conditional request verifies the expected 304 correctly. The final gate was rerun cleanly after this test correction and the diagram fix, so the selected manifest/record includes every final application change. Earlier runs are superseded; only their source/evidence remains, with temporary dependencies/build output removed after owned-process checks.

At that historical checkpoint, the temporary gate server stopped cleanly and the independent preview at `http://localhost:3112/` was running with `/memory` opened for review. No commits, pushes, merges, external signup submissions, Vercel changes or deployments occurred during this round. Production checks and main/settings reconciliation remain approval-gated in `docs/releasing.md`; issues #81/#82 are not closed based on local-only results. The subsequent removal changes the application, so this historical gate no longer certifies the current source. Revised verification and review results will be appended after the root agent completes them.
