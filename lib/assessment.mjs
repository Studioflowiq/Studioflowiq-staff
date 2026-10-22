export const categories=['VFR','MVFR','IFR','LIFR'];
export function validateMinimums(p){
 const bounds={minCeilingFt:[0,60000],minVisibilitySm:[0,100],maxCrosswindKt:[0,100],maxWindKt:[0,150],maxGustKt:[0,200],maxSkyCover:[0,100],maxForecastAgeHours:[1,24],windowMinutes:[0,120]};
 const out={name:String(p?.name||'My personal minimums').slice(0,80),aircraft:String(p?.aircraft||'').slice(0,80),vfrOnly:p?.vfrOnly!==false,avoidThunderstorms:p?.avoidThunderstorms!==false};
 for(const [k,[lo,hi]] of Object.entries(bounds)){if(k==='maxCrosswindKt'&&(p?.[k]===''||p?.[k]==null)){out[k]=null;continue}if(p?.[k]===''||p?.[k]==null||!Number.isFinite(Number(p[k]))||Number(p[k])<lo||Number(p[k])>hi)throw Error('Enter a valid '+k.replace(/([A-Z])/g,' $1').toLowerCase()+'.');out[k]=Number(p[k])}
 out.maxTurbulence=[0,1,2].includes(Number(p?.maxTurbulence))?Number(p.maxTurbulence):1;out.maxIcing=[0,1,2].includes(Number(p?.maxIcing))?Number(p.maxIcing):0;out.icingApproved=p?.icingApproved===true;out.convectiveBufferNm=p?.convectiveBufferNm==null?20:Number(p.convectiveBufferNm);if(!Number.isFinite(out.convectiveBufferNm)||out.convectiveBufferNm<20||out.convectiveBufferNm>100)throw Error('Convective advisory buffer must be 20–100 NM.');
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
  const raw=hours.map(h=>key==='ceilingFt'&&h.noCeiling===true?Infinity:h[key]);
  const values=raw.filter(v=>(Number.isFinite(v)&&v>=0)||(key==='ceilingFt'&&v===Infinity));
  const incomplete=values.length!==raw.length||!values.length;
  const v=kind==='min'?Math.min(...values):Math.max(...values),pass=kind==='min'?v>=limit:v<=limit;
  if(incomplete&&(!values.length||pass)){add(label,'review',label+' is missing or invalid for part of the selected flight window.'+searchNote);return}
  if(key==='visibilitySm'&&!pass&&hours.filter(h=>h[key]===v).every(h=>h.visibilityLowerBound)){add(label,'review','TAF visibility is reported only as greater than '+v+' sm; it cannot confirm your '+limit+' sm minimum.');return}
  add(label,pass?'pass':'fail',v===Infinity?'No ceiling forecast (clear, few or scattered clouds) · personal minimum '+limit+' ft AGL':`${v.toFixed(1)} ${unit} · personal ${kind==='min'?'minimum':'maximum'} ${limit} ${unit}`,v===Infinity?null:v);
 }

 if(hours.length){
  field('Ceiling','ceilingFt',minimums.minCeilingFt,'min','ft AGL');field('Visibility','visibilitySm',minimums.minVisibilitySm,'min','sm');field('Surface wind','windKt',minimums.maxWindKt,'max','kt');field('Gust','gustKt',minimums.maxGustKt,'max','kt');field('Cloud coverage','skyCover',minimums.maxSkyCover,'max','%');
  const cats=hours.map(h=>h.category);add('Flight category',cats.some(c=>!categories.includes(c))?'review':cats.every(c=>minimums.allowedCategories.includes(c))?'pass':'fail',cats.some(c=>!categories.includes(c))?'Flight category unavailable for part of this time window.'+searchNote:'Forecast categories: '+[...new Set(cats)].join(', ')+' · allowed '+minimums.allowedCategories.join(', '));
  const gridTimes=hours.map(h=>Date.parse(h.gridUpdatedAt));if(gridTimes.some(t=>!Number.isFinite(t)||now-t>minimums.maxForecastAgeHours*3600000||t>now+300000))add('Grid freshness','review','Ceiling, visibility or wind grid issue time is missing or outdated.');
  if(point.airport&&minimums.maxCrosswindKt!==null){const ends=point.runwayEnds||[{heading:point.runwayHeading,label:point.runwayLabel}];const winds=hours.flatMap(h=>ends.map(r=>crosswind(h.windDegrees,Math.max(h.windKt??NaN,h.gustKt??NaN),r.heading)));if(!ends.length||winds.some(v=>v===null))add('Runway crosswind','review','Runway headings or numeric wind/gust data are missing.');else{const v=Math.max(...winds);add('Runway crosswind',v<=minimums.maxCrosswindKt?'pass':'fail',v.toFixed(1)+' kt including gusts · maximum '+minimums.maxCrosswindKt+' kt · worst across all runway ends',v)}}

  if(minimums.avoidThunderstorms){const storm=hours.some(h=>h.supplementalThunderstorm||/thunder|tornado/i.test(h.summary||''));const complete=hours.every(h=>typeof h.summary==='string'&&h.summary.trim().length>0);add('Thunderstorm forecast',storm?'fail':complete?'pass':'review',storm?'Thunderstorms or tornadoes are mentioned in the forecast window.':complete?'No thunderstorm mention in the supplied hourly summaries. Radar and aviation hazards still require review.':'Storm forecast text is missing for part of this time window. Review aviation hazards and radar.')}
 }
 const nearbySources=hours.flatMap(h=>h.nearbySources||[]);if(nearbySources.length){add('Nearby airport weather','pass','Missing weather at '+point.label+' supplied by '+[...new Set(nearbySources.map(s=>s.airport+' ('+s.distanceNm.toFixed(1)+' NM away; '+(s.product||'forecast')+')'))].join(', ')+'. Nearby conditions may differ at the requested location.');if(nearbySources.some(s=>[s.updatedAt,s.gridUpdatedAt].some(stamp=>{const t=Date.parse(stamp);return !Number.isFinite(t)||now-t>minimums.maxForecastAgeHours*3600000||t>now+300000})))add('Nearby forecast freshness','review','Nearby airport forecast is stale or has no issue time.')}
 const status=checks.some(c=>c.status==='fail')?'no-go':checks.some(c=>c.status==='review')?'review':'go';const sample=hours.find(h=>Date.parse(h.startTime)<=at&&Date.parse(h.endTime)>at)||hours[0];
 const temps=hours.map(h=>Number.isFinite(h.temperature)&&['F','C'].includes(h.unit)?h.unit==='C'?h.temperature*9/5+32:h.temperature:null);
 const rain=hours.map(h=>h.rainChance);
 const weather={temperatureMinF:temps.length&&temps.every(Number.isFinite)?Math.min(...temps):null,temperatureMaxF:temps.length&&temps.every(Number.isFinite)?Math.max(...temps):null,rainChance:rain.length&&rain.every(v=>Number.isFinite(v)&&v>=0&&v<=100)?Math.max(...rain):null,windDegrees:Number.isFinite(sample?.windDegrees)?sample.windDegrees:null,windDirection:typeof sample?.windDirection==='string'?sample.windDirection:null,summary:typeof sample?.summary==='string'?sample.summary:null,source:point.forecast?.source||null,updatedAt:point.forecast?.updatedAt||null};
 return {...point,forecast:undefined,nearbySearch:search,status,checks,weather};
}
export function tallyChecks(points=[]){
 const checks=points.flatMap(p=>(p.checks||[]).map(c=>({...c,location:p.label}))),noGo=checks.filter(c=>c.status==='fail'),review=checks.filter(c=>c.status==='review'),passed=checks.filter(c=>c.status==='pass');
 return {total:checks.length,passed:passed.length,review:review.length,noGo:noGo.length,status:noGo.length?'no-go':review.length||!checks.length?'review':'go',failures:noGo,reviews:review};
}
export function evaluateFlight(points,minimums,now=Date.now()){
 if(!points.length)return{status:'review',tally:tallyChecks([]),reasons:['No route points evaluated.'],points:[]};
 const results=points.map(p=>evaluatePoint(p,minimums,now)),tally=tallyChecks(results);
 return{wxScore:weatherScore(results,minimums),status:tally.status,tally,checkedAt:new Date(now).toISOString(),reasons:results.flatMap(p=>p.checks.filter(c=>c.status!=='pass').map(c=>p.label+': '+c.rule+' — '+c.reason)),points:results,formula:'NO GO only for a valid reported breach. Available checks passing with unresolved items → GO — review required before flight. Missing information is not a pass; no verified checks → REVIEW.'};
}
export function nm(a,b){const r=Math.PI/180,x=(b.lat-a.lat)*r,y=(b.lon-a.lon)*r;return 3440.065*2*Math.asin(Math.sqrt(Math.sin(x/2)**2+Math.cos(a.lat*r)*Math.cos(b.lat*r)*Math.sin(y/2)**2))}
export function routeSamples(airports,departure,speed,headings={}){let elapsed=0;const points=[];for(let i=0;i<airports.length;i++){const a=airports[i];if(i){const prev=airports[i-1],d=nm(prev,a),count=Math.max(1,Math.ceil(d/40));if(count>10)throw Error('Split legs longer than 400 NM into additional checkpoints.');for(let j=1;j<count;j++){const f=j/count,lonDelta=((a.lon-prev.lon+540)%360)-180;points.push({label:prev.id+' → '+a.id+' · route sample '+j,lat:prev.lat+(a.lat-prev.lat)*f,lon:((prev.lon+lonDelta*f+540)%360)-180,at:new Date(Date.parse(departure)+(elapsed+d*f/speed)*3600000).toISOString(),airport:false})}elapsed+=d/speed}const h=headings[a.id];points.push({label:a.id,lat:a.lat,lon:a.lon,at:new Date(Date.parse(departure)+elapsed*3600000).toISOString(),airport:true,runwayEnds:h?.all,runwayHeading:h?.heading??null,runwayLabel:h?.label||'not selected'})}if(points.length>24)throw Error('This route has too many weather checkpoints. Split it into smaller flights.');return{points,hours:elapsed}}
export function calendarReminder(plan,result,at){const fmt=s=>new Date(s).toISOString().replace(/[-:]/g,'').replace(/\.\d{3}/,'');const escape=s=>String(s).replace(/\\/g,'\\\\').replace(/\n/g,'\\n').replace(/,/g,'\\,').replace(/;/g,'\\;');const description='Recheck AV8FLY Go or No Go for '+plan.route+'. Last result '+result.status.toUpperCase()+' at '+result.checkedAt+'. This calendar reminder does not refresh weather. Open https://av8fly.com/flight-desk.html#go-no-go to refresh.\n'+result.reasons.join('\n');return ['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//AV8FLY//Personal Minimums//EN','BEGIN:VEVENT','UID:'+crypto.randomUUID()+'@av8fly.com','DTSTAMP:'+fmt(Date.now()),'DTSTART:'+fmt(at),'DTEND:'+fmt(Date.parse(at)+300000),'SUMMARY:Go or No Go — recheck '+escape(plan.route),'DESCRIPTION:'+escape(description),'URL:https://av8fly.com/flight-desk.html#go-no-go','BEGIN:VALARM','TRIGGER:PT0M','ACTION:DISPLAY','DESCRIPTION:Recheck your personal minimums in AV8FLY','END:VALARM','END:VEVENT','END:VCALENDAR',''].map(line=>{let out='',part='';for(const ch of line){if(new TextEncoder().encode(part+ch).length>73){out+=part+'\r\n ';part=''}part+=ch}return out+part}).join('\r\n')}

// Presentation describes available checks; internal review status still means incomplete.
export function assessmentPresentation(points=[]){
 const tally=tallyChecks(points),incomplete=tally.review>0||tally.total===0;
 const status=tally.noGo?'no-go':tally.passed?'go':'review';
 const label=status==='no-go'?'NO GO · personal or aircraft limit exceeded':status==='go'?(incomplete?'GO — review required before flight':'GO · airport checks within your minimums'):'REVIEW · information needs attention';
 const notice=tally.total===0?'No weather checks are available — assessment incomplete.':incomplete?(tally.review+' '+(tally.review===1?'item needs':'items need')+' review — assessment incomplete. Unverified information is not counted as passed.') : '';
 return {status,label,notice,incomplete,tally};
}

// AV8 planning model v1: margin against pilot limits, not probability of safety.
export function weatherScore(points=[],minimums={}){
 const specs=[['ceiling','Ceilings','Ceiling','minCeilingFt','min',20],['visibility','Visibility','Visibility','minVisibilitySm','min',20],['crosswind','Crosswind','Runway crosswind','maxCrosswindKt','max',15],['wind','Wind / gusts','Surface wind','maxWindKt','max',10],['turbulence','Turbulence','Turbulence',null,'hazard',10],['icing','Icing','Icing',null,'hazard',15],['convective','Convective','Convective advisories',null,'hazard',10]];
 const factors=specs.map(([id,label,rule,key,kind,weight])=>{
  const applicable=kind==='hazard'?points.filter(p=>p.hazardScreen):points.filter(p=>!p.hazardScreen);
  const checks=applicable.flatMap(p=>(p.checks||[]).filter(c=>c.rule===rule||(id==='wind'&&c.rule==='Gust')).map(c=>({...c,location:p.label})));
  const limit=minimums[key],missing=!applicable.length||applicable.some(p=>!(p.checks||[]).some(c=>c.rule===rule))||checks.some(c=>c.status==='review')||(key&&(limit==null||!Number.isFinite(limit)));
  let score=null;
  if(!missing&&kind!=='hazard')score=Math.min(...checks.map(c=>{
   if(id==='ceiling'&&c.status==='pass'&&c.value===null&&c.reason.startsWith('No ceiling'))return 100;
   if(!Number.isFinite(c.value))return null;
   const l=c.rule==='Gust'?minimums.maxGustKt:limit,v=c.value;
   if(!Number.isFinite(l))return null;
   // 60 at the limit, 100 with 2x minimum or <=half maximum; below limits trends to zero.
   return kind==='min'?(l===0?100:Math.max(0,Math.min(100,v>=l?60+40*(v/l-1):60*v/l))):(l===0?(v===0?100:0):Math.max(0,Math.min(100,v<=l?60+80*(1-v/l):60-60*(v/l-1))));
  }).map(v=>v===null?NaN:v));
  // Surface text cannot establish absence of aviation convection. Icing/turbulence need dedicated data.
  if(kind==='hazard'){const valid=checks.filter(c=>Number.isFinite(c.score));if(checks.some(c=>c.status==='fail'))score=0;else if(!missing&&valid.length===checks.length)score=Math.min(...valid.map(c=>c.score));}
  if(!Number.isFinite(score))score=null;
  return {id,label,weight,score:score===null?null:Math.round(score),limit:key?limit:null,breach:checks.some(c=>c.status==='fail'),reasons:checks.map(c=>c.location+': '+c.reason),availability:score===null?'Review aviation hazards / data unavailable':kind==='hazard'?'Aviation advisory exposure assessed; not a hazard-free guarantee':'Assessed'};
 });
 const known=factors.filter(f=>f.score!==null),coverage=known.reduce((s,f)=>s+f.weight,0),score=coverage?Math.round(known.reduce((s,f)=>s+f.score*f.weight,0)/coverage):null;
 const grade=score===null?'Unrated':score>=90?'Great':score>=80?'Good':score>=65?'Fair':score>=45?'Poor':'Very poor';
 const tally=tallyChecks(points),incomplete=coverage<100||tally.review>0;
 return {version:'av8-wx-v1',score,grade,coverage,incomplete,factors,aircraft:minimums.aircraft||minimums.name||'Personal minimums',status:tally.noGo?'no-go':score===null?'review':'go',label:tally.noGo?'NO GO · confirmed limit breach':score===null?'REVIEW · no score available':incomplete?'GO · review required before flight':'GO · within checked minimums',meaning:'Weather fit against your minimums; not a probability of safety.',scope:'Surface factors cover airport times. Hazard scores screen NOAA advisories along straight-line legs, surface through cruise altitude. No advisory does not establish absence of icing, turbulence or storms. Future times beyond source coverage require review.'};
}
