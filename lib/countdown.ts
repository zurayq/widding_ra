export type TimeRemaining={days:number;hours:number;minutes:number;seconds:number};
export function getTimeRemaining(dateISO:string,now=Date.now()):TimeRemaining|null {
 if(!dateISO||!/(?:Z|[+-]\d{2}:\d{2})$/i.test(dateISO))return null;
 const target=Date.parse(dateISO);if(!Number.isFinite(target))return null;
 const total=Math.floor(Math.max(0,target-now)/1000);
 return {days:Math.floor(total/86400),hours:Math.floor(total%86400/3600),minutes:Math.floor(total%3600/60),seconds:total%60};
}
