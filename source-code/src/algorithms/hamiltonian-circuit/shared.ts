import type {Input,Output} from '../../problems/hamiltonian-circuit/definition';
export interface TreeNode{id:number;parent:number|null;label:string;status:'current'|'open'|'pruned'|'best'|'done'|'superseded';value:number}
export interface GNode{id:string;role?:string}
export interface GEdge{from:string;to:string;role?:string}
export interface VisualState{nodes:GNode[];edges:GEdge[];treeNodes:TreeNode[];note:string}
export function initVisual(input:Input):VisualState{return {nodes:input.nodes.map(id=>({id})),edges:input.edges.map(e=>({from:e.from,to:e.to})),treeNodes:[],note:''}}
export function pack(circuit:string[]|null):Output{return circuit?{found:true,circuit}:{found:false,circuit:[]}}
export function assertActive(signal:AbortSignal){if(signal.aborted)throw new DOMException('Đã hủy','AbortError')}
export const limits={maxSteps:5000,maxBytes:2500000};
export function markPath(draft:VisualState,path:string[]){
 const inPath=new Set(path);
 for(const n of draft.nodes)n.role=inPath.has(n.id)?'visited':undefined;
 if(path.length)draft.nodes[draft.nodes.findIndex(n=>n.id===path[path.length-1])].role='current';
 const edges=new Set<string>();for(let i=0;i+1<path.length;i++)edges.add(`${path[i]}|${path[i+1]}`);
 for(const e of draft.edges)e.role=(edges.has(`${e.from}|${e.to}`)||edges.has(`${e.to}|${e.from}`))?'path':undefined;
}
