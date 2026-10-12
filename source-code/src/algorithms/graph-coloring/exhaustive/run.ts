import type {RunContext} from '../../../core/contracts';import type {Input,Output} from '../../../problems/graph-coloring/definition';import {assertActive,markColoring,pack,type VisualState} from '../shared';import {adjacency,connected} from '../../../problems/graph-coloring/checker';
const SAFE_LIMIT=200000;
export function run(input:Input,{rec,signal}:RunContext<VisualState>):Output{
 const {nodes,colors:k}=input;const n=nodes.length;const adj=adjacency(input);
 if(Math.pow(k,n)>SAFE_LIMIT)throw new Error(`Vét cạn kⁿ = ${k}^${n} quá lớn; hãy dùng thuật toán quay lui cho trường hợp này.`);
 let nextId=0;let found:number[]|null=null;const coloring:number[]=new Array(n).fill(0);
 const rootId=nextId++;
 rec.step('init',`Sinh mọi cách tô ${n} đỉnh bằng ${k} màu.`,d=>{d.treeNodes.push({id:rootId,parent:null,label:'∅',status:'current',value:0})},[],'search');
 function assign(v:number,parent:number):boolean{
  assertActive(signal);
  for(let c=0;c<k;c++){
   rec.count('visit');
   coloring[v]=c;
   const id=nextId++;
   rec.step('assign',`Gán màu ${c} cho đỉnh ${nodes[v]}.`,d=>{d.treeNodes.push({id,parent,label:`${nodes[v]}:${c}`,status:'current',value:0})},[],'search');
   if(v===n-1){
    rec.count('compare');
    let ok=true;
    for(let i=0;i<n&&ok;i++)for(let j=i+1;j<n&&ok;j++)if(connected(adj,nodes[i],nodes[j])&&coloring[i]===coloring[j])ok=false;
    rec.step('check',ok?`Cách tô ${coloring.join(',')} hợp lệ — nghiệm.`:`Cách tô ${coloring.join(',')} có hai đỉnh kề cùng màu.`,d=>{const node=d.treeNodes.find(x=>x.id===id);if(node)node.status=ok?'best':'done';if(ok)markColoring(d,coloring)},[],'leaf');
    if(ok){found=coloring.slice();return true}
    continue;
   }
   if(assign(v+1,id))return true;
  }
  return false;
 }
 const ok=assign(0,rootId);
 rec.step('done',ok?'Hoàn tất: tìm được cách tô hợp lệ.':'Hoàn tất: đã thử hết mọi cách, không thể tô.',d=>{d.note=ok?'Tô thành công':'Không thể tô'},[],'done');
 return pack(found);
}
