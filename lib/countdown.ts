export type TimeRemaining={days:number;hours:number;minutes:number;seconds:number};
export function getWeddingState(dateISO:string,now=Date.now(),timeZone='Europe/Istanbul'):'before'|'celebration'|'thanks' {
 const target=Date.parse(dateISO);
 if(!Number.isFinite(target)||now<target)return 'before';
 const calendar=new Intl.DateTimeFormat('en-CA',{timeZone,year:'numeric',month:'2-digit',day:'2-digit'});
 return calendar.format(new Date(now))===calendar.format(new Date(target))?'celebration':'thanks';
}
export function getTimeRemaining(dateISO:string,now=Date.now()):TimeRemaining|null {
 if(!dateISO||!/(?:Z|[+-]\d{2}:\d{2})$/i.test(dateISO))return null;
 const target=Date.parse(dateISO);if(!Number.isFinite(target))return null;
 const total=Math.floor(Math.max(0,target-now)/1000);
 return {days:Math.floor(total/86400),hours:Math.floor(total%86400/3600),minutes:Math.floor(total%3600/60),seconds:total%60};
}
