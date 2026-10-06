# Close-pair heart motion repair

The latest request replaces the previous edge detours and split trails. Existing portraits, languages, wedding data, countdown, map camera and venue components are retained.

## Completed changes

- [x] Remove every wide left/right detour around the verse, portraits, countdown and venue note.
- [x] Keep both hearts on one gently curving central route after they meet.
- [x] Separate the shared route from small pair-relative circling and lead changes.
- [x] Smooth the transition from the measured country anchors without resetting the dance.
- [x] Keep heart centre separation within 40px and vertical lead within 20px after the join.
- [x] Keep exactly two persistent hearts and settle them separately at the ending.
- [x] Replace the 18 split/shared route spans with one shared path.
- [x] Begin the trail only at the meeting point; draw and erase it from scroll.
- [x] Preserve text/venue-note masks and keep the trail tied to the pair's actual midpoint.
- [x] Add faint fixed cultural edges at 3.5% opacity, retaining stronger opening patterns.
- [x] Preserve all original image files, locale support and real wedding configuration.
- [x] Update browser checks for the central pair and single-trail requirements.
- [x] Make the main browser review portable with CHROMIUM_EXECUTABLE_PATH.
- [x] Update README.md and ASSETS.md.

## Verification performed for this repair

- [x] TypeScript check.
- [x] Production build using the lockfile's Next.js 16.3.8.
- [x] Wedding configuration/countdown/directions/locale unit checks.
- [x] Browser review at 320, 390, 430 and 1440px, plus landscape orientation.
- [x] Dense central-corridor, pair-distance and vertical-lead checks.
- [x] Position/tangent/rotation/size continuity through 26 choreography knots.
- [x] Exactly one path, no pre-meeting trail, no future reveal and full top erasure.
- [x] Paused poses, backward snapshots, fast/repeated direction changes.
- [x] Map handoffs and over-city venue-note attachment.
- [x] Mid-scroll reload, viewport resize and orientation.
- [x] Six locale scenarios, persistent manual selection and switching mid-scroll.
- [x] Countdown reaches zero without changing the configured wedding timestamp.
- [x] Reduced motion and no-JavaScript practical information.
- [x] Actual browser screenshots inspected with local fonts configured.
- [x] Hash comparison confirms every original PNG remains unchanged.

The current review checks the new close central dance rather than the old whole-portrait clearance rule that forced the hearts toward the phone edges. The shared line retains content masks. Missing-artwork and forced-initialization-error tests from the previous implementation were not rerun for this scoped repair. No lint script/configuration exists.

## Genuine remaining inputs

- [ ] Exact venue name, address and/or coordinates. Directions stay unavailable until supplied.
- [ ] Optional supplied Algerian/Palestinian skyline artwork; quiet existing vector fallbacks remain.
- [ ] Optional supplied verse calligraphy; correctly shaped live Arabic is already available.

Amir/Raghed, 17 October 2026 at 15:00 in Europe/Istanbul, İzmit/Kocaeli, the two portraits, two patterns, four map frames and opening maps/heart are present.
