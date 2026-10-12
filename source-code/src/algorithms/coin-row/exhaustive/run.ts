import type {RunContext} from '../../../core/contracts';
import type {Input,Output} from '../../../problems/coin-row/definition';
import {assertActive,pack,type VisualState} from '../shared';

export function run(input:Input,{rec,signal}:RunContext<VisualState>):Output{
 const values=input.values;const n=values.length;

 function solve(i:number):{value:number;selected:number[]}{
  assertActive(signal);
  rec.count('recurse');
  if(i>=n){
   rec.step('base',`Hết đồng xu (i=${i}): tổng 0.`,d=>{d.current=undefined;d.note='Đã xét hết dãy'},[],'search');
   return {value:0,selected:[]};
  }
  rec.step('branch',`Xét đồng xu ${i+1}: thử bỏ qua hoặc chọn.`,d=>{d.current=i;d.note=`Xét đồng xu ${i+1}`},[{target:`item-${i}`,role:'current'}],'search');
  const skip=solve(i+1);
  const take=solve(i+2);
  const takeValue=values[i]+take.value;
  if(takeValue>skip.value){
   rec.step('better',`Chọn đồng xu ${i+1} cho tổng lớn hơn: ${takeValue} > ${skip.value}.`,d=>{d.note=`Chọn đồng xu ${i+1}`},[],'search');
   return {value:takeValue,selected:[i,...take.selected]};
  }
  rec.step('better',`Bỏ qua đồng xu ${i+1}: ${skip.value} ≥ ${takeValue}.`,d=>{d.note=`Bỏ qua đồng xu ${i+1}`},[],'search');
  return skip;
 }

 const result=solve(0);
 rec.step('done',`Hoàn tất: tổng tối ưu ${result.value}.`,d=>{
  d.items=d.items.map((it,idx)=>({...it,role:result.selected.includes(idx)?'taken':'skipped'}));
  d.note=`Tổng tối ưu ${result.value}`;
 },[],'done');
 return pack(result.value,result.selected);
}
