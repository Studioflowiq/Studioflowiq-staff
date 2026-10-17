export const categories=['VFR','MVFR','IFR','LIFR'];
export function validateMinimums(p){
 const bounds={minCeilingFt:[0,60000],minVisibilitySm:[0,100],maxCrosswindKt:[0,100],maxWindKt:[0,150],maxGustKt:[0,200],maxSkyCover:[0,100],maxForecastAgeHours:[1,24],windowMinutes:[0,120]};
 const out={name:String(p?.name||'My personal minimums').slice(0,80),vfrOnly:p?.vfrOnly!==false,avoidThunderstorms:p?.avoidThunderstorms!==false};
 for(const [k,[lo,hi]] of Object.entries(bounds)){if(k==='maxCrosswindKt'&&(p?.[k]===''||p?.[k]==null)){out[k]=null;continue}if(p?.[k]===''||p?.[k]==null||!Number.isFinite(Number(p[k]))||Number(p[k])<lo||Number(p[k])>hi)throw Error('Enter a valid '+k.replace(/([A-Z])/g,' $1').toLowerCase()+'.');out[k]=Number(p[k])}
 out.allowedCategories=categories.filter(c=>p?.allowedCategories?.includes(c));if(!out.allowedCategories.length)throw Error('Choose at least one permitted flight category.');if(out.vfrOnly&&out.allowedCategories.some(c=>['IFR','LIFR'].includes(c)))throw Error('VFR-only profiles cannot permit IFR or LIFR.');return out;
}
export function crosswind(direction,speed,heading){if(![direction,speed,heading].every(Number.isFinite)||speed<0)return null;const angle=(direction-heading)*Math.PI/180;return Math.abs(speed*Math.sin(angle))}
export function evaluatePoint(point,minimums,now=Date.now()){
 const search=point.forecast?.nearbySearch,searchNote=search?.searchComplete?' Nearby search completed: '+search.candidateCount+' airports within '+search.radiusNm+' NM; no usable data for this flight-time window.' : search?' Nearby forecasts were checked within '+search.radiusNm+' NM; this item still needs review.':'';
 const checks=[],add=(rule,status,reason,value=null)=>checks.push({rule,status,reason,value});const at=Date.parse(point.at),margin=minimums.windowMinutes*60000;
 const hours=(point.forecast?.hourly||[]).filter(h=>(margin?Date.parse(h.startTime)<at+margin:Date.parse(h.startTime)<=at)&&Date.parse(h.endTime)>at-margin);
 if(!hours.length)add('Forecast coverage','review','No forecast covers this location and flight-time window.'+searchNote);
 const updated=Date.parse(point.forecast?.updatedAt);if(!Number.isFinite(updated)||now-updated>minimums.maxForecastAgeHours*3600000||updated>now+300000)add('Forecast freshness','review','Forecast issue time is missing, old or in the future.');
 if(hours.length&&Math.min(...hours.map(h=>Date.parse(h.startTime)))>at-margin)add('Window coverage','review','Forecast does not cover the beginning of your time buffer.');
 const intervals=hours.map(h=>[Date.parse(h.startTime),Date.parse(h.endTime)]).sort((a,b)=>a[0]-b[0]);let covered=at-margin;for(const [start,end] of intervals){if(start>covered){add('Window coverage','review','There is a gap in the forecast time window.');break}covered=Math.max(covered,end)}
 if(hours.length&&Math.max(...hours.map(h=>Date.parse(h.endTime)))<at+margin)add('Window coverage','review','Forecast does not cover the end of your time buffer.');
 function field(label,key,limit,kind,unit){
  const values=hours.map(h=>key==='ceilingFt'&&h.noCeiling===true?Infinity:h[key]);
  if(values.some(v=>!Number.isFinite(v)&&!(key==='ceilingFt'&&v===Infinity))||!values.length){add(label,'review',label+' is missing for part of the selected flight window.'+searchNote);return}
  const v=kind==='min'?Math.min(...values):Math.max(...values),pass=kind==='min'?v>=limit:v<=limit;
  if(key==='visibilitySm'&&!pass&&hours.filter(h=>h[key]===v).every(h=>h.visibilityLowerBound)){add(label,'review','TAF visibility is reported only as greater than '+v+' sm; it cannot confirm your '+limit+' sm minimum.');return}
  add(label,pass?'pass':'fail',v===Infinity?'No ceiling forecast (clear, few or scattered clouds) · personal minimum '+limit+' ft AGL':`${v.toFixed(1)} ${unit} · personal ${kind==='min'?'minimum':'maximum'} ${limit} ${unit}`,v===Infinity?null:v);
 }

 if(hours.length){
  field('Ceiling','ceilingFt',minimums.minCeilingFt,'min','ft AGL');field('Visibility','visibilitySm',minimums.minVisibilitySm,'min','sm');field('Surface wind','windKt',minimums.maxWindKt,'max','kt');field('Gust','gustKt',minimums.maxGustKt,'max','kt');field('Cloud coverage','skyCover',minimums.maxSkyCover,'max','%');
  const cats=hours.map(h=>h.category);add('Flight category',cats.some(c=>!categories.includes(c))?'review':cats.every(c=>minimums.allowedCategories.includes(c))?'pass':'fail',cats.some(c=>!categories.includes(c))?'Flight category unavailable for part of this time window.'+searchNote:'Forecast categories: '+[...new Set(cats)].join(', ')+' · allowed '+minimums.allowedCategories.join(', '));
  const gridTimes=hours.map(h=>Date.parse(h.gridUpdatedAt));if(gridTimes.some(t=>!Number.isFinite(t)||now-t>minimums.maxForecastAgeHours*3600000||t>now+300000))add('Grid freshness','review','Ceiling, visibility or wind grid issue time is missing or outdated.');
  if(point.airport&&minimums.maxCrosswindKt!==null){const ends=point.runwayEnds||[{heading:point.runwayHeading,label:point.runwayLabel}];const winds=hours.flatMap(h=>ends.map(r=>crosswind(h.windDegrees,Math.max(h.windKt??NaN,h.gustKt??NaN),r.heading)));if(!ends.length||winds.some(v=>v===null))add('Runway crosswind','review','Runway headings or numeric wind/gust data are missing.');else{const v=Math.max(...winds);add('Runway crosswind',v<=minimums.maxCrosswindKt?'pass':'fail',v.toFixed(1)+' kt including gusts · maximum '+minimums.maxCrosswindKt+' kt · worst across all runway ends',v)}}

  if(minimums.avoidThunderstorms){const storm=hours.some(h=>h.supplementalThunderstorm||/thunder|tornado/i.test(h.summary||''));add('Thunderstorm forecast',storm?'fail':'pass',storm?'Thunderstorms or tornadoes are mentioned in the forecast window.':'No thunderstorm mention in the supplied hourly summaries. Radar and aviation hazards still require review.')}
 }
 const nearbySources=hours.flatMap(h=>h.nearbySources||[]);if(nearbySources.length){add('Nearby airport weather','pass','Missing weather at '+point.label+' supplied by '+[...new Set(nearbySources.map(s=>s.airport+' ('+s.distanceNm.toFixed(1)+' NM away; '+(s.product||'forecast')+')'))].join(', ')+'. Nearby conditions may differ at the requested location.');if(nearbySources.some(s=>[s.updatedAt,s.gridUpdatedAt].some(stamp=>{const t=Date.parse(stamp);return !Number.isFinite(t)||now-t>minimums.maxForecastAgeHours*3600000||t>now+300000})))add('Nearby forecast freshness','review','Nearby airport forecast is stale or has no issue time.')}
 const status=checks.some(c=>c.status==='fail')?'no-go':checks.some(c=>c.status==='review')?'review':'go';return {...point,forecast:undefined,nearbySearch:search,status,checks};
}
export function tallyChecks(points=[]){
 const checks=points.flatMap(p=>(p.checks||[]).map(c=>({...c,location:p.label}))),noGo=checks.filter(c=>c.status==='fail'),review=checks.filter(c=>c.status==='review'),passed=checks.filter(c=>c.status==='pass');
 return {total:checks.length,passed:passed.length,review:review.length,noGo:noGo.length,status:noGo.length?'no-go':review.length||!checks.length?'review':'go',failures:noGo,reviews:review};
}
export function evaluateFlight(points,minimums,now=Date.now()){
 if(!points.length)return{status:'review',tally:tallyChecks([]),reasons:['No route points evaluated.'],points:[]};
 const results=points.map(p=>evaluatePoint(p,minimums,now)),tally=tallyChecks(results);
 return{status:tally.status,tally,checkedAt:new Date(now).toISOString(),reasons:results.flatMap(p=>p.checks.filter(c=>c.status!=='pass').map(c=>p.label+': '+c.rule+' — '+c.reason)),points:results,formula:'GO only when every configured check passes at every checked point. Any breached minimum → NO GO. Missing, stale or incomplete data → NEEDS REVIEW.'};
}
export function nm(a,b){const r=Math.PI/180,x=(b.lat-a.lat)*r,y=(b.lon-a.lon)*r;return 3440.065*2*Math.asin(Math.sqrt(Math.sin(x/2)**2+Math.cos(a.lat*r)*Math.cos(b.lat*r)*Math.sin(y/2)**2))}
export function routeSamples(airports,departure,speed,headings={}){let elapsed=0;const points=[];for(let i=0;i<airports.length;i++){const a=airports[i];if(i){const prev=airports[i-1],d=nm(prev,a),count=Math.max(1,Math.ceil(d/40));if(count>10)throw Error('Split legs longer than 400 NM into additional checkpoints.');for(let j=1;j<count;j++){const f=j/count,lonDelta=((a.lon-prev.lon+540)%360)-180;points.push({label:prev.id+' → '+a.id+' · route sample '+j,lat:prev.lat+(a.lat-prev.lat)*f,lon:((prev.lon+lonDelta*f+540)%360)-180,at:new Date(Date.parse(departure)+(elapsed+d*f/speed)*3600000).toISOString(),airport:false})}elapsed+=d/speed}const h=headings[a.id];points.push({label:a.id,lat:a.lat,lon:a.lon,at:new Date(Date.parse(departure)+elapsed*3600000).toISOString(),airport:true,runwayEnds:h?.all,runwayHeading:h?.heading??null,runwayLabel:h?.label||'not selected'})}if(points.length>24)throw Error('This route has too many weather checkpoints. Split it into smaller flights.');return{points,hours:elapsed}}
export function calendarReminder(plan,result,at){const fmt=s=>new Date(s).toISOString().replace(/[-:]/g,'').replace(/\.\d{3}/,'');const escape=s=>String(s).replace(/\\/g,'\\\\').replace(/\n/g,'\\n').replace(/,/g,'\\,').replace(/;/g,'\\;');const description='Recheck AV8FLY Go or No Go for '+plan.route+'. Last result '+result.status.toUpperCase()+' at '+result.checkedAt+'. This calendar reminder does not refresh weather. Open https://av8fly.com/flight-desk.html#go-no-go to refresh.\n'+result.reasons.join('\n');return ['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//AV8FLY//Personal Minimums//EN','BEGIN:VEVENT','UID:'+crypto.randomUUID()+'@av8fly.com','DTSTAMP:'+fmt(Date.now()),'DTSTART:'+fmt(at),'DTEND:'+fmt(Date.parse(at)+300000),'SUMMARY:Go or No Go — recheck '+escape(plan.route),'DESCRIPTION:'+escape(description),'URL:https://av8fly.com/flight-desk.html#go-no-go','BEGIN:VALARM','TRIGGER:PT0M','ACTION:DISPLAY','DESCRIPTION:Recheck your personal minimums in AV8FLY','END:VALARM','END:VEVENT','END:VCALENDAR',''].map(line=>{let out='',part='';for(const ch of line){if(new TextEncoder().encode(part+ch).length>73){out+=part+'\r\n ';part=''}part+=ch}return out+part}).join('\r\n')}

// Presentation describes available checks; internal review status still means incomplete.
export function assessmentPresentation(points=[]){
 const tally=tallyChecks(points),incomplete=tally.review>0||tally.total===0;
 const status=tally.noGo?'no-go':tally.passed?'go':'review';
 const label=status==='no-go'?'NO GO · airport minimum exceeded':status==='go'?(incomplete?'GO — available checks pass':'GO · airport checks within your minimums'):'REVIEW NEEDED · no verified passing checks';
 const notice=tally.total===0?'No weather checks are available — assessment incomplete.':incomplete?(tally.review+' '+(tally.review===1?'item needs':'items need')+' review — assessment incomplete. Unverified information is not counted as passed.') : '';
 return {status,label,notice,incomplete,tally};
}
