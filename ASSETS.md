# Active artwork and recoverable originals

All eleven original supplied artworks remain intact under `Assets/`. The approved opening now uses one newer keepsake composition; its source and measured heart homes are documented below. Legacy country maps and raster patterns are retained for recovery but are no longer requested by the opening. `lib/assets.ts` retains original dimensions and normalized alignment/caption metadata, while `src` points to optimized WebP derivatives.

| Role / public WebP | Exact original filename in `Assets/` | Original size | Optimized size | Alpha / fit |
| --- | --- | --- | --- | --- |
| `algeria_hart_map.webp` | `algeria_hart_map.png` | 1010×1086 | 650×699 | Transparent; measured visible window, contain |
| `palastine_hart_map.webp` | `palastine_hart_map.png` | 446×1086 | 350×852 | Transparent; measured visible window, contain |
| `travelling-heart.webp` | `matte-travelling-heart.png` | 1297×1213 | 400×374 | Transparent matte burgundy paper; exactly two travelling instances |
| `childhoodComposition.webp` | `ChatGPT Image Oct 6, 2026, 07_51_13 PM.png` | 1024×1536 | 900×1350 | Transparent; full childhood composition |
| `adultComposition.webp` | `ChatGPT Image Oct 6, 2026, 08_33_05 PM.png` | 1122×1402 | 1000×1250 | Transparent; full adult composition and original name labels |
| `openingPatternAlgeria.webp` | `ChatGPT Image Oct 6, 2026, 07_51_03 PM.png` | 887×1774 | 600×1200 | Transparent; contain visible crop; strong opening / faint throughout |
| `openingPatternPalestine.webp` | `ChatGPT Image Oct 6, 2026, 07_51_09 PM.png` | 724×2172 | 500×1500 | Transparent; contain visible crop; strong opening / faint throughout |
| `mapWide.webp` | `ChatGPT Image Oct 6, 2026, 07_50_39 PM.png` | 1672×941 | 1600×900 | Opaque; first camera layer, cover/pan/scale |
| `mapCloser.webp` | `ChatGPT Image Oct 6, 2026, 07_50_49 PM.png` | 1919×820 | 1600×684 | Opaque; second camera layer, cover/pan/scale |
| `mapRegional.webp` | `ChatGPT Image Oct 6, 2026, 07_50_54 PM.png` | 1916×821 | 1600×686 | Opaque; third camera layer, cover/pan/scale |
| `mapCity.webp` | `ChatGPT Image Oct 6, 2026, 07_50_58 PM.png` | 1916×821 | 1600×686 | Opaque; final camera layer, city pin and compact annotation |

Public URLs are `/assets/<semantic-role>.webp`, with exact casing audited even on Windows. The Palestinian pattern's actual original dimensions are 724×2172, correcting the earlier brief's 682×2048. Country association follows configuration, not an inferred cultural provenance.

## Loading repair and size evidence

Eight active public PNGs and the unused `couple_childhood.png` were truncated to approximately 786KB and failed full browser/Sharp decoding despite HTTP 200. The originals were valid. They were restored, browser-decoded and then optimized. All final derivatives decode fully. `scripts/check-assets.mjs` checks exact filenames, decoded content and aspect ratios. `scripts/optimize-assets.mjs` can regenerate them; its detailed size report is `.verification/asset-sizes.json`.

Historical optimization baseline for the initial eleven artworks: **19,149,900 bytes**. Optimized artwork: **2,503,050 bytes**. Saved: **16,646,850 bytes (86.9%)**. WebP quality is 94 for portraits, 88 elsewhere, alpha quality 100. Comparisons do not use the smaller, invalid truncated files as a baseline. Original PNGs are recoverable in `Assets/`; previous public copies are archived locally under `.verification/legacy-public/` and in Git history. No PNG duplicate remains in the active public asset folder.

## Alignment, masks and captions

Registry bounds are normalized against the full original canvas. Legacy country map alignment metadata remains recoverable. The active opening uses the new composition's measured hole rectangles `(386,529,104,89)` and `(1181,460,97,84)` on a 1515×1038 canvas. The matte heart's measured visible window is `(151,178,998,837)` on its 1297×1213 canvas; the original glossy heart remains recoverable. Home poses are measured directly from responsive layout markers, then blend into the unchanged 24px (22px on narrow phones) dance.

Both full portrait images remain visible. Precisely confined masks sample clean paper from the same image to cover baked English glyphs. Larger localized HTML captions use a warm torn-paper label within the former caption area, flowing vertically when text is enlarged. Faces, canvas edges, flowers and original adult names remain intact. Registry `composition.captionRegions` records original mask rectangles/polygons/paper samples; `composition.clearance` records meaningful artwork bounds. Text is never shrunk to an unreadably small width. Texture patches may show seams under magnification; no pixel-perfect reference match is claimed.

The four legacy map WebPs above remain source references. The recoverable full-HD source of the approved Gulf zoom is `map-zoom.mp4` (1920×1080, 60fps, 6.4 seconds, silent H.264, fast-start, keyframes every 0.5s) with matching `map-zoom-start.webp` / `map-zoom-end.webp` at 1920×1080. The camera follows the illustrated shore point `(669.6,384)` on the original 1672×941 wide artwork; `lib/map-camera.ts` converts it through the clip's continuous camera and mobile framing. Arrival finishes at 82% before the venue note appears. Media failure and reduced/no motion use the corrected final still. This illustration point is not georeferenced; Google Maps directions retain the independently supplied coordinates in `lib/content.ts`.

## Decorations, share artwork and fonts

`components/StoryDecorations.tsx` contains reusable `decorative-heart-small` and `decorative-rose-small` SVGs. Both follow the supplied `IMG_3011.jpeg` aesthetic: uneven dark-brown outlines, cream paper centres, beige paper rims and subtle grain. Roses use brown ink petal curls, stems and paper-filled leaves. Hearts occupy a 22×26px slot and roses a 23×29px slot, both at 85% opacity so their outlines remain legible. Their static anchors are local to each section. Scroll response is bounded to 3–4px and 2–3°; they have no trail, input or accessibility role. SVG gradient/filter IDs are unique per instance and decoration kind.

Only `public/share-preview.jpg` provides the 1200×630 share composition. `app/icon.svg` and `app/favicon.ico` provide icons. `scripts/create-share-image.mjs` regenerates them. Lora and Noto Naskh Arabic, with their OFL licenses, live in `app/fonts/` and load through `next/font/local`.

`algerian_landmark`, `palestinian_landmark` and `quran_verse` are disabled optional registry roles with no supplied source filename. Unfinished skylines are hidden; live Arabic is displayed. Real optional artwork requires an exact source, dimensions, normalized useful bounds and enabled configuration. No existing skyline/calligraphy file is falsely claimed.

## Venue keepsake

`public/assets/venue-keepsake.webp` (800×887, WebP quality 90, full alpha) is the approved paper-and-ink card artwork with lettering removed. The decorative coastal illustration, brown rose and hollow heart remain; all venue/date/time/directions text is real localized HTML. The card uses the supplied Tütünçiftlik venue link and real coordinates in `lib/content.ts`; the painted mini-map is decorative. The public image has transparent edges and a readable cream fallback.

## Joined skyline footer

`skyline-keepsake.webp` (1000×500, WebP quality 92, full alpha) preserves the approved cream/champagne paper-relief Algiers/Jerusalem-inspired architecture and rose. Empty paper background, all text and the two baked hearts were removed with image editing. `app/page.tsx` supplies translated live lettering and the email credit; the existing choreography reads the responsive centre resting anchor. Legacy separate landmark placeholders remain disabled.

## Verse paper artwork

`verse-keepsake.webp` (1000×563, WebP quality 92, full alpha) is the approved gold-edged cream slip with pressed golden flowers, dried buds and small paper-tape accents. Exterior backdrop and all baked calligraphy were removed through image editing; the central textured paper remains blank for live Arabic. Its source is a generated letter-free variant of the approved preview.

## Countdown and lighter map media

`countdown-keepsake.webp` (800×1200, quality 92, full alpha) frames live localized text with the approved cream/gold paper and taped golden flower. It contains no baked lettering or numbers. `travelling-heart.webp` is a matte paper/ink edit of the original heart with measured visible bounds, retaining the rounded shape rather than glossy highlights; its original is in `Assets/matte-travelling-heart.png`.

The active clip is now `map-zoom-mobile.mp4` (1280×720, 30fps, 6.4s, 3,001,500 bytes, keyframes every 0.5s), with matching `map-zoom-mobile-start.webp` and `map-zoom-mobile-end.webp`. The full-HD media above remain recoverable sources and are not requested by the invitation. The exact same map movement is downscaled, never regenerated.
# Approved opening keepsake

`Assets/opening-keepsake.png` is the transparent source (1515×1038), with its production derivative at `public/assets/opening-keepsake.webp` (1000px wide). Native country labels and the existing two moving hearts remain separate. `openingHomes` in `lib/assets.ts` records the measured transparent cut-outs; both static and animated poses use those rectangles. Flowers sit outside the maps. `TraditionalBorder.tsx` supplies distinct crisp geometric/stitched edge ornaments, flush to the invitation edges, with faint continuity through the story.

Built-in image-edit prompt used: “Extract only the two champagne folded-paper country silhouettes and their attached outer golden flower sprigs from the approved opening preview. Preserve shapes, paper folds, gold outlines and relative placement: Algeria left, flowers outside left; Palestine right, flowers outside right. Remove the background, all lettering, both edge patterns and both burgundy hearts. Leave exterior areas and exact heart-shaped slots genuinely transparent. No rearranging, added elements, baked checkerboard or style change.”

