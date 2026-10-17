import {Alert,Share} from 'react-native';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import {File,Paths} from 'expo-file-system';
import {tripPackHTML} from './lib/trip-pack.mjs';
import {planGPX,planMessage} from './lib/share-plan.mjs';
export async function sharePlan(kind:'message'|'pdf'|'gpx',plan:any,result:any,assessment:any=null,options:{assessment?:boolean;people?:number}={}){
 try{if(!result)throw Error('Complete the flight plan before sharing.');if(kind==='message'){await Share.share({title:options.assessment?'Go / No-Go snapshot':'AV8 FLY flight plan',message:planMessage(plan,result,assessment,options)});return}
 if(!await Sharing.isAvailableAsync())throw Error('File sharing is unavailable on this device.');
 if(kind==='pdf'){const {uri}=await Print.printToFileAsync({html:tripPackHTML(plan,result,assessment,{...options,assessment:options.assessment===true,people:options.people||2}),width:612,height:792});await Sharing.shareAsync(uri,{mimeType:'application/pdf',UTI:'com.adobe.pdf',dialogTitle:'Share AV8 FLY planning PDF'});return}
 const file=new File(Paths.cache,'AV8-FLY-route-'+Date.now()+'.gpx');file.create();file.write(planGPX(result));await Sharing.shareAsync(file.uri,{mimeType:'application/gpx+xml',UTI:'com.topografix.gpx',dialogTitle:'Share route file'});
 }catch(e:any){Alert.alert('Share flight plan',e.message||'Could not create the file. Please try again.')}
}
