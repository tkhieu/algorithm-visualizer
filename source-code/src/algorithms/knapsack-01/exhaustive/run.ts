import type {RunContext} from '../../../core/contracts';
import type {Input,Output} from '../../../problems/knapsack-01/definition';
import {assertActive,pack,type VisualState} from '../shared';

export function run(input:Input,{rec,signal}:RunContext<VisualState>):Output{
 let best:number[]=[];
 let bestValue=-1;
 let bestNodeId:number|null=null;
 let nextId=0;
 const pathItems=(i:number,chosen:number[]):VisualState['items']=>input.items.map((_,index)=>index>=i?'waiting':chosen.includes(index)?'taken':'rejected');
 const focus=(draft:VisualState,id:number,i:number,weight:number,chosen:number[])=>{
  draft.focusNode=id;
  draft.current={i,w:weight};
  draft.items=pathItems(i,chosen);
 };
 rec.step('start','Khởi tạo lời giải tốt nhất là tập rỗng.',d=>{d.note='Bắt đầu duyệt cây tập con'},[],'start');
 function visit(i:number,weight:number,value:number,chosen:number[],parent:number|null){
  assertActive(signal);
  rec.count('recurse');
  const id=nextId++;
  rec.step('branch',`Xét nút ${id}: đã quyết định ${i} vật, giá trị ${value}.`,d=>{
   d.nodes.push({id,parent,label:`${i}/${value}`,status:'current',value});
   focus(d,id,i,weight,chosen);
   d.note=`Đã quyết định ${i} vật`;
  },[{target:`node-${id}`,role:'current'}],'search');
  if(i===input.items.length){
   rec.count('compare');
   if(value>bestValue){
    const oldBestNodeId=bestNodeId;
    bestValue=value;
    best=[...chosen];
    bestNodeId=id;
    rec.step('leaf',`Tìm nghiệm tốt hơn: ${value}.`,d=>{
     if(oldBestNodeId!==null){const old=d.nodes.find(x=>x.id===oldBestNodeId);if(old)old.status='superseded'}
     const node=d.nodes.find(x=>x.id===id);
     if(node)node.status='best';
     focus(d,id,i,weight,chosen);
     d.note=`Giá trị tốt nhất ${value}`;
    },[{target:`node-${id}`,role:'best'}],'search');
   }else{
    rec.step('leaf',`Nút lá ${id} có giá trị ${value}, không cải thiện nghiệm hiện có.`,d=>{
     const node=d.nodes.find(x=>x.id===id);
     if(node)node.status='done';
     focus(d,id,i,weight,chosen);
     d.note='Nút lá đã xét';
    },[],'search');
   }
   return;
  }
  visit(i+1,weight,value,chosen,id);
  const item=input.items[i];
  if(weight+item.weight<=input.capacity){
   rec.count('visit');
   visit(i+1,weight+item.weight,value+item.value,[...chosen,i],id);
  }else{
   rec.count('prune');
   rec.step('branch',`Không tạo nhánh lấy vật ${i+1}: khối lượng ${weight+item.weight} vượt sức chứa ${input.capacity}.`,d=>{
    focus(d,id,i,weight,chosen);
    d.note='Nhánh lấy không khả thi';
   },[{target:`item-${i}`,role:'rejected'}],'search');
  }
  rec.step('branch',`Đã xét xong các lựa chọn từ nút ${id}.`,d=>{
   const node=d.nodes.find(x=>x.id===id);
   if(node)node.status='done';
   focus(d,id,i,weight,chosen);
   d.note='Đã xét xong nút';
  },[],'search');
 }
 visit(0,0,0,[],null);
 rec.step('done',`Hoàn tất: giá trị tối ưu ${bestValue}.`,d=>{
  const weight=best.reduce((sum,index)=>sum+input.items[index].weight,0);
  focus(d,bestNodeId!,input.items.length,weight,best);
  d.note='Hoàn tất';
 },[{target:`node-${bestNodeId}`,role:'best'}],'done');
 return pack(input,best);
}
