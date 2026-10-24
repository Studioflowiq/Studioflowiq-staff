export const ORIGIN:string;
export const SUPPORT_EMAIL:string;
export function activationURL(raw:string):string|null;
export function navigationKind(raw:string,sandbox?:boolean):'internal'|'external'|'blocked';

export function allowPaymentFrame(raw:string,isTopFrame?:boolean):boolean;
