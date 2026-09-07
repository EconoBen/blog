# Social and browser identity

The dedicated share card identifies Ben Labaschin and Agent Memory using warm paper, large literal typography, the exact current O’Reilly cover and one adult horned grebe portrait. The separate SVG mark simplifies that identity for browser tabs.

## Assets and reproduction

- Share card: `public/social/ben-labaschin-agent-memory-v3.png`, 1200 × 630 PNG, 215,497 bytes.
- Authoritative cover: `public/assets/agent-memory-cover-early-release.png`. Its original pixels and text are preserved, with the presentation matte cropped using the same proportions as the website’s BookCover component.
- Generated portrait source: `design/social/grebe-portrait-source-v1.png`, 1254 × 1254 RGBA PNG. Created with the built-in image-generation tool on September 6, 2026; original retained at `/Users/blabaschin/.codex/generated_images/01a0732f-8805-7692-a91a-e5cc1ba15962/exec-13e6d2f2-61e7-4fab-b71c-2613fefd1ec8.png`.
- `node scripts/generate-social-card.mjs` composes the card deterministically from the portrait, exact cover, literal text and the Geist font bundled with the installed Next.js dependency. The generated PNG is committed; generation is not part of the production build.
- `node scripts/generate-grebe-icons.mjs` renders the native SVG into PNG sizes 32, 180, 192 and 512, a maskable 512 icon and a 16/32/48 ICO. The maskable symbol fits within the central 80% safe circle. The exact source is `public/icons/grebe-v1.svg`.
- `node scripts/verify-social-identity.mjs` checks metadata behavior and real binary assets. Add `SITE_URL=http://localhost:3110` or a production URL to verify server-returned LinkedIn crawler metadata and HTTP assets.

No publication artwork or typography inside the book cover was regenerated. The portrait is supporting art, and the SVG is a separate code-native simplification. Future replacements should increment asset filenames and metadata references together.

## Final generation prompt

Use case: logo-brand. Create a new supporting mascot portrait for Ben Labaschin's econoben.dev website social identity, on a genuinely transparent background. Square canvas, single isolated adult horned grebe HEAD AND CURVED NECK ONLY, facing RIGHT in crisp side profile. The first reference locks the adult horned grebe identity: sharp pointed charcoal bill, black charcoal cap and cheek, red-orange very small eye, distinct broad orange-gold horn/ear tuft swept back, rich rust neck with pale cream throat edge. The second reference sets the warm technical-editorial ink-and-gouache style. Make the silhouette bold, compact and immediately recognizable at 32 pixels; broad confident flat colored shapes, very restrained few engraved feather marks, no fine hairline-only shapes or busy crosshatching. Portrait fills most of the square with modest equal padding; horn tuft stays fully inside frame. Head large, long neck curves softly into a compact shoulder/upper breast at bottom, no feet/body/water/ripples/scene. Intelligent naturalistic bird, no smile, no cute oversized eyes, no generic duck bill, no penguin, no crest like a cockatoo. Palette charcoal #211e1f, warm rust #d95a2e, golden ochre #d6a03b and warm ivory. No text, no logos, no book (the exact authoritative book will be placed separately in deterministic composition), no border, no shadow, no colored background. This image is supporting artwork, not the final social card. Preserve true transparency.

The two references were the animal-editorial-design skill’s `grebe-cover-reference.png` and `grebe-banner-anchor.png`. The generated result was more detailed than the requested tiny mark, so the native SVG provides the small-icon simplification.

## LinkedIn refresh

LinkedIn requires Open Graph title, image, description and URL, and recommends a 1.91:1 image of at least 1200 × 627 under 5 MB. This card is 1200 × 630 and about 210 KiB. See [LinkedIn’s requirements](https://www.linkedin.com/help/linkedin/answer/a521928).

After publishing, use [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/) with `https://econoben.dev/`. LinkedIn says refreshes apply to new posts; existing posts keep their previous preview. Remove and re-add the link preview in an unpublished draft after refresh. See [LinkedIn’s refresh guidance](https://www.linkedin.com/help/recruiter/answer/a6233775).

## Spacing correction

Version 2 moves the existing portrait 100px left in the editable HTML/CSS composition, providing a clear ivory gap between the bill and the book artwork. The exact cover, source portrait, typography, icon family and other placements are unchanged. No new raster artwork was generated. Version 1 remains available for previously cached links; metadata now points to version 3.

Version 3 follows the accepted bill spacing with three elliptical ripple strokes centered beneath the portrait’s base. This replaces the offset wide water lines, grounding the grebe and clearing the publisher footer. Cover, portrait, typography and icons remain unchanged. This is another edit to the existing native composition; no raster artwork was regenerated.
