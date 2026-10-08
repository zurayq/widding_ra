'use client';
import { Artwork } from '../components/Artwork';
import { OpeningOrigins } from '../components/OpeningOrigins';
import { OriginalPattern } from '../components/OriginalPattern';
import { PortraitComposition } from '../components/PortraitComposition';
import { Countdown } from '../components/Countdown';
import { StoryMotion } from '../components/StoryMotion';
import { MapStage } from '../components/MapStage';
import { StoryDecorations } from '../components/StoryDecorations';
import { useLocale } from '../components/LocaleProvider';
import { formatWeddingDate, formatWeddingTime } from '../lib/i18n';
import { wedding } from '../lib/content';
function Flourish(){return <div className="flourish" aria-hidden="true"><i/><span>◇</span><i/></div>;}
export default function Page(){
  const {locale,copy}=useLocale();
  return <main className="invitation enhanced" id="invitation">
    <div className="story-patterns" aria-hidden="true">
      <div className="story-pattern story-pattern-left"><OriginalPattern country="algeria"/></div>
      <div className="story-pattern story-pattern-right"><OriginalPattern country="palestine"/></div>
    </div>
    <StoryMotion/>
    <section className="opening scene" data-scene="opening" aria-label={copy.invitationTitle}>
      <div className="edge-pattern edge-left" aria-hidden="true"><OriginalPattern country="algeria"/></div>
      <div className="edge-pattern edge-right" aria-hidden="true"><OriginalPattern country="palestine"/></div>
      <div className="opening-heading"><p className="eyebrow">{copy.intro}</p><h1>{copy.titleFirst}{' '}<br/><em>{copy.titleSecond}</em></h1><p className="intro-subtitle">{copy.subtitle}</p></div>
      <div className="origin-composition">
        <OpeningOrigins algeria={copy.algeria} palestine={copy.palestine}/>
      </div>
      <div className="scroll-invitation"><span>{copy.scroll}</span><svg viewBox="0 0 16 44" aria-hidden="true"><path d="M8 1V38M3 32L8 39L13 32" fill="none" stroke="currentColor"/></svg></div>
    </section>
    <section className="verse-scene scene" data-scene="verse" aria-label={copy.verseLabel}>
      <StoryDecorations area="story"/>
      <div className="verse-composition" data-reveal="verse">
        {wedding.useVerseArtwork?<Artwork id="quran_verse" alt={copy.alt.verse}/>:<div className="verse-keepsake">
          {/* Letter-free artwork; Arabic remains selectable and readable without images. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="verse-paper-art" src="/assets/verse-keepsake.webp" width={1000} height={563} alt="" aria-hidden="true" loading="lazy"/>
          <p className="verse-text" dir="rtl" lang="ar">{wedding.verseLines.map((line,index)=><span key={line}>{line}{index===0?' ':''}</span>)}</p>
        </div>}
      </div>
    </section>
    <section className="portrait-scene childhood-scene scene" data-scene="childhood" aria-label={copy.alt.childhoodComposition}>
      <StoryDecorations area="childhood"/>
      <p className="eyebrow invitation-copy" data-reveal="invitation">{copy.invitation}</p>
      <div className="portrait-slot childhood-slot" data-reveal="childhood"><PortraitComposition kind="childhood" caption={copy.childhood} alt={copy.alt.childhoodComposition}/></div>
    </section>
    <section className="portrait-scene adult-scene scene" data-scene="adult" aria-label={copy.alt.adultComposition}>
      <StoryDecorations area="adult"/>
      <div className="portrait-slot adult-slot" data-reveal="adult"><PortraitComposition kind="adult" caption={copy.adult} alt={copy.alt.adultComposition}/></div>
      <p className="couple-names">{wedding.names.groom}<span aria-hidden="true"> &amp; </span>{wedding.names.bride}</p>
    </section>
    <section className="countdown-scene scene" data-scene="countdown" aria-label={copy.ceremony}>
      <StoryDecorations area="countdown"/>
      <div className="countdown-card" data-reveal="countdown"><div className="countdown-paper">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="countdown-paper-art" src="/assets/countdown-keepsake.webp" width={800} height={1200} alt="" aria-hidden="true" loading="lazy"/>
        <div className="countdown-content"><p className="eyebrow">{copy.ceremony}</p><Countdown/><Flourish/><p className="wedding-date">{formatWeddingDate(locale,wedding.dateISO,wedding.timezone)}<span>{formatWeddingTime(locale,wedding.dateISO,wedding.timezone)} · {wedding.country}</span></p><a className="calendar-link" href="/wedding.ics" download="amir-raghed-wedding.ics">{copy.addCalendar}</a></div>
      </div></div>
    </section>
    <MapStage/>
    <footer className="ending scene" data-scene="ending" aria-label={copy.closing}>
      <div className="skyline-scene">
        {/* The artwork contains no lettering or hearts; the live pair finishes in its centre. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="skyline-art" src="/assets/skyline-keepsake.webp" width={1000} height={500} alt="" aria-hidden="true" loading="lazy"/>
        <div className="skyline-overlay">
          <div className="closing-copy"><h2 className="ending-line" lang="en" dir="ltr">{copy.closing}</h2></div>
          <div className="resting-place" aria-hidden="true"/>
        </div>
      </div>
      <a className="wordmark" href="mailto:studio@zurayq.lol">URAR Space</a>
    </footer>
  </main>;
}
