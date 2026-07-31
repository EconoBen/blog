## ADDED Requirements

### Requirement: The site presents one restrained grebe editorial system
Every route using the shared editorial frame SHALL share a warm
technical-editorial “paper pond” system based on ivory paper, charcoal
typography, muted teal, rust, ochre, and the adult horned grebe identity from
the approved banner and book cover.

#### Scenario: Grebe styling supports the content hierarchy
- **WHEN** a visitor opens any editorial route at a normal desktop or mobile viewport
- **THEN** titles, writing, calls to action, and the authoritative book cover MUST remain visually dominant over paper texture and mascot decoration

#### Scenario: The broader site remains a personal platform
- **WHEN** the grebe system is introduced across the shared site frame
- **THEN** posts, talks, publications, code and tools, and Ben's professional identity MUST remain first-class destinations rather than being subordinated to a book-only microsite

### Requirement: Grebe decoration remains sparse and content-aware
Decorative grebes SHALL occupy unused edges, gutters, and section transitions
without sitting behind readable copy, controls, publication text, or other
authoritative content.

#### Scenario: Desktop density stays restrained
- **WHEN** an editorial route is rendered at 1024 CSS pixels or wider
- **THEN** the full long page MUST contain no more than ten decorative grebe instances and no more than two simultaneously moving mascots in the visible viewport

#### Scenario: Mobile density is reduced
- **WHEN** an editorial route is rendered below 768 CSS pixels
- **THEN** no more than four decorative grebes MUST appear across the full page and they MUST NOT reduce the readable content width

### Requirement: Grebe motion is optional, slow, and accessible
Ambient mascot motion SHALL use CSS transforms and opacity only, SHALL NOT
capture pointer input, and SHALL respect the visitor's reduced-motion setting.

#### Scenario: Default motion is calm
- **WHEN** the visitor has not requested reduced motion
- **THEN** no more than two moving grebes MUST use long-duration cross-screen swims with no abrupt jumps, scroll-jacking, or content movement

#### Scenario: Reduced motion freezes decoration
- **WHEN** `prefers-reduced-motion: reduce` is active
- **THEN** all grebe animation MUST be disabled while static decoration and every site function remain available

### Requirement: Decorative assets are semantically silent and efficient
Mascot and paper assets SHALL be implemented as presentation-only elements
while the real book cover SHALL remain meaningful content with accurate
alternative text and responsive image sizing.

#### Scenario: Assistive technology reads only meaningful imagery
- **WHEN** a screen reader traverses any editorial route
- **THEN** decorative grebes and texture MUST be hidden from the accessibility tree and the Agent Memory cover MUST expose an accurate descriptive alternative

#### Scenario: Decoration does not block interaction
- **WHEN** a user clicks, taps, selects text, or uses the keyboard near a grebe
- **THEN** the decorative layer MUST NOT intercept input or obscure the focus indicator
