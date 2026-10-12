import type {Input} from '../../problems/fake-coin/definition';import type {Recorder} from '../../core/contracts';
export interface VisualState{items:{label:string;role?:string}[];current?:number;note?:string}
export function initVisual(input:Input):VisualState{return {items:input.weights.map((_,i)=>({label:`Xu ${i}`})),note:'Tìm xu nhẹ hơn'}}
export const legend={current:'Nhóm đang xét',done:'Đồng xu giả'};
export function weigh(weights:number[],left:number[],right:number[],rec:Recorder<VisualState>):number{const a=left.reduce((s,i)=>s+weights[i],0),b=right.reduce((s,i)=>s+weights[i],0);rec.count('compare');rec.step('weigh',`Cân ${left.length} xu bên trái với ${right.length} xu bên phải: ${a} so với ${b}.`,d=>{d.note=`${a} so với ${b}`;d.current=left[0]});return Math.sign(a-b)}
export function finish(index:number,rec:Recorder<VisualState>){rec.step('done',`Đồng xu giả nhẹ hơn ở vị trí ${index}.`,d=>{d.items[index].role='done';d.current=index;d.note=`Xu giả: ${index}`});return {index}}
