'use client';
import { useEffect, useRef } from 'react';
import { attachMapVideo } from '../lib/map-video';
import styles from './MapStage.module.css';

export function MapVideo({ alt }: { alt: string }) {
  const container = useRef<HTMLDivElement>(null), video = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const root = document.querySelector<HTMLElement>('#invitation');
    if (root && video.current && container.current) return attachMapVideo(root, video.current, container.current);
  }, []);
  return <div className={styles.media} data-map-video data-video-state="static" ref={container}>
    {/* Final frame remains useful without JavaScript, video support or motion. */}
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img className={styles.finalStill} src="/assets/map-zoom-end.webp" alt={alt} loading="lazy" width={1280} height={720} onError={event=>{event.currentTarget.style.visibility='hidden';}}/>
    <div className={styles.fallbackPlane} data-map-fallback aria-hidden="true">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/assets/map-zoom-start.webp" alt="" loading="lazy" width={1280} height={720} onError={event=>{event.currentTarget.style.visibility='hidden';}}/>
    </div>
    <video className={styles.video} ref={video} muted playsInline preload="none" disablePictureInPicture aria-hidden="true" tabIndex={-1}/>
  </div>;
}
