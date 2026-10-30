import test from 'node:test';
import assert from 'node:assert/strict';
import {activationURL,navigationKind} from '../lib/links.mjs';
test('accepts real VayHaven invitation and recovery links only',()=>{
 for(const hash of ['invite=abc','reset=abc'])assert.equal(activationURL('https://vayhaven.com/#'+hash),'https://vayhaven.com/#'+hash);
 for(const u of ['http://vayhaven.com/#invite=abc','https://vayhaven.com.attacker.com/#invite=x','https://attacker@vayhaven.com/#invite=x','javascript:alert(1)','https://vayhaven.com/api/auth#invite=x','https://vayhaven.com/#invite=','https://vayhaven.com/?viewAs=x'])assert.equal(activationURL(u),null);
});
test('checkout and signing links leave the app only for explicit HTTPS providers',()=>{
 assert.equal(navigationKind('https://vayhaven.com/?app=guest'),'internal');
 for(const host of ['checkout.stripe.com','square.link','apps.docusign.com'])assert.equal(navigationKind('https://'+host+'/test'),'external');
 for(const u of ['https://checkout.stripe.com.attacker.com/','https://user@checkout.stripe.com/','file:///etc/passwd','intent://test','https://attacker.com','http://checkout.stripe.com'])assert.equal(navigationKind(u),'blocked');
});
test('variants have distinct bundle ids and never reuse StudioFlowIQ EAS identity',async()=>{
 const {default:config}=await import('../app.config.js');
 const original=process.env.EXPO_PUBLIC_APP_VARIANT;
 try{const ids=[];for(const v of ['management','guest']){process.env.EXPO_PUBLIC_APP_VARIANT=v;const c=config({config:{ios:{},android:{}}});ids.push(c.ios.bundleIdentifier);assert.equal(c.ios.bundleIdentifier,'com.vayhaven.'+v);assert.equal(c.extra.appVariant,v);assert.ok(c.extra.eas.projectId);assert.notEqual(c.extra.eas.projectId,'c5bdf421-e26b-4283-803e-7eac8e24ac33')}assert.notEqual(ids[0],ids[1]);}finally{if(original===undefined)delete process.env.EXPO_PUBLIC_APP_VARIANT;else process.env.EXPO_PUBLIC_APP_VARIANT=original;}
});

test('vendor has a separate identity, icon and build profiles',async()=>{
 const {default:config}=await import('../app.config.js');
 const original=process.env.EXPO_PUBLIC_APP_VARIANT;
 try{const icons=new Set();for(const v of ['management','guest','vendor']){process.env.EXPO_PUBLIC_APP_VARIANT=v;const c=config({config:{ios:{},android:{}}});assert.equal(c.ios.bundleIdentifier,'com.vayhaven.'+v);icons.add(c.icon);if(v==='vendor'){assert.equal(c.name,'VayHaven Vendor');assert.notEqual(c.extra.eas?.projectId,'a37f4684-12e6-4eb2-857b-d91a04e1a5e6');}}assert.equal(icons.size,3);}finally{if(original===undefined)delete process.env.EXPO_PUBLIC_APP_VARIANT;else process.env.EXPO_PUBLIC_APP_VARIANT=original;}
});
