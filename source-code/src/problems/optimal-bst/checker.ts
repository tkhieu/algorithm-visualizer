import type {Verdict} from '../../core/contracts';import {inputSchema,outputSchema,type Input,type Output} from './definition';
export function optimum(freq:number[]):number{
 const n=freq.length;
 const prefix=[0];for(let i=0;i<n;i++)prefix.push(prefix[i]+freq[i]);
 const cost=Array.from({length:n},()=>new Array<number>(n).fill(0));
 for(let len=1;len<=n;len++){
  for(let i=0;i+len-1<n;i++){
   const j=i+len-1;
   let best=Infinity;
   for(let k=i;k<=j;k++){
    const left=k>i?cost[i][k-1]:0;
    const right=k<j?cost[k+1][j]:0;
    const c=left+right+(prefix[j+1]-prefix[i]);
    if(c<best)best=c;
   }
   cost[i][j]=best;
  }
 }
 return cost[0][n-1];
}
function subtreeCost(freq:number[],roots:number[][],i:number,j:number,depth:number):{cost:number;ok:boolean}{
 if(i>j)return {cost:0,ok:true};
 const r=roots[i]?.[j];
 if(r===undefined||r<i||r>j)return {cost:0,ok:false};
 const sumFreq=freq.slice(i,j+1).reduce((s,f)=>s+f,0);
 const left=subtreeCost(freq,roots,i,r-1,depth+1);
 const right=subtreeCost(freq,roots,r+1,j,depth+1);
 return {cost:sumFreq+left.cost+right.cost,ok:left.ok&&right.ok};
}
export function check(input:Input,output:Output):Verdict{
 if(!inputSchema.safeParse(input).success)return {ok:false,reason:'Đầu vào không hợp lệ'};
 if(!outputSchema.safeParse(output).success)return {ok:false,reason:'Đầu ra sai định dạng'};
 const n=input.freq.length;
 const {cost,ok}=subtreeCost(input.freq,output.roots,0,n-1,1);
 if(!ok)return {ok:false,reason:'Bảng chọn gốc không hợp lệ'};
 if(cost!==output.cost)return {ok:false,reason:'Chi phí báo cáo không khớp với bảng chọn gốc'};
 const best=optimum(input.freq);
 return {ok:true,optimal:output.cost===best,score:output.cost};
}
