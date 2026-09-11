> Status — DEPLOYED WITH APPROVAL, September 10, 2026. The reviewed site, including subsequent wing refinements, is live at https://econoben.dev from commit `e221eab7878402d012c3a4ff930bbecf318ad07b` through Vercel deployment `dpl_HopkTX98TsxzzYAAGa2kXcoqc9iS`. Local and live release checks pass; see `docs/releasing.md` for final evidence and retained limitations. Earlier local-only delivery notes below are historical. Merge into `main` and OpenSpec archive remain deferred until branch reconciliation.

## 1. Plan and baseline
- [x] 1.1 Record the six retained areas, user-requested demonstration removal, ownership, invariants, release gate and acceptance criteria.
- [x] 1.2 Resolve the contact default and current source/deployment association without changing remote state. Existing About address retained; optional user choice remains easy to apply centrally.

## 2. Cache and release safety
- [x] 2.1 Write meaningful failing cache/source-preservation tests, then correct mutable headers and destructive build cleanup.
- [x] 2.2 Exclude generated artifacts from the index while preserving local files, and align local runtime/build configuration.
- [x] 2.3 Provide one local verification/release preparation command with source/rollback evidence; prepare main and Vercel reconciliation for approval.

## 3. Reading and discovery
- [x] 3.1 Test and implement conservative topic aliases with old-URL compatibility and correct real-corpus counts.
- [x] 3.2 Add reference/topic-based related reading with honest reasons, retaining separately labeled chronological navigation.
- [x] 3.3 Expose existing audio near reading time and add a working section index for long articles, with unique fragments and no autoplay.

## 4. Mobile and current copy
- [x] 4.1 Build the visible Writing/Book/Search/Menu header with all destinations, Escape/focus behavior and 320px fit.
- [x] 4.2 Correct current customer descriptions and undated chapter summaries; reconcile public contact links without rewriting dated articles.

## 5. Book experience
- [x] 5.1 Improve book type hierarchy and spacing, and add chapter-specific feedback actions using the configured contact.
- [x] 5.2 Make chapter-update signup text and confirmation match the actual subscription scope; verify existing read destinations.

## 6. Remove the rejected memory demonstration
- [x] 6.1 Update the current proposal, design and requirements to retain six areas and remove the demonstration; preserve earlier execution evidence as superseded history.
- [x] 6.2 Remove the `/memory` route, dedicated components/styles/test, and homepage/book/navigation/sitemap links without disturbing the retained changes.

## 7. Validate the revised source and prepare review
- [x] 7.1 Run relevant regression/type/build/served checks against the revised source; retain cache returning-reader and source-preservation coverage. Record new source/build evidence instead of reusing the superseded snapshot.
- [x] 7.2 Inspect home, mobile menu, book, tags and long/short articles on desktop and phones; confirm the rejected example is absent and `/memory` no longer serves it.
- [x] 7.3 Review the removal and integration for stale links, imports, test references and regressions; address any must-fix findings.
- [x] 7.4 Append revised validation results and remaining deployment actions, then present the local preview with publishing explicitly held for approval.
