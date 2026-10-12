import type {RunContext} from '../../core/contracts';
import type {Input,Output} from '../../problems/graph-traversal/definition';
import type {GraphVisualState} from '../../visualizers/graph';

export interface VisualState extends GraphVisualState{frontier:number[];order:number[];parent:(number|null)[]}
export function initVisual(input:Input):VisualState{return {nodes:Array.from({length:input.n},(_,v)=>({id:String(v),label:String(v)})),edges:input.edges.map(([a,b])=>({from:String(a),to:String(b),directed:true})),frontier:[input.start],order:[],parent:Array(input.n).fill(null),note:'Đỉnh bắt đầu đã vào hàng đợi/ngăn xếp.'}}

export function runTraversal(input:Input,{rec,signal}:RunContext<VisualState>,kind:'dfs'|'bfs'):Output{
 const adj=Array.from({length:input.n},()=>[] as number[]);
 for(const [a,b] of input.edges)if(!adj[a].includes(b))adj[a].push(b);
 adj.forEach(a=>a.sort((x,y)=>x-y));
 const seen=new Set<number>([input.start]),parent:(number|null)[]=Array(input.n).fill(null),order:number[]=[];
 rec.step('init',`Bắt đầu duyệt từ đỉnh ${input.start}.`,d=>{d.frontier=[input.start]});
 function visit(v:number,frontier:number[]){
  if(signal.aborted)throw new DOMException('Đã hủy','AbortError');
  order.push(v);rec.count('visit');
  rec.step('visit',`Thăm đỉnh ${v}; thứ tự hiện tại: ${order.join(', ')}.`,d=>{d.nodes[v].role='visited';d.order=[...order];d.frontier=[...frontier];d.note=`Đã thăm ${order.length} đỉnh.`},[{target:String(v),role:'visited'}]);
 }
 function discover(v:number,w:number,frontier:number[]){
  seen.add(w);parent[w]=v;rec.count('assign');
  rec.step('discover',`Phát hiện đỉnh ${w} từ ${v} và thêm vào ${kind==='bfs'?'hàng đợi':'ngăn xếp'}.`,d=>{d.parent[w]=v;d.frontier=[...frontier];const edge=d.edges.find(e=>e.from===String(v)&&e.to===String(w));if(edge)edge.role='tree'},[{target:`${v}-${w}`,role:'tree'}]);
 }
 if(kind==='bfs'){
  const queue=[input.start];
  for(let head=0;head<queue.length;head++){
   const v=queue[head];visit(v,queue.slice(head+1));
   for(const w of adj[v])if(!seen.has(w)){queue.push(w);discover(v,w,queue.slice(head+1))}
  }
 }else{
  const stack=[input.start];
  function dfs(v:number){
   visit(v,stack);
   for(const w of adj[v])if(!seen.has(w)){stack.push(w);discover(v,w,stack);dfs(w);stack.pop()}
  }
  dfs(input.start);
 }
 const output={order,parent};
 rec.step('done',`Hoàn tất duyệt ${order.length} đỉnh.`,d=>{d.order=[...order];d.parent=[...parent];d.frontier=[];d.note='Duyệt xong.'});
 return output;
}
export const legend={'Đã thăm':'Nền đen','Cạnh cây':'Nét đậm'};
export const limits={maxInputSize:60,maxSteps:5000,maxBytes:3000000};
