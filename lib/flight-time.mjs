// Explicit wall-clock conversion, independent of the browser's local time zone.
export function zonedDateTime(timestamp, zone) {
 const parts=new Intl.DateTimeFormat('en-CA',{timeZone:zone,year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).formatToParts(new Date(timestamp));
 const get=k=>parts.find(p=>p.type===k).value;
 return `${get('year')}-${get('month')}-${get('day')}T${get('hour')}:${get('minute')}`;
}
export function wallTimeToISO(value,zone){
 const match=/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::\d{2})?$/.exec(value||'');
 if(!match)throw Error('Choose a complete date and time.');
 const [,y,m,d,h,min]=match.map(Number),wall=Date.UTC(y,m-1,d,h,min);
 const canonical=value.slice(0,16);
 if(zonedDateTime(wall,'UTC')!==canonical)throw Error('Choose a valid calendar date and time.');
 const offsets=new Set();
 for(const delta of [-86400000,0,86400000]){const t=wall+delta,local=zonedDateTime(t,zone);offsets.add(Date.parse(local+'Z')-t);}
 const candidates=[...offsets].map(offset=>wall-offset).filter(t=>zonedDateTime(t,zone)===canonical);
 if(!candidates.length)throw Error('This time does not exist during the daylight-saving change. Choose another time.');
 if(candidates.length>1)throw Error('This time occurs twice during the daylight-saving change. Select UTC / Zulu to specify the exact time.');
 return new Date(candidates[0]).toISOString();
}
