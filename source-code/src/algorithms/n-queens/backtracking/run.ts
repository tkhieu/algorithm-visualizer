import type {RunContext} from '../../../core/contracts';import type {Input,Output} from '../../../problems/n-queens/definition';import {assertActive,marksFor,pack,type VisualState} from '../shared';
export function run(input:Input,{rec,signal}:RunContext<VisualState>):Output{
 const n=input.n;let nextId=0;const positions:(number|null)[]=new Array(n).fill(null);const nodeAtRow:number[]=[];
 let solution:number[]|null=null;let solutionLeaf:number|null=null;
 const promising=(row:number,col:number)=>{for(let r=0;r<row;r++){const c=positions[r]!;if(c===col||Math.abs(c-col)===Math.abs(r-row))return false}return true};
 rec.step('init','Kiểm tra an toàn dựa trên cột và hai đường chéo so với các hàng đã đặt.',d=>{d.note='Bắt đầu đặt quân hậu từ hàng 0'},[],'search');
 function place(row:number):boolean{
  assertActive(signal);
  for(let col=0;col<n;col++){
   rec.count('visit');
   const id=nextId++;const parent=row===0?null:nodeAtRow[row-1];
   rec.step('try',`Thử đặt quân hậu hàng ${row}, cột ${col}.`,d=>{d.nodes.push({id,parent,label:`${row}:${col}`,status:'current',value:0});d.marks=marksFor(n,positions)},[{target:`cell-${row}-${col}`,role:'current'}],'search');
   if(!promising(row,col)){
    rec.count('prune');
    rec.step('reject',`Hàng ${row}, cột ${col} bị tấn công theo cột hoặc đường chéo — loại bỏ.`,d=>{const node=d.nodes.find(x=>x.id===id);if(node)node.status='pruned'},[{target:`cell-${row}-${col}`,role:'rejected'}],'search');
    continue;
   }
   positions[row]=col;nodeAtRow[row]=id;
   rec.step('place',`Đặt quân hậu hợp lệ tại hàng ${row}, cột ${col}.`,d=>{const node=d.nodes.find(x=>x.id===id);if(node)node.status='open';d.marks=marksFor(n,positions)},[{target:`cell-${row}-${col}`,role:'queen'}],'search');
   if(row===n-1){
    solution=positions.slice() as number[];solutionLeaf=id;
    rec.step('found',`Đặt xong n=${n} quân hậu — tìm được nghiệm.`,d=>{d.marks=marksFor(n,positions);d.note='Tìm được nghiệm'},[],'done');
    return true;
   }
   if(place(row+1))return true;
   positions[row]=null;
   rec.step('backtrack',`Không hàng nào bên dưới hàng ${row} khả thi — quay lui.`,d=>{const node=d.nodes.find(x=>x.id===id);if(node)node.status='done';d.marks=marksFor(n,positions)},[{target:`cell-${row}-${col}`,role:'rejected'}],'search');
  }
  return false;
 }
 const ok=place(0);
 if(!ok)rec.step('done','Đã thử hết mọi cột ở hàng 0 — không có nghiệm.',d=>{d.note='Không có nghiệm'},[],'done');
 else if(solutionLeaf!==null)rec.step('done',`Hoàn tất với nghiệm hợp lệ gồm ${n} quân hậu.`,d=>{const node=d.nodes.find(x=>x.id===solutionLeaf);if(node)node.status='best';d.note='Hoàn tất'},[],'done');
 return pack(solution);
}
