import type {Input,Output} from '../../problems/n-queens/definition';
export interface TreeNode{id:number;parent:number|null;label:string;status:'current'|'open'|'pruned'|'best'|'done'|'superseded';value:number}
export interface BoardMark{row:number;col:number;role:string;label?:string}
export interface VisualState{rows:number;marks:BoardMark[];nodes:TreeNode[];note:string}
export function initVisual(input:Input):VisualState{return {rows:input.n,marks:[],nodes:[],note:''}}
export function pack(positions:number[]|null):Output{return positions?{found:true,positions}:{found:false,positions:[]}}
export function assertActive(signal:AbortSignal){if(signal.aborted)throw new DOMException('Đã hủy','AbortError')}
export const limits={maxSteps:5000,maxBytes:2500000};
export function marksFor(n:number,positions:(number|null)[]):BoardMark[]{const marks:BoardMark[]=[];for(let row=0;row<n;row++){const col=positions[row];if(col!==null&&col!==undefined)marks.push({row,col,role:'queen',label:'Q'})}return marks}
