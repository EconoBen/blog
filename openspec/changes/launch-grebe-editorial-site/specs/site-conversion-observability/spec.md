## ADDED Requirements

### Requirement: Production page analytics are active
The root application SHALL load Vercel Analytics once so production page views
are observable across the App Router site.

#### Scenario: Analytics is mounted once
- **WHEN** the root layout is rendered
- **THEN** exactly one Vercel Analytics component MUST be present and route changes MUST NOT create duplicate analytics clients

### Requirement: High-value funnel actions emit stable named events
The site SHALL emit explicit analytics events for the homepage-to-book action,
the O'Reilly read action, the O'Reilly trial action, and successful newsletter
subscription.

#### Scenario: Homepage book interest is measured
- **WHEN** a visitor activates a homepage link whose primary purpose is opening `/book`
- **THEN** the site MUST emit `homepage_book_click` with a non-identifying placement value

#### Scenario: O'Reilly reading is measured
- **WHEN** a visitor activates the primary O'Reilly reading action
- **THEN** the site MUST emit `oreilly_read_click` with the source page and CTA placement

#### Scenario: Trial interest is measured
- **WHEN** a visitor activates the O'Reilly trial link
- **THEN** the site MUST emit `oreilly_trial_click` with the source page

#### Scenario: Successful subscriptions are measured
- **WHEN** the subscribe API returns success
- **THEN** the site MUST emit `newsletter_subscribe_success` with the form placement and MUST NOT include the visitor's email address

### Requirement: Analytics preserves visitor privacy
Custom analytics payloads SHALL contain only low-cardinality, non-identifying
values required to distinguish funnel placement.

#### Scenario: Personal data is excluded
- **WHEN** any custom funnel event is emitted
- **THEN** the payload MUST NOT contain email addresses, typed form content, free-form page text, IP-derived data, or user identifiers

#### Scenario: Analytics failure does not block navigation
- **WHEN** the analytics client is unavailable or rejects an event
- **THEN** the requested navigation or successful subscription state MUST still complete
