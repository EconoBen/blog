## ADDED Requirements

### Requirement: Composed grebe artwork
The site SHALL use an adult horned grebe with charcoal plumage, rust neck, golden ear tufts and fine ink detail. Background birds MUST remain pointer-transparent and hidden from assistive technology. The viewport SHALL contain at most two roaming swimmers, one arriving from each side with randomized timings and gaps, plus a periodic edge peek; the book-reading grebe SHALL be an occasional right-to-left visitor and SHALL NOT remain in the homepage pond.

#### Scenario: Responsive reading
- **WHEN** a reader views the homepage or an article at mobile, tablet or desktop width
- **THEN** the site shows layered swimming decoration behind content with reduced opacity in the reading area and no horizontal page overflow. Background sprites SHALL have genuine alpha without a rectangular matte.

### Requirement: Existing platform continuity
The refinement SHALL retain all navigation destinations, current post metadata, exact book-cover source, subscription form and tracked book links.

#### Scenario: Navigation and book discovery
- **WHEN** a reader follows navigation or the homepage book action
- **THEN** the existing route resolves with the same content and the book remains described as Early Release.

### Requirement: Accessible presentation
The refined controls MUST show visible keyboard focus and remain usable at narrow widths. The header SHALL use plain text navigation with a visible current-page indication and SHALL NOT contain a pond pause button. Reduced-motion preference SHALL disable ambient animation.

#### Scenario: Narrow viewport
- **WHEN** the page is rendered at 390 CSS pixels
- **THEN** the title, primary actions, artwork and latest post stack in reading order and contact links do not overlay content.

### Requirement: Playable homepage pond
The homepage SHALL offer an accessible “Find an article” button for pointer, touch and keyboard activation. Each accepted activation SHALL coordinate one bounded dive, surface wake and bubble sequence around the fixed waterline. Repeated activation during an active dive SHALL NOT stack additional choreography. The reading visitor SHALL hold the exact current book cover.

#### Scenario: Activate the coordinated water response
- **WHEN** a visitor clicks, taps or uses the keyboard to activate “Find an article”
- **THEN** the bird and its surface wake follow the same fixed-waterline choreography, with one active sequence and no accumulating click-positioned ripple instances.

The earlier pointer-positioned ripple and six-instance limit are historical behavior, superseded by the selected coordinated dive and wake.

#### Scenario: Reduced motion
- **WHEN** a visitor requests reduced motion through their system preference
- **THEN** ambient pond animation is disabled and the viewport drift field is hidden.

### Requirement: Current release status
The homepage, About page and book page SHALL report Chapters 1–3 available and Chapter 4 next, preserving dated historical articles.

#### Scenario: Book release progress
- **WHEN** a reader opens the book page
- **THEN** the status shows three live chapters, Chapter 3 is marked live in the contents, and Chapter 4 is next.

### Requirement: Discoveries in the pond
Visitors SHALL be able to activate the main grebe to dive and retrieve a real archive article. Repeated activation SHALL remain bounded; reduced motion SHALL reveal the result without a dive animation. Pointer and keyboard input SHALL both work.

#### Scenario: Dive for an article
- **WHEN** a visitor activates the grebe
- **THEN** it dives and resurfaces with an article link, without automatically navigating.

### Requirement: A remembered reading place
The site SHALL store only the latest meaningful unfinished reading position on the visitor’s device, handle unavailable or malformed storage, and offer explicit resume and dismissal.

#### Scenario: Return to reading
- **WHEN** a visitor returns home after partially reading an article
- **THEN** a grebe bookmark links to the saved reading position; ordinary article visits SHALL NOT unexpectedly restore scroll.

### Requirement: Curious and occasional wildlife
The peeker SHALL respond to a nearby pointer without intercepting clicks. Rare meetings SHALL reuse the two swimmer slots and wait for a gap. Hidden tabs and reduced motion SHALL stop ambient scheduling. A visible full-motion visit SHALL begin with one left swimmer already in view as soon as the client scheduler mounts, one quarter of the way through the existing crossing. This startup correction SHALL preserve crossing velocity, the 34–49-second full crossing duration, the opposite swimmer's 2–4-second arrival, ordinary 9–23-second gaps, occasional reading visitors and the two-swimmer cap.

#### Scenario: Early arrival and later encounter
- **WHEN** a visitor opens a visible page with full motion enabled and its client scheduler mounts
- **THEN** one left swimmer is already moving in view, the opposite swimmer starts after 2–4 seconds, and later arrivals and encounters retain the existing timing and never exceed two swimmers. This guarantee begins after hydration, not in server-rendered markup.

#### Scenario: Restart ambient motion
- **WHEN** visibility or reduced-motion preferences stop and restart the scheduler, including changes batched into one render
- **THEN** the restarted first swimmer receives a fresh animation node, its original duration and delay are preserved, and no previous scheduler or timer continues running. A hidden or reduced-motion page SHALL contain no active roaming swimmers.

### Requirement: Chapter shoreline
The book page SHALL label its existing interactive chapter graphic “Explore the chapters.” It SHALL preserve the graphic, keyboard-operable chapter stops, authoritative chapter titles and descriptions, three-live/Chapter-4-next release state, tracked reading links and detailed contents. Plain-language copy SHALL NOT remove or replace the chapter interaction.

#### Scenario: Select a chapter
- **WHEN** a visitor selects a shoreline stop
- **THEN** the chapter title, description and release state appear, with the existing reading link for live chapters.

### Requirement: Literal discovery copy
Homepage discovery controls and related-article navigation SHALL use plain, literal language without puns or invented navigation metaphors. The hero SHALL use “Find an article,” “Suggested article,” “Read article” and “Related articles.” Finding states SHALL use “Finding an article…,” “Retrieving an article…” and “Article selected.” The related section SHALL show a plain selected-article and related-article layout with verified reasons and distinct “Read article” and “View related articles” actions. Authoritative article prose, titles and book content SHALL remain unchanged.

#### Scenario: Read or explore a related article
- **WHEN** a visitor reaches “Related articles”
- **THEN** a “Read article” link opens the chosen article, while “View related articles” changes the shared selection and focuses its heading without navigating away.

### Requirement: Physical pond response
The hero grebe SHALL respond gently to pointer approach, visibly anticipate a dive and gradually submerge through a fixed water surface before resurfacing continuously. Activation SHALL reveal bounded water and bubble effects. The production pond SHALL remain silent and SHALL NOT initialize audio or present a sound control.

#### Scenario: Dive with bubbles
- **WHEN** a visitor activates the grebe
- **THEN** the bird gradually submerges, bounded water and bubble effects appear, and the existing article discovery completes; repeated input cannot stack concurrent dives.

#### Scenario: Silent or reduced-motion visit
- **WHEN** a visitor uses the production pond, including with a reduced-motion preference
- **THEN** the pond produces no sound, and reduced-motion visits bypass pointer/dive choreography while preserving article discovery.

### Requirement: Essays connected through real topics
The homepage SHALL offer a bounded editorial pond explorer whose named entries represent actual essays and whose connections identify shared source tags or verified publication references. The selected atlas-and-dusk treatment SHALL replace the previous arbitrary-light presentation with a legible selected neighborhood. It SHALL have keyboard selection, visible focus, separated mobile touch targets and an ordinary linked list of all represented essays. Related-essay selection SHALL preserve meaningful keyboard focus. It SHALL NOT fabricate thematic relationships or add continuous background animation.

#### Scenario: Follow a shared idea
- **WHEN** a visitor chooses a named entry or related essay
- **THEN** the title, date, excerpt, real topics and article link update together, and each connection states its verified topic or reference basis.

### Requirement: Reliable reading and discovery
Audio controls SHALL support keyboard seeking, metadata-only readiness and retry after failure. Search SHALL distinguish failed requests from empty results and cancel stale results. Reading bookmarks SHALL accept every valid published article slug. Subscription confirmation SHALL require an affirmative upstream response and SHALL NOT log subscriber email addresses.

#### Scenario: Service failure
- **WHEN** search or subscription cannot reach a working service
- **THEN** the interface reports the failure honestly and offers recovery without claiming a successful search or subscription.

### Requirement: Efficient publication delivery
Articles SHALL render Markdown, math and syntax highlighting on the server, keeping client-side islands limited to interactions. Local article media SHALL carry intrinsic dimensions and responsive optimized sources. Post-list and search payloads SHALL omit unused full Markdown bodies. Expanded code previews SHALL load their rendering libraries on demand.

#### Scenario: Read a technical essay
- **WHEN** a reader opens a technical article
- **THEN** code, math, tables, diagrams and same-page footnotes remain functional without downloading the full Markdown/highlighter runtime in the article's initial JavaScript.


### Requirement: Comparative creative choice
The second round SHALL present three local interactive visual studies: dusk pond, naturalist field atlas and underwater cutaway. All SHALL use the same real essays and representative interaction, support phone and desktop, and explain differences. Final replacement of the existing homepage/explorer SHALL follow the user's selected combination: atlas paper, ink and annotations with the dusk pond's natural reed bank, layered water and reflection. The studies SHALL remain available for comparison during final refinement.

#### Scenario: Compare a discovery
- **WHEN** the user changes the study direction
- **THEN** the current essay and its verified relationships remain comparable, the prior motion/audio stops, and the visual environment changes distinctly.

#### Scenario: Apply the selected combination
- **WHEN** the final homepage and explorer are implemented
- **THEN** their paper-and-ink editorial treatment and natural shoreline form one composed environment, with the production pond silent under the completed sound decision.

### Requirement: Legible and rewarding discovery
A discovered essay SHALL appear with its title, useful excerpt, reading time and explicit reading action in a composed reveal connected to the grebe's return. Related essay placement SHALL have a meaningful selected-neighborhood structure, and each relationship SHALL accurately state its basis and direction.

#### Scenario: Return with a discovery
- **WHEN** a visitor activates a full-motion dive
- **THEN** surfacing begins at 2.1 seconds, the current essay remains visible until the returned discovery replaces it at 3.15 seconds, and the motion finishes at 3.8 seconds without queuing a concurrent dive or shifting the reserved article layout.

#### Scenario: Follow a verified connection
- **WHEN** a visitor chooses a related essay
- **THEN** the displayed relationship distinguishes a shared topic from a verified reference without inventing continuation or prerequisite claims.

### Requirement: Shared discovery context
Hero discovery and the essay explorer SHALL share one selected essay. Selecting an essay SHALL update the article and its named neighborhood together. A deliberate list or related-essay selection SHALL focus the selected heading even when the essay is already selected; a later dive SHALL NOT inherit that focus request or move focus away from its initiating control.

#### Scenario: Discover and continue exploring
- **WHEN** the grebe returns a new essay and the visitor then selects one of its verified neighbors
- **THEN** hero discovery and the explorer display the same selected essay and relationship context throughout the flow, with a separate explicit action required to read the article.

#### Scenario: Select the current essay again
- **WHEN** a visitor chooses the already selected essay from the ordinary essay list
- **THEN** its heading receives focus immediately, and a later dive preserves focus on the dive control while updating the shared article context.

#### Scenario: Repeated discovery with reduced motion
- **WHEN** a visitor activates “Find an article” repeatedly with reduced motion, including activations batched in one render
- **THEN** the live region announces the actual resulting selected title, changes for subsequent discoveries, and leaves focus on the initiating control without scheduling delayed announcement timers.

### Requirement: Sound quality decision
The production pond SHALL remain silent because the audition has not demonstrated clear value. The optional water audition SHALL remain only in the local comparative studies, silent by default and requiring explicit enabling plus deliberate activation. Study sound SHALL be easy to mute and cancel on hidden, unmounted or replaced interaction. Validation SHALL distinguish browser audio lifecycle evidence from physical speaker/headphone or perceptual listening claims. This decision SHALL NOT remove intentional article audio controls.

#### Scenario: Use the production pond
- **WHEN** a visitor activates the production “Find an article” control
- **THEN** article discovery completes with no pond AudioContext or sound control; no further sound choice is pending.

#### Scenario: Silent comparison
- **WHEN** the user previews the experience with sound disabled
- **THEN** the full discovery remains available and no audio context or sound is started by the dive.

### Requirement: Creative completion gate
The second round SHALL include independent critique, relevant browser verification and the user's review before goal completion. A working prototype or passing automated tests alone SHALL NOT satisfy this requirement.

#### Scenario: Studies are technically ready
- **WHEN** the comparative studies are implemented and tested but no direction has been chosen
- **THEN** the goal remains active and final visual integration remains pending.

#### Scenario: Direction chosen with final work remaining
- **WHEN** the user has selected the visual combination but its latest motion validation or final user review remains incomplete
- **THEN** the goal remains active and those tasks remain open; completed comparison evidence SHALL NOT be represented as final production acceptance.

#### Scenario: Accepted review with a bounded correction
- **WHEN** the user accepts the refinement subject to an immediate first swimmer without pace or density changes
- **THEN** implementing and validating that correction satisfies the final user-review task without another approval request. Goal completion SHALL still wait for the final production build and smoke check; an unmerged local change SHALL NOT be archived or deployed as a consequence of creative acceptance.
