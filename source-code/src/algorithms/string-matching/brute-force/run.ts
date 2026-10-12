import type {RunContext} from '../../../core/contracts';
import type {Input,Output} from '../../../problems/string-matching/definition';
import {assertActive,pack,type VisualState} from '../shared';

export function run(input:Input,{rec,signal}:RunContext<VisualState>):Output{
 const {text,pattern}=input;const n=text.length,m=pattern.length;
 const positions:number[]=[];
 rec.step('init',`So khớp vét cạn: dịch mẫu từ vị trí 0 đến ${Math.max(0,n-m)}.`,d=>{d.note='Bắt đầu so khớp vét cạn'},[],'init');
 for(let s=0;s+m<=n;s++){
  assertActive(signal);
  rec.step('shift',`Đặt mẫu tại vị trí ${s}.`,d=>{d.shift=s;d.comparisons=[];d.note=`Dịch mẫu tới vị trí ${s}`},[],'shift');
  let j=0;let ok=true;
  while(j<m){
   assertActive(signal);
   rec.count('compare');
   const match=text[s+j]===pattern[j];
   rec.step('compare',`So sánh T[${s+j}] = '${text[s+j]}' với P[${j}] = '${pattern[j]}': ${match?'khớp':'không khớp'}.`,d=>{
    d.comparisons=[...d.comparisons,{patternIndex:j,match}];
    d.note=match?'Khớp, tiếp tục so sánh':'Không khớp, dừng tại vị trí này';
   },[{target:`pattern-${j}`,role:match?'match':'mismatch'}],'compare');
   if(!match){ok=false;break}
   j++;
  }
  if(ok){
   positions.push(s);
   rec.step('match',`Khớp hoàn toàn tại vị trí ${s}.`,d=>{d.note=`Tìm thấy một lần khớp tại vị trí ${s}`},[],'match');
  }
 }
 rec.step('done',`Hoàn tất: tìm thấy ${positions.length} vị trí khớp.`,d=>{d.note=`Tìm thấy ${positions.length} vị trí khớp`},[],'done');
 return pack(positions);
}
