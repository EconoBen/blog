## 1. Content Continuity Guardrails

- [ ] 0.1 Establish the execution model: non-`main` branches only, worktrees for parallel slices, PRs for every slice, and no merges before explicit review
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
