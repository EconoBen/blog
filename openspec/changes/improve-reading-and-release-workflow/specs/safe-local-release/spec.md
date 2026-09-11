## ADDED Requirements

### Requirement: Mutable responses remain updateable
Article HTML and unversioned public assets SHALL revalidate; only content-versioned assets MAY receive immutable caching. Framework-managed build asset caching SHALL remain framework-managed.

#### Scenario: A reader returns after an article changes
- **WHEN** a reader requests a previously read article after an update
- **THEN** the configured browser cache policy requires revalidation and the server can provide the changed content

### Requirement: Building preserves source assets
The default build and verification commands SHALL leave source media and originals intact. Generated build output SHALL be excluded from Git tracking while local files remain available.

#### Scenario: Build cleanup encounters source media
- **WHEN** the build cleanup is executed in a repository containing videos and originals
- **THEN** those source files are unchanged

### Requirement: Releases require approval and reproducible evidence
A documented local release preparation command SHALL run the meaningful regression suite, types, production build and served checks and record source revision plus rollback context. This task SHALL NOT deploy or push/merge code that automatically deploys without explicit user approval.

#### Scenario: Preparation without publishing approval
- **WHEN** preparation completes in this task
- **THEN** it produces local review evidence and proposed branch/settings reconciliation without running Vercel deployment or triggering a Git deployment

#### Scenario: Scope changes after a verified local snapshot
- **WHEN** user feedback removes a feature after the local release gate has passed
- **THEN** the prior snapshot is marked superseded and the revised source receives new validation evidence before it is presented for deployment approval
