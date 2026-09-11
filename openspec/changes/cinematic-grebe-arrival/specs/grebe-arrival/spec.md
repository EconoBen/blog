## ADDED Requirements

### Requirement: Complete arrival choreography
The homepage SHALL offer the user-requested ordered sequence with one large adult horned grebe, a visible wake-up and shake, vertical departure with disturbed water, a drifting feather and light contact ripple, a sudden left-to-right crossing that reveals the website, and a landing into the existing pond.

#### Scenario: First homepage arrival
- **WHEN** an eligible visitor opens the homepage with the artwork available and ordinary motion preferences
- **THEN** the sequence plays once, in the specified order, and finishes on the usable homepage

#### Scenario: Landing handoff
- **WHEN** the arrival bird contacts the existing pond
- **THEN** the existing resident bird and reflection replace the animated bird without a visible duplicate, article selection or additional roaming swimmer

### Requirement: Visitor control and availability
The opening SHALL be silent, have a visible keyboard-accessible Skip opening control, and remain absent for reduced-motion visitors. It SHALL NOT conceal the website permanently when assets, storage or JavaScript fail. Playback SHALL NOT interrupt deep links, history restoration or someone already reading farther down the page.

#### Scenario: Skip or motion preference
- **WHEN** the visitor skips the opening, presses Escape, or enables reduced motion
- **THEN** the overlay disappears, all interaction and scroll restrictions are released, and ordinary site access is restored

#### Scenario: Return or failed preparation
- **WHEN** the opening already ran during the session or artwork cannot load within a bounded preparation interval
- **THEN** the normal site remains available without automatic replay

#### Scenario: Hidden tab or navigation
- **WHEN** the tab is hidden or the homepage unmounts
- **THEN** hidden time does not advance the visible choreography and unmounting removes every owned timer, animation frame, observer and restriction

### Requirement: Existing site preservation
The opening SHALL preserve accepted grebe styling, the silent dive and peeker, normal two-slot swimmer cadence, the exact book cover, six retained improvement areas and the removed memory example. It SHALL work at desktop and narrow phone sizes, using an observed DOM landing target.

#### Scenario: Roaming resumes
- **WHEN** playback completes or is skipped
- **THEN** the established scheduler starts with its immediate left swimmer and unchanged right-side timing, durations and maximum count

### Requirement: Local review before publishing
Implementation SHALL remain local until Ben explicitly authorizes publishing. New source and assets SHALL be covered by updated regression/build/served evidence and visual sequence review before presenting the result.

#### Scenario: Review handoff
- **WHEN** the sequence is ready
- **THEN** Ben receives a working local preview and verification results, with no Git push, hosted preview, Vercel mutation or production deployment
