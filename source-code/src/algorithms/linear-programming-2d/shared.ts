import type {Input,Output} from '../../problems/linear-programming-2d/definition';
export interface VisualState{
 domain:[number,number];samples:{x:number;y:number}[];
 points:{x:number;y:number;role?:string}[];feasibleRegion:{x:number;y:number}[];
 matrix:(number|string|null)[][];computed:boolean[][];current:{i:number;w:number}|null;
 note:string;
}
export function initVisual(input:Input):VisualState{
 const maxC=Math.max(1,...input.constraints.map(c=>c.c));
 return {domain:[0,maxC],samples:[{x:0,y:0},{x:maxC,y:0}],points:[],feasibleRegion:[],matrix:[],computed:[],current:null,note:''};
}
export function pack(x:number,y:number,value:number):Output{return {x,y,value}}
export function assertActive(signal:AbortSignal){if(signal.aborted)throw new DOMException('Đã hủy','AbortError')}
export const limits={maxInputSize:8,maxSteps:3000,maxBytes:2000000};
export const legend={'Đỉnh đang xét':'Viền đậm','Đỉnh tối ưu':'Nền đen','Miền khả thi':'Nền xám'};
export function orderByAngle(points:{x:number;y:number}[]):{x:number;y:number}[]{
 if(points.length<3)return [...points];
 const cx=points.reduce((s,p)=>s+p.x,0)/points.length;
 const cy=points.reduce((s,p)=>s+p.y,0)/points.length;
 return [...points].sort((a,b)=>Math.atan2(a.y-cy,a.x-cx)-Math.atan2(b.y-cy,b.x-cx));
}
