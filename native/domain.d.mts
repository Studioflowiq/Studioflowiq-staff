export function invitation(raw:string,variant:string,origin?:string):{token:string;studio:string}|null;
export function classId(booking:any):string;
export function memberId(booking:any):string;
export function activeBooking(booking:any):boolean;
export function localDay(timezone:string,now?:Date):string;
export function scanMember(value:string):string|null;
export function sortClasses(classes:any[]):any[];
