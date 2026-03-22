## ADDED Requirements

### Requirement: Expansion work is allowed when continuity is protected
The redesign SHALL allow expansion work to proceed as long as baseline content, routes, wording, and core behaviors remain protected.

#### Scenario: Expansion does not remove baseline content
- **WHEN** new IA, copy experiments, book surfaces, newsletter placement, editorial styling changes, or route additions are introduced
- **THEN** they MUST NOT remove existing posts, routes, wording-by-default, or feature-backed surfaces from the public site

#### Scenario: Exploratory redesign work does not erase the baseline
- **WHEN** exploratory redesign code exists in the working tree or proposal discussions
- **THEN** that work MUST NOT be treated as permission to drop baseline routes, content, or behaviors

### Requirement: Approved deltas are explicit and reviewable
Any deviation from the current site during the redesign SHALL be documented explicitly and reviewed as an intentional delta.

#### Scenario: Intentional continuity exceptions are documented
- **WHEN** a redesign implementation cannot exactly preserve an existing behavior, route, or content surface because of a technical constraint or planned deferment
- **THEN** the exception MUST be recorded with the affected route or feature, the reason, and the follow-up work needed to close the gap

#### Scenario: Refinement work follows continuity review
- **WHEN** the redesign has been reviewed for continuity
- **THEN** further copy, book, newsletter, and aesthetic refinements MAY proceed without creating a separate parity phase, provided the continuity guardrails remain in force
