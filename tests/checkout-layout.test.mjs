import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import fs from 'node:fs';
import ts from 'typescript';

test('checkout toolbar has a modal-local safe area and both exits dismiss checkout',()=>{
 const src=fs.readFileSync(new URL('../App.tsx',import.meta.url),'utf8');
 const compiled=ts.transpileModule(src+'\nexport {FlightApp};',{reportDiagnostics:true,compilerOptions:{jsx:ts.JsxEmit.React,module:ts.ModuleKind.CommonJS,esModuleInterop:true,target:ts.ScriptTarget.ES2022}});
 assert.deepEqual(compiled.diagnostics.filter(d=>d.category===ts.DiagnosticCategory.Error),[]);
 let stateIndex=0;const updates=[];
 const react={createElement:(type,props,...children)=>({type,props:props||{},children:children.flat(Infinity)}),useState:init=>{const index=stateIndex++;return [index===11?'https://fiit-lyfe.myshopify.com/checkouts/test':init,value=>updates.push({index,value})]},useRef:current=>({current}),useEffect:()=>{}};
 const rn=new Proxy({StyleSheet:{create:x=>x,hairlineWidth:1}},{get:(target,key)=>target[key]||key});
 const modules={'react':react,'react-native':rn,'react-native-safe-area-context':{SafeAreaView:'SafeAreaView',SafeAreaProvider:'SafeAreaProvider'},'expo-constants':{platform:{ios:{buildNumber:'test'}}},'react-native-webview':{WebView:'WebView'},'expo-status-bar':{StatusBar:'StatusBar'},'@expo/vector-icons':{Ionicons:'Ionicons'},'./FlightWorkspace':{useFlightPlan:()=>({plan:{},result:null})},'./lib/planning.mjs':{ORIGIN:'https://av8fly.com'},'./lib/app-presentation':{appPresentation:''},'./lib/planning-presentation':{planningPresentation:()=>''}};
 const context={exports:{},require:name=>modules[name]||{},URL,Map,Set,console};vm.runInNewContext(compiled.outputText,context);
 const tree=context.exports.FlightApp(),nodes=[];function walk(n){if(!n||typeof n!=='object')return;nodes.push(n);n.children?.forEach(walk)}walk(tree);
 const modal=nodes.find(n=>n.type==='Modal'&&n.props.visible===true&&n.children[0]?.type==='SafeAreaProvider');assert.ok(modal,'external checkout must establish safe-area metrics within its modal');
 const safe=modal.children[0].children[0];assert.equal(safe.type,'SafeAreaView');assert.deepEqual(Array.from(safe.props.edges),['top','bottom','left','right']);
 const back=nodes.find(n=>n.type==='Pressable'&&n.props.accessibilityLabel==='Back to AV8 FLY');assert.ok(back);back.props.onPress();assert.equal(updates.at(-1).index,11);assert.equal(updates.at(-1).value,null);
 modal.props.onRequestClose();assert.equal(updates.at(-1).value,null);
 const close=nodes.find(n=>n.type==='Pressable'&&n.props.accessibilityLabel==='Close source');close.props.onPress();assert.equal(updates.at(-1).value,null);
});
