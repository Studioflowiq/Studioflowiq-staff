export function trustedPressurePage(raw:string):boolean;
export const pressureWebBridge:string;
export function pressureDelivery(sample:any):string;
export function createPressureController(options:{sensor:any;send:(sample:any)=>void;canUse:()=>boolean;now?:()=>number;every?:any;cancel?:any}):{command:(action:string)=>void|Promise<void>;stop:()=>void;setForeground:(active:boolean)=>void;dispose:()=>void};
