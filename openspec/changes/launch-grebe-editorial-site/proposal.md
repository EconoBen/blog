> **Status:** IN PROGRESS — approved for implementation on 2026-07-30.

## Why

`econoben.dev` has a credible editorial foundation, but it does not yet reflect the
real Early Release state of *Agent Memory* or the distinctive grebe-led visual
identity Ben has established. The current book funnel also has a broken mobile
email control, little conversion observability, stale chapter organization, and a
long sequence of visually equivalent cards that weakens the path from interest to
reading or subscribing.

## What Changes

- Replace the placeholder blue draft cover with the authoritative adult-grebe
  Early Release cover while preserving the original O'Reilly artwork exactly.
- Update homepage, book-page, and site metadata language from “upcoming” or “in
  progress” to the current Early Release state.
- Correct the book architecture so Chapter 3 closes Part I and Part II begins
  with Chapter 4.
- Recompose `/book` into a shorter conversion path: hero, available-now proof,
  Early Release value, build outcomes, chapter map, and one newsletter close.
- Repair the mobile newsletter form and ensure the site exposes only one
  `#subscribe` target per page.
- Activate Vercel Analytics and add explicit, privacy-conscious conversion
  events for O'Reilly reads, trial starts, book-page visits from the homepage,
  and successful subscriptions.
- Introduce a reusable site-wide “paper pond” layer: warm paper texture, sparse
  edge-positioned mascots, restrained teal/rust accents, and no more than two
  slow cross-screen swims at a time, with a complete reduced-motion freeze.
- Replace the generic homepage forest-led feature treatment with a composition
  that foregrounds Ben's writing, the real book, and the grebe identity without
  turning the whole site into a book microsite.
- Add automated and rendered quality gates for route continuity, internal and
  external links, responsive behavior, accessibility, motion preferences,
  metadata, and production builds.

## Capabilities

### New Capabilities

- `grebe-editorial-system`: Reusable paper, palette, mascot-placement, motion,
  accessibility, and responsive rules for animal-led site surfaces.
- `book-early-release-funnel`: Accurate Early Release content and a deliberate
  path from the homepage and `/book` to O'Reilly reading, trial, or subscription.
- `site-conversion-observability`: Vercel Analytics and named funnel events that
  make high-value actions measurable without invasive tracking.
- `site-quality-gates`: Automated and manual evidence for links, routes,
  metadata, responsive layouts, accessibility, and production readiness.

### Modified Capabilities

- None. This change operates within the route/content and behavior continuity
  requirements established by `preserve-site-parity-before-expansion`.

## Impact

- **Routes:** `/`, `/book`, shared site frame, newsletter surfaces, and metadata.
- **Components:** homepage, book page, editorial page frame, subscription form,
  analytics wrappers, and new decorative grebe components.
- **Assets:** authoritative book cover, grebe mascot sprites, and a subtle paper
  texture, stored under `public/assets/`.
- **Dependencies:** the already-installed `@vercel/analytics` package becomes
  active; no new analytics vendor is introduced.
- **Workflow:** a new OpenSpec change, link and responsive checks, production
  render evidence, and a reviewable non-`main` branch.
