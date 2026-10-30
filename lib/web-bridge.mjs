import {ORIGIN} from './links.mjs';
export const MAX_DOWNLOAD_BYTES=10*1024*1024;
const fileTypes={'application/pdf':'pdf','text/csv':'csv','text/plain':'txt','application/json':'json','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':'xlsx','application/vnd.ms-excel':'xls','image/jpeg':'jpg','image/png':'png','image/webp':'webp','text/calendar':'ics'};
export function downloadPayload(raw){
 if(!raw||raw.type!=='download'||typeof raw.base64!=='string'||raw.base64.length>Math.ceil(MAX_DOWNLOAD_BYTES/3)*4||!raw.base64.length||raw.base64.length%4||/[^A-Za-z0-9+/=]/.test(raw.base64)||!/^[A-Za-z0-9+/]*={0,2}$/.test(raw.base64))return null;
 const size=raw.base64.length/4*3-(raw.base64.endsWith('==')?2:raw.base64.endsWith('=')?1:0);if(size>MAX_DOWNLOAD_BYTES)return null;
 const mime=String(raw.mime||'').split(';')[0].toLowerCase(),ext=fileTypes[mime];if(!ext)return null;
 const stem=String(raw.name||'VayHaven').replace(/\.[^.]*$/,'').replace(/[^a-zA-Z0-9 _-]/g,'_').slice(0,100)||'VayHaven';
 return {name:stem+'.'+ext,mime,base64:raw.base64};
}
// Main-frame, same-origin only. Fetch private files inside the authenticated WebView;
// never copy its cookies, credentials or arbitrary download URLs into native storage.
export const WEB_BRIDGE=String.raw`(function(){
 if(window.top!==window||location.origin!==${JSON.stringify(ORIGIN)}||window.__vayhavenBridge)return;
 window.__vayhavenBridge=true;var busy=false;
 function post(value){window.ReactNativeWebView.postMessage(JSON.stringify(value));}
 async function download(raw,name){if(busy)return;busy=true;try{
  var u=new URL(raw,location.href);if(!(u.origin===location.origin&&u.protocol==='https:'||u.protocol==='blob:'&&u.origin===location.origin||u.protocol==='data:'&&/^data:(text\/plain|text\/csv|application\/pdf)[;,]/i.test(raw)))throw Error('This download is unavailable.');
  var r=await fetch(u.href,{credentials:u.protocol==='https:'?'same-origin':'omit',cache:'no-store'});if(!r.ok)throw Error('Unable to download. Sign in and try again.');
  if(r.url&&new URL(r.url).origin!==location.origin&&u.protocol==='https:')throw Error('Use the secure attachment link to open this file.');
  if(Number(r.headers.get('content-length'))>${MAX_DOWNLOAD_BYTES})throw Error('Files over 10 MB must be downloaded in your browser.');
  var blob=await r.blob();if(blob.size>${MAX_DOWNLOAD_BYTES})throw Error('Files over 10 MB must be downloaded in your browser.');
  var disposition=r.headers.get('content-disposition')||'',match=disposition.match(/filename="?([^";]+)"?/i);
  var reader=new FileReader();reader.onerror=function(){busy=false;post({type:'download-error',message:'Unable to read this file.'});};
  reader.onload=function(){busy=false;post({type:'download',name:name||(match&&match[1])||'VayHaven',mime:blob.type,base64:String(reader.result).split(',')[1]});};reader.readAsDataURL(blob);
 }catch(e){busy=false;post({type:'download-error',message:e.message||'Unable to download this file.'});}}
 document.addEventListener('click',function(e){var a=e.target&&e.target.closest&&e.target.closest('a[href]');if(!a||e.defaultPrevented)return;var u;try{u=new URL(a.href,location.href);}catch{return;}
  var privateFile=u.origin===location.origin&&((u.pathname==='/api/files'&&!u.searchParams.has('inline'))||u.pathname==='/api/export'||u.pathname==='/api/reports'&&u.searchParams.has('format')||u.pathname==='/api/docusign/envelopes'&&u.searchParams.has('download'));
  if(a.hasAttribute('download')||privateFile){e.preventDefault();e.stopPropagation();void download(a.href,a.download);return;}
  if(u.origin!==location.origin&&['https:','mailto:','tel:'].includes(u.protocol)){e.preventDefault();e.stopPropagation();post({type:'open-link',url:u.href});}
 },true);
 window.addEventListener('vayhaven:download',function(e){void download(e.detail.url,'');});
})();true;`;
