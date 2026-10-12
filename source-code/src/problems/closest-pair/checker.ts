import type {Verdict} from '../../core/contracts';import {inputSchema,outputSchema,type Input,type Output} from './definition';
function dist(a:{x:number;y:number},b:{x:number;y:number}):number{return Math.hypot(a.x-b.x,a.y-b.y)}
export function bruteForceClosest(input:Input):{i:number;j:number;distance:number}{
 const pts=input.points;let best=Infinity,bi=0,bj=1;
 for(let i=0;i<pts.length;i++)for(let j=i+1;j<pts.length;j++){const d=dist(pts[i],pts[j]);if(d<best){best=d;bi=i;bj=j}}
 return {i:bi,j:bj,distance:best};
}
export function check(input:Input,output:Output):Verdict{
 if(!inputSchema.safeParse(input).success)return {ok:false,reason:'Đầu vào không hợp lệ'};
 if(!outputSchema.safeParse(output).success)return {ok:false,reason:'Đầu ra sai định dạng'};
 if(output.i===output.j||output.i>=input.points.length||output.j>=input.points.length)return {ok:false,reason:'Chỉ số điểm không hợp lệ'};
 const actual=dist(input.points[output.i],input.points[output.j]);
 if(Math.abs(actual-output.distance)>1e-6)return {ok:false,reason:'Khoảng cách báo cáo không khớp với toạ độ'};
 const best=bruteForceClosest(input).distance;
 const optimal=Math.abs(actual-best)<=1e-6;
 return {ok:true,optimal,score:actual};
}
