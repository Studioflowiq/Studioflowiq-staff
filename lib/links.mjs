export const ORIGIN='https://studioflowiq.com';
export const SUPPORT_EMAIL='hello@studioflowiq.com';
export function activationURL(raw){
 try{const url=new URL(raw.trim());if(url.origin!==ORIGIN||!['/member','/login'].includes(url.pathname)||url.username||url.password)return null;return url.href;}catch{return null;}
}
export function navigationKind(raw){
 try{const u=new URL(raw);if(u.username||u.password)return 'blocked';if(u.origin===ORIGIN&&!u.username&&!u.password)return 'internal';if(u.protocol==='https:'&&['checkout.stripe.com','connect.stripe.com','square.link','checkout.square.site','connect.squareup.com'].includes(u.hostname))return 'external';if(u.protocol==='mailto:'&&u.pathname===SUPPORT_EMAIL)return 'external';return 'blocked';}catch{return 'blocked';}
}
export function allowPaymentFrame(raw,isTopFrame){
 if(isTopFrame!==false)return false;
 try{const u=new URL(raw);return u.protocol==='https:'&&!u.username&&!u.password&&['web.squarecdn.com','sandbox.web.squarecdn.com','pci-connect.squareup.com','pci-connect.squareupsandbox.com'].includes(u.hostname);}catch{return false;}
}
