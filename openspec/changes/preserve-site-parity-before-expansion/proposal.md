## Why

The redesign should move forward now, not wait behind a rigid parity phase. The real risk is not that pages look different while we build; it is that posts, routes, wording, metadata, or features silently disappear during the redesign.

## What Changes

- Define continuity guardrails so redesign work can proceed in parallel without losing posts, routes, wording, metadata, or current feature surfaces.
- Preserve the existing content corpus and feature inventory while allowing the new site shell, page designs, and book/newsletter surfaces to be built now.
- Replace the explicit parity-chart requirement with lighter-weight source inventories and validation checks focused on preventing content loss.
- Break the work into execution-ready tasks that cover shared site foundation, route modernization, feature continuity, and redesign review.

## Capabilities

### New Capabilities
- `route-content-parity`: Preserve the current route map, content corpus, and canonical wording while redesign work proceeds.
- `behavior-system-parity`: Preserve the current site behaviors and system outputs, including navigation, search, tags, archives, markdown/audio rendering, code-and-tools content, and crawl surfaces.
- `expansion-gates`: Add guardrails that allow expansion work to proceed without dropping baseline content or silently changing wording.

### Modified Capabilities
- None.

## Impact

- Affected code: `app/`, `app/components/`, `app/services/`, `app/config/`, `src/posts/`, metadata/SEO outputs, and route handlers.
- Affected systems: Next.js App Router pages, markdown content loading, audio manifest usage, unified search, publications/talks config rendering, RSS/sitemap/robots generation, and mobile/desktop navigation behaviors.
- Affected workflow: OpenSpec becomes the planning source of truth for a continuity-first redesign, and Beads becomes the execution breakdown for parallel redesign and preservation work.
