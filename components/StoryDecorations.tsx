import {useId} from 'react';
export function StoryDecorations({area}:{area:'story'|'childhood'|'adult'|'countdown'|'ending'}){
 const uid=useId().replaceAll(':','');
 return <div className={'local-decorations decorations-'+area} aria-hidden="true">
  {(['heart','rose'] as const).map((kind,index)=><span className={'decorative-'+kind+'-small decoration-'+index} data-decoration data-sway={index?4:3} data-tilt={index?3:2} key={kind}>
   <svg viewBox="0 0 60 70" focusable="false"><defs>
    {kind==='heart'?<><linearGradient id={uid+kind} x2=".7" y2="1"><stop stopColor="#fff5df"/><stop offset="1" stopColor="#efdfba"/></linearGradient>
     <filter id={uid+'paper-grain'} x="-10%" y="-10%" width="120%" height="120%" colorInterpolationFilters="sRGB"><feTurbulence type="fractalNoise" baseFrequency=".65" numOctaves="2" seed="8" result="grain"/><feColorMatrix in="grain" type="saturate" values="0"/><feComponentTransfer><feFuncR type="linear" slope=".08" intercept=".92"/><feFuncG type="linear" slope=".08" intercept=".92"/><feFuncB type="linear" slope=".08" intercept=".92"/></feComponentTransfer><feComposite in2="SourceGraphic" operator="in"/><feBlend in2="SourceGraphic" mode="multiply"/></filter></>:<linearGradient id={uid+kind} x2=".8" y2="1"><stop stopColor="#dfa6a1"/><stop offset=".48" stopColor="#bd787b"/><stop offset="1" stopColor="#94555c"/></linearGradient>}
    </defs>
    {kind==='heart'?<g filter={'url(#'+uid+'paper-grain)'} strokeLinecap="round" strokeLinejoin="round">
     {/* Cream paper rim and a slightly uneven, hand-inked brown heart. */}
     <path d="M30 60C25 52 7 37 7 22C6 8 19 4 29 19C35 8 46 3 52 14C60 29 44 43 30 60Z" fill={'url(#'+uid+kind+')'} stroke="#d4bd91" strokeWidth="3" opacity=".75"/>
     <path d="M30 55C24 47 12 36 12 23C11 12 21 9 29 24L30 28C34 16 44 9 48 17C55 28 40 44 30 55Z" fill={'url(#'+uid+kind+')'} stroke="#65401b" strokeWidth="4.5"/>
     <path d="M13 22C12 15 18 12 22 15M48 20C50 27 45 35 41 40" fill="none" stroke="#8b5928" strokeWidth=".8" opacity=".65"/>
    </g>:<><path d="M30 36Q28 54 22 66M27 51Q9 52 13 41Q24 41 27 51M26 56Q44 56 44 45Q29 45 26 56" fill="#9caa87" stroke="#788969" strokeWidth="1"/><path d="M30 40C8 38 10 22 17 15C15 5 30 2 36 9C49 6 56 22 46 30C44 40 37 42 30 40Z" fill={'url(#'+uid+kind+')'}/><path d="M29 14Q18 20 26 30Q39 37 43 22Q40 13 29 14ZM29 18Q38 16 37 24Q34 31 28 25Q24 22 29 18" fill="none" stroke="#f1c5b3" strokeWidth="1.3" opacity=".75"/></>}
   </svg>
  </span>)}
 </div>;
}
