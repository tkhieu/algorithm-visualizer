import type {RunContext} from '../../../core/contracts';
import type {Input,Output} from '../../../problems/convex-hull/definition';
import {assertActive,cross,pack,type VisualState} from '../shared';

export function run(input:Input,{rec,signal}:RunContext<VisualState>):Output{
 const pts=input.points;const n=pts.length;
 const next=new Map<number,number>();
 rec.step('start','Kiểm tra từng cặp điểm xem có tạo thành cạnh của bao lồi hay không.',d=>{d.note='Bắt đầu kiểm tra từng cặp'},[],'start');
 for(let i=0;i<n;i++){
  for(let j=0;j<n;j++){
   if(i===j)continue;
   assertActive(signal);
   let allLeft=true,allRight=true;
   for(let k=0;k<n;k++){
    if(k===i||k===j)continue;
    rec.count('compare');
    const c=cross(pts[i],pts[j],pts[k]);
    if(c<0)allLeft=false;
    if(c>0)allRight=false;
   }
   const isEdge=allLeft||allRight;
   rec.step('check',`Cặp (${i}, ${j}): ${isEdge?'tất cả điểm còn lại nằm một phía → là cạnh bao lồi':'không phải cạnh bao lồi'}.`,d=>{
    d.segments=[{from:i,to:j,role:isEdge?'hull':'rejected'}];
    d.note=isEdge?`Cạnh bao lồi (${i}, ${j})`:`Loại cặp (${i}, ${j})`;
   },[],'check');
   if(isEdge){
    if(allLeft&&!allRight)next.set(i,j);
    else if(allRight&&!allLeft)next.set(j,i);
   }
  }
 }
 const order:number[]=[];
 if(next.size>0){
  const start=[...next.keys()][0];
  let cur=start;
  const seen=new Set<number>();
  while(!seen.has(cur)){
   seen.add(cur);order.push(cur);
   const nxt=next.get(cur);
   if(nxt===undefined)break;
   cur=nxt;
  }
 }
 rec.step('done',`Hoàn tất: bao lồi có ${order.length} đỉnh.`,d=>{d.hull=order;d.note=`Bao lồi có ${order.length} đỉnh`},[],'done');
 return pack(order);
}
