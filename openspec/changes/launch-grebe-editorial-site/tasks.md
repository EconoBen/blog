> **Status:** COMPLETE — draft PR
> [#79](https://github.com/EconoBen/blog/pull/79) is open from
> `feat/grebe-editorial-refresh`, based on production `main` at `ff68ffb6`;
> Vercel preview and required checks are green.

## 1. Baseline and Guardrails

- [x] 1.1 Record the production baseline commit, changed route family, current cover asset, current book links, current route inventory, and pre-existing `.next` dirt outside the implementation worktree
- [x] 1.2 Confirm the supplied cover and approved grebe banner assets visually, copy the authoritative cover, retain the banner as an external identity reference, and record their roles
- [x] 1.3 Add or extend automated checks that can prove one subscription target, corrected chapter ownership, current release wording, analytics mounting, and stable O'Reilly URLs before implementation is called complete

## 2. Authoritative Book Data and Cover

- [x] 2.1 Centralize the O'Reilly URLs, release state, chapter availability, part/chapter structure, status labels, and campaign parameters in one book-data module
- [x] 2.2 Implement a responsive `BookCover` component that displays the supplied adult-grebe cover without regenerating the O'Reilly artwork and exposes accurate alternative text
- [x] 2.3 Replace the blue draft placeholder everywhere and update homepage, book-page, Open Graph, Twitter, and root metadata language to Early Release
- [x] 2.4 Verify Chapter 3 closes Part I, Chapter 4 opens Part II, and no rendered or metadata copy still calls the book merely upcoming or forthcoming

## 3. Grebe Editorial Assets and System

- [x] 3.1 Generate a small adult horned grebe mascot set from the approved banner and cover references using the animal-editorial identity lock and a removable chroma-key background
- [x] 3.2 Remove the key, validate transparent edges and recognizable adult-grebe traits, optimize project-bound PNG/WebP assets, and keep the approved source references unchanged
- [x] 3.3 Implement the reusable site-wide `GrebeField` component in the shared editorial frame with declarative route-aware placement, desktop/mobile density limits, semantic hiding, and pointer transparency
- [x] 3.4 Add namespaced paper, palette, ripple, stacking, responsive CSS, and no more than two slow cross-screen swims with a complete `prefers-reduced-motion` freeze path
- [x] 3.5 Add component, source, and rendered assertions for site-wide field ownership, mascot count, decorative semantics, interaction isolation, cross-screen motion, and reduced-motion support

## 4. Conversion Funnel and Analytics

- [x] 4.1 Mount Vercel Analytics exactly once in the root layout
- [x] 4.2 Implement a resilient tracked-action helper for `homepage_book_click`, `oreilly_read_click`, and `oreilly_trial_click` without delaying navigation
- [x] 4.3 Emit `newsletter_subscribe_success` only after a successful API response and include placement metadata without email or free-form content
- [x] 4.4 Repair the shared newsletter form at 390px by removing the legacy full-width-button conflict, preserving a usable email control, and keeping submit/success/error states visible
- [x] 4.5 Verify the book page has exactly one `#subscribe` target and one newsletter form after the current main-branch duplicate-removal fix is preserved

## 5. Homepage Refresh

- [x] 5.1 Keep the writing-first headline and wider personal-platform navigation while updating the hero and empty state from upcoming/forthcoming language to Early Release
- [x] 5.2 Add a restrained homepage grebe field that uses no more than four mobile and ten desktop mascot instances and keeps all text/controls clear
- [x] 5.3 Replace the generic forest-led feature impression with a real-content editorial treatment that foregrounds the latest post and the real Agent Memory cover without inventing post metadata
- [x] 5.4 Update the homepage book treatment and selected-work card to use the real cover, current status, tracked `/book` actions, and accurate copy
- [x] 5.5 Review the homepage's first and second screens so current focus, writing, book, talks, publications, and tools remain balanced rather than becoming a book microsite

## 6. Book Page Refresh

- [x] 6.1 Rebuild the hero around the real cover, current availability, tracked read action, updates action, and trial action while preserving the O'Reilly destination and UTMs
- [x] 6.2 Replace consecutive same-weight audience/question/outcome grids with differentiated available-now proof, Early Release value, and practical build-outcome editorial beats
- [x] 6.3 Render the centralized corrected three-part chapter map with current statuses and one contextual grebe treatment that does not encode essential information
- [x] 6.4 Preserve the single shared subscription close and confirm page landmarks, heading order, cover alt text, decorative semantics, and focus states
- [x] 6.5 Review the book page at 390, 768, 1024, and 1440 CSS pixels for cover balance, content width, mascot density, CTA hierarchy, and unintended horizontal overflow

## 7. Production Quality Gates

- [x] 7.1 Run repository formatting, lint/type checks, component or source tests, and strict OpenSpec validation; document only genuinely pre-existing exceptions
- [x] 7.2 Run `npm run build` and verify the production route table still includes the full route/content family from the continuity spec
- [x] 7.3 Start a production server and crawl internal links plus changed external web destinations, using GET or browser verification where HEAD requests are rejected
- [x] 7.4 Run automated accessibility checks on `/` and `/book` and verify no new critical or serious findings, logical headings, keyboard focus, and nonintercepting decoration
- [x] 7.5 Capture and visually review fresh desktop/mobile first-viewport and full-page screenshots for `/` and `/book`, including compiled reduced-motion verification
- [x] 7.6 Recheck `/posts`, `/talks`, `/publications`, `/about`, `/code-ai`, `/search`, RSS, sitemap, and robots for route continuity and obvious shared-shell regressions

## 8. Review and Handoff

- [x] 8.1 Update proposal, design decisions, and this checklist with the actual implementation, evidence paths, validation results, and any approved deviations
- [x] 8.2 Run the repository's substantive code-review workflow, address Must Address findings, and inspect the final diff for unrelated or generated-file churn
- [x] 8.3 Commit the coherent change, push `feat/grebe-editorial-refresh`, and open a draft PR to `main` with context, impact, next steps, and the complete test plan
- [x] 8.4 Verify the draft PR and its preview/check state, then leave merging to Ben's explicit approval
