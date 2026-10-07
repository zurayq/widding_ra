'use client';
import { useEffect, useLayoutEffect, useState } from 'react';
import { wedding } from '../lib/content';
import { getTimeRemaining, getWeddingState, type TimeRemaining } from '../lib/countdown';
import { useLocale } from './LocaleProvider';
export function Countdown() {
  const { copy } = useLocale();
  const [left, setLeft] = useState<TimeRemaining | null>(null);
  const [state,setState]=useState<'before'|'celebration'|'thanks'>('before');
  const ready=left!==null;
  useLayoutEffect(()=>{
    // Measure the initial real digits and rare calendar-state changes only;
    // second-by-second ticking never rebuilds the scroll story.
    if(ready)window.dispatchEvent(new Event('invitation-countdown-layout'));
  },[ready,state]);
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    const update = () => {
      const next = getTimeRemaining(wedding.dateISO);
      setLeft(next);
      const current=getWeddingState(wedding.dateISO,Date.now(),wedding.timezone);setState(current);
      // Continue across local midnight, then stop completely in the final state.
      if(current!=='thanks')timer=setTimeout(update,current==='before'?1000:Math.max(1,Date.parse(wedding.dateISO.slice(0,10)+'T00:00:00+03:00')+86400000-Date.now()));
    };
    update();
    return () => { if (timer) clearTimeout(timer); };
  }, []);
  return <><h2>{state==='before'?copy.countdown:state==='celebration'?copy.celebrationHeading:copy.thankYouHeading}</h2><div className="live-countdown" aria-live="off">
    {state!=='before' ? <p className="celebration" data-countdown-state={state}>{state==='thanks'?copy.thankYou:copy.celebration}</p>
      : <div className="countdown-grid" aria-label={copy.countdownLabel}>
        {(['days', 'hours', 'minutes', 'seconds'] as const).map(unit =>
          <div key={unit}><span>{left ? String(left[unit]).padStart(2, '0') : '—'}</span><small>{copy[unit]}</small></div>)}
      </div>}
    {!left && !wedding.dateISO && <p>{copy.datePending}</p>}
  </div></>;
}
