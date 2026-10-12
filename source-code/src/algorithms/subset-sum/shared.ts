import type {Output} from '../../problems/subset-sum/definition';
export interface TreeNode{id:number;parent:number|null;label:string;status:'current'|'open'|'pruned'|'best'|'done'|'superseded';value:number}
export interface VisualState{nodes:TreeNode[];matrix:(number|string|null)[][];computed:boolean[][];current:{i:number;w:number}|null;backtrack:[number,number][];note:string}
export function initVisual():VisualState{return {nodes:[],matrix:[],computed:[],current:null,backtrack:[],note:''}}
export function pack(indices:number[]|null):Output{return indices?{found:true,indices}:{found:false,indices:[]}}
export function assertActive(signal:AbortSignal){if(signal.aborted)throw new DOMException('Đã hủy','AbortError')}
export const limits={maxSteps:5000,maxBytes:2500000};
