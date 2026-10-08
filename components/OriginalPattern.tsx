'use client';
import {assets,visibleWindow} from '../lib/assets';
import {useArtworkLoad} from './useArtworkLoad';

/** Repeat the supplied artwork proportionally; never redraw its motifs. */
export function OriginalPattern({country}:{country:'algeria'|'palestine'}){
 const id=country==='algeria'?'openingPatternAlgeria':'openingPatternPalestine';
 const asset=assets[id],v=visibleWindow(asset),s=asset.sourceSize;
 const width=v.width*s.width,height=v.height*s.height;
 const {ref,status}=useArtworkLoad(asset.src,true);
 return <div ref={ref} className="original-pattern-strip" data-artwork={id} data-asset-state={status} aria-hidden="true" style={{visibility:status==='error'?'hidden':undefined}}>
  {Array.from({length:8},(_,i)=><svg key={i} className="original-pattern-tile" viewBox={[v.x*s.width,v.y*s.height,width,height].join(' ')} preserveAspectRatio="xMidYMin meet" style={{aspectRatio:width/height}} focusable="false">
   <image href={asset.src} width={s.width} height={s.height}/>
  </svg>)}
 </div>;
}
