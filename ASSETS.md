# Active artwork and recoverable originals

All eleven originals remain intact under `Assets/`. `lib/assets.ts` retains their original dimensions and normalized alignment/caption metadata, while `src` points to the optimized WebP below. The SVG canvas scales each derivative proportionally into the original coordinate system; no normalized anchors were invalidated by resizing.

| Role / public WebP | Exact original filename in `Assets/` | Original size | Optimized size | Alpha / fit |
| --- | --- | --- | --- | --- |
| `algeria_hart_map.webp` | `algeria_hart_map.png` | 1010×1086 | 650×699 | Transparent; measured visible window, contain |
| `palastine_hart_map.webp` | `palastine_hart_map.png` | 446×1086 | 350×852 | Transparent; measured visible window, contain |
| `palastine_small_hart.webp` | `palastine_small_hart.png` | 629×1086 | 350×604 | Transparent; principal red silhouette; exactly two travelling instances |
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

Equivalent original artwork: **19,149,900 bytes**. Optimized artwork: **2,503,050 bytes**. Saved: **16,646,850 bytes (86.9%)**. WebP quality is 94 for portraits, 88 elsewhere, alpha quality 100. Comparisons do not use the smaller, invalid truncated files as a baseline. Original PNGs are recoverable in `Assets/`; previous public copies are archived locally under `.verification/legacy-public/` and in Git history. No PNG duplicate remains in the active public asset folder.

## Alignment, masks and captions

Registry bounds are normalized against the full original canvas. Algeria's visible window is `(76,52,920,998)`, with cutout centre `(497.5/920,555.5/998)` and size `(143/920,133/998)`. Palestine's window is `(13,45,355,1026)`, centre `(191.5/355,517.5/1026)`, size `(125/355,117/1026)`. The heart's principal red-body window is `(146,436,297,253)`; stray alpha pixels are excluded. The traveller is 24px, or 22px on narrow phones.

Both full portrait images remain visible. Precisely confined masks sample clean paper from the same image to cover baked English glyphs. Larger localized HTML captions use a warm torn-paper label within the former caption area, flowing vertically when text is enlarged. Faces, canvas edges, flowers and original adult names remain intact. Registry `composition.captionRegions` records original mask rectangles/polygons/paper samples; `composition.clearance` records meaningful artwork bounds. Text is never shrunk to an unreadably small width. Texture patches may show seams under magnification; no pixel-perfect reference match is claimed.

The four legacy map WebPs above remain source references. The live stage uses the approved corrected İzmit Gulf zoom: `map-zoom.mp4` (1920×1080, 60fps, 6.4 seconds, silent H.264, fast-start, keyframes every 0.5s) with matching `map-zoom-start.webp` / `map-zoom-end.webp` at 1920×1080. The camera follows the illustrated shore point `(669.6,384)` on the original 1672×941 wide artwork; `lib/map-camera.ts` converts it through the clip's continuous camera and mobile framing. Arrival finishes at 82% before the venue note appears. Media failure and reduced/no motion use the corrected final still. This illustration point is not georeferenced; Google Maps directions retain the independently supplied coordinates in `lib/content.ts`.

## Decorations, share artwork and fonts

`components/StoryDecorations.tsx` contains reusable `decorative-heart-small` and `decorative-rose-small` SVGs with muted rose gradients and olive leaves. Their static anchors are local to each section. Scroll response is bounded to 3–4px and 2–3°; they have no trail, input or accessibility role. The named reference `ChatGPT Image Oct 6, 2026, 06_55_10 PM.png` was not found in the supplied workspace, attachments or Downloads. Their reference-specific texture/colors cannot be verified until that image is supplied.

`public/share-preview.jpg` and `app/opengraph-image.png` provide the 1200×630 share composition. `app/icon.svg` and `app/favicon.ico` provide icons. `scripts/create-share-image.mjs` regenerates them. Lora and Noto Naskh Arabic, with their OFL licenses, live in `app/fonts/` and load through `next/font/local`.

`algerian_landmark`, `palestinian_landmark` and `quran_verse` are disabled optional registry roles with no supplied source filename. Unfinished skylines are hidden; live Arabic is displayed. Real optional artwork requires an exact source, dimensions, normalized useful bounds and enabled configuration. No existing skyline/calligraphy file is falsely claimed.
