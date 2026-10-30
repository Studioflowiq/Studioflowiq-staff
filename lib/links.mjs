export const ORIGIN='https://vayhaven.com';
export const SUPPORT_EMAIL='';
export function activationURL(raw,variant){
 try {const u=new URL(raw.trim()); const h=new URLSearchParams(u.hash.slice(1));
 if(u.origin!==ORIGIN||u.pathname!=='/'||u.username||u.password||!['invite','reset'].some(k=>h.get(k)))return null;
 if(variant){if(!['management','guest','vendor'].includes(variant))return null;u.searchParams.set('app',variant==='management'?'manager':variant);if(variant!=='management')u.searchParams.set('portal',variant);u.searchParams.delete('viewAs');}
 return u.href;}catch{return null;}
}
// Only explicit user taps reach this path. Automatic redirects retain the narrow allowlist below.
export function userLink(raw){
 try{const u=new URL(raw);if(u.username||u.password)return null;
 if(u.protocol==='https:'&&u.origin!==ORIGIN)return u.href;
 if(u.protocol==='tel:'&&/^\+?[\d(). -]{3,30}$/.test(u.pathname))return u.href;
 if(u.protocol==='mailto:'&&/^[^\s<>@]+@[^\s<>@]+$/.test(u.pathname)&&!/[\r\n]|%0[ad]/i.test(raw))return u.href;
 return null;}catch{return null;}
}
export function navigationKind(raw){
 try {const u=new URL(raw);if(u.origin===ORIGIN&&!u.username&&!u.password)return 'internal';
 if(u.protocol==='https:'&&!u.username&&!u.password&&['checkout.stripe.com','connect.stripe.com','square.link','checkout.square.site','connect.squareup.com','apps.docusign.com','account.docusign.com'].includes(u.hostname))return 'external';
 return 'blocked';}catch{return 'blocked';}
}
