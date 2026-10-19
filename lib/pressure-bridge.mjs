export function trustedPressurePage(raw){try{const u=new URL(raw);return u.origin==='https://av8fly.com'&&/^\/ahrs(?:\.html)?\/?$/.test(u.pathname)}catch{return false}}
export const pressureWebBridge=`(function(){if(location.origin!=='https://av8fly.com'||!/^\\/ahrs(?:\\.html)?\\/?$/.test(location.pathname))return;window.AV8NativeBarometer={postMessage:function(body){if(body&&(body.action==='start'||body.action==='stop'))window.ReactNativeWebView?.postMessage(JSON.stringify({type:'av8-baro',action:body.action}));}};})();true;`;
export function pressureDelivery(sample){return `window.AV8Barometer?.receive(${JSON.stringify(sample)});true;`;}
// Native API returns hPa and monotonic sample seconds. Keep those units separate
// from epoch receipt time and reject non-increasing / delayed stream samples.
export function createPressureController({sensor,send,canUse,now=Date.now,every=setInterval,cancel=clearInterval}){
 let generation=0,requested=false,foreground=true,pending=false,subscription=null,timer=null,lastReceipt=null,anchor=null,lastSensorTime=null;
 const report=reason=>send({reason});
 function release(){generation++;pending=false;subscription?.remove();subscription=null;if(timer!==null)cancel(timer);timer=null;lastReceipt=null;anchor=null;lastSensorTime=null}
 function stop(){requested=false;release()}
 async function start(){
  requested=true;if(!foreground){report('paused');return}if(!canUse()){requested=false;report('unavailable');return}if(subscription||pending)return;
  release();pending=true;const token=generation;const current=()=>token===generation&&requested&&foreground&&canUse();
  try{
   if(!await sensor.isAvailableAsync()){if(current()){requested=false;report('unavailable')}return}if(!current())return;
   let permission=await sensor.getPermissionsAsync();if(!current())return;
   if(!permission.granted&&permission.canAskAgain!==false&&permission.status!=='denied')permission=await sensor.requestPermissionsAsync();
   if(!current())return;if(!permission.granted){requested=false;report('denied');return}
   sensor.setUpdateInterval(1000);report('waiting');const started=now();
   subscription=sensor.addListener(sample=>{
    if(!current())return;const receipt=now(),hPa=sample?.pressure,t=sample?.timestamp;
    if(!Number.isFinite(hPa)||hPa<300||hPa>1150||!Number.isFinite(t)||t<0){report('error');return}
    if(lastSensorTime!==null&&t<=lastSensorTime){report('stale');return}lastSensorTime=t;
    if(anchor===null)anchor={sensor:t,receipt};const timestamp=anchor.receipt+(t-anchor.sensor)*1000,age=receipt-timestamp;
    if(age< -1000||age>=5000){report('stale');return}
    lastReceipt=receipt;send({kPa:hPa/10,timestamp});
   });
   timer=every(()=>{if(current()&&now()-(lastReceipt??started)>=5000)report('stale')},1000);
  }catch{if(current()){requested=false;release();report('error')}}finally{if(token===generation)pending=false}
 }
 function setForeground(active){foreground=active;if(!active){release();if(requested)report('paused')}else if(requested)void start()}
 return {command:action=>{if(action==='start')return start();if(action==='stop')stop()},stop,setForeground,dispose:stop};
}
