import type {Input} from '../../problems/polynomial-eval/definition';import type {Recorder} from '../../core/contracts';
export interface VisualState{items:{label:string;role?:string}[];current?:number;note?:string}
export function initVisual(input:Input):VisualState{return {items:[],note:`Tính P(${input.x})`}}
export const legend={current:'Giá trị trung gian',done:'Giá trị đa thức'};
export function record(rec:Recorder<VisualState>,explain:string,value:number){rec.step('accumulate',explain,d=>{d.items.push({label:String(value)});d.current=d.items.length-1;d.note=explain})}
export function finish(rec:Recorder<VisualState>,value:number){rec.step('done',`Giá trị đa thức là ${value}.`,d=>{d.items.push({label:String(value),role:'done'});d.current=d.items.length-1;d.note=`P(x) = ${value}`});return {value}}
