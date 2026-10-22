export function trustedReceiverPage(raw){try{const u=new URL(raw);return u.origin==='https://av8fly.com'&&/^\/(ahrs|flight-desk|performance)(?:\.html)?\/?$/.test(u.pathname)}catch{return false}}
export const receiverWebBridge=`(function(){if(window!==window.top||location.origin!=='https://av8fly.com'||!/^\\/(ahrs|flight-desk|performance)(?:\\.html)?\\/?$/.test(location.pathname))return;window.AV8NativeReceiver={postMessage:function(body){if(body&&(body.action==='start'||body.action==='stop')&&Number.isSafeInteger(body.generation))window.ReactNativeWebView?.postMessage(JSON.stringify({type:'av8-receiver-command',action:body.action,generation:body.generation}));}};})();true;`;
export function receiverDelivery(packet){return `document.dispatchEvent(new CustomEvent('av8-receiver',{detail:${JSON.stringify(packet)}}));true;`}
export function createReceiverController({transport,send,canUse}){
 let foreground=true,active=false,request=0,generation=null,subscription=null;
 function stop(){request++;active=false;generation=null;subscription?.remove();subscription=null;void transport?.stop().catch(()=>{})}
 async function command(action,webGeneration){
  if(action==='stop'){stop();return}if(action!=='start'||!Number.isSafeInteger(webGeneration))return;
  stop();if(!foreground||!canUse())return;
  generation=webGeneration;
  if(!transport){send({generation,status:'Receiver support unavailable in this build'});return}
  active=true;const token=request;
  subscription=transport.addListener('onPacket',packet=>{if(active&&request===token&&foreground&&canUse()&&packet.generation===generation)send(packet)});
  try{await transport.start(webGeneration)}catch{if(active&&request===token){send({generation:webGeneration,status:'Receiver could not start · check Local Network permission and UDP port 4000'});stop()}}
 }
 return {command,stop,setForeground:value=>{foreground=value;if(!value)stop()},dispose:stop};
}
