import type {Verdict} from '../../core/contracts';import {inputSchema,outputSchema,type Input,type Output} from './definition';
type P={x:number;y:number};
function cross(o:P,a:P,b:P):number{return (a.x-o.x)*(b.y-o.y)-(a.y-o.y)*(b.x-o.x)}
export function check(input:Input,output:Output):Verdict{
 if(!inputSchema.safeParse(input).success)return {ok:false,reason:'Đầu vào không hợp lệ'};
 if(!outputSchema.safeParse(output).success)return {ok:false,reason:'Đầu ra sai định dạng'};
 const hull=output.hull;
 if(hull.length<3)return {ok:false,reason:'Bao lồi phải có ít nhất 3 đỉnh'};
 if(new Set(hull).size!==hull.length||hull.some(i=>i>=input.points.length))return {ok:false,reason:'Chỉ số đỉnh trùng hoặc ngoài phạm vi'};
 const pts=hull.map(i=>input.points[i]);
 let sign=0;
 for(let i=0;i<pts.length;i++){
  const a=pts[i],b=pts[(i+1)%pts.length],c=pts[(i+2)%pts.length];
  const cr=cross(a,b,c);
  if(cr!==0){const s=cr>0?1:-1;if(sign===0)sign=s;else if(s!==sign)return {ok:false,reason:'Các đỉnh không tạo thành đa giác lồi'}}
 }
 if(sign===0)return {ok:false,reason:'Bao lồi suy biến (các đỉnh thẳng hàng)'};
 for(const p of input.points){
  for(let i=0;i<pts.length;i++){
   const a=pts[i],b=pts[(i+1)%pts.length];
   const cr=cross(a,b,p);
   if(sign>0&&cr<0)return {ok:false,reason:'Có điểm nằm ngoài bao lồi'};
   if(sign<0&&cr>0)return {ok:false,reason:'Có điểm nằm ngoài bao lồi'};
  }
 }
 return {ok:true,optimal:true,score:pts.length};
}
