'use client';
import { useEffect, useState } from 'react';
import { wedding } from '../lib/content';
import { getTimeRemaining, type TimeRemaining } from '../lib/countdown';
import { useLocale } from './LocaleProvider';
export function Countdown() {
  const { copy } = useLocale();
  const [left, setLeft] = useState<TimeRemaining | null>(null);
  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | undefined;
    const update = () => {
      const next = getTimeRemaining(wedding.dateISO);
      setLeft(next);
      if (next && Object.values(next).every(n => n === 0) && timer) clearInterval(timer);
    };
    update();
    const next = getTimeRemaining(wedding.dateISO);
    if (next && Object.values(next).some(n => n > 0)) timer = setInterval(update, 1000);
    return () => { if (timer) clearInterval(timer); };
  }, []);
  const reached = left && Object.values(left).every(n => n === 0);
  return <div className="live-countdown" aria-live="off">
    {reached ? <p className="celebration">{copy.celebration}</p>
      : <div className="countdown-grid" aria-label={copy.countdownLabel}>
        {(['days', 'hours', 'minutes', 'seconds'] as const).map(unit =>
          <div key={unit}><span>{left ? String(left[unit]).padStart(2, '0') : '—'}</span><small>{copy[unit]}</small></div>)}
      </div>}
    {!left && !wedding.dateISO && <p>{copy.datePending}</p>}
  </div>;
}
