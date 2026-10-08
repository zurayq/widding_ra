export type Point = { x: number; y: number };
export type Bounds = { x: number; y: number; width: number; height: number };
export type CaptionRegion = {
  bounds: Bounds; polygon?: Point[]; rotation?: number;
  paperSample: Bounds; fontSize: number; textBounds?: Bounds; multiline?: boolean;
};
export type Asset = {
  id: string; src: string; filename?: string; sourcePath?: string; alt: string; decorative: boolean;
  sourceSize: { width: number; height: number }; visibleBounds: Bounds; alphaBounds?: Bounds; alpha: 'transparent' | 'opaque' | 'fallback';
  fit: 'contain'; fallback: 'algeria' | 'palestine' | 'heart' | 'memory' | 'map' | 'pattern' | 'monument' | 'dome' | 'verse' | 'opening';
  enabled?: boolean;
  anchor?: Point; cutoutSize?: { width: number; height: number };
  visualAnchor?: Point; destinationAnchor?: Point; cameraFocalAnchor?: Point; maxScale?: number;
  composition?: { captionRegions: CaptionRegion[]; clearance: { name: string; bounds: Bounds }[] };
};
const full = { x: 0, y: 0, width: 1, height: 1 };
const normalized = (x: number, y: number, width: number, height: number, sourceWidth: number, sourceHeight: number): Bounds => ({
  x: x / sourceWidth, y: y / sourceHeight, width: width / sourceWidth, height: height / sourceHeight,
});
const entry = (id: string, fallback: Asset['fallback'], extra: Partial<Asset> = {}): Asset => {
  const filename = extra.filename ?? id + '.png';
  return {
    id, filename, sourcePath: 'Assets/' + filename, src: '/assets/' + id + '.webp',
    alt: id.replaceAll('_', ' '), decorative: true, alpha: 'transparent',
    sourceSize: { width: 1000, height: 1000 }, visibleBounds: full, fit: 'contain', fallback, ...extra,
  };
};
const childhood = entry('childhoodComposition', 'memory', {
  filename: 'ChatGPT Image Oct 6, 2026, 07_51_13 PM.png',
  alt: 'Amir and Raghed as children, in the supplied torn-paper composition', decorative: false,
  sourceSize: { width: 1024, height: 1536 },
  visibleBounds: normalized(0, 19, 1024, 1502, 1024, 1536),
  composition: {
    captionRegions: [
      { bounds: normalized(429, 1151, 193, 47, 1024, 1536), paperSample: normalized(442, 1147, 165, 8, 1024, 1536), fontSize: 43 },
      { bounds: normalized(277, 1231, 507, 49, 1024, 1536), paperSample: normalized(292, 1224, 478, 10, 1024, 1536), fontSize: 42 },
      { bounds: normalized(236, 1313, 601, 48, 1024, 1536), paperSample: normalized(268, 1356, 540, 9, 1024, 1536), fontSize: 42 },
    ],
    clearance: [
      { name: 'childhood-portraits', bounds: normalized(107, 286, 889, 773, 1024, 1536) },
      { name: 'childhood-caption', bounds: normalized(236, 1141, 612, 226, 1024, 1536) },
    ],
  },
});
const adult = entry('adultComposition', 'memory', {
  filename: 'ChatGPT Image Oct 6, 2026, 08_33_05 PM.png',
  alt: 'Amir and Raghed together, with their original name labels and floral torn-paper artwork', decorative: false,
  sourceSize: { width: 1122, height: 1402 },
  visibleBounds: normalized(0, 14, 1122, 1374, 1122, 1402),
  composition: {
    captionRegions: [
      {
        bounds: normalized(315, 1124, 480, 54, 1122, 1402), rotation: -2.7,
        polygon: [{ x:318/1122,y:1134/1402 },{ x:789/1122,y:1117/1402 },{ x:794/1122,y:1173/1402 },{ x:317/1122,y:1186/1402 }],
        paperSample: normalized(500, 1175, 150, 8, 1122, 1402), fontSize: 43,
      },
      {
        bounds: normalized(308, 1220, 606, 56, 1122, 1402), rotation: -2.7,
        polygon: [{ x:307/1122,y:1236/1402 },{ x:911/1122,y:1206/1402 },{ x:916/1122,y:1258/1402 },{ x:312/1122,y:1284/1402 }],
        paperSample: normalized(480, 1273, 140, 8, 1122, 1402), fontSize: 42,
        textBounds: normalized(308, 1206, 606, 87, 1122, 1402), multiline: true,
      },
    ],
    clearance: [
      { name: 'adult-portraits', bounds: normalized(166, 107, 859, 973, 1122, 1402) },
      { name: 'amir-name', bounds: normalized(52, 216, 286, 168, 1122, 1402) },
      { name: 'raghed-name', bounds: normalized(868, 232, 246, 177, 1122, 1402) },
      { name: 'adult-caption', bounds: normalized(307, 1117, 612, 167, 1122, 1402) },
    ],
  },
});
export const assets = {
  openingComposition: entry('openingComposition', 'opening', {
    filename: 'opening-keepsake.png', src: '/assets/opening-keepsake.webp',
    sourceSize: {width:1515,height:1038},
    alt: 'Gold-edged paper maps with pressed flowers beside Algeria and Palestine',
  }),
  algeria_hart_map: entry('algeria_hart_map', 'algeria', {
    alt: 'Algeria, one of our two homes', decorative: false,
    sourceSize: { width: 1010, height: 1086 },
    visibleBounds: normalized(76, 52, 920, 998, 1010, 1086),
    anchor: { x: 497.5 / 920, y: 555.5 / 998 }, cutoutSize: { width: 143 / 920, height: 133 / 998 },
  }),
  palastine_hart_map: entry('palastine_hart_map', 'palestine', {
    alt: 'Palestine, one of our two homes', decorative: false,
    sourceSize: { width: 446, height: 1086 },
    visibleBounds: normalized(13, 45, 355, 1026, 446, 1086),
    anchor: { x: 191.5 / 355, y: 517.5 / 1026 }, cutoutSize: { width: 125 / 355, height: 117 / 1026 },
  }),
  palastine_small_hart: entry('palastine_small_hart', 'heart', {
    filename: 'matte-travelling-heart.png', src: '/assets/travelling-heart.webp',
    sourceSize: { width: 1297, height: 1213 }, visibleBounds: normalized(151, 178, 998, 837, 1297, 1213),
    visualAnchor: { x: .5, y: .5 },
  }),
  childhoodComposition: childhood,
  adultComposition: adult,
  openingPatternAlgeria: entry('openingPatternAlgeria', 'pattern', {
    filename: 'ChatGPT Image Oct 6, 2026, 07_51_03 PM.png', sourceSize: { width: 887, height: 1774 },
    alphaBounds: normalized(61, 9, 556, 1750, 887, 1774),
    visibleBounds: normalized(73, 15, 174, 1742, 887, 1774),
    alt: 'Pattern configured beside Algeria',
  }),
  openingPatternPalestine: entry('openingPatternPalestine', 'pattern', {
    filename: 'ChatGPT Image Oct 6, 2026, 07_51_09 PM.png', sourceSize: { width: 724, height: 2172 },
    alphaBounds: normalized(0, 0, 619, 2172, 724, 2172),
    visibleBounds: normalized(109, 0, 506, 2172, 724, 2172),
    alt: 'Pattern configured beside Palestine',
  }),
  mapWide: entry('mapWide', 'map', {
    filename: 'ChatGPT Image Oct 6, 2026, 07_50_39 PM.png', sourceSize: { width: 1672, height: 941 },
    alpha: 'opaque', decorative: false, alt: 'The supplied broad geographic illustration',
    cameraFocalAnchor: { x: .390, y: .448 }, maxScale: 1.8,
  }),
  mapCloser: entry('mapCloser', 'map', {
    filename: 'ChatGPT Image Oct 6, 2026, 07_50_49 PM.png', sourceSize: { width: 1919, height: 820 },
    alpha: 'opaque', decorative: false, alt: 'The supplied closer geographic illustration',
    cameraFocalAnchor: { x: .350, y: .530 }, maxScale: 1.8,
  }),
  mapRegional: entry('mapRegional', 'map', {
    filename: 'ChatGPT Image Oct 6, 2026, 07_50_54 PM.png', sourceSize: { width: 1916, height: 821 },
    alpha: 'opaque', decorative: false, alt: 'The supplied regional coastline illustration',
    cameraFocalAnchor: { x: .458, y: .348 }, maxScale: 2.15,
  }),
  mapCity: entry('mapCity', 'map', {
    filename: 'ChatGPT Image Oct 6, 2026, 07_50_58 PM.png', sourceSize: { width: 1916, height: 821 },
    alpha: 'opaque', decorative: false, alt: 'The supplied closest city-area illustration; the marker is an editable artwork anchor',
    cameraFocalAnchor: { x: .676, y: .269 }, destinationAnchor: { x: .60, y: .49 }, maxScale: 1.6,
  }),
  // These optional roles have no supplied source file. Their modest vector/text fallbacks are deliberate.
  algerian_landmark: entry('algerian_landmark', 'monument', { enabled: false, src: '', filename: undefined, sourcePath: undefined, alpha: 'fallback', sourceSize: { width: 600, height: 400 } }),
  palestinian_landmark: entry('palestinian_landmark', 'dome', { enabled: false, src: '', filename: undefined, sourcePath: undefined, alpha: 'fallback', sourceSize: { width: 600, height: 400 } }),
  quran_verse: entry('quran_verse', 'verse', { enabled: false, src: '', filename: undefined, sourcePath: undefined, alpha: 'fallback', sourceSize: { width: 1200, height: 400 } }),
} satisfies Record<string, Asset>;
export type AssetId = keyof typeof assets;
// Measured transparent holes in the approved letter-free composition. The
// same rectangles position static/no-JS hearts and start the shared live dance.
export const openingHomes = [
  {id:'algeria_hart_map',bounds:normalized(386,529,104,89,1515,1038)},
  {id:'palastine_hart_map',bounds:normalized(1181,460,97,84,1515,1038)},
] as const;
export const mapAssetOrder = ['mapWide', 'mapCloser', 'mapRegional', 'mapCity'] as const;
export function visibleWindow(asset: Asset): Bounds {
  return asset.visibleBounds;
}
