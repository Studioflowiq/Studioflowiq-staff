import {spawnSync} from 'node:child_process';
import {readFileSync} from 'node:fs';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const expo=require.resolve('expo/bin/cli');
const config=require('../app.config.js');
for(const variant of ['management','guest','vendor']){
 process.env.EXPO_PUBLIC_APP_VARIANT=variant;
 const identity=config({config:JSON.parse(readFileSync('app.json','utf8')).expo});
 if(identity.ios.bundleIdentifier!=='com.vayhaven.'+variant||identity.extra.appVariant!==variant)throw Error('Incorrect app identity: '+variant);
 const directory='dist-'+variant;
 const result=spawnSync(process.execPath,[expo,'export','--clear','--platform','ios','--platform','android','--output-dir',directory],{env:process.env,stdio:'inherit'});
 if(result.status!==0)process.exit(result.status||1);
 const metadata=JSON.parse(readFileSync(directory+'/metadata.json','utf8'));
 const expectedIcon=readFileSync('assets/icon-'+variant+'.png');
 for(const platform of ['ios','android']){
  const output=metadata.fileMetadata[platform];
  if(!output?.bundle||!output.assets.some(asset=>readFileSync(directory+'/'+asset.path).equals(expectedIcon)))throw Error('Incorrect bundled icon: '+variant+' '+platform);
 }
 console.log('Verified '+identity.name+': distinct identity and correct icon in iOS and Android exports.');
}
