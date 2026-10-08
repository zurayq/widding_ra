import assert from 'node:assert/strict';
import { wedding, buildDirectionsUrl } from '../lib/content.ts';
import { getTimeRemaining,getWeddingState } from '../lib/countdown.ts';
import { selectLocale, selectLocaleFromAcceptLanguage, formatWeddingDate, formatWeddingTime, translations } from '../lib/i18n.ts';

assert.equal(wedding.dateISO, '2026-10-17T15:00:00+03:00');
assert.equal(wedding.timezone, 'Europe/Istanbul');
assert.equal(wedding.city, 'Körfez');
assert.equal(wedding.venueName, 'Tütünçiftlik Kültür Merkezi');
assert(wedding.placeUrl.includes('!3d40.7603888!4d29.7847177'));
assert.deepEqual(new Set(Object.values(wedding.names)), new Set(['Amir', 'Raghed']));
const target = Date.parse(wedding.dateISO);
assert.deepEqual(getTimeRemaining(wedding.dateISO, target - 90061000), { days: 1, hours: 1, minutes: 1, seconds: 1 });
assert.deepEqual(getTimeRemaining(wedding.dateISO, target), { days: 0, hours: 0, minutes: 0, seconds: 0 });
assert.deepEqual(getTimeRemaining(wedding.dateISO, target + 86400000), { days: 0, hours: 0, minutes: 0, seconds: 0 });
assert.equal(getTimeRemaining('2026-10-17T15:00:00', target), null);
assert.equal(getTimeRemaining('invalid', target), null);
const unset = { venueName: '', address: '', latitude: '', longitude: '', city: 'İzmit', region: 'Kocaeli', country: 'Türkiye' };
assert.equal(buildDirectionsUrl(unset), '', 'A city alone must never enable venue directions');
assert.equal(new URL(buildDirectionsUrl()).searchParams.get('destination'),'40.7603888,29.7847177','Directions use the supplied real coordinates');
assert.equal(buildDirectionsUrl({ ...unset, venueName: 'Unverified venue label' }), '');
assert.equal(new URL(buildDirectionsUrl({ ...unset, latitude: '0', longitude: '0' })).searchParams.get('destination'), '0,0');
assert.equal(buildDirectionsUrl({ ...unset, latitude: '91', longitude: '1' }), '');
const address = { ...unset, venueName: 'Example configured venue', address: 'Example exact address' };
assert.equal(new URL(buildDirectionsUrl(address)).searchParams.get('destination'), 'Example configured venue, Example exact address, İzmit, Kocaeli, Türkiye');
for (const [preferences, manual, expected] of [
  [['tr-TR', 'en-US'], null, 'tr'], [['en-US', 'tr-TR'], null, 'en'],
  [['fr-FR', 'de-DE', 'tr-TR'], null, 'en'], [['fr-FR', 'de-DE'], null, 'en'],
  [['tr-TR'], 'en', 'tr'], [['en-US'], 'tr', 'en'], [['ar-DZ'], null, 'ar'], [['ar-PS','en'], 'en', 'ar'],
]) assert.equal(selectLocale(preferences, manual), expected);
assert.equal(selectLocaleFromAcceptLanguage('fr;q=1,tr-TR;q=0.8,en;q=0.3'), 'en');
assert.equal(selectLocaleFromAcceptLanguage('tr;q=0,en-US;q=1'), 'en');
assert.equal(selectLocaleFromAcceptLanguage('en-US,tr-TR;q=0.9', 'tr'), 'en');
assert.equal(getWeddingState(wedding.dateISO,target-1),'before');
assert.equal(getWeddingState(wedding.dateISO,target),'celebration');
assert.equal(getWeddingState(wedding.dateISO,Date.parse('2026-10-17T23:59:59+03:00')),'celebration');
assert.equal(getWeddingState(wedding.dateISO,Date.parse('2026-10-18T00:00:00+03:00')),'thanks');
assert.equal(formatWeddingDate('en', wedding.dateISO, wedding.timezone), '17 October 2026');
assert.equal(formatWeddingDate('tr', wedding.dateISO, wedding.timezone), '17 Ekim 2026');
for (const locale of ['en', 'tr']) assert.equal(formatWeddingTime(locale, wedding.dateISO, wedding.timezone), '15:00');
assert.deepEqual(Object.keys(translations.en).sort(), Object.keys(translations.tr).sort());
assert.deepEqual(Object.keys(translations.en.alt).sort(), Object.keys(translations.tr.alt).sort());
console.log('Wedding timestamp, names, venue guard, countdown, locale preference and Istanbul formatting checks passed.');

assert.equal(selectLocaleFromAcceptLanguage('ar-DZ,tr;q=0.8,en;q=0.5'),'ar');
assert.deepEqual(Object.keys(translations.en).sort(),Object.keys(translations.ar).sort());
assert.deepEqual(Object.keys(translations.en.alt).sort(),Object.keys(translations.ar.alt).sort());
import {weddingCalendar} from '../lib/calendar.ts';
const calendar=weddingCalendar(wedding,buildDirectionsUrl()),unfolded=calendar.replace(/\r\n /g,'');
assert(unfolded.includes('DTSTART:20261017T120000Z\r\n'));
assert(unfolded.includes('GEO:40.7603888;29.7847177'));
assert(unfolded.includes('Tütünçiftlik Kültür Merkezi'));
assert(!unfolded.includes('DTEND:'),'Do not invent an event duration');
for(const line of calendar.split('\r\n'))assert(Buffer.byteLength(line)<=75,'Calendar folding respects UTF-8 octets');
console.log('Arabic locale, calendar UTC start, venue and UTF-8 folding checks passed.');
