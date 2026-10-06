# Amir & Raghed · widding.ly

A complete native-scroll wedding invitation, designed as a 320–430px phone composition and centered unchanged on larger screens. The supplied opening maps, heart, childhood/adult portraits, patterns, and four geographic images drive the design. Two persistent hearts dance, separate around compositions, reunite, and settle beside quiet ending decorations.

## Run locally

Use `npm install`, `npm run dev`, and open http://localhost:3000. On Windows use `npm.cmd` if PowerShell blocks `npm.ps1`. Scripts invoke local Node entry points to work in this folder containing an ampersand. `npm run build` and `npm start` build and serve production. This repair does not publish anything.

## Content and languages

`lib/content.ts` contains editable names **Amir and Raghed**, date **2026-10-17T15:00:00+03:00**, timezone **Europe/Istanbul**, and destination **İzmit, Kocaeli, Türkiye**. The invitation formats **17 October 2026 / 17 Ekim 2026** and **15:00** with Intl in the configured timezone. Exact venue/address/coordinates remain empty. Add verified coordinates or a full address to enable Google Maps `/maps/dir/?api=1&destination=…`; a name or city alone does not enable directions. Valid coordinates take precedence. The illustrated map anchor never supplies actual directions.

`lib/i18n.ts` centralizes English/Turkish UI, accessibility text, image descriptions, and portrait captions. The Arabic quotation remains unchanged and RTL. The server uses the explicit language cookie before ordered Accept-Language preferences. Before client paint, browser synchronization checks explicit persisted selection before the first supported navigator.languages preference, skips unsupported languages, and falls back to English. A subtle fixed EN/TR control persists manual choice in cookie/localStorage, updates document language, and preserves scroll, heart positions, map transforms, and reserved scene dimensions. No account or reload is needed.

The clock initially renders neutral values, updates once per second, stops at zero, and shows localized celebration copy. `aria-live="off"` prevents repeated announcements. It is the only timer-driven part of the story.

## Supplied artwork

See `ASSETS.md` for the exact file mapping, actual dimensions, transparency, and calibration. Original PNGs remain intact in `Assets/` and are copied unchanged to `public/assets/`, with encoded URLs centralized in `lib/assets.ts`. Source dimensions reserve layout before decode. The childhood and adult compositions are used directly, preserving portraits, decorative paper edges, flowers, and original adult name labels. Small same-source paper texture masks cover only baked English caption glyphs, with the same responsive HTML caption arrangement in both languages. Turkish lines are reflowed to stay readable within the original paper strips.

Patterns are faint, associated with their configured countries, and disappear with the opening maps. No cultural provenance is inferred from their appearance. All four geographic images appear in one occupied sticky stage, with per-image focal settings, bounded scale/pan, and brief crossfades. They have different perspectives; alignment is an approximate visual registration of the supplied terrain, not a verified geographic survey. The final pin and torn-paper note are inside that city view, attached to an editable illustration anchor, with a comfortable directions target.

No supplied skyline/calligraphy files were found. Small vector landmark decorations and live Arabic text remain tasteful optional fallbacks. Required portrait failures show a compact localized unavailable state and identify the exact file in the developer console; other missing artwork also has light fallbacks. The old reference crop and obsolete map/paper asset roles are not used.

## Motion and calibration

`lib/choreography.ts` authors continuous cubic curves with shared shape-preserving tangents for varied departure, orbit, crossing, lead changes, portrait/countdown detours, calm map travel, and two distinct resting hearts. Visible widths are 24px normally and 22px at the narrowest phone width. Measured PNG bounds and normalized opening cutout anchors account for transparency and contain fitting. Use development `?anchors=1` to review replacements.

`lib/trails.ts` builds a fixed route network of shared spans, separate branch spans, and smooth split/reunion junctions. Each branch has its own cumulative path length and solid reveal mask; completed history stays in place and the two branches do not draw each other's future travel. Thin fixed dashes and content masks keep the route clear of lettering and the venue paper. Reverse scrolling erases the same network exactly; the top has no trail.

`components/StoryMotion.tsx` owns one ScrollTrigger, reading physical native scroll through one common draw function. All poses, reveals, trails, and the map camera depend only on that current position. There are no motion timers, random offsets, velocity accumulation, spring tails, or numeric scrub delays. Overlays use invitation-local document coordinates; the pinned stage uses explicit local offsets. The page reserves the map's full height before hydration for reliable mid-scroll reload. Resize/orientation, images, fonts, locale changes, and development remounts rebuild geometry and clean up listeners/triggers. Overlay layers do not intercept input. Reduced motion and initialization failure show readable static scenes with a final city presentation and venue information; practical information also remains available without JavaScript.

## Verification

- `npm run typecheck`
- `npm run build`
- `node scripts/check-configuration.mjs` (Node 22.18+ for TypeScript imports)
- With the dev server running: `node scripts/review-master.mjs`
- With the dev server running: `node scripts/check-fallbacks.mjs`

Browser verification uses Playwright with installed Microsoft Edge; adjust executablePath on another machine. Screenshots and reports are in `.verification/master/`. The checks cover 320/390/430/1440px, narrow/wide orientation, meaningful face/text clearance, continuous positions/tangents, independent branch endpoints and no future lines, slow/fast/reverse/paused travel, every camera handoff, pin/note attachment, mid-scroll reload/resize, locale preference/manual scenarios and visible-note switching, reached-date clock behavior, reduced motion, no-JavaScript information, and missing-artwork/motion failure. `?inspect=1` exposes development-only geometry, routes, and pose sampling for the review. No lint script/configuration exists.

Remaining required input is the exact venue name/address or coordinates. Optional final skyline/calligraphy files can replace the current quiet fallbacks. Recalibrate new artwork and verify the final real directions after supplying venue data.
