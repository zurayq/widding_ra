# Amir & Raghed · widding.ly

A native-scroll wedding invitation, designed as a 320–430px phone composition and centered unchanged on larger screens. The supplied opening maps, heart, childhood/adult portraits, patterns, and four geographic images drive the design. After leaving their maps, two persistent hearts stay close in the centre, gently circle one another and exchange the lead, then settle beside quiet ending decorations. One dashed trail begins only when they meet.

## Run locally

Use `npm install`, `npm run dev`, and open http://localhost:3000. On Windows use `npm.cmd` if PowerShell blocks `npm.ps1`. Scripts invoke local Node entry points to work in this folder containing an ampersand. `npm run build` and `npm start` build and serve production. This repair does not publish anything.

## Content and languages

`lib/content.ts` contains editable names **Amir and Raghed**, date **2026-10-17T15:00:00+03:00**, timezone **Europe/Istanbul**, and destination **İzmit, Kocaeli, Türkiye**. The invitation formats **17 October 2026 / 17 Ekim 2026** and **15:00** with Intl in the configured timezone. Exact venue/address/coordinates remain empty. Add verified coordinates or a full address to enable Google Maps `/maps/dir/?api=1&destination=…`; a name or city alone does not enable directions. Valid coordinates take precedence. The illustrated map anchor never supplies actual directions.

`lib/i18n.ts` centralizes English/Turkish UI, accessibility text, image descriptions, and portrait captions. The Arabic quotation remains unchanged and RTL. The server uses the explicit language cookie before ordered Accept-Language preferences. Before client paint, browser synchronization checks explicit persisted selection before the first supported navigator.languages preference, skips unsupported languages, and falls back to English. A subtle fixed EN/TR control persists manual choice in cookie/localStorage, updates document language, and preserves scroll, heart positions, map transforms, and reserved scene dimensions. No account or reload is needed.

The clock initially renders neutral values, updates once per second, stops at zero, and shows localized celebration copy. `aria-live="off"` prevents repeated announcements. It is the only timer-driven part of the story.

## Supplied artwork

See `ASSETS.md` for the exact file mapping, actual dimensions, transparency, and calibration. Original PNGs remain intact in `Assets/` and are copied unchanged to `public/assets/`, with encoded URLs centralized in `lib/assets.ts`. Source dimensions reserve layout before decode. The childhood and adult compositions are used directly, preserving portraits, decorative paper edges, flowers, and original adult name labels. Small same-source paper texture masks cover only baked English caption glyphs, with the same responsive HTML caption arrangement in both languages. Turkish lines are reflowed to stay readable within the original paper strips.

Patterns are associated with their configured countries. The stronger opening strips fade with the maps; a separate fixed pair at 3.5% opacity carries the theme through the invitation, behind readable content and without intercepting taps. No cultural provenance is inferred from their appearance. All four geographic images appear in one occupied sticky stage, with per-image focal settings, bounded scale/pan, and brief crossfades. They have different perspectives; alignment is an approximate visual registration of the supplied terrain, not a verified geographic survey. The final pin and torn-paper note are inside that city view, attached to an editable illustration anchor, with a comfortable directions target.

No supplied skyline/calligraphy files were found. Small vector landmark decorations and live Arabic text remain tasteful optional fallbacks. Required portrait failures show a compact localized unavailable state and identify the exact file in the developer console; other missing artwork also has light fallbacks. The old reference crop and obsolete map/paper asset roles are not used.

## Motion and calibration

`lib/choreography.ts` separates a slowly curving central route from a small elliptical pair movement. Scene-authored phases vary the circling and lead exchanges without restarting the dance at each section. All of the former phone-edge detours have been removed, including the large separation around the venue note. After meeting, the hearts' centres remain within 40px of one another, with at most 20px vertical separation; the final pose has a small gap between two distinct hearts. Shape-preserving cubic tangents and a zero-slope departure blend avoid jumps. Visible widths are 24px normally and 22px at the narrowest phone width. Measured PNG bounds and normalized opening cutout anchors account for transparency and contain fitting. Use development `?anchors=1` to review replacements.

`lib/trails.ts` builds exactly one path through the actual midpoint of the pair. It begins at the `join` beat, with no origin trails or split branches. A cumulative path-length mask reveals it behind the hearts while fixed thin dashes preserve their spacing. Existing content masks keep the line off lettering and the venue paper. Reverse scrolling erases the same path; it vanishes completely before the hearts return to their maps. The route follows the shared curve rather than drawing tangled loops for each heart's orbit.

`components/StoryMotion.tsx` owns one ScrollTrigger, reading physical native scroll through one common draw function. All poses, reveals, trails, and the map camera depend only on that current position. There are no motion timers, random offsets, velocity accumulation, spring tails, or numeric scrub delays. Overlays use invitation-local document coordinates; the pinned stage uses explicit local offsets. The page reserves the map's full height before hydration for reliable mid-scroll reload. Resize/orientation, images, fonts, locale changes, and development remounts rebuild geometry and clean up listeners/triggers. Overlay layers do not intercept input. Reduced motion and initialization failure show readable static scenes with a final city presentation and venue information; practical information also remains available without JavaScript.

## Verification

- `npm run typecheck`
- `npm run build`
- `node scripts/check-configuration.mjs` (Node 22.18+ for TypeScript imports)
- With the dev server running: `node scripts/review-master.mjs`
- With the dev server running: `node scripts/check-fallbacks.mjs`

Browser verification uses Playwright's installed Chromium on Linux/macOS or Microsoft Edge on Windows. Set `CHROMIUM_EXECUTABLE_PATH` to select another installed browser. Screenshots and reports are in `.verification/master/`. The updated review covers 320/390/430/1440px, orientation, central-pair spacing and vertical-lead limits, continuous positions/tangents, exactly one shared trail with no future reveal, slow/fast/reverse/paused travel, every camera handoff, pin/note attachment, mid-scroll reload/resize, locale preference/manual scenarios and visible-note switching, reached-date clock behavior, reduced motion, and no-JavaScript information. `?inspect=1` exposes development-only geometry, routes, and pose sampling. The line retains its content masks; the hearts now follow the central route over the artwork rather than taking outer-edge detours. No lint script/configuration exists.

Remaining required input is the exact venue name/address or coordinates. Optional final skyline/calligraphy files can replace the current quiet fallbacks. Recalibrate new artwork and verify the final real directions after supplying venue data.
