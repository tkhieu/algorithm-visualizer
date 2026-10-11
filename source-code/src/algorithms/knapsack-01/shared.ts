import type {Input,Output} from '../../problems/knapsack-01/definition';
export interface TreeNode{id:number;parent:number|null;label:string;status:'current'|'open'|'pruned'|'best'|'done'|'superseded';value:number;bound?:number}
export interface VisualState{matrix:(number|null)[][];computed:boolean[][];nodes:TreeNode[];items:('waiting'|'considered'|'taken'|'rejected')[];current:{i:number;w:number}|null;dependencies:[number,number][];backtrack:[number,number][];focusNode:number|null;note:string}
export function initVisual(input:Input):VisualState{return {matrix:[],computed:[],nodes:[],items:input.items.map(()=>'waiting'),current:null,dependencies:[],backtrack:[],focusNode:null,note:''}}
export function pack(input:Input,selected:number[]):Output{return {selected:[...selected].sort((a,b)=>a-b),weight:selected.reduce((s,i)=>s+input.items[i].weight,0),value:selected.reduce((s,i)=>s+input.items[i].value,0)}}
export function assertActive(signal:AbortSignal){if(signal.aborted)throw new DOMException('Đã hủy','AbortError')}
export const limits={maxInputSize:20,maxSteps:5000,maxBytes:2500000};
export const legend={'Đang xét':'Viền đậm','Phụ thuộc':'Nền xám','Đã chọn':'Nền đen','Đã cắt':'Viền đứt','Nghiệm cũ':'Nền xám nhạt'};
