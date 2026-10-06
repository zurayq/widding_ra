export type Box={x:number;y:number;width:number;height:number};
export type Pose={x:number;y:number;width:number;height:number;rotation:number;depth:number};
export type Knot={scroll:number;a:Pose;b:Pose;route:{x:number;y:number};beat:string};
export type StoryGeometry={width:number;height:number;maxScroll:number;viewportHeight:number;origins:[Pose,Pose];verse:Box;childhood:Box;adult:Box;countdown:Box;map:Box;pinHeight:number;mapFrame:Box;note:Box;cityAnchor:{x:number;y:number};rest:Box};
export const choreography={visibleHeartWidth:24,visibleHeartRatio:297/253,tiltLimit:12,mapScrollDistance:1120};
const clip=(n:number,a:number,b:number)=>Math.max(a,Math.min(b,n));
export function buildJourney(g:StoryGeometry):Knot[]{
 const w=g.width,focus=Math.min(370,g.viewportHeight*.43),size=w<350?22:24,h=size/choreography.visibleHeartRatio,edge=size/2+2.5,knots:Knot[]=[];
 const pose=(x:number,y:number,r=0,depth=2):Pose=>({x,y,width:size,height:h,rotation:r,depth});
 const at=(y:number)=>y-focus;
 const add=(scroll:number,a:Pose,b:Pose,beat:string)=>{if(knots.length&&scroll<=knots.at(-1)!.scroll)throw Error('Non-continuous choreography range: '+beat);knots.push({scroll,a,b,route:{x:(a.x+b.x)/2,y:(a.y+b.y)/2},beat});};
 const pair=(s:number,x:number,y:number,ax:number,ay:number,bx:number,by:number,ar:number,br:number,beat:string)=>add(s,pose(x+ax,y+ay,ar,2),pose(x+bx,y+by,br,3),beat);
 const sides=(s:number,y:number,ar:number,br:number,beat:string,lead=10)=>add(s,pose(edge,y-lead,ar,2),pose(w-edge,y+lead,br,3),beat);
 add(0,...g.origins,'home');
 add(55,{...g.origins[0],x:g.origins[0].x-12,y:g.origins[0].y-23,rotation:-7},{...g.origins[1],x:g.origins[1].x+10,y:g.origins[1].y-18,rotation:8},'outward leap');
 pair(130,w*.56,focus+130,-22,-9,22,10,6,-5,'join');
 const approach=at(g.verse.y-78),span=approach-130;
 pair(130+span*.30,w*.58,focus+130+span*.30,24,-16,-24,16,-5,7,'passing orbit');
 pair(130+span*.64,w*.50,focus+130+span*.64,-8,-27,10,25,-8,7,'lead exchange');
 sides(approach,g.verse.y-78,-5,5,'verse approach',5);
 sides(at(g.verse.y+g.verse.height*.52),g.verse.y+g.verse.height*.52,3,-4,'verse aside',8);
 sides(at(g.verse.y+g.verse.height+18),g.verse.y+g.verse.height+18,2,-2,'verse exit',3);
 pair(at(g.verse.y+g.verse.height+63),w*.53,g.verse.y+g.verse.height+35,-18,-5,18,5,4,-4,'verse reunion');
 sides(at(g.childhood.y+58),g.childhood.y-65,-7,6,'childhood approach',5);
 sides(at(g.childhood.y+g.childhood.height*.43),g.childhood.y+g.childhood.height*.43,-6,8,'childhood detour',-12);
 sides(at(g.childhood.y+g.childhood.height*.86),g.childhood.y+g.childhood.height*.86,6,-5,'childhood caption',8);
 pair(at(g.childhood.y+g.childhood.height+24),w*.53,g.childhood.y+g.childhood.height+22,-17,-4,17,4,2,-2,'childhood reunion');
 sides(at(g.adult.y+95),g.adult.y-18,6,-7,'adult approach',-5);
 sides(at(g.adult.y+g.adult.height*.46),g.adult.y+g.adult.height*.46,7,-6,'adult detour',12);
 sides(at(g.adult.y+g.adult.height*.86),g.adult.y+g.adult.height*.86,-5,6,'adult caption',-8);
 sides(at(g.adult.y+g.adult.height+53),g.adult.y+g.adult.height+53,-2,2,'names aside',0);
 pair(at(g.adult.y+g.adult.height+86),w*.47,g.adult.y+g.adult.height+78,-18,4,18,-4,-3,3,'adult reunion');
 const c=g.countdown,left=Math.max(edge,c.x-19),right=Math.min(w-edge,c.x+c.width+19);
 add(at(c.y+28),pose(left,c.y-24,-8),pose(right,c.y-13,6,3),'paper approach');
 add(at(c.y+c.height*.53),pose(left,c.y+c.height*.53+16,6),pose(right,c.y+c.height*.53-17,-8,3),'paper lead change');
 pair(at(c.y+c.height+31),w*.51,c.y+c.height+31,-21,-6,21,6,-3,4,'paper reunion');
 pair(g.map.y-155,w*.53,g.map.y+36,-22,-7,22,7,4,-5,'map approach');
 const duration=g.map.height-g.pinHeight,top=g.mapFrame.y;
 pair(g.map.y,w*.54,g.map.y+top+80,-20,-5,20,5,-3,3,'pin entry');
 pair(g.map.y+duration*.22,w*.51,g.map.y+duration*.22+top+112,-18,6,18,-6,3,-2,'map closer');
 pair(g.map.y+duration*.46,w*.49,g.map.y+duration*.46+top+143,-17,-4,17,4,-2,2,'map regional');
 pair(g.map.y+duration*.81,g.cityAnchor.x,g.map.y+duration*.81+top+g.cityAnchor.y+24,-16,-3,16,3,1,-1,'city arrival');
 const ns=g.map.y+duration*.90,noteY=ns+top+g.note.y+g.note.height+22;
 add(ns,pose(21,noteY-5,-5,3),pose(w-21,noteY+5,6,2),'presenting note');
 const below=g.map.y+duration*.955,belowY=below+top+g.note.y+g.note.height+46;
 add(below,pose(25,belowY+3,4,3),pose(w-25,belowY-3,-4,2),'below the note');
 const releaseY=Math.min(g.pinHeight-42,top+g.note.y+g.note.height+78);
 pair(g.map.y+duration,w*.50,g.map.y+duration+releaseY,-18,-1,18,1,1,-1,'pin release');
 pair(at(g.rest.y-88),w*.52,g.rest.y-88,-20,3,20,-3,-2,2,'quiet descent');
 pair(at(g.rest.y),w*.5,g.rest.y,-18,0,18,2,0,0,'rest');
 if(g.maxScroll>knots.at(-1)!.scroll){const last=knots.at(-1)!;add(g.maxScroll,last.a,last.b,'rest hold');}
 return knots;
}
export function sampleJourney(knots:Knot[],scroll:number):Omit<Knot,'beat'|'scroll'>{
 let i=0;while(i<knots.length-2&&scroll>knots[i+1].scroll)i++;
 const a=knots[i],b=knots[i+1],span=b.scroll-a.scroll,t=clip((scroll-a.scroll)/span,0,1);
 const field=(read:(k:Knot)=>number)=>{
  const derivative=(j:number)=>{if(j===0||j===knots.length-1)return 0;const before=knots[j].scroll-knots[j-1].scroll,after=knots[j+1].scroll-knots[j].scroll,left=(read(knots[j])-read(knots[j-1]))/before,right=(read(knots[j+1])-read(knots[j]))/after;if(left*right<=0)return 0;const wa=2*after+before,wb=after+2*before;return(wa+wb)/(wa/left+wb/right);};
  const p=read(a),q=read(b),m=derivative(i)*span,n=derivative(i+1)*span,t2=t*t,t3=t2*t;return(2*t3-3*t2+1)*p+(t3-2*t2+t)*m+(-2*t3+3*t2)*q+(t3-t2)*n;
 };
 const body=(which:'a'|'b'):Pose=>({x:field(k=>k[which].x),y:field(k=>k[which].y),width:scroll>=130?clip(field(k=>k[which].width),22,28):field(k=>k[which].width),height:field(k=>k[which].height),rotation:clip(field(k=>k[which].rotation),-12,12),depth:t<.5?a[which].depth:b[which].depth});
 return{a:body('a'),b:body('b'),route:{x:field(k=>k.route.x),y:field(k=>k.route.y)}};
}
