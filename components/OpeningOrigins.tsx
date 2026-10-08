import {Artwork} from './Artwork';
import {openingHomes} from '../lib/assets';
export function OpeningOrigins({algeria,palestine}:{algeria:string;palestine:string}){
 return <div className="origins opening-origins">
  <div className="opening-map-art">
   <Artwork id="openingComposition"/>
   {openingHomes.map(({id,bounds:b})=><div key={id} className="heart-home" data-origin={id} aria-hidden="true" style={{left:b.x*100+'%',top:b.y*100+'%',width:b.width*100+'%',height:b.height*100+'%'}}>
    <noscript><Artwork id="palastine_small_hart"/></noscript>
   </div>)}
  </div>
  <div className="origin-labels"><span>{algeria}</span><span>{palestine}</span></div>
 </div>;
}
