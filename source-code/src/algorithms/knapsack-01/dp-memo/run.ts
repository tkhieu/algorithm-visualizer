import type {RunContext} from '../../../core/contracts';
import type {Input,Output} from '../../../problems/knapsack-01/definition';
import {assertActive,pack,type VisualState} from '../shared';

export function run(input:Input,{rec,signal}:RunContext<VisualState>):Output{
 const n=input.items.length,W=input.capacity;
 const M=Array.from({length:n+1},()=>Array<number|undefined>(W+1));
 let nodeId=0;
 rec.step('call','Tạo bảng nhớ; ô trống là chưa tính.',d=>{
  d.matrix=Array.from({length:n+1},()=>Array<number|null>(W+1).fill(null));
  d.computed=Array.from({length:n+1},()=>Array<boolean>(W+1).fill(false));
  d.note='Bảng nhớ ban đầu trống';
 },[],'compute');
 function solve(i:number,w:number,parent:number|null,phase:'compute'|'backtrack'='compute'):number{
  assertActive(signal);
  rec.count('recurse');
  const cached=M[i][w];
  if(cached!==undefined){
   rec.step('call',`Đọc lại ô nhớ M(${i},${w}) = ${cached}; không tạo lời gọi mới.`,d=>{
    d.current={i,w};
    d.dependencies=[];
    d.note=`Dùng lại M[${i},${w}] = ${cached}`;
   },[{target:`cell-${i}-${w}`,role:'current'}],phase);
   return cached;
  }
  const id=nodeId++;
  rec.step('call',`Gọi M(${i},${w}) để tính ô chưa có.`,d=>{
   d.nodes.push({id,parent,label:`M(${i},${w})`,status:'current',value:0});
   d.focusNode=id;
   d.current={i,w};
   d.note=`Tính M(${i},${w})`;
  },[{target:`cell-${i}-${w}`,role:'current'}],phase);
  if(i===0||w===0){
   M[i][w]=0;
   rec.step('base',`M(${i},${w}) = 0 theo điều kiện dừng.`,d=>{
    d.matrix[i][w]=0;
    d.computed[i][w]=true;
    const node=d.nodes.find(x=>x.id===id);
    if(node)node.status='done';
    d.focusNode=id;
    d.note='Điều kiện dừng';
   },[],phase);
   return 0;
  }
  const item=input.items[i-1];
  const skip=solve(i-1,w,id,phase);
  const take=item.weight<=w?solve(i-1,w-item.weight,id,phase)+item.value:-1;
  rec.count('compare');
  M[i][w]=Math.max(skip,take);
  rec.count('assign');
  rec.step('compute',`M(${i},${w}) = max(${skip}, ${take<0?'không thể':take}) = ${M[i][w]}.`,d=>{
   d.matrix[i][w]=M[i][w]!;
   d.computed[i][w]=true;
   d.current={i,w};
   d.dependencies=take<0?[[i-1,w]]:[[i-1,w],[i-1,w-item.weight]];
   const node=d.nodes.find(x=>x.id===id);
   if(node){node.status='done';node.value=M[i][w]!}
   d.focusNode=id;
   d.note=`M[${i},${w}] = ${M[i][w]}`;
  },[],phase);
  return M[i][w]!;
 }
 const value=solve(n,W,null);
 let w=W;
 const selected:number[]=[];
 for(let i=n;i>0;i--){
  assertActive(signal);
  const skip=solve(i-1,w,null,'backtrack');
  const take=M[i][w]!==skip;
  if(take){selected.push(i-1);w-=input.items[i-1].weight}
  rec.step('backtrack',`${take?'Chọn':'Bỏ'} vật ${i}.`,d=>{
   d.items[i-1]=take?'taken':'rejected';
   d.backtrack.push([i,w]);
   d.note=`${take?'Chọn':'Bỏ'} vật ${i}`;
  },[],'backtrack');
 }
 rec.step('done',`Tối ưu ${value}.`,d=>{d.focusNode=null;d.note=`Tối ưu ${value}`},[],'done');
 return pack(input,selected);
}
