export function estimate(input:{distance:string;speed:string;rate:string;taxi:string;fees:string;roundTrip:boolean}):{hours:number;cost:number}|null;
export const ORIGIN:string;
export function navigationKind(raw:string):'internal'|'external'|'blocked';
