import type {Input} from '../../problems/matrix-multiplication/definition';import type {Recorder} from '../../core/contracts';
export interface VisualState{matrix:number[][];current?:{i:number;w:number}|null;note?:string}
export function initVisual(input:Input):VisualState{return {matrix:Array.from({length:input.a.length},()=>Array<number>(input.a.length).fill(0)),note:'Ma trận tích ban đầu'}}
export const legend={current:'Ô đang tính',done:'Ma trận tích'};
export function finish(rec:Recorder<VisualState>,matrix:number[][]){rec.step('done','Đã tính xong tích hai ma trận.',d=>{d.matrix=matrix;d.note='Ma trận tích hoàn chỉnh';d.current=null});return {matrix}}
