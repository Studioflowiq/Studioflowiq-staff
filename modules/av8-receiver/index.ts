import {requireOptionalNativeModule} from 'expo-modules-core';
type Packet={generation:number;status?:string;base64?:string;peer?:string};
type Receiver={start:(generation:number)=>Promise<void>;stop:()=>Promise<void>;addListener:(event:'onPacket',listener:(packet:Packet)=>void)=>{remove:()=>void}};
export default requireOptionalNativeModule<Receiver>('AV8Receiver');
