import type {Input} from '../../problems/exponentiation/definition';import type {Recorder} from '../../core/contracts';
export interface VisualState{items:{label:string;role?:string}[];current?:number;note?:string}
export function initVisual(input:Input):VisualState{return {items:[{label:`${input.base}^${input.exponent}`}],note:'Bắt đầu tính lũy thừa'}}
export const legend={current:'Tích đang tính',done:'Kết quả'};
export function record(rec:Recorder<VisualState>,lineId:string,explain:string,value:bigint){rec.step(lineId,explain,d=>{d.items.push({label:value.toString()});d.current=d.items.length-1;d.note=explain})}
export function finish(rec:Recorder<VisualState>,value:bigint){const result=value.toString();rec.step('done',`Lũy thừa bằng ${result}.`,d=>{d.items.push({label:result,role:'done'});d.current=d.items.length-1;d.note=`Kết quả ${result}`});return {value:result}}
