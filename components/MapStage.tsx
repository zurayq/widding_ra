'use client';
import { MapVideo } from './MapVideo';
import { useLocale } from './LocaleProvider';
import { wedding, buildDirectionsUrl } from '../lib/content';
import { formatWeddingDate, formatWeddingTime } from '../lib/i18n';
import styles from './MapStage.module.css';

export function MapStage() {
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
        <div className={'location-note paper-wrap ' + styles.annotation} data-reveal="location" data-map-note>
          <div className={'paper location-paper ' + styles.paper} role="region" aria-labelledby="location-heading" tabIndex={0}>
            <p className="eyebrow">{copy.ceremony}</p>
            <h3 id="location-heading">{wedding.venueName || wedding.city+', '+wedding.region}</h3>
            {wedding.address && <p className={styles.address}>{wedding.address}</p>}
            {wedding.venueName && <p className={styles.city}>{wedding.city}, {wedding.region}</p>}
            <div className={styles.details}><span>{date}</span><span>{time}</span></div>
            {directions && <a className={'directions ' + styles.directions} href={directions} target="_blank" rel="noopener noreferrer">{copy.directions}<span aria-hidden="true">↗</span></a>}
          </div>
        </div>
        <span className={styles.caption}>{copy.mapCaption}</span>
      </div>
    </div>
  </section>;
}
