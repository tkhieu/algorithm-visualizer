import type {Input,Output} from '../../problems/optimal-bst/definition';
export interface TreeNode{id:string;parent:string|null;label:string;role?:string}
export interface VisualState{matrix:(number|string|null)[][];computed:boolean[][];current:{i:number;w:number}|null;nodes:TreeNode[];note:string}
export function initVisual(input:Input):VisualState{
 const n=input.freq.length;
 return {
  matrix:Array.from({length:n},()=>new Array<number|string|null>(n).fill(null)),
  computed:Array.from({length:n},()=>new Array<boolean>(n).fill(false)),
  current:null,nodes:[],note:'',
 };
}
export function pack(cost:number,roots:number[][]):Output{return {cost,roots}}
export function assertActive(signal:AbortSignal){if(signal.aborted)throw new DOMException('Đã hủy','AbortError')}
export const limits={maxInputSize:12,maxSteps:4000,maxBytes:2500000};
export const legend={'Đang tính':'Viền đậm','Gốc':'Nền đen'};
export function buildTree(roots:number[][],i:number,j:number,parent:string|null):TreeNode[]{
 if(i>j)return [];
 const r=roots[i][j];
 const id=`${i}-${j}`;
 const node:TreeNode={id,parent,label:`k${r+1}`};
 return [node,...buildTree(roots,i,r-1,id),...buildTree(roots,r+1,j,id)];
}
