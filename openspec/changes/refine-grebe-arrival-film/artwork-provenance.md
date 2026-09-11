# Artwork provenance

> Status — LOCAL WING FOLLOW-UP COMPLETE, September 10, 2026. Build `bbTrs4g9kljfX6-Ec1gvs` passes all 33 source scripts, types, production build and all 12 release checks. Desktop/phone unfolding frames, independent critique and Chromium/WebKit playback checks pass. The current preview is `http://localhost:3112/`. Nothing was published; release requires explicit approval.

The built-in image generation tool produced the revised adult horned-grebe master, its detail edit and the new flank edit. These plates are 1536×1024, three-channel RGB images with no alpha channel. Their checker-pattern backgrounds are real image pixels. Browser-native masks create the visible cutouts; the source plates are not transparent assets. The separately reused wing does have real alpha.

The earlier original generated files remain under `/Users/blabaschin/.codex/generated_images/01a0732f-8805-7692-a91a-e5cc1ba15962/`. The new flank source is recorded separately below. Web assets are under `public/assets/grebes/arrival/`.

## Selected artwork

| Web asset | Original generated PNG | WebP bytes | Alpha |
| --- | --- | --- | --- |
| `engraving-plate-v2.webp` | `exec-4bf91b09-cf0b-4bd6-9c0b-ad3e95c9d130.png` | 391,532 | None; native silhouette mask |
| `anatomy-detail-v2.webp` | `exec-5dd930d8-b79a-49ba-bc62-d6ee71562397.png` | 373,214 | None; retained closed-eye patch |
| `wing-v1.webp` | `exec-b3979169-ae10-4492-a75e-f9036bb68c2f.png` | 364,180 | Real alpha, reused from the prior opening |
| `anatomy-flank-v3.webp` | `exec-1a9a99f9-00c0-4165-bce7-d9061e5f799d.png` in the new source directory below | 407,250 | None; native flank and shoulder patches |

The four character WebPs total 1,536,176 bytes. The earlier three-asset candidate totaled 1,128,926 bytes; its retained release measurements do not include this follow-up asset.

The wing's generation direction and prior export are recorded in [the earlier artwork record](../cinematic-grebe-arrival/artwork.md). `public/assets/grebes/atlas-dusk-shoreline.webp` is also reused unchanged. The book cover is outside this artwork change.

### Request summaries

The earlier requests below are concise summaries, not verbatim prompts. Their exact full prompt text was not available in the files inspected. The new flank request is retained verbatim in the linked prompt file below.

- The master request produced a revised adult horned-grebe engraving for one continuous character, retaining the site's fine ink, ochre tufts, rust neck, charcoal plumage and pale belly.
- The selected detail edit requested the same framing and silhouette as the master, a naturally closed eye, and removal of the folded wing with engraved flank feathers in its place. It supplied eye/flank/shoulder patches for the earlier candidate. The current composition retains its eye patch; the v3 flank supersedes its exposed-flank and shoulder texture.
- Two additional edits explicitly requested transparency but returned opaque plates with baked checker backgrounds. `exec-6c1ec533-9756-47b8-840c-35d0a90d701a.png` and `exec-4b5d26d7-1ae1-4fa5-bd85-f0c1cb177dec.png` were rejected. Neither is selected by `ARRIVAL_ART`.

### New flank request and source

The built-in image generation edit used `anatomy-detail-v2.webp` as its edit target and `engraving-plate-v2.webp` only as the supporting folded-wing/style reference. It requested short charcoal-to-rust body contour feathers across the upper/middle flank, removing long flight feathers, large scalloped coverts and a distinct closed-wing boundary. It requested the same canvas, framing, silhouette, closed eye, head, neck, feet and belly, and explicitly retained the background rather than inventing transparency.

The exact [prompt](../../../release-artifacts/2026-09-10-grebe-film/wing-revision/anatomy-flank-v3-prompt.txt), [original PNG](../../../release-artifacts/2026-09-10-grebe-film/wing-revision/anatomy-flank-v3-original.png) and [metadata](../../../release-artifacts/2026-09-10-grebe-film/wing-revision/anatomy-flank-v3-metadata.json) are retained together. The generated original is `/Users/blabaschin/.codex/generated_images/01a079af-123c-7060-9e21-c79231b94fe6/exec-1a9a99f9-00c0-4165-bce7-d9061e5f799d.png`. The 2,315-byte prompt has SHA-256 `5e4e40bbc252763337719bfdf5d4c42e4b6e6d6790b58161f53bf01b5c4da39c`.

Metadata records a WebP-only encoding with Sharp 0.33.5, quality 92, effort 6 and smart subsampling; no crop, resize or raster artwork edit followed generation. It also records that the generated edit is not pixel-identical outside the requested region. Native selective composition therefore retains the original resting body and the already accepted v2 eyelid. The metadata's “review-only” integration field describes the pre-integration artifact; the public asset is now integrated and matches its recorded WebP hash.

## Native composition

`arrivalArtwork.ts` clips the original plate to `ARRIVAL_BODY_OUTLINE`. The closed-eye patch still comes from `anatomy-detail-v2.webp`; exposed flank and shoulder patches now come from `anatomy-flank-v3.webp`. The old radial flank mask retained long painted flight feathers around the upper back and could read as a second wing. The new flank mask reaches the full upper-back silhouette and blends only along its lower and front boundaries. It remains clipped to the native body outline, including the open tail-to-foot region.

During the opening, `compose(awake, wings, unfolding)` receives `unfolding=true` only before 5300 ms. The original painted wing is fully replaced at `wings=0.005`, before the moving wing mesh appears at values greater than 0.005. Return-flight material blending keeps its 0.22 threshold. The eye patch fades as before, and the fully awake, folded final pose returns the exact original resting body. The new plate does not replace that resident identity.

The reused alpha wing receives a native gradient at its shoulder so the root blends into the engraved torso while the primary feathers retain their detail. The textured body and wing meshes are articulated in Canvas; the resident uses the same original plate with SVG clipping. The feather is native SVG, and the water/light layers are native Canvas/SVG. This work does not claim that a generated video or new raster alpha was produced.

`verify-arrival-artwork.mjs` checks actual Canvas pixels for eye/flank isolation, original resting texture, transparent composed exterior, shoulder blending and disposal. The earlier candidate's passing results do not establish acceptance of this changed texture/mask. Current wing-follow-up pixel regressions, desktop/phone adjacent-frame review and independent critique pass. The evidence is indexed in qa.md and the wing-revision README.

## File identity

Metadata and SHA-256 hashes were read from the actual local files. Source byte counts differ from their WebP encodings.

| File | Bytes | SHA-256 |
| --- | --- | --- |
| Master PNG `exec-4bf91b09…` | 2,610,009 | `5f9c876d695306db5059cde0c12f02d6e47f002694161ccf5515ad6754e57b07` |
| `engraving-plate-v2.webp` | 391,532 | `165db5420b0ad10b4ccced58da7902712fadd75c7ba71f1f5c11dd1ab8c90099` |
| Detail PNG `exec-5dd930d8…` | 2,674,412 | `da6b68c76e7b0e5ddc7a6a921d4abb2bcec8cb72e40c44f2d97f30a6cc58584c` |
| `anatomy-detail-v2.webp` | 373,214 | `09697dd94f616b94a2da847f4b86fa065cddf6f4acdb285504013bf245590f61` |
| `wing-v1.webp` | 364,180 | `447db9c57b58134670e3c621f7fa61c04a7e402e89f728ea8ef792aadddc0711` |
| Flank PNG `exec-1a9a99f9…` / retained `anatomy-flank-v3-original.png` | 2,496,376 | `2372120fbae4a3166ece81b12c825f9b72172ec48166d87acf255e87f8774a62` |
| `anatomy-flank-v3.webp` | 407,250 | `2bb82d11a75dd8e12a32b86e778dc83576d284825a0552fb49a36e0dbda5769f` |

The two rejected PNGs are also three-channel 1536×1024 images without alpha. They remain in the generated-image directory as source history, rather than being passed off as successful transparent exports.
