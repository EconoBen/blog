## 1. Content Continuity Guardrails

- [x] 0.1 Establish the execution model: non-`main` branches only, worktrees for parallel slices, PRs for every slice, and no merges before explicit review
- [ ] 1.1 Inventory canonical content sources and public site surfaces without building a formal parity chart
- [ ] 1.2 Add lightweight checks so posts, slugs, metadata, and feature-backed content cannot disappear silently
- [ ] 1.3 Record the wording-freeze-by-default rule for existing pages and content
- [ ] 1.4 Decide how experimental surfaces like `/book` coexist with the baseline content while redesign proceeds

## 2. Shared Site Foundation

- [ ] 2.1 Build the shared site shell and navigation direction without dropping existing destinations
- [ ] 2.2 Reconcile root layout, metadata defaults, dark mode, sidebar/mobile behavior, and search/nav access with the baseline site
- [ ] 2.3 Ensure redesigned pages do not orphan legacy routes, posts, or feature surfaces

## 3. Core Route Modernization

- [ ] 3.1 Redesign `/` and `/posts` while preserving existing content, links, and wording by default
- [ ] 3.2 Redesign `/posts/[slug]` while preserving markdown rendering, tag links, metadata, and audio behavior
- [ ] 3.3 Redesign `/archive` and `/archives/[month]` without losing grouping, sorting, or linking behavior
- [ ] 3.4 Redesign `/tags` and `/tags/[tag]` without losing tag counts or navigation behavior
- [ ] 3.5 Redesign `/search` without losing query handling or result coverage

## 4. Structured Content Modernization

- [ ] 4.1 Redesign `/talks` while preserving current items, links, and interaction expectations
- [ ] 4.2 Redesign `/publications` while preserving current items, wording by default, and action links
- [ ] 4.3 Redesign `/about` while preserving current content until deliberate copy changes are approved
- [ ] 4.4 Redesign `/code-ai` and `/code-ai/[id]` while preserving categories, search, views, gist-backed content, and code rendering

## 5. Feature and Output Continuity

- [ ] 5.1 Verify `/rss.xml`, `/sitemap.xml`, `/robots.txt`, and metadata outputs still reflect the full site content
- [ ] 5.2 Verify search, sidebar, TTS, and related route handlers still support the redesigned site correctly
- [ ] 5.3 Close any tooling or validation gaps that would let content loss slip through unnoticed

## 6. Review and Refinement

- [ ] 6.1 Review redesigned pages on desktop and mobile with targeted evidence for changed surfaces
- [ ] 6.2 Confirm that no posts, routes, or feature surfaces were lost during the redesign
- [ ] 6.3 Queue the next round of copy, book, newsletter, and aesthetic refinements after continuity review

## 7. End-State Polish

- [ ] 7.1 Create an integrated preview branch that stacks the active redesign slices without merging into `main`
- [ ] 7.2 Refine the shared shell, global styles, and homepage toward the intended end-state visual system
- [ ] 7.3 Refine the language and narrative positioning across the homepage and key top-level pages
- [ ] 7.4 Refine posts, discovery routes, and code/tools subpages so they feel consistent with the final-direction theme
- [ ] 7.5 Capture the Stitch multi-page design brief and outputs as a refinement input, using the desktop/web screens as the implementation reference
- [ ] 7.6 Apply the Stitch desktop direction to the shared shell, homepage, and core top-level routes without dropping continuity guarantees
- [ ] 7.7 Normalize search, archive, tags, and code/tools into a more unified discovery family based on the Stitch desktop patterns
- [ ] 7.8 Review the generated book, publications, talks, and about patterns for what should be adopted, what should be rejected, and what must remain tied to real site behavior

## 8. Combined Preview Refinement

- [ ] 8.1 Use the stacked end-state preview branch to identify the remaining visual and narrative gaps before another polish wave
- [ ] 8.2 Refine `/about`, `/book`, `/publications`, and `/talks` so they read as finished editorial destinations rather than transitional grids or placeholder shells
- [ ] 8.3 Refine `/posts`, `/posts/[slug]`, `/archive`, `/archives/[month]`, `/tags`, `/tags/[tag]`, and `/search` to reduce density and improve hierarchy where the combined preview still feels list-heavy
- [ ] 8.4 Reconcile `/code-ai` and `/code-ai/[id]` with the shared editorial shell so they no longer feel like a separate site while preserving their browsing affordances
- [ ] 8.5 Publish another integrated preview branch and local review server after the next polish wave so the whole system can be judged together again

## 9. Practical Refinement Pass

- [ ] 9.1 Replace self-conscious labels and brag metrics with direct, practical navigation language across shared surfaces and posts
- [ ] 9.2 Rebuild `/talks` around embedded watch/listen utility, remove venue summary stripes and "latest appearance" framing, and keep the page easy to browse
- [ ] 9.3 Rework `/publications` to remove empty metric holes and summary filler, using content-driven layout and plain labels instead
- [ ] 9.4 Restore `/about` as a useful CV page first, while still supporting the broader public-work narrative
- [ ] 9.5 Add an explicit `Home` destination to the editorial shell and run another integrated preview after the practical pass

## 10. Stitch HTML Parity Pass

- [ ] 10.1 Capture the pasted Stitch desktop HTML export as the active implementation reference for the redesign route family
- [ ] 10.2 Update the shared shell, home page, and global tokens to match the exported Stitch desktop HTML more literally
- [ ] 10.3 Update `/posts`, `/posts/[slug]`, `/search`, `/tags`, `/archive`, and `/archives/[month]` to the exported Stitch desktop hierarchy while preserving real site content and behaviors
- [ ] 10.4 Update `/talks`, `/publications`, and `/about` to the exported Stitch desktop structure where it helps, while keeping the practical-language constraints from review
- [ ] 10.5 Update `/code-ai`, `/code-ai/[id]`, and `/book` to the exported Stitch desktop structure where it helps, without adopting invented sample copy or fake metadata
- [ ] 10.6 Publish a new integrated preview branch and local review server specifically for the Stitch HTML parity pass

## 11. Literal Stitch TSX Translation Pass

- [x] 11.1 Convert the pasted Stitch desktop HTML shell into actual shared Next.js TSX layout/components so the exported chrome can be reviewed directly
- [x] 11.2 Convert the pasted Stitch desktop route family for `/`, `/posts`, `/posts/[slug]`, `/talks`, `/publications`, `/about`, `/search`, `/tags`, `/archive`, `/archives/[month]`, `/code-ai`, `/code-ai/[id]`, and `/book` into actual TSX page implementations on the preview branch
- [x] 11.3 Keep the literal translation pass isolated as a preview artifact by clearly separating exported sample content from real production content decisions
- [x] 11.4 Update Beads and branch structure so the literal translation pass can be executed and reviewed independently of the continuity-safe integration work
- [x] 11.5 Publish a fresh local review server from the literal-translation preview so the exported desktop layouts can be judged inside the app

Post-completion note (March 22, 2026): the first “published server” state was not visually reviewable. Follow-up implementation work on `feat/site-stitch-html-preview` had to restore the actual preview by:
- adding `@import "tailwindcss";` to `app/globals.css` so Tailwind utility classes compiled into the rendered app CSS
- overriding the legacy `body.shell-editorial` dark shell background so the literal Stitch pages were not rendered as dark text on a dark surface
- rechecking `/`, `/posts`, `/talks`, `/code-ai`, and `/book` in-browser on `http://localhost:3007` after the CSS fixes

## 12. Parallel Stitch Integration Pass

- [ ] 12.1 Treat `feat/site-practical-review-preview` as the integration base branch, keep `feat/site-stitch-html-preview` as the design-reference branch, and do not merge either branch into `main`
- [ ] 12.2 Launch a shared-shell slice in its own worktree/PR to carry the accepted Stitch shell, global tokens, and homepage direction into the real site implementation
- [ ] 12.3 Launch a reading-routes slice in its own worktree/PR to integrate the accepted Stitch direction into `/posts` and `/posts/[slug]` using real site content and behaviors
- [ ] 12.4 Launch a structured-routes slice in its own worktree/PR to integrate the accepted Stitch direction into `/talks`, `/publications`, and `/about` while preserving practical-language and real-data constraints
- [ ] 12.5 Launch a discovery-and-tools slice in its own worktree/PR to integrate the accepted Stitch direction into `/archive`, `/archives/[month]`, `/tags`, `/tags/[tag]`, `/search`, `/code-ai`, `/code-ai/[id]`, and `/book`
- [ ] 12.6 Use as many background agents as practical, but keep every worker on a disjoint write set so parallel work does not collide
- [ ] 12.7 Open draft PRs for every slice and hold all merges until a human review approves the combined direction

Progress note (March 22, 2026): the discovery half of 12.5 is now active on `feat/site-stitch-polish-discovery`, branched from `feat/site-stitch-review-stack` in its own worktree and reviewed locally on `http://127.0.0.1:3017`.
- Tracking was split into Beads `blog-d6l`, `blog-6mk`, and `blog-txg`, with GitHub issues `#47`, `#48`, and `#49`.
- Two background workers were used with disjoint write sets:
  - archive/month ownership: `app/archive/page.tsx`, `app/archives/[month]/page.tsx`
  - search/tags ownership: `app/search/page.tsx`, `app/tags/page.tsx`, `app/tags/[tag]/page.tsx`
- The implemented polish pass flattened the archive family into a more practical ledger, simplified the month page away from “featured” framing, replaced the tag index’s brag cards with quieter discovery sections, simplified the tag detail sidebar, and unified the search page with calmer grouped results and route-side navigation.
- `npm run build` passed on the branch after the combined pass. A local Playwright sweep on desktop and mobile rechecked `/archive`, `/archives/2026-01`, `/tags`, `/tags/AI`, and `/search?q=memory`.
- Dev-server note: running `npm run build` in the same worktree can still corrupt the live Next dev state, so the local review server needed a restart on `3017` after the build before browser validation stabilized again.
- Remaining scope before 12.5 can close: `/code-ai`, `/code-ai/[id]`, `/book`, plus the discovery slice draft PR.

Production-review note (March 23, 2026): the `next dev` server on `3017` was not stable enough to serve as a trustworthy review surface. Runtime chunk errors repeatedly appeared around `ClientLayout`, page CSS delivery, and hot-reload state, even after spot checks looked healthy. The review baseline is now a production preview (`npm run build` + `npm run start`) on `http://127.0.0.1:3017`.
- A production-mode Playwright sweep across the main route set (`/`, `/posts`, `/posts/[slug]`, `/archive`, `/archives/[month]`, `/tags`, `/tags/[tag]`, `/search`, `/talks`, `/publications`, `/about`, `/book`, `/code-ai`, `/code-ai/[id]`) completed without runtime overlays.
- That sweep generated the next backlog items as Beads and GitHub issues:
  - `blog-2xk` / `#54`: fix the talks page mobile collapse and simplify its desktop utility rail
  - `blog-8rm` / `#51`: fix the publications page mobile collapse and remove stale metric-heavy framing
  - `blog-gmp` / `#52`: normalize metadata and branding across about, talks, and publications
  - `blog-dz3` / `#55`: reduce mobile density in the code-and-tools route family
  - `blog-4uw` / `#53`: refine the book page hero naming and mobile hierarchy

Implementation note (March 23, 2026): the five follow-up polish items above are now implemented on `feat/site-stitch-polish-discovery`.
- `/talks`: lighter hero rail, calmer mobile counters, improved browse card spacing, and route metadata normalized to `Talks | ECONOBEN.DEV`.
- `/publications`: metric-heavy quick-access rail removed, year navigation simplified into chips, featured publication kept intact, and route metadata normalized to `Publications | ECONOBEN.DEV`.
- `/about`: metadata normalized to `About | ECONOBEN.DEV` and hero framing copy aligned with the site shell while preserving CV/contact behavior.
- `/code-ai` and `/code-ai/[id]`: mobile density reduced in hero controls, stats, and CTA stacking; route metadata now explicitly uses `Code & Tools | ECONOBEN.DEV`.
- `/book`: hero naming and mobile spacing refined; route metadata now explicitly uses `Agent Memory | Book | ECONOBEN.DEV`.
- A fresh `npm run build` passed after the route-family pass, and a second production-mode Playwright sweep on `http://127.0.0.1:3017` rechecked the main route family with no runtime overlays.

Frontend-audit note (March 23, 2026): the site is still not review-ready from a frontend polish standpoint even though the production preview is stable. A persistent Playwright tab audit across home, reading routes, discovery routes, talks/publications/about, book, and code-tools produced the next wave of Beads and GitHub issues:
- `blog-mkj` / `#57`: unify the homepage and reading-route hierarchy for `/`, `/posts`, `/posts/[slug]`, `/archive`, and `/archives/[month]`
- `blog-ylv` / `#59`: rework `/tags`, `/tags/[tag]`, and `/search` into stronger navigation surfaces
- `blog-qxn` / `#58`: tighten `/talks`, `/publications`, and `/about` hierarchy for review readiness
- `blog-t75` / `#60`: flatten `/code-ai` and `/code-ai/[id]` into a calmer editorial surface
- `blog-2kf` / `#56`: resolve the remaining `/book` hero and mobile-balance issues
- Implementation on the next wave is now active in parallel workers, using those screenshot-backed findings as the source of truth.

Second-wave progress note (March 23, 2026): the first remediation pass from that tab audit is now implemented locally.
- Reading/archive routes: `/posts`, `/posts/[slug]`, `/archive`, and `/archives/[month]` now start content sooner and carry less competing chrome. The explicit remaining gap in this family is the homepage lower-half composition, which lives in `app/components/ShellHomePage.tsx` and still needs direct work.
- Discovery routes: `/tags`, `/tags/[tag]`, and `/search` now have stronger navigation hierarchy and reduced block competition, especially on mobile.
- Structured/editorial routes: `/talks`, `/publications`, and `/about` now have tighter intro zones, less detached utility chrome, and better mobile scanability.
- Code-tools/book routes: `/code-ai`, `/code-ai/[id]`, and `/book` now front-load content sooner and read less like a dashboard/product landing mix.
- A fresh production rebuild passed after the combined second-wave edits, and updated Playwright screenshots were captured under `.playwright-discovery/tab-audit-20260323-wave2/`.
- The branch is improved, but the frontend backlog is not empty yet; `blog-mkj` in particular remains open because the homepage itself still needs a dedicated pass.

Wave-3 frontend review note (March 23, 2026): a third Playwright pass focused on the still-unsettled tabs using fresh full-page and first-viewport captures under `.playwright-discovery/tab-audit-20260323-wave3/`.
- The new findings are now tracked as narrower Beads and GitHub issues instead of broad route-family polish only:
  - `blog-2xw` / `#61`: compact the mobile shell and expose current-route state in navigation
  - `blog-01k` / `#63`: remove homepage lead-story duplication and settle the second-screen hierarchy
  - `blog-r0j` / `#65`: bring talks and publications content into the first viewport
  - `blog-vt2` / `#62`: remove dashboard chrome from the code-and-tools route family
  - `blog-5rm` / `#64`: finish tags and search review readiness
- Implementation is now splitting again into separate worktree slices branched from `feat/site-stitch-polish-discovery`:
  - `feat/site-stitch-wave3-shell-nav`
  - `feat/site-stitch-wave3-home-hierarchy`
  - `feat/site-stitch-wave3-media-first-view`
  - `feat/site-stitch-wave3-code-tools-cleanup`
  - `feat/site-stitch-wave3-discovery-finish`

Wave-3 implementation note (March 23, 2026, final production recheck): the next route-family remediation pass is now applied locally on `feat/site-stitch-polish-discovery`, verified with a fresh `npm run build`, a restarted `next start` preview on `http://127.0.0.1:3017`, and updated screenshots under `.playwright-discovery/tab-audit-20260323-wave3-final/`.
- Shared shell: active nav pills render correctly again, the current mobile route is promoted to the front of the nav ordering, and the mobile primary nav now wraps instead of clipping at 390px.
- Homepage: lead-story duplication remains fixed, second-screen card density is tighter, and the mobile entry spacing is calmer than the previous wave-3 state.
- Talks/publications: the redundant lower talks intro is gone, the featured media block is tighter, and publications now lead directly with the featured artifact plus year-jump rail instead of a second intro band.
- Discovery: `/search` is flatter and less dashboard-like, while `/tags/[tag]` now exposes route actions and summary cues near the top on mobile instead of assuming a desktop sidebar.
- Code & Tools: the hero is calmer than the earlier wave-3 pass, but this family is still not settled enough to call done.
- Deep-review note: full-page desktop captures under `.playwright-discovery/deep-review-20260323/` confirm that the remaining unresolved work is not limited to wave-3 routes. `/posts` still has readability/hierarchy debt in the reading-family layout, and `/code-ai` still needs another desktop composition pass.

Wave-4 talks/publications note (March 23, 2026): a focused first-viewport hierarchy pass landed on the two review-heavy editorial routes.
- `/talks` now exposes a real page-level `H1` and a compact intro rail before the featured recording, which makes the page read as a deliberate editorial archive instead of a card stack with no lead-in.
- `/publications` now exposes a real page-level `H1` and a compact archive summary block before the featured publication, which tightens the first fold without rewriting the publication content itself.
- Verified in production mode on `http://127.0.0.1:3017` with desktop/mobile Playwright screenshots under `.playwright-discovery/talks-publications-verify/`.

Wave-4 production audit note (March 23, 2026, route-by-route rebuild): the production review surface had to be stabilized again before another frontend wave could be trusted. The recurring `/_document` build failure was resolved by removing a stale duplicate `src/app` scaffold from the worktree, then rebuilding from a fresh `.next` output. After that cleanup, `npm run build` passed, `next start` was restarted on `http://127.0.0.1:3017`, and a new desktop/mobile Playwright sweep across all major tabs was captured under `.playwright-discovery/tab-audit-20260323-wave4/`.
- Runtime state is now clean again across `/`, `/posts`, `/posts/[slug]`, `/archive`, `/archives/[month]`, `/tags`, `/tags/[tag]`, `/search`, `/talks`, `/publications`, `/about`, `/book`, `/code-ai`, and `/code-ai/[id]`.
- The audit also turned remaining frontend debt into narrower tracked work instead of generic polish:
  - `blog-mkj.1`: `/posts/[slug]` had measurable 390px horizontal overflow from long code content and was fixed in the follow-up recheck below.
  - `/code-ai` remains calmer than earlier waves but is still not review-ready on desktop because the first viewport carries too much control weight relative to the archive content.

Wave-4 production recheck note (March 23, 2026, final): after the shared-shell/mobile-nav adjustment, the post-detail containment fix, and the talks/publications/code-tools fold updates, a fresh production rebuild passed and a targeted Playwright recheck was captured under `.playwright-discovery/tab-audit-20260323-wave4-recheck/`.
- `/posts/[slug]` no longer overflows at 390px; `blog-mkj.1` is closed as implemented.
- `/talks` and `/publications` now expose page-level `H1`s in the verified DOM and enter their content with a clearer first viewport.
- `/code-ai` is stronger than it was earlier in the day, but it still needs another editorial calm-down pass before the route can be called ready.
- The mobile shell is lighter than the earlier wrapped-chip variant because the primary nav now behaves as a single horizontal strip instead of a stacked wall of pills.

Wave-5 focused calmness pass note (March 23, 2026, final): another clean `npm run build` plus `next start` recheck on `http://127.0.0.1:3017` captured a narrower screenshot set under `.playwright-discovery/tab-audit-20260323-wave5-recheck/` for `/`, `/posts`, `/archive`, `/code-ai`, and `/posts/[slug]`.
- The desktop shell is quieter than the earlier wave-4 state because inactive topbar items now render as text links instead of a full row of inactive pills; keep the shell bead open anyway until the whole-site navigation still feels settled after one more review pass.
- `/posts` is materially calmer than the earlier wave-4 state: the repeated latest-post CTA is gone, the archive note stays informational, and the year groups now read as a narrower ledger stack instead of a two-column field of mini-sections.
- `/archive` remains stable and close to done after the reading-family pass; the year rail and month sections still scan cleanly in the wave-5 recheck without reintroducing promo-card weight.
- `/code-ai` is stronger again: the featured rail is gone, the first fold reads more like an archive, and the controls sit lower, but the category/filter block is still denser than the calmer editorial routes, so the code-tools bead stays open.

Wave-6 focused composition pass note (March 23, 2026, final): one more production rebuild and focused Playwright recheck under `.playwright-discovery/tab-audit-20260323-wave6-final/` narrowed the remaining gap on the homepage and `/code-ai`.
- The homepage support rail no longer stretches the lead archive card to the height of the full right column, and the right rail now opens with a compact label row plus `All posts` link instead of explanatory filler.
- `/code-ai` no longer renders empty categories in the browse controls, which makes the first fold materially calmer without changing route behavior.
- Both routes are now much closer than they were in wave 4 or wave 5, but the associated beads stay open until one more whole-site review confirms they sit naturally beside the strongest editorial routes.

Wave-7 structured-content pass note (March 23, 2026, final): another clean production rebuild plus Playwright recheck under `.playwright-discovery/tab-audit-20260323-wave7-final/` focused on `/talks` and `/publications`.
- `/talks` now opens with less duplicated helper chrome, a softer browse rail, and grid mode as the default archive treatment, which removes much of the old card-board feel on both desktop and mobile.
- `/publications` now uses a quieter archive-map block in the hero instead of a sticky side rail, and the featured publication still leads without dominating the first fold as heavily.
- Both routes are now close; keep the structured-content beads open only for the final whole-site editorial pass.

Direct user-review correction note (March 23, 2026): the “close” assessment above was too optimistic for four tabs. Direct human review overrode it with route-specific blockers:
- `/posts` still needs a lot of work and should no longer be treated as just residual reading-family polish. Tracking: `blog-mkj.2` / `#69`.
- `/about` has lost too much detail compared with the current-site baseline and needs a substantive CV-depth restoration pass. Tracking: `blog-qxn.1` / `#67`.
- `/talks` still feels too cluttered at the top, even after the recent first-fold improvements. Tracking: `blog-r0j.1` / `#68`.
- `/code-ai` still feels rough and amateurish, so the code-tools route family remains an active blocker instead of a near-close pass. Tracking: `blog-vt2.1` / `#66`.

## 13. Direct User Review Correction Pass

- [ ] 13.1 Rebuild `/posts` into a richer editorial browse page that keeps the calmer reading-family direction but adds stronger lead framing, more useful browse affordances, and clearer differentiation from `/archive`
- [ ] 13.2 Restore `/about` as a substantive CV page by reintroducing missing baseline depth for overview, role detail, skills, publications/talks, education, and other high-signal credentials
- [ ] 13.3 Remove top-of-page clutter from `/talks` so the first viewport foregrounds the archive and featured media instead of forcing users through stacked control systems
- [ ] 13.4 Rework `/code-ai` into a deliberate editorial archive with materially less first-fold control weight and a cleaner relationship between the index and detail routes
- [ ] 13.5 Re-run production-mode Playwright review for `/posts`, `/about`, `/talks`, and `/code-ai`, then leave each route blocked until direct human review agrees the route is no longer weak

Current-review progress note (March 30, 2026): a new production-mode review pass on `http://127.0.0.1:3018` used parallel route owners, screenshot evidence, and a combined recheck under `.playwright-current-review-20260330-audit/` and `.playwright-current-review-20260330-pass2/`.
- `/about` materially advanced 13.2 by restoring missing CV depth, work history, and credential coverage; it is no longer the weakest of the four, but it still needs pacing cleanup and direct human approval.
- `/talks` materially advanced 13.3 by simplifying the first viewport and reducing detached utility chrome; it is better, but the top still feels busier than it should and the archive cards flatten out as the page runs long.
- `/code-ai` materially advanced 13.4 by bringing real entries into the first viewport and reducing the softened-dashboard feel; it is stronger, but the route still carries too much control/chip scaffolding to close yet.
- `/posts` advanced 13.1 enough to surface real content early, but it remains the weakest route by a clear margin and still needs another editorial browse pass before it can be considered close.

Posts follow-up note (March 30, 2026): a second route-local pass under `.playwright-current-review-20260330-posts-pass3/` replaced the awkward split between an underfilled featured slab and a second opening card with a denser composite opening block, then tightened the year archive into a more compact ledger. `/posts` is still open, but it is no longer failing because of giant dead space or interchangeable oversized year cards.

Posts follow-up note (April 1, 2026): another direct human-review correction pass was required because the early April `/posts` fold was still visibly bad even after a Claude worker pass. Verified desktop/mobile screenshots under `.playwright-current-review-20260401-posts-fix9/` now show the current production fold on `http://127.0.0.1:3018/posts`: the opening uses a two-row editorial layout instead of a detached three-panel system, with the intro and latest post sharing the first row and the browse cards moved into a calmer second row. An intermediate attempt briefly regressed 390px mobile collapse; that was fixed by moving the posts-grid layout into responsive CSS instead of inline desktop-only styles. This resolves the worst first-fold composition failure, but `/posts` remains open for another pass on the lower archive sections.

Posts follow-up note (April 2, 2026): another route-local refinement pass under `.playwright-current-review-20260402-posts-fix11/` addressed the remaining “plain and awkward” feel in the lead card. The latest-post surface now uses a split feature treatment with a tinted title panel and a separate detail column, which gives the fold a clearer visual center on desktop while preserving the cleaner mobile stack. `/posts` is still open, but the current blocker has moved down-page into archive rhythm and section polish rather than the top fold itself.

Per-tab frontend review matrix (March 30, 2026):

| Route | Evidence | Current status | Tracking |
| --- | --- | --- | --- |
| `/` | `.playwright-discovery/tab-audit-20260323-wave6-final/home-desktop-fold2.png`, `.playwright-discovery/tab-audit-20260323-wave6-final/home-mobile-full.png` | Improved and close. The homepage archive block no longer stretches awkwardly against the right rail, and the support column now behaves like a real reading rail instead of a promo stack. Keep it open only for one more whole-site review pass. | `blog-mkj` / `#57`, `blog-01k` / `#63`, `blog-126.33` / `#33` |
| `/posts` | `.playwright-current-review-20260330-posts-pass3/posts-desktop.png`, `.playwright-current-review-20260330-posts-pass3/posts-mobile.png`, `.playwright-current-review-20260401-posts-fix9/posts-desktop-fold1.png`, `.playwright-current-review-20260401-posts-fix9/posts-mobile-fold1.png`, `.playwright-current-review-20260402-posts-fix11/posts-desktop-fold1.png`, `.playwright-current-review-20260402-posts-fix11/posts-mobile-fold1.png` | Improved but still open. The fold no longer reads as a detached dashboard or a blank slab: the latest-post feature now has a clearer visual center, and the mobile stack still holds at 390px. The remaining work is the lower archive rhythm and clearer differentiation from `/archive`, not the first-screen composition. | `blog-mkj` / `#57`, `blog-mkj.2` / `#69` |
| `/posts/[slug]` | `.playwright-discovery/tab-audit-20260323-wave2/post-detail-desktop.png`, `.playwright-discovery/tab-audit-20260323-wave2/post-detail-mobile.png`, `.playwright-discovery/tab-audit-20260323-wave4-recheck/post-detail-final-mobile.png` | Improved. Wave-4 recheck confirms the 390px overflow bug is fixed; remaining work is now the broader reading-family hierarchy pass rather than a route-breaking defect. | `blog-mkj` / `#57` |
| `/archive` | `.playwright-discovery/tab-audit-20260323-wave5-recheck/archive-desktop.png`, `.playwright-discovery/tab-audit-20260323-wave5-recheck/archive-mobile.png` | Improved and close. The year rail and month sections now hold their ledger-like scan in production without drifting back toward promo-card chrome; keep it open only until the reading-family bead closes as a whole. | `blog-mkj` / `#57` |
| `/archives/[month]` | `.playwright-discovery/tab-audit-20260323-wave2/archive-month-desktop.png`, `.playwright-discovery/tab-audit-20260323-wave2/archive-month-mobile.png` | Improved. Competing stats rail removed; likely close after another whole-site review pass. | `blog-mkj` / `#57` |
| `/tags` | `.playwright-discovery/tab-audit-20260323-wave3-final/tags-desktop.png`, `.playwright-discovery/tab-audit-20260323-wave3-final/tags-mobile.png` | Improved. Mobile shell clipping is resolved and the route now reads clearly as part of discovery; hold only for any final whole-site polish pass. | `blog-5rm` / `#64`, `blog-2xw` / `#61` |
| `/tags/[tag]` | `.playwright-discovery/tab-audit-20260323-wave2/tag-detail-desktop.png`, `.playwright-discovery/tab-audit-20260323-wave2/tag-detail-mobile.png` | Improved. Related navigation moved higher; monitor in next review pass. | `blog-ylv` / `#59` |
| `/search` | `.playwright-discovery/tab-audit-20260323-wave3-final/search-memory-desktop.png`, `.playwright-discovery/tab-audit-20260323-wave3-final/search-memory-mobile.png` | Improved. Search scope is clearer and the route is calmer; keep under observation, but it is no longer one of the primary blockers. | `blog-5rm` / `#64`, `blog-2xw` / `#61` |
| `/talks` | `.playwright-current-review-20260330-pass2/talks-desktop.png`, `.playwright-current-review-20260330-pass2/talks-mobile.png` | Improved but still open. The route is calmer than the March 23 state and reads more like an archive, but the top still feels busier than it should and the repeated card run flattens the page as you scroll. Keep it blocked until direct review agrees the first viewport is no longer cluttered. | `blog-qxn` / `#58`, `blog-r0j` / `#65`, `blog-r0j.1` / `#68` |
| `/publications` | `.playwright-discovery/tab-audit-20260323-wave7-final/publications-desktop.png`, `.playwright-discovery/tab-audit-20260323-wave7-final/publications-mobile.png` | Improved and close. The sticky side rail is gone, the archive map is quieter, and the featured publication still leads without overloading the first fold. Keep it open only for the final whole-site editorial pass. | `blog-qxn` / `#58`, `blog-r0j` / `#65` |
| `/about` | `.playwright-current-review-20260330-pass2/about-desktop.png`, `.playwright-current-review-20260330-pass2/about-mobile.png` | Improved but still open. The missing CV depth is materially restored and the route now reads like a real professional profile again. The remaining gap is compositional: the page still carries too many small metadata clusters and dense sections to call it fully settled. | `blog-qxn` / `#58`, `blog-qxn.1` / `#67` |
| `/book` | `.playwright-discovery/tab-audit-20260323-wave3-final/book-desktop.png`, `.playwright-discovery/tab-audit-20260323-wave3-final/book-mobile.png` | Close. The shell is cleaner and the earlier mobile interruption is gone; keep for final editorial polish only. | `blog-2kf` / `#56` |
| `/code-ai` | `.playwright-current-review-20260330-pass2/code-ai-desktop.png`, `.playwright-current-review-20260330-pass2/code-ai-mobile.png` | Improved but still open. The route now opens with actual work, the grouped archive sections make sense, and it no longer feels obviously improvised. The remaining problem is editorial finish: controls, chips, and browse scaffolding are still too prominent relative to the entries themselves. | `blog-t75` / `#60`, `blog-vt2` / `#62`, `blog-vt2.1` / `#66` |
| `/code-ai/[id]` | `.playwright-discovery/tab-audit-20260323-wave3-final/code-ai-detail-desktop.png`, `.playwright-discovery/tab-audit-20260323-wave3-final/code-ai-detail-mobile.png`, `.playwright-discovery/tab-audit-20260323-wave4-recheck/code-ai-detail-final-desktop.png`, `.playwright-discovery/tab-audit-20260323-wave4-recheck/code-ai-detail-final-mobile.png` | Improved. The detail route is calmer and more reading-like now, but it remains tied to the broader code-tools cleanup until the index route settles. | `blog-t75` / `#60`, `blog-vt2` / `#62` |

## 14. April 11-12, 2026 Design Session — About, Talks, Home, Site-Wide

Direct human-guided design session covering about page redesign, talks page improvements, home page updates, and site-wide UX fixes.

### About page (13.2 substantially advanced)
- [x] 14.1 Switched from dark "Monograph" theme to light editorial theme matching rest of site
- [x] 14.2 Filled out full CV content from resume PDF: complete bullet points per role, categorized skills, education, patents with hyperlinks
- [x] 14.3 Designed and implemented Option F highlights (inline stat accents) via HTML mockup iteration — numbers woven into contextual sentences with bold blue emphasis
- [x] 14.4 Implemented photo-in-hero layout (Option A) — portrait beside name in 60/40 grid, eliminating empty right-side space
- [x] 14.5 Updated Current Focus cards with accurate, forward-looking content: Building (Workhelix/Nucleus), Writing (Agent Memory book), Speaking (2026 engagements)
- [x] 14.6 Filtered Twitch streams from Publications & Talks section, linked remaining talks to `/talks#id`
- [x] 14.7 Called out O'Reilly reports correctly (not books) + upcoming book title: Agent Memory: Building Stateful AI Agents That Remember, Adapt, and Work Across Time
- [x] 14.8 Section titles enlarged and made blue with inline styles (Tailwind class override issue)
- [x] 14.9 Spacing fixes between dividers and section titles site-wide using inline `marginTop`

### Talks page (13.3 substantially advanced)
- [x] 14.10 Fixed pre-existing hydration mismatch: removed `isOpen` prop chain from FeaturedTalk/TalkMediaPreview, all player state now internal via `useState(false)`
- [x] 14.11 Featured talk now shows live Spotify embed directly (playable without click) for podcasts, YouTube thumbnail with play button for video talks
- [x] 14.12 Added dates and event names to all archive talk cards
- [x] 14.13 Featured talk now also appears in All Talks grid below
- [x] 14.14 Podcast cards in grid show inline Spotify embed instead of placeholder icons
- [x] 14.15 Locale-independent date formatting (manual month array instead of `Intl.DateTimeFormat`)

### Home page
- [x] 14.16 Replaced stats bar (post count, topics, years, images) with Current Focus cards (Building, Writing, Speaking)
- [x] 14.17 Updated subtitle: "Posts, talks, publications, and the work surrounding my upcoming O'Reilly book on AI agent memory."
- [x] 14.18 Updated label: "Technical editorial" → "AI/ML Engineering & Writing"
- [x] 14.19 Featured post card fully wrapped in single Link — clicking anywhere navigates to post
- [x] 14.20 Selected work cards fully wrapped in Links, equal-height with bottom-aligned buttons, consistent `mt-` spacing
- [x] 14.21 Agent Memory book card same treatment

### Site-wide
- [x] 14.22 "Principal ML Engineer" → "Staff AI/ML Engineer" across all pages and mockups
- [x] 14.23 Footer simplified: "© 2024-2026 Ben Labaschin" (removed "Technical Curator & Economist")
- [x] 14.24 Sticky contact remote (Email, GitHub, LinkedIn) now shows on every page including home
- [x] 14.25 Removed "7 publications — newest first" subtitle from publications page
- [x] 14.26 Bluesky removed from contact links

### Hover affordance audit
- [x] 14.27 First pass: tag pills on PostsList, code-ai "Show preview" button, archive breadcrumb, search quick queries, tag detail related tags
- [x] 14.28 Second pass: brand logo hover, desktop nav items raise on hover, home page top tags, post card tags, "View archive" link, featured post card lift, about page publication rows slide
- [x] 14.29 Fixed blue text bleed: all card-wrapping Links now use `style={{ color: 'inherit' }}` to override global anchor color

### Tags page
- [x] 14.30 Case-insensitive tag deduplication (merged "Machine Learning" and "machine learning" etc.)
- [x] 14.31 Tighter alphabetical index grid layout
- [x] 14.32 Tag counts in parentheses
- [x] 14.33 Spacing fixes on sidebar headings ("Tag archive", "A useful starting point")

### Tag detail page
- [x] 14.34 Post cards fully wrapped in Link — clicking anywhere navigates to post
- [x] 14.35 Hover lift on cards, title turns blue on hover
- [x] 14.36 Consistent spacing on sidebar headings ("Topic notes", "Related tags", "Browse beyond")

### Posts page
- [x] 14.37 Grid cards wrapped in Link — fully clickable
- [x] 14.38 Consistent `mt-` spacing for label/title/summary/tags/button
- [x] 14.39 `flex-1` on summary for equal card heights, button pinned to bottom

### Remaining open work
- [ ] `/code-ai` still needs editorial cleanup (13.4 still open)
- [ ] `/posts` list view not yet updated to match grid view clickability
- [ ] Mobile responsiveness not yet audited this session
- [ ] Search page card clickability not yet addressed
- [ ] Some hover affordances may still be missing on less-visited pages

### Additional hover and spacing fixes (continued session)
- [x] 14.40 Tags page: hover raise on top tag cards, letter jump links, alphabetical pills, browse route links
- [x] 14.41 Tag detail page: hover raise on "Open archive", "Search this topic", "Back to tags"
- [x] 14.42 Search page: fixed "Suggested queries" spacing, sidebar heading spacing
- [x] 14.43 ECONOBEN.DEV brand: raise on hover
- [x] 14.44 Discovery nav (Tags, Search): raise on hover
- [x] 14.45 Footer links: raise on hover

Commits: `0cc39834`, `8b92bd58`, `0038c450`, `a07b3912`, `7155bcd0`, `e29d5e6f`, `784f79de`, `09a6e98c`, `054a3cd9`, `4d99a78a`. Pushed to `origin/feat/site-current-review` on April 12, 2026.
