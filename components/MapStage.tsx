'use client';
import {useEffect,useRef} from 'react';
import { MapVideo } from './MapVideo';
import { useLocale } from './LocaleProvider';
import { wedding, buildDirectionsUrl } from '../lib/content';
import { formatWeddingDate, formatWeddingTime } from '../lib/i18n';
import styles from './MapStage.module.css';

export function MapStage() {
  const art=useRef<HTMLImageElement>(null);
  const failArt=(image:HTMLImageElement)=>{image.style.display='none';image.parentElement?.classList.add(styles.artFailed);};
  useEffect(()=>{const image=art.current;if(image?.complete&&!image.naturalWidth)failArt(image);},[]);
  const { locale, copy } = useLocale();
  const directions = buildDirectionsUrl();
  const date = formatWeddingDate(locale, wedding.dateISO, wedding.timezone);
  const time = formatWeddingTime(locale, wedding.dateISO, wedding.timezone);
  return <section className={'map-scene scene ' + styles.stage} data-scene="map" aria-label={copy.mapSceneLabel}>
    <div className={'map-pin ' + styles.pin}>
      <header className={'destination-heading ' + styles.heading}>
        <p className="eyebrow">{copy.destination}</p><h2>{copy.mapHeading}</h2>
      </header>
      <div className={'map-window ' + styles.frame} data-map-frame>
        <MapVideo alt={copy.alt.mapWide}/>
        <div className={styles.vignette} aria-hidden="true"/>
        <span className={'venue-pin ' + styles.marker} aria-label={copy.venuePinLabel} role="img"><svg viewBox="0 0 30 39" aria-hidden="true"><path d="M15 37S2 23 2 14C2-3 28-3 28 14C28 23 15 37 15 37Z" fill="currentColor"/><circle cx="15" cy="14" r="5" fill="#fff7e7"/></svg></span>
        <div className={'location-note ' + styles.annotation} data-reveal="location" data-map-note>
          <div className={'location-paper ' + styles.paper} role="region" aria-labelledby="location-heading" tabIndex={0}>
            {/* Letter-free artwork keeps every label selectable and localized. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img ref={art} className={styles.keepsakeArt} src="/assets/venue-keepsake.webp" width={800} height={887} alt="" aria-hidden="true" loading="lazy" onError={event=>failArt(event.currentTarget)}/>
            <div className={styles.noteCopy}>
            <p className="eyebrow">{copy.ceremony}</p>
            <h3 id="location-heading"><a href={wedding.placeUrl} target="_blank" rel="noopener noreferrer" aria-label={copy.viewPlace}>{wedding.venueName || wedding.city+', '+wedding.region}</a></h3>
            {wedding.address && <p className={styles.address}>{wedding.address}</p>}
            {wedding.venueName && <p className={styles.city}>{wedding.city}, {wedding.region}</p>}
            <div className={styles.details}><span>{date}</span><span>{time}</span></div>
            {directions && <a className={'directions ' + styles.directions} href={directions} target="_blank" rel="noopener noreferrer">{copy.directions}<span aria-hidden="true">↗</span></a>}
            </div>
          </div>
        </div>
        <span className={styles.caption}>{copy.mapCaption}</span>
      </div>
    </div>
  </section>;
}
