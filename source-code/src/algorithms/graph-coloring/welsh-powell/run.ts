import type {RunContext} from '../../../core/contracts';import type {Input,Output} from '../../../problems/graph-coloring/definition';import {assertActive,markColoring,pack,smallestAvailableColor,type VisualState} from '../shared';import {adjacency} from '../../../problems/graph-coloring/checker';
export function run(input:Input,{rec,signal}:RunContext<VisualState>):Output{
 const {nodes,colors:k}=input;const n=nodes.length;const adj=adjacency(input);
 const degree=nodes.map(v=>nodes.filter(u=>adj.has(`${v}|${u}`)).length);
 const order=nodes.map((_,i)=>i).sort((a,b)=>degree[b]-degree[a]||a-b);
 const coloring:(number|null)[]=new Array(n).fill(null);let nextId=0;let parent:number|null=null;let ok=true;
 rec.step('init',`Sắp đỉnh theo bậc giảm dần: ${order.map(i=>nodes[i]).join(', ')}.`,d=>{markColoring(d,coloring)},[],'search');
 for(const i of order){
  assertActive(signal);rec.count('visit');
  const c=smallestAvailableColor(adj,nodes,coloring,k,nodes[i]);
  const id=nextId++;
  if(c===null){
   ok=false;
   rec.step('fail',`Không còn màu nào trong ${k} màu khả dụng cho đỉnh ${nodes[i]} (bậc ${degree[i]}).`,d=>{d.treeNodes.push({id,parent,label:`${nodes[i]}:x`,status:'pruned',value:0});markColoring(d,coloring,nodes[i])},[{target:`node-${nodes[i]}`,role:'rejected'}],'search');
   break;
  }
  coloring[i]=c;
  rec.step('assign',`Gán màu ${c} cho đỉnh ${nodes[i]} (bậc ${degree[i]}).`,d=>{d.treeNodes.push({id,parent,label:`${nodes[i]}:${c}`,status:'current',value:c});markColoring(d,coloring,nodes[i])},[{target:`node-${nodes[i]}`,role:'current'}],'search');
  parent=id;
 }
 rec.step('done',ok?`Tô thành công với tối đa ${k} màu.`:'Không thể tô với số màu đã cho.',d=>{d.note=ok?'Tô thành công':'Thất bại'},[],'done');
 return pack(ok?coloring as number[]:null);
}
