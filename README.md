# Amir & Raghed · Wedding invitation

A warm, narrow paper invitation with two persistent dancing hearts, one reversible dashed shared route, childhood/adult portraits, faint traditional patterns, locally anchored roses/hearts, and a single continuous map-zoom video inside one sticky camera stage. The city card appears above its illustrative pin. Desktop keeps the 430px composition on a quiet ivory background.

## Run and check

`npm install`, then `npm run dev`: localhost only, http://127.0.0.1:3000. Use `npm run dev:network` explicitly for network access. On Windows use `npm.cmd` if PowerShell blocks `npm.ps1`. Direct Node entry points also support this folder's ampersand. Pass `-- --port 3100` for another port.

`npm run check` combines TypeScript, configuration/date/locale guards, full artwork decoding and exact-case checks, and a production build. `npm run build` / `npm start` serve production. `npm run check:browser` reviews the running site; `node scripts/review-metadata.mjs` checks share metadata, fonts/icons and Turkish no-JS masks. Browser scripts use `INVITATION_REVIEW_URL`, or localhost with `PORT`; `CHROMIUM_EXECUTABLE_PATH` overrides the browser. Otherwise they use installed Edge on Windows or Playwright Chromium on other systems. Install a compatible Playwright browser where one is not already available. There is no lint command or lint configuration.

## Wedding, languages and metadata

Edit `lib/content.ts`: Amir and Raghed; **17 October 2026, 15:00, Europe/Istanbul**; Tütünçiftlik Kültür Merkezi, Körfez, Kocaeli, Türkiye. Directions use the supplied place coordinates **40.7603888, 29.7847177**. The venue title opens the supplied Google Maps place; the directions link opens navigation to those coordinates. No street address is invented. Illustration anchors never supply real directions.

The countdown shows remaining time before the target, celebration from the target until the end of 17 October in Istanbul, then a warm thank-you message from 18 October onward. It checks local calendar dates, updates once per second before the event, schedules the wedding-day midnight transition, and stops in the final state. Screen readers are not notified every second.

`lib/i18n.ts` contains English, Turkish and Arabic copy. The primary browser/device language selects its supported translation; unsupported languages select English. Accept-Language provides initial server copy, then the browser synchronizes before paint. Old language cookies/localStorage selections have no effect. There is no language switch. Hidden `?lang=en` / `?lang=tr` / `?lang=ar` supports visual review. The page layout stays LTR; Arabic text uses RTL direction and the self-hosted Naskh font. Lora and Noto Naskh Arabic are self-hosted through `next/font/local`, with OFL licenses in `app/fonts/`.

Open Graph/Twitter fields, a 1200×630 share image, SVG/ICO icons and ivory theme color are supplied. Set `NEXT_PUBLIC_SITE_URL` to the actual deployment URL when known. Otherwise metadata uses an available real request origin; no deployment domain has been invented. `scripts/create-share-image.mjs` creates the current couple's share artwork and icons.

## Artwork and loading repair

The loading defect was **truncated public PNG data**, not URL encoding or missing source files. Nine public PNGs failed full decoding even though their paths returned HTTP 200. Eight active copies and one obsolete copy were affected. The corresponding eleven active originals in `Assets/` decode fully and remain unchanged. Valid originals were restored and browser-decoded before optimizing them.

The initial eleven optimized WebPs totaled **2,503,050 bytes**, versus **19,149,900 bytes** for their source originals: **16,646,850 bytes saved (86.9%)**. This compares equivalent valid artwork, not damaged file sizes. Alpha, proportions, full portrait canvases, names and paper details are preserved. Original-coordinate caption masks still cover only the baked English glyphs; larger HTML paper labels wrap naturally in all supported languages and at enlarged text sizes.

`lib/assets.ts` maps exact recoverable source names to safe semantic WebP URLs. `ASSETS.md` documents each role. `npm run assets:optimize` regenerates the derivatives from verified originals. Removed public PNG duplicates and the unused old childhood copy are locally archived in `.verification/legacy-public/`, and tracked versions remain recoverable through Git history. They are excluded from the production payload.

Opening maps, main heart and patterns are prioritized. Later SVG artwork is requested near its section. Portraits use native lazy loading and the same near-section decode check for their masks. Intrinsic dimensions reserve the image canvas. Successfully loaded images are rendered during loading and are never dependent on a ready-state opacity toggle. Decode failures get a localized, light fallback. A no-JavaScript presentation includes later artwork and practical information.

## Scroll behavior and content clearance

`StoryMotion.tsx` uses one native-scroll source for the pair, route, reveals, local decorations and camera. It caches animation targets and map elements at geometry measurement, rather than querying them on each frame. Smooth bounded orbit/lead changes remain deterministic under pause, fast scrolling and reversal. The pair's centre stays within 12px of the story centre before the map; the orbit exchanges their lead without edge detours or frozen formations. Measured text rows, countdown digits/labels, captions, headings, calendar link and flourishes define a 48px smooth transparency region. The entire pair fades toward 28% opacity near copy without clipping or disappearing, then gently returns to full opacity. Matte burgundy paper hearts use measured alpha bounds and the original opening positions. A 1.6% scroll-derived pulse stops and reverses with the journey; reduced motion and opening/final poses stay still. The route has one solid reveal mask and retained history.

Local secondary hearts/roses are native SVG assets in `StoryDecorations.tsx`. Both follow the supplied `IMG_3011.jpeg` aesthetic: hand-inked dark brown outlines, cream paper centres, soft beige rims and subtle grain. Roses have brown ink petal curls, stems and cream paper leaves. Their section positions stay fixed; nearby pair motion supplies only 3–4px displacement and 2–3° tilt. Reduced motion leaves them static.

Width/orientation and actual content layout changes rebuild the geometry while preserving the current dance/camera beat. Height-only address-bar changes retain the measured viewport, map dimensions, poses and current scroll. Font readiness, root/card layout observers and the produced initial/countdown-state event handle actual reflow; per-second ticks do not rebuild motion. The final descent decelerates into two distinct centred hearts. Opening, captions, countdown and ending flow with enlarged text; narrow/enlarged countdowns use two columns. Observers/listeners/triggers clean up on unmount. Patterns remain faint throughout, stronger around the opening maps. The old placeholder skylines stay disabled; the ending uses the approved transparent joined skyline.

`public/assets/map-zoom-mobile.mp4` is the lighter export of the approved Gulf zoom: 1280×720, 30fps, 6.4 seconds, silent H.264, fast-start, keyframes every 0.5 seconds, **3,001,500 bytes** (65.7% below the 8,756,149-byte original). The original full-HD clip remains recoverable as a source; it is not requested by the page. `MapVideo.tsx` loads it only within 600px of the map, unless reduced motion is enabled. `lib/map-video.ts` keeps one seek in flight and the latest scroll target; downward scroll advances, upward scroll rewinds, and stopping holds the frame. Arrival completes at 82% of the map scroll segment, before the venue card appears. Matching 720p first/final WebPs support loading, no-JS, reduced motion, and video failure. A pending arrival seek has a 1.2s grace period before permanently selecting the correct final still; media stalls and a 10s initial-load deadline also select that fallback. Late media events cannot undo failure. Cleanup cancels timers and listeners. `lib/map-camera.ts` follows the clip's illustrated shore and applies the same proportional phone crop to the video and stills. The illustration is not georeferenced: its pin is independent of the real directions coordinates. The final card fits its content. Very enlarged text in a short landscape viewport uses a bounded, keyboard/touch-scrollable card region above the pin.

Run `node scripts/review-video.mjs` against the running site for actual browser decoding, forward/reverse/rapid seeking, pause, lazy loading, note placement, coordinate links and reduced/video-error fallbacks.

## Verification limits and remaining inputs

Browser reports/screenshots: `.verification/refinement/`. The review covers 320/390/430/1440px, landscape, fresh asset decoding and reload, deterministic forward/reverse/stopped/rapid travel, readable-content clearance, one route, local decoration bounds, height-only stability, language preferences and ignored manual state, 200% text, countdown states/midnight, reduced motion, no-JS and genuine image/motion failures. The same browser review can run against a production server via `INVITATION_REVIEW_URL`.

These are desktop-browser simulations, **not physical-phone tests**. Exact-case validation supports Linux deployment, but an actual deployed Linux host has not been tested here. The venue is configured; a street address can be added if desired. Real skyline/calligraphy artwork is optional; live Arabic already works.

The venue keepsake uses `public/assets/venue-keepsake.webp`: transparent deckled paper, an illustrated coast, brown ink rose and hollow heart. Its lettering is native EN/TR/AR HTML, including the date, time and two accessible Google Maps links. Failed artwork retains a cream paper fallback with the same usable details. `node scripts/review-venue.mjs` checks all supported languages at 320/390px, decoding, correct links and card placement.

## Skyline ending

The approved Algiers/Jerusalem-inspired keepsake is `public/assets/skyline-keepsake.webp` (1000×500, transparent). Its baked lettering and hearts were removed, leaving the gold paper architecture and rose. The existing two travelling hearts settle in the centre gap; the EN/TR/AR closing heading is real text and flows at enlarged sizes. The tiny URAR Space credit has a 44px hit target and opens `mailto:studio@zurayq.lol`, as supplied. It is an email link, not an invented website URL. The skyline reserves its aspect ratio and loads lazily. No additional heart animation or controller is introduced.

## Verse keepsake

The verse uses the approved gold-edged cream paper and pressed golden flower artwork at `/assets/verse-keepsake.webp` (1000×563, transparent). Baked calligraphy was removed; Noto Naskh Arabic renders the exact vocalized excerpt in two natural block lines from `wedding.verseLines`, RTL with `lang="ar"`. Text grows and wraps with system text size; paper height follows it. The excerpt stays readable when images fail and with no JS/reduced motion. Existing shared dance and text clearance adapt to the section geometry.

## Countdown keepsake and calendar

`countdown-keepsake.webp` (800×1200, transparent) is the letter-free cream/gold deckled paper with a taped pressed golden flower from the approved preview. All headings, numbers, date and calendar control are native localized text. The paper grows with enlarged type and falls back to cream if artwork fails. The small practical labels use 12–13px base text; the deliberately tiny studio credit remains unchanged.

`/wedding.ics` downloads a UTF-8 calendar invitation with the confirmed **17 October 2026 at 15:00 in Istanbul** start (12:00 UTC), venue, coordinates and Google Maps link. No unconfirmed end time is invented. Calendar text is escaped and folded by UTF-8 octets. RSVP requires a couple-approved contact/form URL and is intentionally not fabricated.

The share preview now uses only `/share-preview.jpg`, including Körfez and the couple's names. The competing file-based Open Graph image and obsolete widding.ly signature are removed; both Open Graph and Twitter point to the same actual-origin image. The metadata browser review checks a single image, correct location alt text and reachable icons/download. Physical iPhone/Android scroll/Low Power Mode checks and an actual WhatsApp send/cache check still require real devices and the deployment URL.
