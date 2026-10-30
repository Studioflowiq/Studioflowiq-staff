import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {ORIGIN,userLink,activationURL,navigationKind} from '../lib/links.mjs';
import {WEB_BRIDGE,MAX_DOWNLOAD_BYTES,downloadPayload} from '../lib/web-bridge.mjs';

test('each app preserves its entry when opening invitations without preview privileges',()=>{
 for(const variant of ['management','guest','vendor']){
  const u=new URL(activationURL(ORIGIN+'/?viewAs=someone#invite=test',variant));
  assert.equal(u.searchParams.get('app'),variant==='management'?'manager':variant);
  assert.equal(u.searchParams.has('viewAs'),false);assert.equal(u.hash,'#invite=test');
  if(variant!=='management')assert.equal(u.searchParams.get('portal'),variant);
 }
});
test('explicit guest links and attachments can open externally without allowing automatic redirects',()=>{
 for(const raw of ['https://attachments.example.test/file.pdf','https://maps.google.com/?q=Destin','tel:+18505550100','mailto:help@example.test'])assert.equal(typeof userLink(raw),'string');
 assert.equal(navigationKind('https://attachments.example.test/file.pdf'),'blocked');
 for(const raw of ['javascript:alert(1)','file:///secret','http://example.test','https://user:secret@example.test','intent://bad','mailto:a@example.test?body=%0aheader','tel:123;command','https://vayhaven.com/'])assert.equal(userLink(raw),null);
});
test('native exports enforce file types, bounded bytes and safe filenames',()=>{
 const base64=Buffer.from('private report').toString('base64');
 const p=downloadPayload({type:'download',name:'../../statement.html',mime:'application/pdf',base64});assert.equal(p.name,'______statement.pdf');
 assert.equal(p.base64,base64);
 for(const change of [{mime:'text/html'},{base64:'abcd!'},{base64:'ab=c'},{base64:'a'},{base64:''},{type:'open-link'}])assert.equal(downloadPayload({type:'download',mime:'text/csv',base64,...change}),null);
 assert.equal(downloadPayload({type:'download',mime:'text/csv',base64:Buffer.alloc(MAX_DOWNLOAD_BYTES+1).toString('base64')}),null);
 assert.ok(downloadPayload({type:'download',mime:'text/csv',base64:Buffer.alloc(MAX_DOWNLOAD_BYTES).toString('base64')}));
});
function page({origin=ORIGIN,frame=false,redirect=false,huge=false}={}){
 const messages=[],requests=[],events={};let click;
 const window={ReactNativeWebView:{postMessage:raw=>messages.push(JSON.parse(raw))},addEventListener:(name,fn)=>events[name]=fn};window.top=frame?{}:window;
 const context={window,location:{origin,href:origin+'/?app=manager'},URL,Error,String,Number,document:{addEventListener:(name,fn)=>{if(name==='click')click=fn}},
  fetch:async(url,options)=>{requests.push({url,options});return {ok:true,url:redirect?'https://untrusted.test/file':url,headers:{get:()=>null},blob:async()=>({size:huge?MAX_DOWNLOAD_BYTES+1:15,type:'text/csv'})}},
  FileReader:class{readAsDataURL(){this.result='data:text/csv;base64,'+Buffer.from('private report').toString('base64');this.onload()}},};
 vm.runInNewContext(WEB_BRIDGE,context);
 return {messages,requests,click:async(href,{download=false}={})=>{let prevented=false;click?.({target:{closest:()=>({href,download:download?'report.csv':'',hasAttribute:()=>download})},preventDefault:()=>prevented=true,stopPropagation(){}});await new Promise(r=>setImmediate(r));return prevented;}};
}
test('authenticated exports are fetched inside the webview and bridged without session cookies',async()=>{
 const p=page();assert.equal(await p.click(ORIGIN+'/api/reports?format=xlsx'),true);assert.equal(p.requests[0].options.credentials,'same-origin');assert.equal(p.requests[0].options.cache,'no-store');assert.equal(p.messages[0].type,'download');assert.deepEqual(Object.keys(p.messages[0]).sort(),['base64','mime','name','type']);
});
test('bridge supports blob exports, sends external links separately and never fetches them with credentials',async()=>{
 const p=page();await p.click('blob:'+ORIGIN+'/export',{download:true});assert.equal(p.requests[0].options.credentials,'omit');
 await p.click('https://attachments.example.test/photo.png');assert.equal(p.messages.at(-1).type,'open-link');assert.equal(p.requests.length,1);
 await p.click('https://untrusted.test/secret',{download:true});assert.equal(p.messages.at(-1).type,'download-error');assert.equal(p.requests.length,1);
});
test('bridge rejects foreign frames, foreign pages, oversized downloads and redirects',async()=>{
 for(const options of [{origin:'https://untrusted.test'},{frame:true}]){const p=page(options);await p.click(ORIGIN+'/api/files?id=x');assert.equal(p.requests.length,0);assert.equal(p.messages.length,0)}
 for(const options of [{huge:true},{redirect:true}]){const p=page(options);await p.click(ORIGIN+'/api/files?id=x');assert.equal(p.messages[0].type,'download-error')}
});
