import type {RunContext} from '../../../core/contracts';import type {Input,Output} from '../../../problems/knapsack-01/definition';import {assertActive,pack,type VisualState} from '../shared';
export function run(input:Input,{rec,signal}:RunContext<VisualState>):Output{
 let best:number[]=[];let bestValue=-1;let nextId=0;
 rec.step('start','Khởi tạo lời giải tốt nhất là tập rỗng.',d=>{d.note='Bắt đầu duyệt cây tập con'},[], 'start');
 function visit(i:number,weight:number,value:number,chosen:number[],parent:number|null){assertActive(signal);rec.count('recurse');const id=nextId++;
  rec.step('branch',`Xét nút ${id}: đã chọn ${chosen.length} vật, giá trị ${value}.`,d=>{d.nodes.push({id,parent,label:`${i}/${value}`,status:'current',value});d.focusNode=id;d.current={i,w:weight};d.note=`Xét vật ${i+1}`},[{target:`node-${id}`,role:'current'}],'search');
  if(i===input.items.length){rec.count('compare');if(value>bestValue){bestValue=value;best=[...chosen];rec.step('leaf',`Tìm nghiệm tốt hơn: ${value}.`,d=>{const node=d.nodes.find(x=>x.id===id);if(node)node.status='best';d.note=`Giá trị tốt nhất ${value}`},[{target:`node-${id}`,role:'best'}],'search')}return}
  visit(i+1,weight,value,chosen,id);const item=input.items[i];if(weight+item.weight<=input.capacity){rec.count('visit');visit(i+1,weight+item.weight,value+item.value,[...chosen,i],id)}else{rec.count('prune');rec.step('branch',`Bỏ nhánh lấy vật ${i+1} vì quá sức chứa.`,d=>{d.items[i]='rejected';d.note='Quá sức chứa'},[{target:`item-${i}`,role:'rejected'}],'search')}
 }
 visit(0,0,0,[],null);rec.step('done',`Hoàn tất: giá trị tối ưu ${bestValue}.`,d=>{d.items=d.items.map((_,i)=>best.includes(i)?'taken':'rejected');d.note='Hoàn tất'},[], 'done');return pack(input,best)
}
