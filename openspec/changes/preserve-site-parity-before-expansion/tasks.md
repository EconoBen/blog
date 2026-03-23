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

Per-tab frontend review matrix (March 23, 2026):

| Route | Evidence | Current status | Tracking |
| --- | --- | --- | --- |
| `/` | `.playwright-discovery/tab-audit-20260323-wave3-final/home-desktop.png`, `.playwright-discovery/tab-audit-20260323-wave3-final/home-mobile.png` | Improved, but still not fully ready. Lead-story duplication is gone and mobile density is better, but the second-screen composition still needs another deliberate pass. | `blog-mkj` / `#57`, `blog-01k` / `#63` |
| `/posts` | `.playwright-discovery/tab-audit-20260323-wave2/posts-desktop.png`, `.playwright-discovery/tab-audit-20260323-wave2/posts-mobile.png` | Improved. Archive starts sooner; may still need final polish after homepage work. | `blog-mkj` / `#57` |
| `/posts/[slug]` | `.playwright-discovery/tab-audit-20260323-wave2/post-detail-desktop.png`, `.playwright-discovery/tab-audit-20260323-wave2/post-detail-mobile.png` | Improved. Reading starts sooner; monitor for any remaining top-of-article chrome. | `blog-mkj` / `#57` |
| `/archive` | `.playwright-discovery/tab-audit-20260323-wave2/archive-desktop.png`, `.playwright-discovery/tab-audit-20260323-wave2/archive-mobile.png` | Improved. Mobile controls are better, but the route still shares residual reading-family polish with home/posts. | `blog-mkj` / `#57` |
| `/archives/[month]` | `.playwright-discovery/tab-audit-20260323-wave2/archive-month-desktop.png`, `.playwright-discovery/tab-audit-20260323-wave2/archive-month-mobile.png` | Improved. Competing stats rail removed; likely close after another whole-site review pass. | `blog-mkj` / `#57` |
| `/tags` | `.playwright-discovery/tab-audit-20260323-wave3-final/tags-desktop.png`, `.playwright-discovery/tab-audit-20260323-wave3-final/tags-mobile.png` | Improved. Mobile shell clipping is resolved and the route now reads clearly as part of discovery; hold only for any final whole-site polish pass. | `blog-5rm` / `#64`, `blog-2xw` / `#61` |
| `/tags/[tag]` | `.playwright-discovery/tab-audit-20260323-wave2/tag-detail-desktop.png`, `.playwright-discovery/tab-audit-20260323-wave2/tag-detail-mobile.png` | Improved. Related navigation moved higher; monitor in next review pass. | `blog-ylv` / `#59` |
| `/search` | `.playwright-discovery/tab-audit-20260323-wave3-final/search-memory-desktop.png`, `.playwright-discovery/tab-audit-20260323-wave3-final/search-memory-mobile.png` | Improved. Search scope is clearer and the route is calmer; keep under observation, but it is no longer one of the primary blockers. | `blog-5rm` / `#64`, `blog-2xw` / `#61` |
| `/talks` | `.playwright-discovery/tab-audit-20260323-wave3-final/talks-desktop.png`, `.playwright-discovery/tab-audit-20260323-wave3-final/talks-mobile.png` | Improved, but not fully settled. Playback and browse content enter sooner, though the route still leans a little showcase-heavy on mobile. | `blog-qxn` / `#58`, `blog-r0j` / `#65` |
| `/publications` | `.playwright-discovery/tab-audit-20260323-wave3-final/publications-desktop.png`, `.playwright-discovery/tab-audit-20260323-wave3-final/publications-mobile.png` | Improved, but not fully settled. The featured artifact now leads properly, and sparse years waste less space, but the family still wants one more calm-down pass. | `blog-qxn` / `#58`, `blog-r0j` / `#65` |
| `/about` | `.playwright-discovery/tab-audit-20260323-wave2/about-desktop.png`, `.playwright-discovery/tab-audit-20260323-wave2/about-mobile.png` | Improved. Desktop hero is more deliberate; may still want final polish later. | `blog-qxn` / `#58` |
| `/book` | `.playwright-discovery/tab-audit-20260323-wave3-final/book-desktop.png`, `.playwright-discovery/tab-audit-20260323-wave3-final/book-mobile.png` | Close. The shell is cleaner and the earlier mobile interruption is gone; keep for final editorial polish only. | `blog-2kf` / `#56` |
| `/code-ai` | `.playwright-discovery/tab-audit-20260323-wave3-final/code-ai-desktop.png`, `.playwright-discovery/tab-audit-20260323-wave3-final/code-ai-mobile.png` | Still not ready. The family is calmer than before, but `/code-ai` desktop still leaves too much dead space and the index still carries too much control weight for an editorial archive. | `blog-t75` / `#60`, `blog-vt2` / `#62` |
| `/code-ai/[id]` | `.playwright-discovery/tab-audit-20260323-wave3-final/code-ai-detail-desktop.png`, `.playwright-discovery/tab-audit-20260323-wave3-final/code-ai-detail-mobile.png` | Improved, but still tied to the broader code-tools cleanup. The detail route no longer has the worst chrome issues, yet the family is not ready to close until the index settles. | `blog-t75` / `#60`, `blog-vt2` / `#62` |
