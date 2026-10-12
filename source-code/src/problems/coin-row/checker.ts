import type {Verdict} from '../../core/contracts';import {inputSchema,outputSchema,type Input,type Output} from './definition';
export function optimum(values:number[]):number{
 const n=values.length;const dp=new Array<number>(n+1).fill(0);
 if(n>=1)dp[1]=values[0];
 for(let i=2;i<=n;i++)dp[i]=Math.max(dp[i-1],dp[i-2]+values[i-1]);
 return dp[n];
}
export function check(input:Input,output:Output):Verdict{
 if(!inputSchema.safeParse(input).success)return {ok:false,reason:'Đầu vào không hợp lệ'};
 if(!outputSchema.safeParse(output).success)return {ok:false,reason:'Đầu ra sai định dạng'};
 const sel=output.selected;
 if(new Set(sel).size!==sel.length||sel.some(i=>i>=input.values.length))return {ok:false,reason:'Chỉ số đồng xu trùng hoặc ngoài phạm vi'};
 const sorted=[...sel].sort((a,b)=>a-b);
 for(let k=0;k+1<sorted.length;k++)if(sorted[k+1]-sorted[k]<2)return {ok:false,reason:'Có hai đồng xu liền kề cùng được chọn'};
 const sum=sel.reduce((s,i)=>s+input.values[i],0);
 if(sum!==output.value)return {ok:false,reason:'Tổng giá trị không khớp với tập chọn'};
 const best=optimum(input.values);
 return {ok:true,optimal:output.value===best,score:output.value,ratio:best===0?1:output.value/best};
}
