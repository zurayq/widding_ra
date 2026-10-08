'use client';
import { useEffect, useRef } from 'react';
import { attachMapVideo } from '../lib/map-video';
import styles from './MapStage.module.css';
import { mapVideo } from '../lib/map-video-config';
import { videoAnchor, mapCameraConfig } from '../lib/map-camera';

export function MapVideo({ alt }: { alt: string }) {
  const container = useRef<HTMLDivElement>(null), video = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const root = document.querySelector<HTMLElement>('#invitation');
    if (root && video.current && container.current) return attachMapVideo(root, video.current, container.current);
  }, []);
  const anchor=videoAnchor(1), scale=mapCameraConfig.destinationY/anchor.y, ratio=mapVideo.width/mapVideo.height;
  return <div className={styles.media} data-map-video data-video-state="static" ref={container}>
    {/* The corrected final shore remains available without JavaScript or media. */}
    <div className={styles.staticPlane} data-map-static
      style={{width:'calc(var(--map-frame-height) * '+ratio*scale+')',height:'calc(var(--map-frame-height) * '+scale+')',left:'calc(50% - var(--map-frame-height) * '+ratio*scale*anchor.x+')',top:'calc('+mapCameraConfig.destinationY*100+'% - var(--map-frame-height) * '+scale*anchor.y+')'}}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className={styles.finalStill} src={mapVideo.poster} alt={alt} loading="lazy" width={mapVideo.width} height={mapVideo.height} onError={event=>{event.currentTarget.style.visibility='hidden';}}/>
    </div>
    <div className={styles.fallbackPlane} data-map-fallback aria-hidden="true">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={mapVideo.startPoster} alt="" loading="lazy" width={mapVideo.width} height={mapVideo.height} onError={event=>{event.currentTarget.style.visibility='hidden';}}/>
      <video className={styles.video} ref={video} width={mapVideo.width} height={mapVideo.height} muted playsInline preload="none" disablePictureInPicture aria-hidden="true" tabIndex={-1}/>
    </div>
  </div>;
}
