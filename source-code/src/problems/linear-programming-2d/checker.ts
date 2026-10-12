import type {Verdict} from '../../core/contracts';import {inputSchema,outputSchema,type Input,type Output} from './definition';
const EPS=1e-6;
export type Line={a:number;b:number;c:number};
export function allLines(input:Input):Line[]{return [{a:-1,b:0,c:0},{a:0,b:-1,c:0},...input.constraints]}
function satisfiesAll(lines:Line[],x:number,y:number):boolean{return lines.every(l=>l.a*x+l.b*y<=l.c+1e-4)}
export function feasibleVertices(input:Input):{x:number;y:number}[]{
 const lines=allLines(input);
 const pts:{x:number;y:number}[]=[];
 for(let i=0;i<lines.length;i++){
  for(let j=i+1;j<lines.length;j++){
   const l1=lines[i],l2=lines[j];
   const det=l1.a*l2.b-l2.a*l1.b;
   if(Math.abs(det)<EPS)continue;
   const x=(l1.c*l2.b-l2.c*l1.b)/det;
   const y=(l1.a*l2.c-l2.a*l1.c)/det;
   if(satisfiesAll(lines,x,y))pts.push({x,y});
  }
 }
 const dedup:{x:number;y:number}[]=[];
 for(const p of pts)if(!dedup.some(q=>Math.abs(q.x-p.x)<1e-4&&Math.abs(q.y-p.y)<1e-4))dedup.push(p);
 return dedup;
}
export function optimum(input:Input):{x:number;y:number;value:number}{
 const vertices=feasibleVertices(input);
 let best={x:0,y:0,value:-Infinity};
 for(const v of vertices){
  const value=input.objective.cx*v.x+input.objective.cy*v.y;
  if(value>best.value)best={x:v.x,y:v.y,value};
 }
 return best;
}
export function check(input:Input,output:Output):Verdict{
 if(!inputSchema.safeParse(input).success)return {ok:false,reason:'Đầu vào không hợp lệ'};
 if(!outputSchema.safeParse(output).success)return {ok:false,reason:'Đầu ra sai định dạng'};
 if(!satisfiesAll(allLines(input),output.x,output.y))return {ok:false,reason:'Điểm trả về nằm ngoài miền khả thi'};
 const expectedValue=input.objective.cx*output.x+input.objective.cy*output.y;
 if(Math.abs(expectedValue-output.value)>1e-3)return {ok:false,reason:'Giá trị mục tiêu không khớp với (x,y)'};
 const best=optimum(input).value;
 return {ok:true,optimal:Math.abs(output.value-best)<=1e-3,score:output.value};
}
