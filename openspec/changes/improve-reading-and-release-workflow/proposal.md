> Status: REVISED LOCAL IMPLEMENTATION VERIFIED. The interactive memory example is removed; six retained areas pass validation. No deployment or Git-triggered publishing without explicit approval.

## Why

The accepted grebe identity now needs equally clear reading, book, navigation and release workflows. A live cache defect and unsafe build cleanup make maintenance fragile; fragmented discovery and hidden mobile controls make the writing harder to use.

## What Changes

- Revalidate mutable article/asset responses, remove conflicting framework cache overrides, preserve source files during builds, and prepare a repeatable release gate and source/rollback record.
- Stop tracking generated build output while preserving local files; prepare branch and Vercel-setting reconciliation without publishing or changing production.
- Replace mobile scrolling navigation with visible Writing, Book, Search and Menu controls, preserving every destination and keyboard access.
- Normalize topic aliases, add genuinely related article suggestions, expose existing audio near reading time and add a section index for longer articles.
- Improve book typography, chapter feedback and book-specific newsletter wording without implying unsupported preference segmentation.
- Correct current customer descriptions and undated chapter summaries, and centralize public contact links while preserving dated article text.

The six areas above remain approved. Subsequent user feedback explicitly removes the interactive memory example from scope: remove its route, components, styling, test, and homepage/book/navigation/sitemap links. Do not replace it with another demonstration or a placeholder.

## Capabilities

### New Capabilities
- `safe-local-release`: Source-preserving builds, validated cache policies, reproducible release preparation and explicit deployment approval.
- `coherent-reading`: Accessible mobile navigation, normalized topics, contextual article reading and chapter feedback.

### Modified Capabilities
None; previous unarchived changes remain historical and their accepted grebe/motion/content safeguards continue to apply.

## Impact

Next.js config, deployment/build scripts, Git tracking, shared navigation, article/tag services and pages, book/newsletter components, homepage/About current copy, and removal of the rejected local demonstration. No new runtime dependency is planned. Existing issues #81 (cache) and #82 (editorial) supply defect context. Dependency maintenance #80 is separate from the six retained improvement areas and will not be expanded silently.
