import type {RunContext} from '../../../core/contracts';
import type {Input,Output} from '../../../problems/knapsack-01/definition';
import {assertActive,pack,type VisualState} from '../shared';

type Node={id:number;parent:number|null;k:number;weight:number;value:number;chosen:number[];bound:number};

export function run(input:Input,{rec,signal}:RunContext<VisualState>):Output{
 const sorted=input.items.map((item,index)=>({...item,index})).sort((a,b)=>b.value/b.weight-a.value/a.weight||a.index-b.index);
 const W=input.capacity;
 let nextId=0;
 let bestValue=0;
 let best:number[]=[];
 let bestNodeId:number|null=null;
 const everBest=new Set<number>();
 const bound=(k:number,weight:number,value:number)=>k>=sorted.length?value:value+(W-weight)*(sorted[k].value/sorted[k].weight);
 const root:Node={id:nextId++,parent:null,k:0,weight:0,value:0,chosen:[],bound:bound(0,0,0)};
 let bestNode=root;
 const queue:Node[]=[root];
 const pathItems=(node:Node):VisualState['items']=>{
  const statuses:VisualState['items']=input.items.map(()=>'waiting');
  for(let j=0;j<node.k;j++)statuses[sorted[j].index]=node.chosen.includes(sorted[j].index)?'taken':'rejected';
  return statuses;
 };
 const focus=(draft:VisualState,node:Node)=>{
  draft.focusNode=node.id;
  draft.current={i:node.k,w:node.weight};
  draft.items=pathItems(node);
 };
 rec.step('sort','Sắp vật theo tỷ lệ giá trị/khối lượng.',d=>{
  d.nodes.push({id:root.id,parent:null,label:'Gốc',status:'open',value:0,bound:root.bound});
  focus(d,root);
  d.note='Đã sắp theo tỷ lệ';
 },[],'search');

 while(queue.length){
  assertActive(signal);
  queue.sort((a,b)=>b.bound-a.bound);
  const node=queue.shift()!;
  rec.count('visit');
  rec.step('pop',`Xét nút ${node.id}, cận trên ${node.bound.toFixed(2)}.`,d=>{
   focus(d,node);
   d.note=`Cận trên ${node.bound.toFixed(2)}`;
   const visual=d.nodes.find(x=>x.id===node.id);
   if(visual&&node.id!==bestNodeId)visual.status='current';
  },[{target:`node-${node.id}`,role:'current'}],'search');

  if(node.k===sorted.length){
   rec.step('finish',`Nút ${node.id} là lá: đã quyết định hết ${node.k} vật, không còn nhánh để mở rộng.`,d=>{
    const visual=d.nodes.find(x=>x.id===node.id);
    if(visual&&node.id!==bestNodeId)visual.status=everBest.has(node.id)?'superseded':'done';
    focus(d,node);
    d.note='Nút lá đã hoàn tất';
   },[],'search');
   continue;
  }
  if(node.bound<=bestValue){
   if(node.id===bestNodeId||everBest.has(node.id)||node.id===root.id){
    rec.step('finish',`Dừng mở rộng nút ${node.id}: cận trên ${node.bound.toFixed(2)} không thể cải thiện giá trị ${bestValue}.`,d=>{
     const visual=d.nodes.find(x=>x.id===node.id);
     if(visual&&node.id!==bestNodeId)visual.status=everBest.has(node.id)?'superseded':'done';
     focus(d,node);
     d.note='Không thể cải thiện nghiệm hiện có';
    },[],'search');
   }else{
    rec.count('prune');
    rec.step('prune',`Cắt nút ${node.id}: cận trên ${node.bound.toFixed(2)} ≤ giá trị tốt nhất ${bestValue}.`,d=>{
     const visual=d.nodes.find(x=>x.id===node.id);
     if(visual)visual.status='pruned';
     focus(d,node);
     d.note='Cắt do cận trên';
    },[{target:`node-${node.id}`,role:'pruned'}],'search');
   }
   continue;
  }

  const item=sorted[node.k];
  for(const take of [true,false]){
   const weight=node.weight+(take?item.weight:0);
   if(weight>W){
    rec.count('prune');
    rec.step('prune',`Không tạo nhánh lấy ${item.name}: khối lượng ${weight} vượt sức chứa ${W}.`,d=>{
     focus(d,node);
     d.note='Nhánh lấy không khả thi';
    },[{target:`item-${item.index}`,role:'rejected'}],'search');
    continue;
   }
   const value=node.value+(take?item.value:0);
   const chosen=take?[...node.chosen,item.index]:node.chosen;
   const child:Node={id:nextId++,parent:node.id,k:node.k+1,weight,value,chosen,bound:bound(node.k+1,weight,value)};
   rec.step('branch',`${take?'Lấy':'Bỏ'} ${item.name}: giá trị ${value}, cận trên ${child.bound.toFixed(2)}.`,d=>{
    d.nodes.push({id:child.id,parent:node.id,label:`${take?'L':'B'} ${item.name}`,status:'open',value,bound:child.bound});
    focus(d,child);
    d.note=`${take?'Lấy':'Bỏ'} ${item.name}`;
   },[{target:`node-${child.id}`,role:'current'}],'search');

   const improved=value>bestValue;
   if(improved){
    const oldBestNodeId=bestNodeId;
    bestValue=value;
    best=[...chosen];
    bestNode=child;
    bestNodeId=child.id;
    everBest.add(child.id);
    rec.step('best',`Nghiệm tốt hơn tại nút ${child.id}: giá trị ${value}.`,d=>{
     if(oldBestNodeId!==null){const old=d.nodes.find(x=>x.id===oldBestNodeId);if(old)old.status='superseded'}
     const visual=d.nodes.find(x=>x.id===child.id);
     if(visual)visual.status='best';
     focus(d,child);
     d.note=`Tốt nhất = ${value}`;
    },[{target:`node-${child.id}`,role:'best'}],'search');
   }

   if(child.k===sorted.length){
    rec.step('finish',`Nút ${child.id} là lá: đã quyết định hết vật; giá trị ${value}.`,d=>{
     const visual=d.nodes.find(x=>x.id===child.id);
     if(visual&&!improved)visual.status='done';
     focus(d,child);
     d.note='Nút lá đã hoàn tất';
    },[],'search');
   }else if(child.bound>bestValue){
    queue.push(child);
   }else if(improved){
    rec.step('finish',`Nút ${child.id} đạt cận trên bằng giá trị tốt nhất ${bestValue}; giữ nghiệm này và không mở rộng thêm.`,d=>{
     focus(d,child);
     d.note='Đã giữ nghiệm tốt nhất';
    },[],'search');
   }else{
    rec.count('prune');
    rec.step('prune',`Cắt nút ${child.id}: cận trên ${child.bound.toFixed(2)} ≤ giá trị tốt nhất ${bestValue}.`,d=>{
     const visual=d.nodes.find(x=>x.id===child.id);
     if(visual)visual.status='pruned';
     focus(d,child);
     d.note='Cắt do cận trên';
    },[{target:`node-${child.id}`,role:'pruned'}],'search');
   }
  }
  rec.step('finish',`Đã xét xong hai lựa chọn cho ${item.name} tại nút ${node.id}.`,d=>{
   const visual=d.nodes.find(x=>x.id===node.id);
   if(visual&&node.id!==bestNodeId)visual.status=everBest.has(node.id)?'superseded':'done';
   focus(d,node);
   d.note='Đã xét hai lựa chọn';
  },[],'search');
 }
 rec.step('done',`Hoàn tất: giá trị tối ưu ${bestValue}.`,d=>{
  if(bestNodeId===null){const visual=d.nodes.find(x=>x.id===root.id);if(visual)visual.status='best'}
  focus(d,bestNode);
  d.note=`Tối ưu ${bestValue}`;
 },[{target:`node-${bestNode.id}`,role:'best'}],'done');
 return pack(input,best);
}
