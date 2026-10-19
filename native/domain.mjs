export function invitation(raw,variant){try{const u=new URL(raw.trim());if(u.origin!=='https://studioflowiq.com'||u.username||u.password||u.pathname!==(variant==='member'?'/member':'/login'))return null;const p=new URLSearchParams(u.hash.slice(1));const token=p.get(variant==='member'?'access':'setup');if(!token||!/^[a-f0-9]{64}$/.test(token))return null;return {token,studio:u.searchParams.get('studio')||''};}catch{return null}}
export function classId(booking){return booking.classId||booking.class_id}
export function memberId(booking){return booking.memberId||booking.member_id}
export function activeBooking(b){return ['Booked','Checked in','Waitlist'].includes(b.status)}
export function localDay(timezone,now=new Date()){return new Intl.DateTimeFormat('en-CA',{timeZone:timezone||'America/Chicago',year:'numeric',month:'2-digit',day:'2-digit'}).format(now)}
export function scanMember(value){return typeof value==='string'&&value.startsWith('SFIQ:member:')&&value.length>12?value.slice(12):null}
export function sortClasses(classes){return [...classes].sort((a,b)=>(a.date+a.time).localeCompare(b.date+b.time))}
