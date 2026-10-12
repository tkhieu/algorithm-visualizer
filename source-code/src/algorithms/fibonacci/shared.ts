import type {Input} from '../../problems/fibonacci/definition';
export interface VisualState{items:{label:string;role?:string}[];nodes:{id:string;parent:string|null;label:string;role?:string}[];current?:number;note?:string}
export function initVisual(input:Input):VisualState{return {items:[],nodes:[{id:'root',parent:null,label:`F(${input.n})`}],note:'Bắt đầu tính Fibonacci'}}
export const legend={current:'Lời gọi đang xử lý',done:'Giá trị đã tính'};
