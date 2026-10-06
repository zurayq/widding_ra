'use client';
import { Artwork, OliveSprig } from '../components/Artwork';
import { PortraitComposition } from '../components/PortraitComposition';
import { Countdown } from '../components/Countdown';
import { StoryMotion } from '../components/StoryMotion';
import { MapStage } from '../components/MapStage';
import { LocaleSwitch } from '../components/LocaleSwitch';
import { useLocale } from '../components/LocaleProvider';
import { formatWeddingDate, formatWeddingTime } from '../lib/i18n';
import { wedding } from '../lib/content';
function Flourish(){return <div className="flourish" aria-hidden="true"><i/><span>◇</span><i/></div>;}
export default function Page(){
  const {locale,copy}=useLocale();
  return <main className="invitation enhanced" id="invitation">
    <LocaleSwitch/>
    <StoryMotion/>
    <section className="opening scene" data-scene="opening" aria-label={copy.intro}>
      <div className="opening-heading"><p className="eyebrow">{copy.intro}</p><h1>{copy.titleFirst}<br/><em>{copy.titleSecond}</em></h1><p className="intro-subtitle">{copy.subtitle}</p></div>
      <div className="origin-composition">
        <div className="edge-pattern edge-left"><Artwork id="openingPatternAlgeria"/></div>
        <div className="edge-pattern edge-right"><Artwork id="openingPatternPalestine"/></div>
        <div className="origins">
          <figure className="origin algeria"><div data-origin="algeria_hart_map"><Artwork id="algeria_hart_map" alt={copy.alt.algeria}/></div><figcaption>{copy.algeria}</figcaption><OliveSprig className="map-sprig"/></figure>
          <figure className="origin palestine"><div data-origin="palastine_hart_map"><Artwork id="palastine_hart_map" alt={copy.alt.palestine}/></div><figcaption>{copy.palestine}</figcaption><OliveSprig className="map-sprig"/></figure>
        </div>
      </div>
      <div className="scroll-invitation"><span>{copy.scroll}</span><svg viewBox="0 0 16 44" aria-hidden="true"><path d="M8 1V38M3 32L8 39L13 32" fill="none" stroke="currentColor"/></svg></div>
    </section>
    <section className="verse-scene scene" data-scene="verse" aria-label={copy.verseLabel}>
      <div className="verse-composition" data-reveal="verse"><Flourish/>{wedding.useVerseArtwork?<Artwork id="quran_verse" alt={copy.alt.verse}/>:<p className="verse-text" dir="rtl" lang="ar">{wedding.verse}</p>}<Flourish/></div>
    </section>
    <section className="portrait-scene childhood-scene scene" data-scene="childhood" aria-label={copy.alt.childhoodComposition}>
      <p className="eyebrow invitation-copy" data-reveal="invitation">{copy.invitation}</p>
      <div className="portrait-slot childhood-slot" data-reveal="childhood"><PortraitComposition kind="childhood" caption={copy.childhood} alt={copy.alt.childhoodComposition}/></div>
    </section>
    <section className="portrait-scene adult-scene scene" data-scene="adult" aria-label={copy.alt.adultComposition}>
      <div className="portrait-slot adult-slot" data-reveal="adult"><PortraitComposition kind="adult" caption={copy.adult} alt={copy.alt.adultComposition}/></div>
      <p className="couple-names">{wedding.names.groom}<span aria-hidden="true"> &amp; </span>{wedding.names.bride}</p>
    </section>
    <section className="countdown-scene scene" data-scene="countdown" aria-label={copy.countdownLabel}>
      <div className="countdown-card paper-wrap" data-reveal="countdown"><div className="paper countdown-paper"><p className="eyebrow">{copy.ceremony}</p><h2>{copy.countdown}</h2><Countdown/><Flourish/><p className="wedding-date">{formatWeddingDate(locale,wedding.dateISO,wedding.timezone)}<span>{formatWeddingTime(locale,wedding.dateISO,wedding.timezone)} · {wedding.country}</span></p></div><OliveSprig className="countdown-sprig"/></div>
    </section>
    <MapStage/>
    <section className="ending scene" data-scene="ending" aria-label={copy.closing}>
      <p className="eyebrow ending-line">{copy.ending}</p>
      <div className="landmark landmark-left"><Artwork id="algerian_landmark"/></div><div className="landmark landmark-right"><Artwork id="palestinian_landmark"/></div>
      <div className="resting-place" aria-hidden="true"/><div className="closing-copy"><Flourish/><h2>{copy.closing}</h2><p>{copy.algeria} &amp; {copy.palestine}</p><span className="wordmark">widding.ly</span></div>
    </section>
  </main>;
}
