export const APP_ORIGIN='https://volleza.com';
const checkoutHosts=new Set(['square.link','sandbox.square.link','checkout.square.site','connect.squareup.com','connect.squareupsandbox.com']);
export function navigationTarget(value:string):'internal'|'external'|'blank'|'blocked'{try{if(value==='about:blank')return 'blank';const u=new URL(value);if(u.username||u.password)return 'blocked';if(u.protocol==='https:'&&u.origin===APP_ORIGIN)return 'internal';if(u.protocol==='https:'&&u.port===''&&checkoutHosts.has(u.hostname))return 'external';if(['mailto:','tel:'].includes(u.protocol)&&!/[\r\n]/.test(value))return 'external';return 'blocked';}catch{return 'blocked';}}
export function trustedScanMessage(url:string,data:string){if(navigationTarget(url)!=='internal'||typeof data!=='string'||data.length>1024)return false;try{const message=JSON.parse(data);return message&&typeof message==='object'&&!Array.isArray(message)&&message.action==='scan';}catch{return false;}}

export function allowPaymentFrame(raw:string,isTopFrame?:boolean){
 if(isTopFrame!==false)return false;
 try{const u=new URL(raw);return u.protocol==='https:'&&!u.port&&!u.username&&!u.password&&['web.squarecdn.com','sandbox.web.squarecdn.com','pci-connect.squareup.com','pci-connect.squareupsandbox.com'].includes(u.hostname);}catch{return false;}
}
