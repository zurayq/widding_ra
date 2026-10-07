import {useId} from 'react';
export function StoryDecorations({area}:{area:'story'|'childhood'|'adult'|'countdown'|'ending'}){
 const uid=useId().replaceAll(':','');
 return <div className={'local-decorations decorations-'+area} aria-hidden="true">
  {(['heart','rose'] as const).map((kind,index)=><span className={'decorative-'+kind+'-small decoration-'+index} data-decoration data-sway={index?4:3} data-tilt={index?3:2} key={kind}>
   <svg viewBox="0 0 60 70" focusable="false"><defs><linearGradient id={uid+kind} x2=".8" y2="1"><stop stopColor="#dfa6a1"/><stop offset=".48" stopColor="#bd787b"/><stop offset="1" stopColor="#94555c"/></linearGradient></defs>
    {kind==='heart'?<><path d="M29 53C24 45 8 34 8 21C8 8 25 5 30 18C37 5 53 9 52 23C51 35 37 47 29 53Z" fill={'url(#'+uid+kind+')'}/><path d="M15 20Q17 13 23 16" stroke="#f7dbcb" strokeWidth="2" opacity=".65" fill="none"/></>:<><path d="M30 36Q28 54 22 66M27 51Q9 52 13 41Q24 41 27 51M26 56Q44 56 44 45Q29 45 26 56" fill="#9caa87" stroke="#788969" strokeWidth="1"/><path d="M30 40C8 38 10 22 17 15C15 5 30 2 36 9C49 6 56 22 46 30C44 40 37 42 30 40Z" fill={'url(#'+uid+kind+')'}/><path d="M29 14Q18 20 26 30Q39 37 43 22Q40 13 29 14ZM29 18Q38 16 37 24Q34 31 28 25Q24 22 29 18" fill="none" stroke="#f1c5b3" strokeWidth="1.3" opacity=".75"/></>}
   </svg>
  </span>)}
 </div>;
}
