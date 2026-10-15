import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {readFileSync} from 'node:fs';
const require=createRequire(import.meta.url),configure=require('../app.config.js'),base=JSON.parse(readFileSync(new URL('../app.json',import.meta.url))).expo;
test('member app has a separate identity and its own Expo project',()=>{process.env.EXPO_PUBLIC_APP_VARIANT='member';const c=configure({config:base});assert.equal(c.name,'StudioFlowIQ Members');assert.equal(c.ios.bundleIdentifier,'com.studioflowiq.members');assert.equal(c.extra.eas.projectId,'bf5fc323-f8ac-4a1f-a208-a7652a012ba9');assert.equal(c.extra.appVariant,'member');assert.equal(c.icon,'./assets/icon.png')});
test('staff app identity remains intact',()=>{process.env.EXPO_PUBLIC_APP_VARIANT='staff';const c=configure({config:base});assert.equal(c.ios.bundleIdentifier,'com.studioflowiq.staff');assert.equal(c.extra.eas.projectId,'c5bdf421-e26b-4283-803e-7eac8e24ac33');delete process.env.EXPO_PUBLIC_APP_VARIANT;assert.equal(configure({config:base}).ios.bundleIdentifier,'com.studioflowiq.app')});
