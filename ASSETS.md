# Active invitation artwork

`lib/assets.ts` is the central registry. The eleven original PNGs below exist in `Assets/` and are served intact from `public/assets/`. All eight newly supplied copies were compared with their originals using SHA-256. No portrait, pattern, or map was generated, repainted, or rewritten.

Filenames containing spaces and a comma are referenced through `'/assets/' + encodeURIComponent(filename)`. The exact names remain editable in the registry; scene components use semantic roles.

| Registry role | Exact filename and source path | Public URL | Scene | Intrinsic size | Alpha and fitting |
| --- | --- | --- | --- | --- | --- |
| `algeria_hart_map` | `Assets/algeria_hart_map.png` | `/assets/algeria_hart_map.png` | Opening, Algeria | 1010 × 1086 | RGBA; trim transparent padding with SVG viewBox, then contain |
| `palastine_hart_map` | `Assets/palastine_hart_map.png` | `/assets/palastine_hart_map.png` | Opening, Palestine | 446 × 1086 | RGBA; trim transparent padding with SVG viewBox, then contain |
| `palastine_small_hart` | `Assets/palastine_small_hart.png` | `/assets/palastine_small_hart.png` | Two persistent travelling heart instances | 629 × 1086 | RGBA; crop to the principal red silhouette, then contain at the visible pose size |
| `childhoodComposition` | `Assets/ChatGPT Image Oct 6, 2026, 07_51_13 PM.png` | `/assets/ChatGPT%20Image%20Oct%206%2C%202026%2C%2007_51_13%20PM.png` | Childhood, before adults | 1024 × 1536 | RGBA; render the full intrinsic canvas and preserve portraits, floral details, torn edges, and alpha |
| `adultComposition` | `Assets/ChatGPT Image Oct 6, 2026, 08_33_05 PM.png` | `/assets/ChatGPT%20Image%20Oct%206%2C%202026%2C%2008_33_05%20PM.png` | Adults, after childhood | 1122 × 1402 | RGBA; render the full intrinsic canvas, including the original Amir and Raghed name labels |
| `openingPatternAlgeria` | `Assets/ChatGPT Image Oct 6, 2026, 07_51_03 PM.png` | `/assets/ChatGPT%20Image%20Oct%206%2C%202026%2C%2007_51_03%20PM.png` | Opening only, beside Algeria | 887 × 1774 | RGBA; crop near-invisible padding through viewBox, contain, faint opacity and inward/bottom fade |
| `openingPatternPalestine` | `Assets/ChatGPT Image Oct 6, 2026, 07_51_09 PM.png` | `/assets/ChatGPT%20Image%20Oct%206%2C%202026%2C%2007_51_09%20PM.png` | Opening only, beside Palestine | **724 × 2172** | RGBA; crop near-invisible padding through viewBox, contain, faint opacity and inward/bottom fade |
| `mapWide` | `Assets/ChatGPT Image Oct 6, 2026, 07_50_39 PM.png` | `/assets/ChatGPT%20Image%20Oct%206%2C%202026%2C%2007_50_39%20PM.png` | Pinned map, stage 1 | 1672 × 941 | Opaque RGB; full source, proportional cover fit with independent camera pan/scale |
| `mapCloser` | `Assets/ChatGPT Image Oct 6, 2026, 07_50_49 PM.png` | `/assets/ChatGPT%20Image%20Oct%206%2C%202026%2C%2007_50_49%20PM.png` | Same map viewport, stage 2 | 1919 × 820 | Opaque RGB; full source, proportional cover fit with independent camera pan/scale |
| `mapRegional` | `Assets/ChatGPT Image Oct 6, 2026, 07_50_54 PM.png` | `/assets/ChatGPT%20Image%20Oct%206%2C%202026%2C%2007_50_54%20PM.png` | Same map viewport, stage 3 | 1916 × 821 | Opaque RGB; full source, proportional cover fit with independent camera pan/scale |
| `mapCity` | `Assets/ChatGPT Image Oct 6, 2026, 07_50_58 PM.png` | `/assets/ChatGPT%20Image%20Oct%206%2C%202026%2C%2007_50_58%20PM.png` | Same map viewport, stage 4, venue annotation | 1916 × 821 | Opaque RGB; full source, proportional cover fit with independent camera pan/scale |

The actual Palestinian-pattern source is 724 × 2172, rather than the brief's 682 × 2048. The registry uses the actual file size. Both configured pattern-to-country associations follow the brief; visual inspection alone does not establish their cultural provenance. Swapping these associations requires changing their registry filenames/metadata. The source colors and transparency remain unchanged, and neither pattern is mirrored or used as a full-page border.

## Optional artwork with no supplied file

These three semantic roles are explicitly disabled in the registry, with empty `src` and undefined `filename`/`sourcePath`. No existing skyline or calligraphy file was found among the supplied artwork; the following names describe roles, not claimed PNG basenames.

| Role | Scene and current presentation | Source / intrinsic size | Alignment |
| --- | --- | --- | --- |
| `algerian_landmark` | Quiet ending: small, understated monument vector fallback | No source file; SVG viewBox 600 × 400 | Contain beside the resting hearts |
| `palestinian_landmark` | Quiet ending: small, understated dome vector fallback | No source file; SVG viewBox 600 × 400 | Contain beside the resting hearts |
| `quran_verse` | Arabic section: readable live RTL quotation | No source file; optional slot metadata 1200 × 400 | Centered; quotation remains Arabic in both UI locales |

To add genuine optional artwork, configure its exact `filename`, encoded `src`, `sourcePath`, actual `sourceSize`, useful `visibleBounds`, and `enabled:true`. For calligraphy also enable `wedding.useVerseArtwork`. Keep the readable Arabic fallback correct. There are no black placeholder panels.

## Visible bounds and opening-heart calibration

All normalized bounds use the original image's top-left origin. SVG viewBox trimming changes layout only; it never edits the source. `anchor` and `cutoutSize` for the opening maps are relative to their trimmed visible map windows, rather than the padded PNG rectangle. The controller also accounts for object-contain offsets. The heart's pose is aligned to its visible silhouette.

| Role | Useful pixel window `(x, y, width, height)` | Anchor / cutout metadata |
| --- | --- | --- |
| Algeria map | `(76, 52, 920, 998)` | Cutout center `(497.5/920, 555.5/998)`; cutout size `(143/920, 133/998)` |
| Palestine map | `(13, 45, 355, 1026)` | Cutout center `(191.5/355, 517.5/1026)`; cutout size `(125/355, 117/1026)` |
| Red heart | `(146, 436, 297, 253)` | Main connected red body; exclude stray alpha pixels above it; visual center `(0.5, 0.5)` |
| Childhood | Alpha window `(0, 19, 1024, 1502)` | Portrait renderer retains the full 1024 × 1536 canvas |
| Adults | Alpha window `(0, 14, 1122, 1374)` | Portrait renderer retains the full 1122 × 1402 canvas |
| Algeria-side pattern | Meaningful alpha window `(73, 15, 174, 1742)` | Alpha ≥ 20/255; raw nonzero-alpha window `(61, 9, 556, 1750)` retained as `alphaBounds` |
| Palestine-side pattern | Meaningful alpha window `(109, 0, 506, 2172)` | Alpha ≥ 20/255; raw nonzero-alpha window `(0, 0, 619, 2172)` retained as `alphaBounds` |
| All four maps | Full intrinsic source | No alpha trimming; their different ratios and framing require separate camera transforms |

Travellers settle to 24px visible width; opening cutout dimensions can differ slightly and transition into the travelling size. Recalibrate these measurements whenever replacing a country map or the heart silhouette. Development `?anchors=1` exposes the opening calibration overlay.

## Localized portrait captions without changing the PNGs

`components/PortraitComposition.tsx` renders each original PNG in full. An SVG overlay covers only the baked English letter regions with clean paper texture sampled from elsewhere on the **same** original. Responsive HTML caption lines then occupy the original paper-label area in English and Turkish. All coordinates below are source pixels; `lib/assets.ts` stores their normalized equivalents.

| Composition / label | English-letter mask | Clean paper sample `(x, y, width, height)` |
| --- | --- | --- |
| Childhood: ONCE | Rectangle `(429, 1151, 193, 47)` | `(442, 1147, 165, 8)` |
| Childhood: THEY WERE JUST | Rectangle `(277, 1231, 507, 49)` | `(292, 1224, 478, 10)` |
| Childhood: TWO LITTLE HEARTS | Rectangle `(236, 1313, 601, 48)` | `(268, 1356, 540, 9)` |
| Adults: AND THEY GREW | Polygon `(318,1134) → (789,1117) → (794,1173) → (317,1186)` | `(500, 1175, 150, 8)` |
| Adults: INTO A LOVE STORY | Polygon `(307,1236) → (911,1206) → (916,1258) → (312,1284)` | `(480, 1273, 140, 8)` |

The two adult caption lines follow the paper's approximately −2.7° tilt. The second adult HTML label may wrap into two rows within text bounds `(308,1206,606,87)`; this keeps the longer Turkish translation legible without covering the portraits or replacing the entire composition. Turkish childhood wording reflows across the three paper strips as “Bir / zamanlar sadece / iki küçük kalptiler.” Neither locale exposes a second baked English caption. Original adult name labels remain unmasked.

Caption typography replaces the baked typeface with accessible HTML text. Paper texture patches can have subtly different grain when greatly magnified; they were inspected at 320, 390, and 430px in both locales. The source PNGs remain intact. Missing required portraits produce a compact localized unavailable state, preserve the caption, and report the exact failed filename; no replacement portrait is invented.

The registry also provides normalized portrait, name, and caption clearance boxes. The rendered `data-clearance` markers and individual `data-caption-line` nodes allow choreography and verification to use meaningful content bounds. Decorative flowers/outer paper do not enlarge these bounds to the whole padded image.

## Four-image camera and illustrated destination

The sequence is `mapWide → mapCloser → mapRegional → mapCity`, layered inside one pinned viewport. Source sizes and fitting metadata live in the registry. `lib/map-camera.ts` contains each stage's scroll range, target focus, proportional cover fit, scale/pan, brief crossfade, and frame-edge clamping. Every image uses its own transform; these illustrations are not assumed to be identical crops.

| Map layer | Incoming normalized `cameraFocalAnchor` | Additional camera behavior |
| --- | --- | --- |
| Wide | `(0.390, 0.448)` | Broad view scales toward the connecting coastline feature |
| Closer | `(0.350, 0.530)` | Pan toward configured later focus `(0.360, 0.450)` |
| Regional | `(0.458, 0.348)` | Pan toward configured later focus `(0.439, 0.370)` |
| City | `(0.676, 0.269)` | Arrival pan moves toward separate annotation anchor `(0.600, 0.490)` |

These values align recognizable **illustration features** based on visual inspection. The final `destinationAnchor:(0.600,0.490)` is an editable shore annotation position on the supplied artwork. It is not a verified city coordinate, exact venue location, or geographic survey. The pictures differ in perspective and detail, so some morphing of coastline detail during the short handoffs remains inherent to the supplied illustrations. The final city camera uses approximately 1.6× zoom on a normal phone viewport; short orientations have their own bounded framing.

The venue pin and paper note attach to the final image's transformed annotation anchor inside the same viewport. Real Google Maps directions use only an independently configured exact address or latitude/longitude in `lib/content.ts`. Current venue fields are unset, so directions are unavailable. Changing the illustrated anchor must never silently change the real directions destination.

## Replacement workflow

1. Keep the source original, copy it intact into `public/assets/`, and update the corresponding registry role's exact filename/path and measured intrinsic size.
2. Measure useful alpha/portrait/text bounds; update fitting and normalized anchors rather than assuming new transparent padding matches the previous file.
3. For a new composition, recalibrate only the baked-caption letter masks and blank-paper samples. Preserve faces, name labels, torn edges, and decorative details.
4. For a map replacement, tune its individual incoming focus, scale/pan, and handoff against both adjacent images. Keep real venue configuration separate.
5. Review the full invitation at 320, 390, and 430px, both languages, opening anchors, all map handoffs, and forward/reverse travel. Re-run the project checks after changing dimensions or alignment metadata.
