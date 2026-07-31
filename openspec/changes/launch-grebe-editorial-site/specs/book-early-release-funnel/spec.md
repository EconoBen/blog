## ADDED Requirements

### Requirement: The site reflects the current Agent Memory release state
The homepage, book page, root metadata, and social metadata SHALL describe
*Agent Memory* as an O'Reilly Early Release book and SHALL use the authoritative
adult-grebe cover supplied by Ben.

#### Scenario: The real cover replaces the placeholder
- **WHEN** a visitor opens `/book` or sees the homepage book treatment
- **THEN** the page MUST show the supplied adult horned grebe Early Release cover and MUST NOT show the blue cloth draft placeholder or the superseded chick cover

#### Scenario: Public language is current
- **WHEN** a crawler or visitor reads homepage, book-page, Open Graph, or Twitter metadata
- **THEN** the content MUST say that the book is in Early Release and MUST NOT call it merely upcoming, forthcoming, or unpublished

### Requirement: The chapter map matches the current manuscript architecture
The public chapter map SHALL place Chapters 1 through 3 in Part I and SHALL
begin Part II with Chapter 4.

#### Scenario: Part I closes with Chapter 3
- **WHEN** the chapter map is rendered
- **THEN** Chapter 3, “Choosing What Becomes Memory,” MUST appear as the final chapter of Part I

#### Scenario: Part II begins with the write path
- **WHEN** the chapter map is rendered
- **THEN** Chapter 4, “How Memory Gets Written,” MUST appear as the first chapter of Part II

### Requirement: The book page uses one deliberate conversion sequence
The `/book` page SHALL move through hero, available-now proof, Early Release
value, practical outcomes, chapter map, and one closing subscription surface
without repeating equivalent sections or calls to action.

#### Scenario: Primary reading action is immediately available
- **WHEN** a visitor lands on `/book`
- **THEN** the first viewport MUST include an O'Reilly reading action, a chapter-availability statement, the real cover, and a visually secondary updates action

#### Scenario: Only one subscription target exists
- **WHEN** the page DOM is inspected
- **THEN** exactly one element MUST have the `subscribe` id and exactly one newsletter form MUST appear on `/book`

#### Scenario: Repeated card grids are consolidated
- **WHEN** a visitor scrolls between the hero and chapter map
- **THEN** the page MUST use differentiated editorial layouts rather than presenting audience, questions, Early Release value, and outcomes as four consecutive same-weight card grids

### Requirement: O'Reilly destinations are accurate and attributable
The primary read action and the trial action SHALL point to the current O'Reilly
destinations, open safely in a new context, and preserve campaign attribution.

#### Scenario: Read action targets the current book
- **WHEN** a visitor activates the primary book CTA
- **THEN** the browser MUST open the O'Reilly Agent Memory page at `/library/view/agent-memory/0642572370473/` with `utm_source=econoben`, a page-appropriate `utm_medium`, and `utm_campaign=early_release`

#### Scenario: Trial action remains available
- **WHEN** a visitor without access activates the trial link
- **THEN** the browser MUST open O'Reilly's individual free-trial destination with Econoben campaign attribution

### Requirement: The newsletter form remains usable on small screens
The shared subscription form SHALL preserve a legible email field, submit
button, validation state, and success or error message at mobile widths.

#### Scenario: Mobile signup controls do not collapse
- **WHEN** the form is rendered at 390 CSS pixels
- **THEN** the email field MUST remain visibly labeled or placeholder-described, the submit button MUST stay inside the viewport, and neither control MUST be reduced below a usable width

#### Scenario: Successful signup closes the loop
- **WHEN** the subscription API returns success
- **THEN** the form MUST show a clear success message without duplicating the entered email in analytics or page output
