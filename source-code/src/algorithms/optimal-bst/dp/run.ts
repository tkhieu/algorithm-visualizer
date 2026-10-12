import type {RunContext} from '../../../core/contracts';
import type {Input,Output} from '../../../problems/optimal-bst/definition';
import {assertActive,buildTree,pack,type VisualState} from '../shared';

export function run(input:Input,{rec,signal}:RunContext<VisualState>):Output{
 const freq=input.freq;const n=freq.length;
 const prefix=[0];for(const f of freq)prefix.push(prefix[prefix.length-1]+f);
 const cost=Array.from({length:n},()=>new Array<number>(n).fill(0));
 const roots=Array.from({length:n},()=>new Array<number>(n).fill(0));
 for(let i=0;i<n;i++){cost[i][i]=freq[i];roots[i][i]=i}
 rec.step('base','C(i,i) = freq[i] cho mọi khoá đơn.',d=>{
  for(let i=0;i<n;i++){d.matrix[i][i]=freq[i];d.computed[i][i]=true}
  d.note='Khởi tạo đường chéo: cây một khoá';
 },[],'fill');
 for(let len=2;len<=n;len++){
  for(let i=0;i+len-1<n;i++){
   const j=i+len-1;
   assertActive(signal);
   let best=Infinity,bestK=i;
   for(let k=i;k<=j;k++){
    rec.count('compare');
    const left=k>i?cost[i][k-1]:0;
    const right=k<j?cost[k+1][j]:0;
    const total=left+right+(prefix[j+1]-prefix[i]);
    if(total<best){best=total;bestK=k}
   }
   cost[i][j]=best;roots[i][j]=bestK;
   rec.step('fill',`C(${i},${j}) = ${best}, chọn khoá ${bestK+1} làm gốc.`,d=>{
    d.matrix[i][j]=best;d.computed[i][j]=true;d.current={i,w:j};d.note=`C(${i},${j}) = ${best}`;
   },[],'fill');
  }
 }
 const total=n>0?cost[0][n-1]:0;
 const nodes=n>0?buildTree(roots,0,n-1,null):[];
 rec.step('done',`Hoàn tất: chi phí tối ưu ${total}.`,d=>{d.nodes=nodes;d.note=`Chi phí tối ưu ${total}`},[],'done');
 return pack(total,roots);
}
