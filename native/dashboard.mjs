// Match the portal overview using only the authenticated server response.
export function studioOverview(records,bookings,permissions,today){
 const can=p=>permissions.includes(p),classes=records.filter(r=>r.kind==='class');
 const metrics=[];
 if(can('view_members'))metrics.push({key:'members',title:'Active members',value:String(records.filter(r=>r.kind==='member'&&r.status==='Active').length),detail:'Current member records',target:'members'});
 if(can('view_schedule')){
  metrics.push({key:'bookings',title:'Confirmed bookings',value:String(bookings.filter(b=>b.status==='Booked').length),detail:bookings.filter(b=>b.status==='Waitlist').length+' on the waitlist',target:'schedule'});
  const ids=new Set(classes.filter(c=>c.date===today).map(c=>c.id));
  metrics.push({key:'attendance',title:'Checked in today',value:String(bookings.filter(b=>ids.has(b.classId||b.class_id)&&b.status==='Checked in').length),detail:'Studio attendance',target:'schedule'});
 }
 // Revenue and reports have separate permissions; do not expose financial totals
 // merely because a person can open the schedule or member directory.
 if(can('view_payments')){
  const revenue=records.filter(r=>r.kind==='payment'&&r.status==='Paid'&&String(r.date||'').startsWith(today.slice(0,7))).reduce((sum,p)=>sum+(Number.isFinite(Number(p.amount))?Number(p.amount):0),0);
  metrics.push({key:'revenue',title:'Recorded revenue this month',value:new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(revenue),detail:'Paid records · excludes refunds',target:can('view_reports')?'reports':null});
 }
 return metrics;
}
