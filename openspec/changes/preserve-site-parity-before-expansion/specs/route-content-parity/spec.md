## ADDED Requirements

### Requirement: Preserve the current public route inventory while redesign proceeds
The site SHALL keep the current public route inventory available while redesign and expansion work proceed in parallel.

#### Scenario: Canonical public routes are known
- **WHEN** redesign work is planned or implemented
- **THEN** it MUST include `/`, `/posts`, `/posts/[slug]`, `/archive`, `/archives/[month]`, `/tags`, `/tags/[tag]`, `/talks`, `/publications`, `/about`, `/search`, `/code-ai`, `/code-ai/[id]`, `/rss.xml`, `/sitemap.xml`, and `/robots.txt`

#### Scenario: Existing routes remain available
- **WHEN** a user visits an existing public route during the redesign
- **THEN** that route MUST remain available and reachable even as new surfaces or layouts are introduced

### Requirement: Preserve the existing content corpus and canonical wording
The site SHALL preserve the existing content corpus and page wording by default until a later approved change explicitly modifies that wording.

#### Scenario: Post corpus matches the existing blog
- **WHEN** the post corpus is loaded from `src/posts/`
- **THEN** the redesigned site MUST expose the same post slugs, titles, dates, summaries, tags, and markdown bodies as the current site

#### Scenario: Canonical wording is not changed accidentally
- **WHEN** an existing page is reimplemented during redesign
- **THEN** its user-facing wording MUST match the current site unless an approved change explicitly records the intentional copy update

### Requirement: Preserve existing content surfaces and metadata outputs
The site SHALL preserve the current content surfaces and associated metadata outputs while page designs evolve.

#### Scenario: Post detail preserves rendering surfaces
- **WHEN** a user opens `/posts/[slug]`
- **THEN** the redesigned site MUST preserve markdown rendering, tag links, metadata generation, and audio player availability consistent with the current implementation

#### Scenario: Crawl and feed outputs remain intact
- **WHEN** crawlers or readers access `/rss.xml`, `/sitemap.xml`, or `/robots.txt`
- **THEN** the redesigned site MUST preserve those outputs and their current content sources while redesign work is underway
