import {sampleJourney,type Knot} from './choreography';
type Point={x:number;y:number};
export type RouteSpan={id:string;kind:'shared'|'a'|'b';start:number;end:number;points:Point[];scrolls:number[];lengths:number[];length:number;d:string};
const clamp=(n:number)=>Math.max(0,Math.min(1,n));
const ease=(n:number)=>{const t=clamp(n);return t*t*(3-2*t);};
export function buildRouteNetwork(knots:Knot[]):RouteSpan[]{
 const beat=(name:string)=>knots.find(k=>k.beat===name)!.scroll,spans:RouteSpan[]=[];
 const splits:[number,number][]=[
  [0,beat('join')],
  [beat('verse approach')-68,beat('verse reunion')],
  [beat('childhood approach')-64,beat('childhood reunion')],
  [beat('adult approach')-64,beat('adult reunion')],
  [beat('paper approach')-34,beat('paper reunion')],
  [beat('city arrival')+12,beat('pin release')],
 ];
 let cursor=0,index=0;
 const add=(start:number,end:number,kind:RouteSpan['kind'],initial=false)=>{
  if(end-start<.5)return;
  const count=Math.max(8,Math.ceil((end-start)/3)),points:Point[]=[],scrolls:number[]=[],lengths=[0];
  for(let j=0;j<=count;j++){
   const s=start+(end-start)*j/count,p=sampleJourney(knots,s),t=j/count;
   // Junctions are authored in scroll space. Their weight has zero tangent at either end.
   const junction=Math.min(20,(end-start)*.18);
   const split=initial?1-ease((s-(end-junction))/junction):ease((s-start)/junction)*(1-ease((s-(end-junction))/junction));
   const body=kind==='a'?p.a:p.b,weight=kind==='shared'?0:split;
   const point={x:p.route.x+(body.x-p.route.x)*weight,y:p.route.y+(body.y-p.route.y)*weight};
   points.push(point);scrolls.push(s);
   if(j)lengths[j]=lengths[j-1]+Math.hypot(point.x-points[j-1].x,point.y-points[j-1].y);
  }
  const d=points.map((p,j)=>(j?'L':'M')+p.x.toFixed(3)+','+p.y.toFixed(3)).join(' ');
  spans.push({id:'route-'+index++,kind,start,end,points,scrolls,lengths,length:lengths.at(-1)!,d});
 };
 for(let i=0;i<splits.length;i++){
  const start=Math.max(cursor,splits[i][0]),end=splits[i][1];
  if(start>cursor)add(cursor,start,'shared');
  add(start,end,'a',i===0);add(start,end,'b',i===0);cursor=end;
 }
 add(cursor,beat('rest'),'shared');
 return spans;
}
export function routeLengthAt(route:RouteSpan,scroll:number):number{
 if(scroll<=route.start)return 0;if(scroll>=route.end)return route.length;
 const index=(scroll-route.start)/(route.end-route.start)*(route.points.length-1),i=Math.min(route.points.length-2,Math.floor(index)),t=index-i;
 return route.lengths[i]+(route.lengths[i+1]-route.lengths[i])*t;
}
