import type {Input,Output} from '../../problems/combinatorial-generation/definition';import type {Recorder} from '../../core/contracts';
export interface VisualState{items:{label:string;role?:string}[];current?:number;changedPositions?:number[];note?:string}
export function initVisual(input:Input):VisualState{return {items:[],note:`Sinh đối tượng cỡ ${input.n}`}}
export const legend={current:'Đối tượng vừa sinh',done:'Đã sinh xong'};
export function emit(rec:Recorder<VisualState>,object:number[],explain:string){rec.count('visit');rec.step('emit',explain,d=>{d.items.push({label:object.join('')});d.current=d.items.length-1;d.note=explain})}
export function finish(rec:Recorder<VisualState>,kind:Output['kind'],objects:number[][]):Output{rec.step('done',`Đã sinh đủ ${objects.length} đối tượng.`,d=>{d.note=`Tổng cộng ${objects.length} đối tượng`;if(d.items.length)d.items[d.items.length-1].role='done'});return {kind,objects}}
