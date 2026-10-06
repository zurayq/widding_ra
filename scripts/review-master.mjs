import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import assert from 'node:assert/strict';

const output = '.verification/master';
const baseURL = process.env.INVITATION_REVIEW_URL || 'http://localhost:3000';
const diagnostic = process.env.INVITATION_REVIEW_DIAGNOSTIC === '1';
const browser = await chromium.launch({ headless: true, executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe' });
const report = { widths: [], locale: [], clock: {}, static: {}, errors: [] };
const suppliedFiles = [
  'ChatGPT Image Oct 6, 2026, 07_51_13 PM.png', 'ChatGPT Image Oct 6, 2026, 08_33_05 PM.png',
  'ChatGPT Image Oct 6, 2026, 07_51_03 PM.png', 'ChatGPT Image Oct 6, 2026, 07_51_09 PM.png',
  'ChatGPT Image Oct 6, 2026, 07_50_39 PM.png', 'ChatGPT Image Oct 6, 2026, 07_50_49 PM.png',
  'ChatGPT Image Oct 6, 2026, 07_50_54 PM.png', 'ChatGPT Image Oct 6, 2026, 07_50_58 PM.png',
];
await mkdir(output, { recursive: true });

async function ready(page) {
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all([...document.images].map(image => image.decode().catch(() => {})));
  });
  await page.waitForFunction(() => ['algeria_hart_map', 'palastine_hart_map', 'palastine_small_hart', 'openingPatternAlgeria', 'openingPatternPalestine', 'mapWide', 'mapCloser', 'mapRegional', 'mapCity'].every(id => document.querySelector('[data-artwork="' + id + '"][data-asset-state="ready"]')), null, { timeout: 20000 });
  await page.waitForFunction(() => window.__weddingMotion?.knots?.length > 2, null, { timeout: 20000 });
  await page.waitForTimeout(220);
}
async function move(page, y, wait = 65) {
  await page.evaluate(position => window.scrollTo(0, position), y);
  await page.waitForFunction(() => Math.abs(Number(document.querySelector('.motion-layer')?.dataset.scroll)-window.scrollY)<.5, null, { timeout: 3000 });
  await page.waitForTimeout(wait);
}
async function snapshot(page) {
  return page.evaluate(() => ({
    scroll: window.scrollY,
    hearts: [...document.querySelectorAll('.traveller')].map(el => ({ transform: el.style.transform, width: el.style.width, height: el.style.height, z: el.style.zIndex })),
    routes: [...document.querySelectorAll('[data-route]')].map(el => ({ id: el.getAttribute('data-route'), d: el.getAttribute('d'), opacity: el.style.opacity, mask: el.getAttribute('mask') })),
    masks: [...document.querySelectorAll('.route-svg mask path')].map(el => ({ d: el.getAttribute('d'), offset: el.style.strokeDashoffset, dash: el.style.strokeDasharray, opacity: el.style.opacity })),
    camera: [...document.querySelectorAll('[data-map-layer]')].map(el => ({ transform: el.style.transform, opacity: el.style.opacity, width: el.style.width, height: el.style.height, left: el.style.left, top: el.style.top })),
    note: (() => { const el = document.querySelector('.location-note'); return el ? { opacity: el.style.opacity, transform: el.style.transform, left: el.style.left, top: el.style.top, visibility: el.style.visibility } : null; })(),
    marker: (() => { const el = document.querySelector('.venue-pin'); return el ? { opacity: el.style.opacity, left: el.style.left, top: el.style.top, visibility: el.style.visibility } : null; })(),
  }));
}
async function sameSnapshot(page, expected, label) {
  const actual = await snapshot(page);
  const changed = Object.keys(expected).filter(key => JSON.stringify(actual[key]) !== JSON.stringify(expected[key]));
  if (!changed.length) return;
  const filename = output + '/difference-' + label.replaceAll(/[^a-z0-9]+/gi, '-').toLowerCase() + '.json';
  await writeFile(filename, JSON.stringify({ actual, expected }, null, 2));
  throw new Error(label + ': changed ' + changed.join(', ') + '; scroll ' + expected.scroll + ' → ' + actual.scroll + '. Details: ' + filename);
}
async function coreStructure(page, width) {
  assert.equal(await page.locator('.traveller').count(), 2, 'There must be exactly two persistent travellers');
  assert.equal(await page.locator('.map-window').count(), 1, 'One shared map viewport');
  assert.equal(await page.locator('.map-window [data-map-layer]').count(), 4, 'All four geographic stages are in the same viewport');
  assert.equal(await page.locator('.map-window .location-note').count(), 1, 'Venue note is over the map');
  assert.equal(await page.locator('[data-scene="childhood"]').count(), 1);
  assert.equal(await page.locator('[data-scene="adult"]').count(), 1);
  assert.equal(await page.locator('[data-portrait-caption]').count(), 2);
  for (const [selector,filename] of [
    ['[data-composition="childhood"] img',suppliedFiles[0]],
    ['[data-composition="adult"] img',suppliedFiles[1]],
    ['.edge-left [data-artwork] svg image',suppliedFiles[2]],
    ['.edge-right [data-artwork] svg image',suppliedFiles[3]],
    ...[0,1,2,3].map(index=>['[data-map-layer="'+index+'"] svg image',suppliedFiles[index+4]]),
  ]) {
    const source=await page.locator(selector).getAttribute(selector.endsWith(' img')?'src':'href');
    assert.equal(decodeURIComponent(new URL(source,baseURL).pathname).split('/').at(-1),filename,'Exact source role and map order: '+selector);
  }
  for (const [scene,width,height] of [['childhood',1024,1536],['adult',1122,1402]]) {
    assert.deepEqual(await page.locator('[data-composition="'+scene+'"] img').evaluate(image=>({width:image.naturalWidth,height:image.naturalHeight})),{width,height},'Portrait intrinsic proportions and load: '+scene);
  }
  const layout = await page.evaluate(() => {
    const root = document.querySelector('#invitation'), box = root.getBoundingClientRect();
    return { width: box.width, left: box.left, height: root.scrollHeight, overflow: document.documentElement.scrollWidth, patternCount: document.querySelectorAll('[data-scene="opening"] .edge-pattern').length, patternTotal: document.querySelectorAll('.edge-pattern').length };
  });
  assert.equal(layout.width, Math.min(width, 430));
  assert.ok(layout.overflow <= width, 'No horizontal overflow at ' + width);
  assert.ok(Math.abs(layout.left - (width - layout.width) / 2) < 1, 'Phone composition is centered');
  assert.equal(layout.patternCount, 2); assert.equal(layout.patternTotal, 2);
  return layout;
}
async function samplerChecks(page) {
  return page.evaluate(() => {
    const m = window.__weddingMotion, g = m.geometry, failures = [], continuity = [];
    const epsilon = .02;
    for (const knot of m.knots.slice(1, -1)) {
      const before = m.sample(knot.scroll - epsilon), at = m.sample(knot.scroll), after = m.sample(knot.scroll + epsilon);
      const row = { beat: knot.beat, scroll: knot.scroll, position: 0, tangent: 0, scalar: 0 };
      for (const body of ['a', 'b']) {
        row.position = Math.max(row.position, Math.hypot(before[body].x - after[body].x, before[body].y - after[body].y));
        row.tangent = Math.max(row.tangent, Math.hypot((at[body].x-before[body].x)/epsilon-(after[body].x-at[body].x)/epsilon, (at[body].y-before[body].y)/epsilon-(after[body].y-at[body].y)/epsilon));
        row.scalar = Math.max(row.scalar, Math.abs(before[body].rotation-after[body].rotation), Math.abs(before[body].width-after[body].width));
      }
      continuity.push(row);
    }
    const clearance = m.clearance || [];
    for (let scroll = 180; scroll <= g.maxScroll; scroll += 3) {
      const pair = m.sample(scroll);
      for (const [index, h] of [pair.a, pair.b].entries()) {
        if (h.x-h.width*.55 < 0 || h.x+h.width*.55 > g.width) failures.push({ scroll, index, reason: 'horizontal clipping' });
        if (h.width < 21.999 || h.width > 28.001 || Math.abs(h.rotation) > 15) failures.push({ scroll, index, reason: 'size or tilt' });
        for (const [target, b] of clearance.entries()) {
          if (h.x+h.width*.52>b.x && h.x-h.width*.52<b.x+b.width && h.y+h.height*.52>b.y && h.y-h.height*.52<b.y+b.height) failures.push({ scroll, index, target, reason: 'meaningful composition overlap' });
        }
      }
    }
    return { continuity, failures, clearanceCount: clearance.length, networkCount: m.routes?.length ?? 0 };
  });
}

async function routeChecks(page) {
  return page.evaluate(() => {
    const motion = window.__weddingMotion, scroll = window.scrollY, pair = motion.sample(scroll), failures = [], active = [];
    for (const route of motion.routes) {
      const mask = document.querySelector('[data-reveal-route="' + route.id + '"]');
      if (!mask) { failures.push({ id: route.id, reason: 'missing independent reveal mask' }); continue; }
      const pathLength = mask.getTotalLength(), offset = Number(mask.style.strokeDashoffset), visible = Math.max(0, pathLength-offset);
      if (offset < -.2 || offset > pathLength+.2) failures.push({ id: route.id, reason: 'invalid path-length reveal range', offset, pathLength });
      if (visible <= .05) continue;
      // Invert the path-length reveal against each branch's own sampled history.
      // A leading heart must never expose a sample from later native-scroll progress.
      const distance = visible/pathLength*route.lengths.at(-1);
      let index = 0;
      while (index < route.lengths.length-2 && route.lengths[index+1] < distance) index++;
      const span = route.lengths[index+1]-route.lengths[index];
      const t = span ? Math.max(0, Math.min(1, (distance-route.lengths[index])/span)) : 0;
      const revealedScroll = route.scrolls[index]+(route.scrolls[index+1]-route.scrolls[index])*t;
      if (revealedScroll > scroll+.1) failures.push({ id: route.id, reason: 'future trail revealed', scroll, revealedScroll });
      if (scroll >= route.start && scroll < route.end) {
        const point = mask.getPointAtLength(visible);
        const body = route.kind === 'a' ? pair.a : route.kind === 'b' ? pair.b : pair.route;
        const gap = Math.hypot(point.x-body.x, point.y-body.y);
        if (gap > (route.kind === 'shared' ? 65 : 45)) failures.push({ id: route.id, reason: 'leading trail detached from traveller', gap, scroll });
        active.push({ id: route.id, kind: route.kind, gap, revealedScroll });
      }
    }
    const separation = Math.hypot(pair.a.x-pair.b.x, pair.a.y-pair.b.y);
    if (scroll > 55 && separation > 95 && !['a', 'b'].every(kind => active.some(route => route.kind === kind))) failures.push({ reason: 'separated hearts require both independently revealed branches', scroll, separation, active });
    return { scroll, separation, active, failures };
  });
}

try {
  for (const width of [320, 390, 430, 1440]) {
    const context = await browser.newContext({ viewport: { width, height: width === 1440 ? 900 : 844 }, deviceScaleFactor: 1, locale: 'en-US' });
    const page = await context.newPage(), errors = [];
    const loadedAssets = new Set();
    page.on('pageerror', error => errors.push(error.message));
    page.on('response', response => {
      const filename = decodeURIComponent(new URL(response.url()).pathname).split('/').at(-1);
      if (suppliedFiles.includes(filename)) {
        if (response.ok() || response.status() === 304) loadedAssets.add(filename);
        else errors.push('Required asset HTTP ' + response.status() + ': ' + filename);
      }
    });
    page.on('console', message => { if (message.type() === 'error' && /hydration|hydrated|did not match|Invitation motion/i.test(message.text())) errors.push(message.text()); });
    await page.goto(baseURL + '/?inspect=1', { waitUntil: 'networkidle' }); await ready(page);
    const layout = await coreStructure(page, width);
    const motion = await page.evaluate(() => ({ geometry: window.__weddingMotion.geometry, knots: window.__weddingMotion.knots, routes: window.__weddingMotion.routes }));
    const checks = await samplerChecks(page);
    assert.ok(checks.continuity.every(row => row.position < 1 && row.tangent < .15 && row.scalar < .1), 'Position/tangent/rotation/size continuity at ' + width);
    assert.ok(checks.clearanceCount > 0, 'Meaningful collision targets must be present');
    if (checks.failures.length) await writeFile(output + '/clearance-' + width + '.json', JSON.stringify(checks.failures, null, 2));
    if (diagnostic && checks.failures.length) report.errors.push('Dense silhouette clearance at ' + width + ': ' + checks.failures.length + ' collisions');
    else assert.equal(checks.failures.length, 0, 'Dense silhouette clearance at ' + width);
    assert.ok(await page.locator('[data-route]').count() >= 3, 'Separate and shared route network');
    await page.screenshot({ path: output + '/opening-' + width + '.png' });
    const beats = [], networkChecks = [], pauseKnots = motion.knots.filter((_, index) => index % 3 === 1);
    for (const knot of pauseKnots) {
      await move(page, knot.scroll); const stopped = await snapshot(page);
      const network = await routeChecks(page); networkChecks.push(network);
      assert.deepEqual(network.failures, [], 'Per-heart trail endpoint/history check: ' + knot.beat);
      await page.waitForTimeout(220); await sameSnapshot(page, stopped, 'Stopped scroll freezes all visuals: ' + knot.beat);
      await move(page, knot.scroll + 23); await move(page, knot.scroll); await sameSnapshot(page, stopped, 'Reverse restores all visuals: ' + knot.beat);
      beats.push(knot.beat);
      if (width === 390) await page.screenshot({ path: output + '/beat-' + knot.beat.replaceAll(/[^a-z0-9]+/gi, '-').toLowerCase() + '.png' });
    }
    if (width === 390) {
      for (const scene of ['childhood', 'adult']) {
        const start = await page.locator('[data-scene="' + scene + '"]').evaluate(el => el.getBoundingClientRect().top + window.scrollY - 85);
        await move(page, start);
        await page.screenshot({ path: output + '/' + scene + '-composition.png' });
      }
      const mapChecks = [];
      for (const progress of [0, .20, .24, .28, .44, .48, .52, .68, .72, .76, .88, .96, .99]) {
        await move(page, motion.geometry.map.y + (motion.geometry.map.height-motion.geometry.pinHeight)*progress);
        const frame = await page.evaluate(() => {
          const map = document.querySelector('.map-window').getBoundingClientRect(), note = document.querySelector('.location-note').getBoundingClientRect();
          return { frame: { x: map.x, y: map.y, width: map.width, height: map.height }, note: { x: note.x-map.x, y: note.y-map.y, width: note.width, height: note.height }, layers: [...document.querySelectorAll('[data-map-layer]')].map(el => ({ opacity: Number(getComputedStyle(el).opacity), transform: getComputedStyle(el).transform })) };
        });
        assert.ok(frame.layers.some(layer => layer.opacity >= .45), 'Map handoff keeps occupied imagery');
        assert.ok(frame.layers.every(layer => layer.opacity >= 0 && layer.opacity <= 1));
        if (progress >= .88) {
          assert.ok(frame.note.x >= -1 && frame.note.y >= -1 && frame.note.x+frame.note.width <= frame.frame.width+1 && frame.note.y+frame.note.height <= frame.frame.height+1, 'Venue annotation remains clamped inside map view');
          assert.ok(frame.layers.at(-1).opacity > .99, 'Final city view established before venue note');
        }
        mapChecks.push({ progress, ...frame });
        const network = await routeChecks(page); networkChecks.push(network);
        assert.deepEqual(network.failures, [], 'Pinned map trails remain behind their own hearts');
        await page.screenshot({ path: output + '/map-' + String(progress).replace('.', '-') + '.png' });
      }
      assert.ok(mapChecks.every(row => Math.abs(row.frame.y-mapChecks[0].frame.y)<1), 'All camera stages share one stable pinned frame');
      const settled = mapChecks.filter(row => row.progress >= .96);
      assert.ok(Math.abs(settled[0].note.x-settled[1].note.x)<1 && Math.abs(settled[0].note.y-settled[1].note.y)<1, 'Final note stays attached to city anchor');
      report.map = mapChecks;
      for (const knot of motion.knots.slice(1, -1)) for (const delta of [-10, -2, 0, 2, 10]) await move(page, knot.scroll + delta, 30);
      const middle = Math.round(motion.geometry.map.y + (motion.geometry.map.height - motion.geometry.pinHeight) * .78);
      await move(page, middle); const reference = await snapshot(page);
      for (const destination of [0, motion.geometry.maxScroll, middle - 450, 200, middle + 200, middle]) await move(page, destination, 35);
      await sameSnapshot(page, reference, 'Rapid repeated direction changes retrace deterministically');
      await page.reload({ waitUntil: 'networkidle' }); await ready(page);
      await sameSnapshot(page, reference, 'Mid-scroll reload restores camera, routes and hearts');
      await page.setViewportSize({ width: 320, height: 844 }); await page.waitForTimeout(220);
      assert.equal(await page.evaluate(() => window.__weddingMotion.geometry.width), 320);
      await page.setViewportSize({ width: 390, height: 844 }); await page.waitForTimeout(220);
      await sameSnapshot(page, reference, 'Resize back restores the same visual pose');
      await page.locator('.locale-switch button').filter({ hasText: 'TR' }).click(); await page.waitForTimeout(160);
      assert.equal(await page.getAttribute('html', 'lang'), 'tr');
      await sameSnapshot(page, reference, 'Language switch preserves scroll and choreography');
      assert.equal(await page.locator('#invitation').evaluate(el => el.scrollHeight), layout.height, 'Both languages reserve the same geometry');
      assert.ok((await page.locator('[data-portrait-caption]').allTextContents()).every(text => /kalptiler|hikâyesine/i.test(text)), 'Both artwork captions are localized');
      assert.ok(await page.locator('.location-note').textContent().then(text => text.includes('17 Ekim 2026') && text.includes('15:00')));
      for (const scene of ['childhood','adult']) {
        const position=await page.locator('[data-scene="'+scene+'"]').evaluate(el=>el.getBoundingClientRect().top+window.scrollY-85);
        await move(page,position);
        assert.equal(await page.locator('[data-composition="'+scene+'"] img').evaluate(image=>image.complete&&image.naturalWidth>0),true,'Supplied portrait remains loaded in Turkish');
        await page.screenshot({path:output+'/turkish-'+scene+'-composition.png'});
      }
      await move(page,middle);
      await sameSnapshot(page,reference,'Turkish portrait roundtrip restores mid-scroll choreography');
      await move(page, motion.geometry.map.y+(motion.geometry.map.height-motion.geometry.pinHeight)*.98);
      const translatedNotePose=await snapshot(page);
      await page.screenshot({ path: output + '/turkish-city-note.png' });
      await page.locator('.locale-switch button').filter({ hasText: 'EN' }).click(); await page.waitForTimeout(160);
      await sameSnapshot(page,translatedNotePose,'Visible venue note switch to English preserves geometry');
      await page.locator('.locale-switch button').filter({ hasText: 'TR' }).click(); await page.waitForTimeout(160);
      await sameSnapshot(page,translatedNotePose,'Visible venue note switch back to Turkish preserves geometry');
      await move(page,middle);
      await page.locator('.locale-switch button').filter({ hasText: 'EN' }).click(); await page.waitForTimeout(160);
      await sameSnapshot(page, reference, 'Switch back to English preserves scroll and choreography');
      const disabled = page.locator('.directions');
      assert.equal(await disabled.isDisabled(), true, 'Missing venue keeps directions unavailable');
      assert.ok(await disabled.evaluate(el => el.getBoundingClientRect().height >= 44), 'Comfortable directions target');
      assert.equal(await page.locator('.live-countdown').getAttribute('aria-live'), 'off');
      await page.emulateMedia({ reducedMotion: 'reduce' }); await page.waitForTimeout(220);
      await page.locator('.location-note').scrollIntoViewIfNeeded();
      assert.equal(await page.locator('.location-note').evaluate(el => getComputedStyle(el).opacity), '1');
      assert.equal(await page.locator('.route-svg').evaluate(el => getComputedStyle(el).display), 'none');
      assert.ok(await page.locator('.map-window [data-map-layer]').last().evaluate(el => Number(getComputedStyle(el).opacity) > .99));
      await page.screenshot({ path: output + '/reduced-motion.png' });
      await page.emulateMedia({ reducedMotion: 'no-preference' }); await page.waitForTimeout(220);
    }
    await move(page, 0);
    const top = await page.evaluate(() => ({ opacity: document.querySelector('.route-svg').style.opacity, masks: [...document.querySelectorAll('.route-svg mask path')].map(el => ({ length: el.getTotalLength(), offset: Number(el.style.strokeDashoffset) })) }));
    assert.equal(top.opacity, '0'); assert.ok(top.masks.every(mask => Math.abs(mask.length-mask.offset) < .2), 'All branch history is erased at the top');
    assert.equal(loadedAssets.size, 8, 'All eight exact supplied files load successfully through the journey');
    assert.deepEqual(errors, []);
    report.widths.push({ width, layout, checks, networkChecks, beats, errors, top, loadedAssets: [...loadedAssets], motion });
    await context.close();
  }

  const orientationContext = await browser.newContext({ viewport: { width: 390, height: 844 }, locale: 'en-US' });
  const orientationPage = await orientationContext.newPage();
  await orientationPage.goto(baseURL + '/?inspect=1', { waitUntil: 'networkidle' }); await ready(orientationPage);
  await orientationPage.setViewportSize({ width: 844, height: 390 }); await ready(orientationPage);
  const landscapeGeometry = await orientationPage.evaluate(() => window.__weddingMotion.geometry);
  await move(orientationPage, landscapeGeometry.map.y+(landscapeGeometry.map.height-landscapeGeometry.pinHeight)*.99);
  const landscape = await orientationPage.evaluate(() => {
    const map=document.querySelector('.map-window').getBoundingClientRect(),note=document.querySelector('.location-note').getBoundingClientRect(),button=document.querySelector('.directions').getBoundingClientRect();
    return { width: document.querySelector('#invitation').getBoundingClientRect().width, map:{x:map.x,y:map.y,width:map.width,height:map.height}, note:{x:note.x-map.x,y:note.y-map.y,width:note.width,height:note.height}, button:{y:button.y-map.y,height:button.height}, overflow:document.documentElement.scrollWidth };
  });
  assert.equal(landscape.width,430); assert.ok(landscape.overflow<=844);
  assert.ok(landscape.note.x>=-1 && landscape.note.y>=-1 && landscape.note.x+landscape.note.width<=landscape.map.width+1 && landscape.note.y+landscape.note.height<=landscape.map.height+1,'Landscape orientation keeps venue annotation inside map');
  assert.ok(landscape.button.height>=44 && landscape.button.y+landscape.button.height<=landscape.map.height,'Landscape directions remains readable and touchable');
  await orientationPage.screenshot({path:output+'/landscape-orientation.png'});
  await orientationPage.setViewportSize({width:390,height:844}); await ready(orientationPage);
  assert.equal(await orientationPage.evaluate(()=>window.__weddingMotion.geometry.width),390);
  const orientationPose=await snapshot(orientationPage); await orientationPage.waitForTimeout(220); await sameSnapshot(orientationPage,orientationPose,'Returning to portrait freezes settled orientation geometry');
  report.orientation=landscape; await orientationContext.close();

  for (const test of [
    { id: 'turkish', preferences: ['tr-TR', 'en-US'], accept: 'tr-TR,en-US;q=0.9', expected: 'tr' },
    { id: 'english', preferences: ['en-US', 'tr-TR'], accept: 'en-US,tr-TR;q=0.9', expected: 'en' },
    { id: 'supported-later', preferences: ['fr-FR', 'de-DE', 'tr-TR'], accept: 'fr-FR,de-DE;q=0.9,tr-TR;q=0.8', expected: 'tr' },
    { id: 'unsupported', preferences: ['fr-FR', 'de-DE'], accept: 'fr-FR,de-DE;q=0.9', expected: 'en' },
    { id: 'manual-cookie', preferences: ['tr-TR'], accept: 'tr-TR', manual: 'en', expected: 'en' },
    { id: 'manual-storage', preferences: ['en-US'], accept: 'en-US', storage: 'tr', expected: 'tr' },
  ]) {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 }, extraHTTPHeaders: { 'Accept-Language': test.accept } });
    await context.addInitScript(({ preferences, storage }) => {
      Object.defineProperty(navigator, 'languages', { get: () => preferences });
      Object.defineProperty(navigator, 'language', { get: () => preferences[0] });
      if (storage) localStorage.setItem('invitation-language', storage);
    }, test);
    if (test.manual) await context.addCookies([{ name: 'invitation-language', value: test.manual, url: baseURL }]);
    const page = await context.newPage();
    await page.goto(baseURL + '/?inspect=1', { waitUntil: 'networkidle' }); await ready(page);
    assert.equal(await page.getAttribute('html', 'lang'), test.expected, 'Browser locale case ' + test.id);
    assert.equal(await page.locator('.locale-switch button[aria-pressed="true"]').textContent(), test.expected.toUpperCase());
    if (!test.storage) {
      const html = await context.request.get(baseURL + '/');
      assert.ok((await html.text()).includes('<html lang="' + test.expected + '"'), 'Server locale case ' + test.id);
    }
    await page.locator('.locale-switch button').filter({ hasText: test.expected === 'tr' ? 'EN' : 'TR' }).click();
    const manual = test.expected === 'tr' ? 'en' : 'tr';
    await page.reload({ waitUntil: 'networkidle' }); await ready(page);
    assert.equal(await page.getAttribute('html', 'lang'), manual, 'Manual selection persists: ' + test.id);
    report.locale.push({ ...test, persisted: manual }); await context.close();
  }

  const clockContext = await browser.newContext({ viewport: { width: 390, height: 844 }, locale: 'en-US' });
  const clockPage = await clockContext.newPage();
  const target = new Date('2026-10-17T15:00:00+03:00');
  await clockPage.clock.install({ time: new Date(target.getTime() - 3000) });
  await clockPage.clock.pauseAt(new Date(target.getTime() - 2000));
  await clockPage.goto(baseURL + '/?inspect=1', { waitUntil: 'networkidle' });
  assert.ok((await clockPage.locator('.countdown-grid').textContent()).includes('02'));
  await clockPage.clock.runFor(2000);
  assert.equal(await clockPage.locator('.celebration').count(), 1, 'Reached date shows celebration');
  const reached = await clockPage.locator('.live-countdown').textContent();
  await clockPage.clock.runFor(5000);
  assert.equal(await clockPage.locator('.live-countdown').textContent(), reached, 'Reached-date clock stays stopped at zero');
  report.clock = { target: target.toISOString(), reached, afterFiveSeconds: await clockPage.locator('.live-countdown').textContent() };
  await clockContext.close();

  const staticContext = await browser.newContext({ viewport: { width: 390, height: 844 }, javaScriptEnabled: false, extraHTTPHeaders: { 'Accept-Language': 'tr-TR' } });
  const staticPage = await staticContext.newPage(); await staticPage.goto(baseURL + '/', { waitUntil: 'networkidle' });
  await staticPage.locator('.location-note').scrollIntoViewIfNeeded();
  assert.equal(await staticPage.locator('.location-note').evaluate(el => getComputedStyle(el).opacity), '1');
  assert.ok(await staticPage.locator('.location-note').textContent().then(text => text.includes('17 Ekim 2026') && text.includes('İzmit')));
  assert.equal(await staticPage.locator('.directions').isDisabled(), true);
  await staticPage.screenshot({ path: output + '/no-javascript.png' });
  report.static = { locale: await staticPage.getAttribute('html', 'lang'), venueVisible: true, directionsDisabled: true };
  await staticContext.close();
  await writeFile(output + '/report.json', JSON.stringify(report, null, 2));
  if (report.errors.length) { console.log('Diagnostic review completed with unresolved failures: ' + report.errors.length); process.exitCode = 1; }
  else console.log('Master browser checks passed: four widths, choreography, reversible routes/camera, lifecycle, EN/TR, countdown and static fallback.');
} catch (error) {
  report.errors.push(error.stack || String(error));
  await writeFile(output + '/report.json', JSON.stringify(report, null, 2));
  throw error;
} finally { await browser.close(); }
