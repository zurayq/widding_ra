'use client';
import { useEffect, useId, useState, type CSSProperties } from 'react';
import { assets, type Bounds, type CaptionRegion } from '../lib/assets';
import { useLocale } from './LocaleProvider';
import styles from './PortraitComposition.module.css';

const placement = (bounds: Bounds): CSSProperties => ({
  left: bounds.x * 100 + '%', top: bounds.y * 100 + '%',
  width: bounds.width * 100 + '%', height: bounds.height * 100 + '%',
});

function splitCaption(caption: string, count: number): string[] {
  const explicit = caption.split('\n');
  if (explicit.length === count) return explicit;
  const words = caption.split(/\s+/), lines: string[] = [];
  while (lines.length < count) {
    const remainingLines = count - lines.length;
    lines.push(words.splice(0, Math.ceil(words.length / remainingLines)).join(' '));
  }
  return lines;
}

export function PortraitComposition({ kind, caption, alt }: {
  kind: 'childhood' | 'adult'; caption: string; alt: string;
}) {
  const asset = kind === 'childhood' ? assets.childhoodComposition : assets.adultComposition;
  const { width, height } = asset.sourceSize;
  const composition = asset.composition!;
  const captions = splitCaption(caption, composition.captionRegions.length);
  const uid = useId().replaceAll(':', '');
  const {copy} = useLocale();
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    // SSR images can fail before React attaches onError; a probe also covers that case.
    let active=true;
    const probe=new Image();
    probe.onerror=()=>{if(active){setFailed(true);console.error('Supplied invitation portrait could not load: '+asset.filename);}};
    probe.src=asset.src;
    return()=>{active=false;probe.onerror=null;};
  },[asset.src,asset.filename]);
  const rectanglePath = (region: CaptionRegion): string => {
    if (region.polygon) return region.polygon.map((point, i) => (i ? 'L' : 'M') + point.x * width + ' ' + point.y * height).join(' ') + 'Z';
    const { x, y, width: rw, height: rh } = region.bounds;
    return 'M' + x * width + ' ' + y * height + 'h' + rw * width + 'v' + rh * height + 'h-' + rw * width + 'Z';
  };
  if (failed) return <figure className={styles.unavailable} data-composition={kind} data-artwork={asset.id} data-asset-state="error">
    <p>{copy.assetUnavailable}</p><figcaption>{caption.replaceAll('\n', ' ')}</figcaption>
  </figure>;
  return <figure className={styles.composition} data-composition={kind} data-artwork={asset.id}
    style={{ aspectRatio: width / height }}>
    {/* The source PNG is intact. Only the original English letter regions receive paper from the same artwork. */}
    <img className={styles.original} src={asset.src} width={width} height={height} alt={alt} loading="eager" decoding="async" onError={()=>{
      setFailed(true);console.error('Supplied invitation portrait could not load: ' + asset.filename);
    }}/>
    <svg className={styles.captionMask} viewBox={'0 0 ' + width + ' ' + height} aria-hidden="true">
      <defs>
        {composition.captionRegions.map((region, index) => {
          const sample = region.paperSample;
          return <pattern key={index} id={uid + '-paper-' + index} patternUnits="userSpaceOnUse"
            width={sample.width * width} height={sample.height * height}>
            <image href={asset.src} x={-sample.x * width} y={-sample.y * height} width={width} height={height}/>
          </pattern>;
        })}
      </defs>
      {composition.captionRegions.map((region, index) => <path key={index} d={rectanglePath(region)} fill={'url(#' + uid + '-paper-' + index + ')'}/>)}
    </svg>
    <figcaption className={'portrait-caption ' + styles.caption} data-portrait-caption={kind}>
      {composition.captionRegions.map((region, index) => {
        const text = captions[index];
        const textBounds = region.textBounds ?? region.bounds;
        const usableWidth = textBounds.width * width - 10;
        // Approximate serif widths conservatively; the browser keeps all labels on their original paper strip.
        const fittedSize = region.multiline ? region.fontSize : Math.min(region.fontSize, usableWidth / Math.max(1, text.length * .69));
        return <span className={styles.captionLine + (region.multiline ? ' ' + styles.multiline : '')} data-caption-line={index} key={index} style={{
          ...placement(textBounds), transform: 'rotate(' + (region.rotation ?? 0) + 'deg)',
          fontSize: fittedSize / width * 100 + 'cqi',
        }}>{text}</span>;
      })}
    </figcaption>
    {composition.clearance.map(({ name, bounds }) => <span key={name} data-clearance={name}
      className={styles.clearance} style={placement(bounds)} aria-hidden="true"/>)}
  </figure>;
}
