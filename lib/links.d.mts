export const ORIGIN:string;
export const SUPPORT_EMAIL:string;
export function activationURL(raw:string,variant?:string):string|null;
export function userLink(raw:string):string|null;
export function navigationKind(raw:string):"internal"|"external"|"blocked";
