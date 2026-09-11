# Arrival artwork

The built-in image generation tool produced the animation sprites from the site's horned-grebe identity. The accepted files are encoded as WebP without cropping, recoloring or manual raster edits. All three preserve real alpha transparency. The eye opening, wing articulation and feather are drawn or animated in the browser from the shared elapsed clock.

## Accepted assets

| Web asset | Original generated PNG |
| --- | --- |
| `public/assets/grebes/arrival/sleep-v1.webp` | `/Users/blabaschin/.codex/generated_images/01a0732f-8805-7692-a91a-e5cc1ba15962/exec-51bed73d-57a0-48f6-b4fa-aac71dbebfd2.png` |
| `public/assets/grebes/arrival/wing-v1.webp` | `/Users/blabaschin/.codex/generated_images/01a0732f-8805-7692-a91a-e5cc1ba15962/exec-b3979169-ae10-4492-a75e-f9036bb68c2f.png` |
| `public/assets/grebes/arrival/flight-v1.webp` | `/Users/blabaschin/.codex/generated_images/01a0732f-8805-7692-a91a-e5cc1ba15962/exec-cc577da7-60ee-47f4-93ca-b7fe8419fbcf.png` |

Original generated files remain in place. Each is 1536×1024. The animation reuses `public/assets/grebes/atlas-dusk-shoreline.webp` for its pond. The existing book cover is untouched.

## Generation direction

- The initial upright grebe used the existing engraving and animal editorial design reference. The prompt requested a full adult horned grebe in fine ink and gouache, right-facing with ochre tufts, rust neck, charcoal back, ivory belly, folded wings and a transparent background. The accepted sleeping variant closed the eye, relaxed the head slightly and corrected the toes to separate lobes.
- The wing prompt requested one isolated extended wing with the shoulder at lower left and fanned primary feathers opening upward/right. It retained the charcoal feathers, pale wing panel and fine engraved hatching of the sleeping reference. The browser uses the same sprite at two shoulder hinges.
- The accepted flight prompt used the sleeping sprite as its reference and requested a horizontal right-facing bird, neck forward, body horizontal, lobed toes trailing, folded wings for separate articulation, red eye open, and a true RGBA cutout on a 1536×1024 canvas. It explicitly retained opaque plumage and transparent empty space.

Earlier trial exports with baked checkerboards or white paper were rejected in browser review. They are not loaded or shipped. The final flight export was regenerated from the transparent sleeping reference; no CSS blending is needed to hide a background. Source PNGs were inspected, alpha was checked programmatically, and the accepted WebPs were inspected over the actual pond and revealed page.

## Native animation graphics

The opening eyelid/iris and single falling feather are small SVG drawings in `ArrivalBird.tsx`. `ArrivalPond.tsx` renders vegetation, reflected light, splash and ripples; `ArrivalSurface.tsx` adds foreground contact waves and droplets. Their positions and opacity follow the same clock as the bird, so visibility pauses preserve the complete composition.
