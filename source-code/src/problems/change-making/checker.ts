import type {Verdict} from '../../core/contracts';import {inputSchema,outputSchema,type Input,type Output} from './definition';
export function optimum(amount:number,coins:number[]):number{
 const dp=new Array<number>(amount+1).fill(Infinity);
 dp[0]=0;
 for(let x=1;x<=amount;x++)for(const c of coins)if(c<=x&&dp[x-c]+1<dp[x])dp[x]=dp[x-c]+1;
 return dp[amount];
}
export function check(input:Input,output:Output):Verdict{
 if(!inputSchema.safeParse(input).success)return {ok:false,reason:'Đầu vào không hợp lệ'};
 if(!outputSchema.safeParse(output).success)return {ok:false,reason:'Đầu ra sai định dạng'};
 const coinSet=new Set(input.coins);
 if(output.coins.some(c=>!coinSet.has(c)))return {ok:false,reason:'Dùng mệnh giá không có trong danh sách'};
 if(output.coins.length!==output.count)return {ok:false,reason:'Số lượng không khớp danh sách đồng xu'};
 const sum=output.coins.reduce((s,c)=>s+c,0);
 if(sum!==input.amount)return {ok:false,reason:'Tổng không bằng số tiền cần đổi'};
 const best=optimum(input.amount,input.coins);
 return {ok:true,optimal:output.count===best,score:output.count,ratio:best===0?1:best/output.count};
}
