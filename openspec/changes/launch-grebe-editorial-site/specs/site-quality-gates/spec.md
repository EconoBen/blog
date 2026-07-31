## ADDED Requirements

### Requirement: Existing public routes and content surfaces remain available
The refresh SHALL preserve the route and content continuity requirements from
the active site-redesign change.

#### Scenario: Core route family remains buildable
- **WHEN** the production build completes
- **THEN** `/`, `/posts`, `/posts/[slug]`, `/archive`, `/archives/[month]`, `/tags`, `/tags/[tag]`, `/talks`, `/talks/[id]`, `/publications`, `/about`, `/search`, `/code-ai`, `/code-ai/[id]`, `/book`, `/rss.xml`, `/sitemap.xml`, and `/robots.txt` MUST remain present

#### Scenario: Grebe work does not remove content
- **WHEN** the homepage and book refresh is compared with the production baseline
- **THEN** existing posts, talks, publications, tools, navigation destinations, and crawl surfaces MUST remain reachable

### Requirement: User-facing links are valid
The implementation SHALL verify internal links against the built application
and SHALL verify changed external destinations with a request method acceptable
to the destination.

#### Scenario: Internal link audit passes
- **WHEN** the production preview is crawled
- **THEN** every reachable internal navigation, CTA, tag, archive, post, talk, publication, code-tool, RSS, sitemap, and robots link MUST resolve without a 4xx or 5xx response

#### Scenario: Changed external destinations are checked
- **WHEN** the O'Reilly book, O'Reilly trial, GitHub, LinkedIn, email, and changed publication links are audited
- **THEN** each web destination MUST resolve or return an explicitly documented anti-bot response that is manually verified in a browser

### Requirement: Responsive layouts remain usable
Changed pages and shared components SHALL be checked at 390, 768, 1024, and
1440 CSS pixels.

#### Scenario: No unintended horizontal overflow
- **WHEN** `/` and `/book` are rendered at each target width
- **THEN** page content, newsletter controls, cover presentation, and decorative layers MUST stay inside the viewport except for a deliberately scrollable navigation rail

#### Scenario: Touch and keyboard actions remain usable
- **WHEN** a visitor uses touch or keyboard navigation on a changed page
- **THEN** primary CTAs, navigation, form controls, and focus indicators MUST remain visible and operable

### Requirement: Metadata and accessibility remain accurate
The homepage and book page SHALL expose accurate titles, descriptions, social
images, headings, alternative text, and decorative semantics.

#### Scenario: Metadata matches the rendered state
- **WHEN** homepage and book-page metadata is inspected
- **THEN** titles, descriptions, canonical URLs, and social descriptions MUST match the Early Release positioning and use a current visual asset

#### Scenario: Automated accessibility audit has no serious regressions
- **WHEN** the production preview is audited
- **THEN** changed pages MUST have no new critical or serious automated accessibility findings and MUST preserve a logical heading order

### Requirement: Production evidence proves readiness
The branch SHALL not be called ready until code checks, a production build,
runtime checks, and rendered desktop/mobile review all pass.

#### Scenario: Automated checks pass
- **WHEN** implementation is complete
- **THEN** formatting, type checking, tests, OpenSpec validation, production build, and link checks defined by the repository MUST pass or have a documented pre-existing exception

#### Scenario: Rendered evidence is reviewed
- **WHEN** the production preview is ready
- **THEN** fresh first-viewport and full-page screenshots of `/` and `/book` at desktop and mobile widths MUST be visually reviewed against the grebe editorial hierarchy and funnel requirements
