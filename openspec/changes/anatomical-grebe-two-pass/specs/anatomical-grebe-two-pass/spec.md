## ADDED Requirements

### Requirement: Anatomy is established before integration
The implementation team SHALL examine real grebe flight references and the existing opening before choosing the revised anatomy solution. The reference study SHALL address shoulder placement, body/wing proportions, elbow and wrist movement, feather overlap, perspective and the body's response to a stroke. An isolated local study SHALL demonstrate unfolding and at least two complete wingbeats, with normal-speed playback and adjacent frames reviewed before the revised anatomy is integrated into the opening. Existing artwork or deformation SHALL NOT be treated as sufficient merely because it passes geometry tests.

#### Scenario: Anatomy study review gate
- **WHEN** the isolated study is offered for integration
- **THEN** recorded reference observations, normal-speed playback and adjacent unfolding/downstroke/recovery frames support a convincing animal, with concrete critique addressed or the study revised before integration

### Requirement: Coordinated articulated wings
Wings SHALL unfold through visibly connected shoulder, elbow and wrist motion while retaining plausible full-size anatomy. Near and far wings SHALL depict different perspectives of the same coordinated movement. Feather overlap and primary motion SHALL distinguish a broad powered downstroke from a folded recovery. Lift, neck posture and body response SHALL accompany the stroke without excessive distortion of the engraved identity. The result SHALL avoid miniature wings growing into place, flat rotating panels, a duplicate painted closed wing, disconnected shoulders and abrupt shape substitutions.

#### Scenario: Unfolding and repeated strokes
- **WHEN** the bird unfolds and completes two full wingbeats in the study and the integrated sequence
- **THEN** its attachment, joint sequence, perspective, silhouette and body response remain coherent both at normal speed and across adjacent frames

### Requirement: Retain the opening's setting and preceding beats
The film SHALL retain the adult grebe's engraved identity, warm paper, atmospheric teal pond, waking, water shake, falling feather and gentle contact ripple. The feather SHALL settle visibly onto its ripple's origin before the first book-bearing pass. Water disturbance SHALL remain connected to the departing bird and feather. The pond SHALL conceal the underlying website through the book presentation until the intended reveal during the second pass.

#### Scenario: Opening through feather contact
- **WHEN** an eligible visitor watches the beginning
- **THEN** waking, shake, takeoff, feather descent and quiet ripple form a coherent sequence without background rectangles, page bleed-through, detached water effects or a skipped contact beat

### Requirement: First pass introduces the actual book
After feather contact and the quiet ripple, the same grebe SHALL make a clearly visible left-to-right pass that brings in one restrained book presentation. That presentation SHALL use the actual local cover, book title, Benjamin Labaschin's name, O'Reilly attribution and one concise early-release update sourced from the site's canonical book data. Published chapter information SHALL derive from chapter statuses rather than an independent fixed chapter count. The cover's typography SHALL remain crisp. Bird and presentation paths SHALL keep the beak, feet, wings and book visually distinct.

#### Scenario: Book enters with the first crossing
- **WHEN** the first left-to-right pass traverses a desktop or phone viewport
- **THEN** the book's entry is visibly connected to the passage through restrained trailing motion, a small settling turn and a soft shadow, without an oversized banner or distracting prop

#### Scenario: Published chapter statuses change
- **WHEN** the canonical chapter data contains a different set of live chapters
- **THEN** the presentation's concise update reflects that data accurately without a second manually maintained count

### Requirement: A readable quiet book interval
The settled presentation SHALL remain readable for approximately three to four seconds before its removal. Its cover SHALL be recognizable and its update readable on a phone without zoom or horizontal overflow. Language SHALL be direct, with no puns, whimsical slogans or added decorative messages. The temporary presentation SHALL contain no buttons or links that disappear before a visitor can use them. Persistent book information and navigation SHALL remain available on the normal site after completion or interruption.

#### Scenario: Phone reading pause
- **WHEN** the presentation settles on a 320 or 390 pixel wide phone viewport
- **THEN** identity and update remain legible within the viewport for the quiet interval, with no competing bird traversal or unnecessary presentation motion

### Requirement: Second pass removes the presentation and reveals the site
The grebe SHALL make a second unmistakable left-to-right crossing on a path or at a depth distinct from the first. Its passage SHALL remove the same book presentation and reveal the actual homepage in one coordinated sequence. The first crossing and reading interval SHALL remain visually distinct from this reveal; the presentation SHALL NOT disappear independently of the second passage.

#### Scenario: Second crossing and removal
- **WHEN** the quiet book interval finishes
- **THEN** the second traversal visibly carries away the presentation while exposing the real site, with no duplicated book or incidental early page reveal

### Requirement: One continuous bank and resident landing
The second pass SHALL continue into a coherent bank and descending arc toward the existing pond, decelerating into visible water contact and the resident's resting state. It SHALL preserve one bird identity, one silhouette and continuous pose/position/scale through the transition. It SHALL NOT teleport, crossfade doubled bodies or make an unexplained artwork replacement. Completion SHALL leave the bird and visible article invitation usable without an unnecessary post-contact scroll correction.

#### Scenario: Crossing through contact on responsive layouts
- **WHEN** the second crossing, bank and landing play on desktop, portrait phone or short landscape
- **THEN** the motion reads as one continuous animal movement, the body and waterline meet visibly, the resident replaces it without a jump, and the final invitation and grebe remain within the usable viewport

### Requirement: Shared pacing and bounded rendering
The complete opening SHALL last roughly 16–18 seconds, with timing adjusted through visual review to preserve the quiet beats and the three-to-four-second book hold. One visible elapsed clock SHALL coordinate character poses, presentation motion, reveal, water and handoff, and SHALL pause while the document is hidden. Only one arrival actor SHALL be visible at a time. Preparation, per-frame work and retained buffers SHALL stay bounded; unchanged artwork SHALL NOT be repeatedly prepared between flight phases. The opening SHALL remain silent.

#### Scenario: Hidden tab and return
- **WHEN** the document becomes hidden during the book hold or a flight pass and later becomes visible
- **THEN** the visual clock resumes from the same point, preserving the reading time, character/presentation synchronization and stage continuity

#### Scenario: Final performance review
- **WHEN** the frozen candidate is measured in unrecorded desktop and phone-viewport playback
- **THEN** per-phase timing, initial setup cost, resource bounds and limitations are recorded, and visible playback stutters trigger investigation rather than being excused by passing source tests

### Requirement: Preserve interruption and normal site access
Immediate Skip and Escape SHALL remain available during preparation and every film stage, including the reading interval. Replay, once-per-session/history eligibility, reduced-motion handling, navigation cleanup and bounded artwork preparation SHALL remain effective. New essential artwork and the book cover SHALL either be ready before their visible use or cause a graceful return to the usable site. Completion, Skip, navigation and unmount SHALL clear owned listeners, timers, canvases, locks and stale asynchronous work, restoring focus and scroll according to the existing lifecycle contract. The site SHALL remain usable without JavaScript. Reduced motion SHALL bypass the automatic film and hide its replay control.

#### Scenario: Skip or Escape during the book interval
- **WHEN** a visitor skips or presses Escape while the book is entering, held or leaving
- **THEN** the film and book disappear immediately, the original focus/scroll state is restored appropriately, no inert or overflow lock remains, and later pending work cannot restart the film

#### Scenario: Replay followed by interruption
- **WHEN** a visitor replays from below the fold and then skips, navigates or unmounts the homepage
- **THEN** the owning lifecycle releases its resources without overriding the new route or leaving the presentation on screen

#### Scenario: Reduced motion or missing new artwork
- **WHEN** reduced motion is requested, essential new artwork fails to load/decode, the cover is unavailable or preparation exceeds its deadline
- **THEN** readable site content, book information and navigation remain available without an unsolicited late start, broken temporary presentation or invisible interaction lock

### Requirement: Preserve restrained pond behavior
The arrival SHALL keep the existing two-slot roaming schedule, pacing and maximum of two background swimmers. Roamers and the peeker SHALL remain held while the opening owns the scene. Completion or an eligibility/failure/Skip bypass SHALL resume the existing scheduler with its established immediate-swimmer behavior. The resident handoff SHALL NOT create an additional roaming bird or a second resident, and normal pointer/dive/article interactions SHALL continue to work.

#### Scenario: Resume after the new longer opening
- **WHEN** the opening ends normally or is bypassed/interrupted
- **THEN** the ordinary pond resumes with the original cadence and concurrency limit, one resident and functional existing controls

### Requirement: Current visual evidence and local delivery
Completion SHALL require independent artistic critique, current normal-speed desktop and phone recordings, and adjacent frames of unfolding, recovery, book arrival/removal, banking and contact. Evidence SHALL identify its source/build and distinguish visual review from automated checks or performance measurement. The final local candidate SHALL pass relevant regressions, types, production preparation/served checks and strict OpenSpec validation, with limitations recorded and a working local preview retained. Existing work and historical evidence SHALL be preserved. No Git push, remote merge, hosted preview, deployment or remote settings mutation SHALL occur without explicit user approval.

#### Scenario: Candidate is declared ready for review
- **WHEN** the new opening is delivered locally
- **THEN** every requirement has current evidence in the QA inventory, visual defects from independent review are resolved, the preview matches the verified source, and publishing remains separately approval-gated
