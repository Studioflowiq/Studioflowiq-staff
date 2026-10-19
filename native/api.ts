const configuredOrigin=process.env.EXPO_PUBLIC_API_ORIGIN||'https://studioflowiq.com';
if(!['https://studioflowiq.com','https://studioflowiq-sandbox.fiitlyfe2021.chatgpt.site'].includes(configuredOrigin))throw new Error('Unrecognized StudioFlowIQ service origin');
export const ORIGIN=configuredOrigin;
export const SANDBOX=ORIGIN!=='https://studioflowiq.com';
export class ApiError extends Error{constructor(message:string,public status:number){super(message)}}
export async function request(path:string,token:string,body?:unknown,variant='staff'){
 if(!path.startsWith('/api/'))throw new Error('Invalid service path');
 const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),20000);
 try{const response=await fetch(ORIGIN+path,{method:body===undefined?'GET':'POST',headers:{Origin:ORIGIN,'Content-Type':'application/json','X-Studioflow-App':variant,...(token?{Authorization:'Bearer '+token}:{})},...(body===undefined?{}:{body:JSON.stringify(body)}),signal:controller.signal,credentials:'omit',redirect:'error'});const text=await response.text();let data:any;try{data=JSON.parse(text)}catch{throw new ApiError('Your studio could not be reached. Please try again.',response.status)}if(!response.ok)throw new ApiError(data.error||'Please try again.',response.status);return data;}catch(e:any){if(e.name==='AbortError')throw new Error('The connection timed out. Check your connection and try again.');throw e}finally{clearTimeout(timer)}
}
