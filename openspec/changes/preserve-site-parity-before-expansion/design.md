## Context

> Status note (March 22, 2026): the literal Stitch-to-TSX preview pass now exists on the isolated preview branch `feat/site-stitch-html-preview` and is reviewable locally on `http://localhost:3007`. That branch intentionally uses exported sample copy and placeholder states where needed so the desktop layout family can be judged in-browser without treating the exported content as production truth. A follow-up render fix was required after the first pass: the preview initially served with missing utility styling because `app/globals.css` did not import Tailwind, and the old `body.shell-editorial` rule still forced a dark shell background. The current preview state includes both fixes and has been visually rechecked on the main top-level route set.

> Status note (later on March 22, 2026): the first parallel integration wave is now open as draft PRs, but Playwright review and source comparison show it is still incomplete. The active draft stack covers the shared shell/home direction, posts, talks/publications/about, and the code index, but it does not yet carry the Stitch direction into `/archive`, `/archives/[month]`, `/search`, `/tags`, `/tags/[tag]`, `/book`, or `/code-ai/[id]`. The review also surfaced concrete shell defects in the preview/reference branch that should inform the real integration work: `/code-ai` still presents a double-shell state when it falls outside editorial-shell routing, the shared top bar can degrade into duplicate search text when icon/font wiring is brittle, and the floating dark-mode affordance still leaks into pages that are meant to read as standalone editorial destinations.

> Status note (latest on March 22, 2026): Playwright review against the active integration branches on `3008`, `3011`, and `3015` surfaced another pair of concrete issues that should now be treated as explicit implementation work, not vague polish. First, the editorial shell still leaves mobile users with only the brand link and `Search` visible in the header; the full primary navigation remains hidden until the footer, which is not acceptable for a real reviewable site. Second, the active second-wave branch for `/book` and `/code-ai/[id]` still leaks raw Material Symbols token text into visible UI (`psychology`, `arrow_back`, `terminal`, `arrow_forward`), which means those controls need a stable font-independent treatment instead of assuming the icon font will always render.

The `blog` repo is the implementation target for the public site at `econoben.dev`. It is a Next.js App Router application with content and behavior spread across route components in `app/`, config-driven sections in `app/config/`, markdown posts in `src/posts/`, and service logic in `app/services/`.

The current working tree already contains exploratory editorial redesign work, including a new shell and a `/book` route. That work should continue, but it must not cause silent loss of content or features from the existing site. The canonical baseline is still the current site as currently implemented and shipped: its routes, wording, content corpus, metadata, feeds, and user-visible behaviors.

This change exists to prevent content loss while the redesign moves forward. Without continuity guardrails, the migration can easily drop posts, routes, metadata, or feature surfaces while the new visual system is being built.

The first implementation wave is already split into stacked draft PRs for the shared foundation, structured pages, posts, discovery routes, and continuity-backed surfaces. The next wave should move from "safe continuity" toward "closer to final" by using an integrated preview branch plus focused polish branches for shared visual fidelity, language, and subpage refinement.

The latest design input is a Stitch-generated multi-page site family built from the active OpenSpec brief plus uploaded Figma references. That pass produced both mobile and desktop route families, but the desktop/web outputs are the more useful implementation target. They reinforce a calmer editorial shell, a Ben-first homepage, cleaner list-based discovery pages, narrower long-form reading layouts, and more normalized archive/tag/search/code-tool families.

As of March 22, 2026, the project also has pasted raw Stitch desktop HTML exports for the main route family. Those exported page structures are now the closest available expression of the intended visual system. They should be treated as the current design-reference baseline for layout, spacing, typography pairing, color tokens, and page hierarchy across:

- `/`
- `/posts`
- `/posts/[slug]`
- `/talks`
- `/publications`
- `/about`
- `/search`
- `/tags`
- `/archive`
- `/archives/[month]`
- `/code-ai`
- `/code-ai/[id]`
- `/book`

They are still not implementation truth. They invent sample content, overstate some book/newsletter states, and occasionally drift in labels or copy. The implementation rule is: match the shell and page structure closely, while preserving real site content, routes, behaviors, and wording unless a deliberate copy change is approved.

The combined preview makes the remaining issues concrete. The site is now directionally coherent, but several routes still reveal their transitional state: `About` is cramped, `Book` still reads like a placeholder, `Publications` and `Talks` are still card-grid heavy, `Posts` remains too dense, and `Code & Tools` still feels like a separate product rather than part of the same editorial platform.

The latest review adds a sharper constraint: the redesign must become more practical and less self-conscious. In the current preview, the site gets weaker when it starts narrating itself with labels like "essays," "pieces," "appearances," "major publications," and "featured entries," or when it introduces visual devices such as proof strips and metric sidebars that do not help people actually use the page. The old site handled some of this better, especially on `Talks`, where embedded media made the page immediately useful and about-page content still behaved like a real CV.

The latest implementation instruction is more concrete than that: stop treating the exported Stitch HTML as a loose design moodboard and instead translate the pasted desktop route family into real Next.js TSX so the user can inspect the exact layouts in-browser. This preview-first translation pass is allowed to be more literal than the continuity-safe rewrite, as long as it stays isolated to non-`main` preview branches and the planning artifacts clearly distinguish "literal design preview" from "final production integration."

The latest execution instruction now goes one step further: begin the real integration wave immediately, use parallel worktrees and as many background agents as practical, open PRs for every slice, and do not merge anything into `main` until the human reviews the resulting branch set. The working rule is:

- `feat/site-practical-review-preview` is the real integration base
- `feat/site-stitch-html-preview` is the visual/design reference
- each implementation slice gets its own worktree and PR
- slices must have disjoint write ownership
- no branch merges without explicit review approval

The newest constraint from live review is that the route family has to be treated in two waves, not one. The first PR wave established direction, but the remaining discovery/book surfaces are too visible to defer indefinitely. If those routes keep their old structure while the homepage/posts/talks family adopts the Stitch shell, the site will continue to feel split between “new editorial surface” and “old utility site.”

## Goals / Non-Goals

**Goals:**
- Preserve the existing public site's routes, posts, wording, and feature surfaces while the redesign proceeds.
- Allow redesign and expansion work to move forward in parallel once content-continuity guardrails are in place.
- Make content loss obvious through lightweight inventories and checks instead of a heavyweight parity chart.
- Keep copy changes deliberate by freezing existing wording unless a later explicit change approves them.

**Non-Goals:**
- Rewriting copy accidentally during layout or design work.
- Treating exploratory design changes as permission to drop existing content or behaviors.
- Building a formal route-by-route parity spreadsheet or chart as a prerequisite to development.
- Redesigning the content model at the same time as the site shell unless continuity is preserved.

## Decisions

### 1. The canonical baseline is the current site, but redesign work can proceed in parallel
The migration source of truth is still the current public site and its existing repo behavior, but the redesign does not need to wait for a formal parity signoff. Instead, the redesign proceeds while continuity guards prevent regressions.

Alternatives considered:
- Use the exploratory redesign as the new baseline: rejected because it makes it too easy to lose content or routes accidentally.
- Freeze all redesign work until parity is finished: rejected because it slows progress unnecessarily and is not what the user wants.

### 2. Use lightweight continuity inventories instead of an explicit parity chart
We still need to know what must be preserved, but that inventory should be operational and lightweight: canonical content sources, public route surfaces, feature-backed routes, and generated outputs.

Alternatives considered:
- Build a formal parity matrix for every route before coding: rejected because it adds planning overhead without enough additional protection.
- Skip inventory entirely: rejected because it makes missing content harder to catch.

### 3. Existing wording is frozen by default during redesign
Canonical wording remains in place unless a deliberate change later chooses to rewrite it. Layout and design work do not get to rewrite copy by accident.

Alternatives considered:
- Allow opportunistic copy cleanup during redesign: rejected because it makes it harder to separate design work from content decisions.
- Rewrite top-level copy immediately: rejected because the user wants to keep current wording until intentional revisions are discussed.

### 4. Expansion work is allowed as long as continuity protections stay in place
Book surfaces, newsletter placement, and editorial refinement can be built while route modernization is underway, provided they do not remove baseline content or silently replace existing wording.

Alternatives considered:
- Force all expansion into a later change: rejected because the user wants to keep building the site now.
- Allow unrestricted expansion with no guardrails: rejected because it increases the risk of losing content or features.

### 5. Validation focuses on continuity, not perfect one-to-one parity
Automated build/runtime checks plus targeted human review are enough, as long as they confirm that posts, routes, metadata, and feature surfaces still exist and work.

Alternatives considered:
- Rely only on `next build`: rejected because content loss can still slip through.
- Require exhaustive visual parity review for every route before building new surfaces: rejected because it over-constrains progress.

### 6. Use Stitch desktop exports as the current page-family reference, not implementation truth
The Stitch project is useful because it extends the homepage direction into a complete desktop site family. The correct use is to match its information architecture, hierarchy, pacing, type pairing, spacing, and calmer visual language route by route, while keeping the real site's content, behaviors, and tone constraints.

Alternatives considered:
- Ignore Stitch and continue from ad hoc editorial exploration: rejected because the multi-page desktop pass clarifies the page family more concretely.
- Treat Stitch as direct codegen or literal copy source: rejected because it invents fake content and occasionally drifts into generic product/newsletter patterns.
- Use only abstract screenshots or moodboards as reference: rejected because the raw Stitch desktop HTML gives a much more precise implementation target.

### 6. The design thesis is practical, direct, and content-first
The site should feel useful, grounded, and easy to navigate. Labels should describe what the content is in plain terms: posts, talks, publications, resume. Visual emphasis should come from the content itself, not from self-promotional metrics or decorative summary bands.

Alternatives considered:
- Keep the more self-consciously editorial language: rejected because it reads as pretentious and obscures what the pages actually are.
- Lean harder into metrics and "at a glance" cards: rejected because the current review shows they create awkward empty space and bragging cues more often than useful orientation.
- Treat the about page as a pure narrative page instead of a CV: rejected because the old site’s resume-first utility is still part of what the page needs to do.

### 7. Talks should prioritize watch/listen utility over summary framing
The current rewritten talks page degrades compared with the old implementation because it removes the embedded media experience and replaces it with summary metrics and generic framing. The correct direction is to restore embedded playback and make the page easy to browse and consume directly.

Alternatives considered:
- Keep the "latest appearance" / "recorded appearances" framing: rejected because it reads as bragging and is less useful than embedded media.
- Keep abstract proof strips about venues: rejected because they do not help the user decide what to watch.

### 8. Navigation should include an explicit Home destination
The brand link is not enough as the only way back to the homepage once the site has more destinations. The editorial shell should expose a clear `Home` entry in navigation.

Alternatives considered:
- Rely on the site title/brand only: rejected because explicit wayfinding is clearer and more practical.

### 9. Route-family implementation should align to the exported Stitch pages in parallel
The next execution wave should split along page families that mirror the available Stitch references:

- shared shell and homepage
- reading and discovery routes
- structured content routes
- code/tools and book routes

Each slice can move in parallel in separate worktrees, but they should all treat the exported Stitch desktop HTML as the common visual target so the integrated preview converges instead of drifting.

Alternatives considered:
- Continue with one combined preview branch only: rejected because it slows route-family iteration and makes it harder to use multiple agents safely.
- Let each route family interpret the design independently: rejected because that already caused visible drift from the intended visual system.

### 10. Add a literal Stitch-to-TSX preview pass before more interpretation
The exported desktop HTML should be translated into actual Next.js TSX route components so the user can inspect what the design looks like when rendered by the app. This is a preview artifact, not proof that the content model or production behavior has been reconciled. The point is to remove ambiguity about the visual target before another interpretation layer is added.

Alternatives considered:
- Continue adapting the export loosely route by route: rejected because the user explicitly asked to see the exported pages converted directly.
- Keep the HTML outside the app and inspect it separately: rejected because the user wants the design rendered inside the actual Next.js codebase.
- Merge literal preview code directly toward production without an explicit preview phase: rejected because it would blur fake sample content and real site behavior too early.

### 11. Execute the real integration in parallel worktrees, not by merging preview code
The accepted Stitch direction should now be integrated into the real route implementations through parallel worktree slices. Each slice should target a route family, own a disjoint set of files, and end in its own draft PR. The preview branch stays a reference; it is not merged directly. Instead, workers translate the approved direction into real route code that preserves current content and behaviors.

Alternatives considered:
- Merge the literal preview branch and clean it up later: rejected because it would bring exported sample content and placeholder assumptions too close to production.
- Implement sequentially in one long-running branch: rejected because the user explicitly wants parallel execution and reviewable PR slices.
- Let multiple workers edit the same shared files freely: rejected because it creates preventable merge conflicts and destroys the value of parallel worktrees.

### 12. Use Playwright review to drive the second integration wave
Now that the literal preview is reviewable in-browser, the next work should be driven by rendered behavior rather than by abstract similarity to the exported HTML. That means the second wave should specifically target the gaps made obvious by review:

- discovery-family routes that still drop back to the old site structure
- book/code-detail routes that remain outside the visible Stitch direction
- shell reconciliation issues such as missing editorial-shell route coverage, duplicated chrome, brittle icon handling, and mobile/utility affordances that leak into the editorial surface

Alternatives considered:
- Keep extending only the already-open first-wave PRs: rejected because that would broaden their ownership, make review harder, and erode the parallel worktree model.
- Ignore preview-only defects until after production integration: rejected because the preview is the clearest available expression of the intended experience, so broken shell behavior there is useful evidence, not noise.
- Treat the first four PRs as “good enough” and wait for review: rejected because the uncovered route families are still directly linked from the shell and will make the site feel unfinished immediately.

### 13. Treat mobile nav access and icon-token leakage as production-facing defects
Once the route family is visible in real browser review, some problems stop being subjective design polish and become hard usability defects. Two current examples are: hiding the full primary nav on mobile until the footer, and leaking raw icon token text into buttons/callouts on `/book` and `/code-ai/[id]`. These should be fixed directly in the active PR branches instead of being deferred to a later aesthetic pass.

Alternatives considered:
- Leave mobile users with footer-only navigation until a later menu redesign: rejected because the active shell is already being judged in-browser and must support practical wayfinding now.
- Keep relying on Material Symbols for critical button UI in these routes: rejected because the active review environment already proved that brittle icon-font rendering degrades into visible placeholder text.

## Architecture

```mermaid
flowchart TD
    A[Current Site Baseline] --> B[Continuity Guardrails]
    A1[Routes in app/] --> B
    A2[Markdown posts in src/posts/] --> B
    A3[Config in app/config/] --> B
    A4[Services and generated outputs] --> B

    B --> C[Shared Site Foundation]
    C --> D[Parallel Route Modernization]
    C --> E[Parallel Expansion Surfaces]

    D --> F[Continuity Checks]
    E --> F
    B --> F

    F --> G[Review and Refinement Queue]
```

## Risks / Trade-offs

- **[Redesign work can still hide regressions]** → Add lightweight continuity checks for posts, routes, outputs, and feature-backed pages.
- **[Existing exploratory code may diverge from current behavior]** → Keep the current site as the content/feature source of truth even when the new design moves ahead.
- **[Current repo has tooling gaps]** → Record repo-level validation limits, such as missing ESLint wiring, and lean on build/runtime plus targeted review until stronger checks exist.
- **[Parallel work can blur content vs design decisions]** → Freeze wording by default and track intentional copy changes separately.

## Migration Plan

1. Freeze the parity baseline: route inventory, content inventory, wording freeze, and known exploratory deltas.
2. Build the shared site foundation so redesign work can move ahead without orphaning baseline routes and features.
3. Modernize content routes and expansion surfaces in parallel while preserving existing content sources and wording by default.
4. Verify dynamic systems and outputs: search, tags, archives, code-and-tools, metadata, RSS, sitemap, and robots.
5. Review the redesigned site for continuity gaps, then queue copy/book/newsletter refinements for the next pass.
6. Create an integrated preview branch from the active stacked slices and run a second pass for shared visual fidelity, language, and subpage polish.
7. Use the exported Stitch desktop HTML to define the next implementation wave for the shared shell, homepage, long-form reading, talks, discovery surfaces, structured pages, archive views, and code/tool pages.
8. Run a combined-preview review, then launch another polish wave for remaining route-family drift, wording cleanup, and behavior gaps.
9. Run a practical-refinement wave that removes pretentious language, restores useful embedded media where the old site was stronger, and re-centers the about page on CV utility.
10. Run a literal Stitch translation wave that turns the pasted desktop HTML into TSX route components in the preview branch so the exported layouts can be judged directly.
11. After that preview exists, decide route by route what should stay literal, what should be replaced with real site data, and what should be discarded.
12. Launch a parallel integration wave from `feat/site-practical-review-preview`, using the literal preview branch as reference and separate worktrees for shell, reading, structured, and discovery/tools slices.
13. Open draft PRs for those slices, review them together, and keep all merges blocked until the human approves the combined direction.
14. Run a Playwright review pass against the live local preview and active slice outputs, then use that evidence to launch a second-wave set of worktrees for the still-uncovered discovery/book routes plus any shared-shell reconciliation fixes.
15. Keep those second-wave slices in draft PRs as well, so the human can review the whole direction before any merge toward `main`.

## Execution Constraints

- Implementation proceeds on non-`main` branches only.
- Parallel implementation should use git worktrees so multiple route families can advance independently.
- Each parallel slice should land in its own PR and remain unmerged until human review approves the branch set.
- Shared foundation work that changes common files such as layout shells, shared components, or global styles should establish the integration base first; page-specific work should branch from that base to reduce conflicts.
- Once multiple draft slices exist, an integration preview branch may stack them together so later polish work can target the real combined experience without merging anything into `main`.
- Combined previews should drive refinement work. New polish slices should be based on rendered-page review rather than on abstract theme descriptions once a stacked preview exists.
- Literal Stitch translations are allowed in preview branches even when they still contain sample copy or static placeholders from the export, but those branches must be treated as design-preview artifacts rather than production-ready route implementations.
- Real integration work should branch from `feat/site-practical-review-preview`, not from `main`, and should use `feat/site-stitch-html-preview` only as a visual reference.
- Use as many background agents as practical, but only when each agent has a disjoint write set and a bounded route-family scope.
- Every implementation slice should end in a draft PR. Review happens before any merge, and no merge to `main` is allowed during this wave.
- PRs created for this change are review checkpoints, not merge signals. Nothing should be merged into `main` until the user explicitly approves it.

Rollback strategy:
- If a redesign slice drops route availability, content coverage, or feature continuity, revert that slice to the last safe state rather than layering more design work on top.

## Open Questions

- What is the minimum continuity check set that gives enough protection without turning into the formal parity chart you do not want?
- How visible should `/book` be while the broader site redesign is still preserving baseline content and wording?
