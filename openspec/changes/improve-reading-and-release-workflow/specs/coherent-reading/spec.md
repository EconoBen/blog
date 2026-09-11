## ADDED Requirements

### Requirement: Mobile destinations remain discoverable
The shared header SHALL expose Writing, Book, Search and Menu at 320px and wider. Menu SHALL retain all existing destinations, support keyboard operation and Escape, and close after navigation.

#### Scenario: A phone reader needs About
- **WHEN** the reader opens Menu
- **THEN** About and all secondary destinations are visible without hidden horizontal scrolling

### Requirement: Topics and related reading express meaningful relationships
Known aliases SHALL resolve to one canonical topic without losing access through existing URLs. Article endings SHALL suggest relevant posts using real references or shared canonical topics, with an accurate reason; chronological navigation SHALL remain separately labeled.

#### Scenario: Existing singular topic link
- **WHEN** the reader visits an existing LLM alias URL
- **THEN** the canonical LLMs collection includes both aliases' posts with correct counts and no duplicates

### Requirement: Reading controls appear before the article body
Posts with existing audio SHALL expose listening near reading time without autoplay. Longer articles SHALL offer a useful section index with working unique heading fragments and sticky-header clearance.

#### Scenario: A reader selects a section or audio
- **WHEN** the reader follows an index link or opens listening controls
- **THEN** the chosen section is readable or the existing audio player is available without navigating to the article end

### Requirement: Book actions and current copy are consistent
Book headings SHALL remain legible and differentiated on phones. Each chapter SHALL offer a feedback action identifying its chapter/title. Chapter-update forms SHALL accurately explain their book-related purpose and the actual subscription scope. Public contact links SHALL use one configured address; historical dated post bodies SHALL remain unchanged.

#### Scenario: Chapter feedback
- **WHEN** the reader activates feedback for Chapter 3
- **THEN** a mail action targets the configured contact with the chapter number and title supplied

### Requirement: Public pages reflect the retained feature scope
The site SHALL retain the approved navigation, reading, book and editorial improvements while omitting the rejected interactive memory example. Home, book, navigation and sitemap SHALL contain no entry for the example, and `/memory` SHALL NOT serve the demonstration or a replacement placeholder.

#### Scenario: Review after the demonstration is removed
- **WHEN** a visitor browses home, book, the mobile menu or the sitemap after the scope revision
- **THEN** the retained destinations remain available and no link introduces the removed demonstration

#### Scenario: The rejected route is requested
- **WHEN** a visitor requests `/memory` after removal
- **THEN** the site returns its normal not-found response without rendering the demonstration
