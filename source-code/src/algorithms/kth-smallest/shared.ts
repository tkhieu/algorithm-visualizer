import type {Input} from '../../problems/kth-smallest/definition';import type {Recorder} from '../../core/contracts';
export interface VisualState{values:number[];marks:{index:number;role:'pivot'|'compare'|'found'}[];ranges?:{from:number;to:number;role:'active'}[];note?:string}
export function initVisual(input:Input):VisualState{return {values:[...input.values],marks:[],note:`Tìm giá trị nhỏ thứ ${input.k}`}}
export const legend={pivot:'Chốt phân hoạch',compare:'Vị trí đang so sánh',found:'Giá trị nhỏ thứ k'};
export function finish(rec:Recorder<VisualState>,index:number,value:number){rec.step('done',`Giá trị nhỏ thứ ${index+1} là ${value}.`,d=>{d.marks=[{index,role:'found'}];d.note=`Kết quả ${value}`});return {value}}
