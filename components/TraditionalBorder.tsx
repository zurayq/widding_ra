/** Decorative edge artwork: native linework stays crisp at every screen size. */
export function TraditionalBorder({country}:{country:'algeria'|'palestine'}){
 return <svg className={'traditional-border traditional-border-'+country} viewBox="0 0 64 640" preserveAspectRatio="xMidYMin slice" aria-hidden="true" focusable="false">
  <g fill="none" stroke="currentColor" strokeWidth="1.15" strokeLinejoin="round">
   {country==='algeria'?<>
    <path d="M-2 0V640M3 0V640"/>
    {Array.from({length:8},(_,i)=><g key={i} transform={'translate(0 '+i*80+')'}>
     <path d="M-9 0L28 36L-9 72L-46 36ZM-9 8L20 36L-9 64L-38 36ZM-9 18L9 36L-9 54L-27 36Z"/>
     <path d="M-3 30H3V42H-3ZM-9 24H-3V30H-9M-9 42H-3V48H-9M24 9L29 14L24 19L19 14ZM32 20L36 24L32 28L28 24ZM24 53L29 58L24 63L19 58Z"/>
     <g transform="translate(24 76)"><path d="M0-9Q8-14 3-3Q14-8 9 0Q14 8 3 3Q8 14 0 9Q-8 14-3 3Q-14 8-9 0Q-14-8-3-3Q-8-14 0-9Z"/><circle r="2"/></g>
    </g>)}
   </>:<>
    <path d="M64 0V640M61 0V640M57 0V640M51 0V640"/>
    {Array.from({length:10},(_,i)=><g key={i} transform={'translate(38 '+(i*64+10)+')'}>
     <path d="M0-9L7-2L0 5L-7-2ZM0 9V44M0 20C-12 8-15 25 0 29C15 25 12 8 0 20ZM0 36C-11 24-15 37 0 44C15 37 11 24 0 36Z"/>
     <path d="M0 52L-9 43L-6 41L0 46L6 41L9 43ZM-20 14L-15 19L-20 24L-25 19ZM-20 34L-16 38L-20 42L-24 38Z"/>
     <path d="M19 0L22 3L19 6L16 3ZM19 12L22 15L19 18L16 15ZM19 24L22 27L19 30L16 27ZM19 36L22 39L19 42L16 39ZM19 48L22 51L19 54L16 51Z"/>
    </g>)}
   </>}
  </g>
 </svg>;
}
