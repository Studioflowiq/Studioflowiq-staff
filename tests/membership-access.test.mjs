import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

const flush=()=>new Promise(setImmediate);
const readyStatus={ready:true,sandbox:true,production:false,entitlement:{tier:'free',status:'expired'}};
function harness(request){
  const states=[],refs=[],effects=[];let si=0,ri=0,ei=0,nodes=[],signIns=0;
  const queued=[];
  const react={
    createElement:(type,props,...children)=>({type,props:props||{},children:children.flat(Infinity)}),
    useState(initial){const i=si++;if(!(i in states))states[i]=initial;return [states[i],v=>states[i]=typeof v==='function'?v(states[i]):v]},
    useRef(initial){const i=ri++;return refs[i]??(refs[i]={current:initial})},
    useEffect(run,deps){const i=ei++,old=effects[i];if(!old||deps.some((d,j)=>!Object.is(d,old.deps[j]))){old?.cleanup?.();effects[i]={deps};queued.push(()=>{effects[i].cleanup=run()})}},
  };
  const rn=new Proxy({AppState:{addEventListener:()=>({remove(){}})}},{get:(o,k)=>o[k]||k});
  const iap={connected:true,subscriptions:[{id:'com.av8fly.app.member.monthly',displayPrice:'$7.99'},{id:'com.av8fly.app.pro.monthly',displayPrice:'$9.99'}],fetchProducts:async()=>{},finishTransaction:async()=>{}};
  const modules={react,'react-native':rn,'react-native-safe-area-context':{SafeAreaView:'SafeAreaView'},'expo-iap':{useIAP:()=>iap,getAvailablePurchases:async()=>[]}};
  const code=ts.transpileModule(fs.readFileSync(new URL('../AppleMembership.tsx',import.meta.url),'utf8'),{compilerOptions:{jsx:ts.JsxEmit.React,module:ts.ModuleKind.CommonJS,esModuleInterop:true,target:ts.ScriptTarget.ES2022}}).outputText;
  const context={exports:{},require:n=>modules[n],Set,console};vm.runInNewContext(code,context);
  const props={visible:true,ready:1,request,close(){},changed(){},signIn(){signIns++}};
  function render(changes={}){Object.assign(props,changes);si=ri=ei=0;nodes=[];function walk(n){if(!n||typeof n!=='object')return;nodes.push(n);n.children?.forEach(walk)}walk(context.exports.default(props));while(queued.length)queued.shift()()}
  const label=n=>n.children.flatMap(c=>c?.children||[]).join('');
  return {render,buttons:text=>nodes.filter(n=>n.type==='Pressable'&&label(n)===text),get signIns(){return signIns}};
}

test('billing offers sign-in after 401 and refreshes when the signed-in bridge reconnects',async()=>{
  let authenticated=false,calls=0;
  const app=harness(async()=>{calls++;if(!authenticated)throw Object.assign(new Error('Sign in to your AV8 FLY account first.'),{status:401});return readyStatus});
  app.render();await flush();app.render();
  assert.equal(app.buttons('Sign in to continue').length,1);
  assert(app.buttons('Subscribe with Apple').every(b=>b.props.disabled));
  app.buttons('Sign in to continue')[0].props.onPress();assert.equal(app.signIns,1);
  app.render({visible:false});authenticated=true;app.render({visible:true,ready:2});await flush();app.render();
  assert(calls>=2);assert.equal(app.buttons('Sign in to continue').length,0);
  assert(app.buttons('Subscribe with Apple').every(b=>!b.props.disabled));
});

test('late unauthenticated response cannot overwrite a newer authenticated session',async()=>{
  let rejectOld,calls=0;
  const app=harness(()=>++calls===1?new Promise((_,reject)=>{rejectOld=reject}):Promise.resolve(readyStatus));
  app.render();app.render({ready:2});await flush();app.render();
  assert(app.buttons('Subscribe with Apple').every(b=>!b.props.disabled));
  rejectOld(Object.assign(new Error('Old session'),{status:401}));await flush();app.render();
  assert.equal(app.buttons('Sign in to continue').length,0);
  assert(app.buttons('Subscribe with Apple').every(b=>!b.props.disabled));
});

test('service failure remains retryable and does not masquerade as a bad login',async()=>{
  let broken=true;
  const app=harness(async()=>{if(broken)throw Object.assign(new Error('Service unavailable'),{status:503});return readyStatus});
  app.render();await flush();app.render();
  assert.equal(app.buttons('Sign in to continue').length,0);
  assert(app.buttons('Subscribe with Apple').every(b=>b.props.disabled));
  broken=false;app.buttons('Refresh membership')[0].props.onPress();await flush();app.render();
  assert(app.buttons('Subscribe with Apple').every(b=>!b.props.disabled));
});

test('existing access is disabled immediately while the account session is rechecked',async()=>{
  let finish;const app=harness(async()=>readyStatus);
  app.render();await flush();app.render();assert(app.buttons('Subscribe with Apple').every(b=>!b.props.disabled));
  app.render({request:()=>new Promise(resolve=>{finish=resolve}),ready:2});app.render();
  assert(app.buttons('Subscribe with Apple').every(b=>b.props.disabled));
  finish(readyStatus);await flush();app.render();assert(app.buttons('Subscribe with Apple').every(b=>!b.props.disabled));
});
