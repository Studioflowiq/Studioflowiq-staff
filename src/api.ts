import * as SecureStore from 'expo-secure-store';
export const API_ORIGIN='https://flytflow.com';
const SESSION_KEY='flytflow.session.v1';let token:string|null=null;
export class ApiError extends Error{constructor(message:string,public status:number){super(message)}}
export async function restoreSession(){token=await SecureStore.getItemAsync(SESSION_KEY);return !!token}
export async function request(path:string,body?:unknown){const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),35000);try{const response=await fetch(API_ORIGIN+'/api/'+path,{method:body===undefined?'GET':'POST',headers:{'content-type':'application/json',...(token?{authorization:'Bearer '+token}:{})},...(body===undefined?{}:{body:JSON.stringify(body)}),signal:controller.signal});const data=await response.json();if(!response.ok)throw new ApiError(data.error||'Unable to complete this request.',response.status);return data}catch(e:any){if(e.name==='AbortError')throw new Error('The connection took too long. Please try again.');if(e instanceof ApiError)throw e;throw new Error(e.message||'Check your connection and try again.')}finally{clearTimeout(timer)}}
export async function signIn(email:string,password:string){const result=await request('mobile-login',{email,password});await saveToken(result.token)}
export async function openDemo(){const result=await request('mobile-demo',{});await saveToken(result.token)}
async function saveToken(value:string){if(!/^[a-f0-9]{64}$/.test(value))throw new Error('The server did not return a valid session.');await SecureStore.setItemAsync(SESSION_KEY,value,{keychainAccessible:SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY});token=value}
export async function clearSession(){token=null;await SecureStore.deleteItemAsync(SESSION_KEY)}
export async function signOut(){try{await request('logout',{})}finally{await clearSession()}}
