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

- [x] 12.1 Treat `feat/site-practical-review-preview` as the integration base branch, keep `feat/site-stitch-html-preview` as the design-reference branch, and do not merge either branch into `main`
- [ ] 12.2 Launch a shared-shell slice in its own worktree/PR to carry the accepted Stitch shell, global tokens, and homepage direction into the real site implementation
- [ ] 12.3 Launch a reading-routes slice in its own worktree/PR to integrate the accepted Stitch direction into `/posts` and `/posts/[slug]` using real site content and behaviors
- [ ] 12.4 Launch a structured-routes slice in its own worktree/PR to integrate the accepted Stitch direction into `/talks`, `/publications`, and `/about` while preserving practical-language and real-data constraints
- [ ] 12.5 Launch a discovery-and-tools slice in its own worktree/PR to integrate the accepted Stitch direction into `/archive`, `/archives/[month]`, `/tags`, `/tags/[tag]`, `/search`, `/code-ai`, `/code-ai/[id]`, and `/book`
- [x] 12.6 Use as many background agents as practical, but keep every worker on a disjoint write set so parallel work does not collide
- [x] 12.7 Open draft PRs for every slice and hold all merges until a human review approves the combined direction
- [x] 12.8 Run a Playwright-driven review pass against the live local Stitch preview and the active integration slices to identify concrete shell, mobile, and route-coherence gaps before the next implementation wave
- [ ] 12.9 Launch a second integration wave in separate worktrees/PRs for the routes still outside the first draft stack: `/archive`, `/archives/[month]`, `/search`, `/tags`, `/tags/[tag]`, `/book`, and `/code-ai/[id]`
- [ ] 12.10 Reconcile shared-shell drift revealed by review, including editorial-shell route coverage, nav completeness, duplicate shell chrome, and preview-only icon/font regressions that obscure the intended design
- [x] 12.11 Add a practical mobile primary-navigation treatment for editorial-shell routes so the active stitch shell does not hide every destination except Search above the fold on small screens
- [x] 12.12 Remove raw Material Symbols token leakage from `/book` and `/code-ai/[id]` so critical buttons and callouts do not render icon names such as `psychology`, `arrow_back`, `terminal`, or `arrow_forward`
- [x] 12.13 Create a successor reading-slice branch stacked on `feat/site-stitch-integrate-shell-home` so `/posts` and `/posts/[slug]` inherit the new shell instead of the legacy `BEN LABASCHIN` frame
- [x] 12.14 Create a successor structured-slice branch stacked on `feat/site-stitch-integrate-shell-home` so `/talks`, `/publications`, and `/about` inherit the new shell instead of the legacy `BEN LABASCHIN` frame
- [x] 12.15 Assemble a shell-based integrated review branch that combines the current child slices (`#35`, `#36`, `#41`, `#42`) on top of `feat/site-stitch-integrate-shell-home` so the whole site can be judged together in-browser
- [x] 12.16 Align `/code-ai` with the shared editorial shell on the active stitch stack so the integrated review branch no longer mixes the legacy `BEN LABASCHIN` chrome with the new `econoben.dev` shell
- [x] 12.17 Make active mobile editorial-nav labels legible so the current route does not disappear inside the solid blue selected chip on small screens

Execution note (March 22, 2026): the first four draft PRs are real progress, but they are not the whole site. Playwright review of the current local Stitch preview and source comparison against the active PR stack showed that:
- the shared shell still needs reconciliation work (`EditorialPageFrame.tsx` overlap between shell and discovery slices)
- `/code-ai` still shows a double-shell state in the literal preview because it is not treated as an editorial-shell route there
- the first-wave PR stack still does not cover `/archive`, `/archives/[month]`, `/search`, `/tags`, `/tags/[tag]`, `/book`, or `/code-ai/[id]`
- the next implementation wave must therefore extend the PR stack instead of pretending the first wave is sufficient

Follow-up note (later on March 22, 2026): the second-wave branches are now real draft PRs as well:
- `#35` for `/book` and `/code-ai/[id]`, stacked on `feat/site-stitch-integrate-shell-home`
- `#36` for `/archive`, `/archives/[month]`, `/search`, `/tags`, and `/tags/[tag]`, also stacked on `feat/site-stitch-integrate-shell-home`

The shared-shell PR `#31` also received Playwright-driven follow-up fixes so the active shell now:
- includes `Code & Tools` in the primary nav
- treats `/code-ai` as an editorial-shell destination instead of leaking old chrome
- suppresses the floating dark-mode affordance on editorial-shell routes

Latest review note (later still on March 22, 2026): Playwright review of the active PR branches found two more concrete defects that still need implementation follow-up:
- the editorial shell still hides all primary destinations on mobile except the brand link and `Search`, leaving no above-the-fold navigation treatment for small screens
- `/book` and `/code-ai/[id]` still leak raw Material Symbols token text in visible UI on the active second-wave branch, so those routes need a font-independent cleanup instead of relying on icon rendering to work

Additional stack note (same review session): Playwright review of the still-open reading and structured PRs also showed that the review stack is not yet one coherent site. Those PRs still render under the old `BEN LABASCHIN` shell because they are based on `feat/site-practical-review-preview`, not the newer shell branch. The next step is to restack the route-only tips for reading and structured content on top of `feat/site-stitch-integrate-shell-home` instead of pretending the old-shell PRs are still review-ready.

Successor-stack note (same execution wave): shell-based successor PRs now exist for both the reading and structured families:
- `#41` for the restacked reading slice
- `#42` for the restacked structured slice

With those PRs in place, the next useful artifact is no longer another isolated route branch. It is an integrated non-`main` review stack that combines `#35`, `#36`, `#41`, and `#42` on top of `#31`, so the site can be reviewed as one coherent shell-based system.

Integrated-stack note (later in the same execution wave): the combined review branch now exists as draft PR `#44` (`feat/site-stitch-review-stack`) on top of `feat/site-stitch-integrate-shell-home`, and local Playwright review on `http://127.0.0.1:3016` confirms that the stacked site is finally reviewable as one route family. That review also surfaced the next concrete shared-shell defect: `/code-ai` still renders under the legacy `BEN LABASCHIN` chrome while the rest of the stack uses the new editorial shell, so `12.16` tracks bringing that index route into the same shell system before the next integrated pass.

Follow-up note (same review pass, after the `/code-ai` shell fix was replayed locally): the integrated shell still has one more mobile-only defect. The active primary-nav chip renders as a solid blue pill with a nearly invisible label across routes such as `/`, `/posts`, `/book`, and `/code-ai`, so `12.17` tracks a shared-shell style fix before the next integrated review snapshot is treated as fully representative.

Verification note (end of the same implementation wave): both follow-up shell fixes are now present on the active shared-shell branch and replayed onto the integrated review branch `#44`.
- `/code-ai` now renders under the shared editorial shell instead of the legacy `BEN LABASCHIN` topbar (`79a9314` on `feat/site-stitch-integrate-shell-home`, replayed into `#44`)
- active mobile nav labels now stay readable inside the blue selected chip (`ccc7500` on `feat/site-stitch-integrate-shell-home`, replayed into `#44`)
- local Playwright review on `http://127.0.0.1:3016` rechecked home, book, and code/tools mobile screenshots and confirmed the active label is now visible
