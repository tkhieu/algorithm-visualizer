import type {Verdict} from '../../core/contracts';import {inputSchema,outputSchema,type Input,type Output} from './definition';
export function optimum(grid:boolean[][]):number{
 const rows=grid.length,cols=grid[0].length;
 const dp=Array.from({length:rows},()=>new Array<number>(cols).fill(0));
 for(let i=0;i<rows;i++)for(let j=0;j<cols;j++){
  const coin=grid[i][j]?1:0;
  if(i===0&&j===0){dp[i][j]=coin;continue}
  const up=i>0?dp[i-1][j]:-Infinity;
  const left=j>0?dp[i][j-1]:-Infinity;
  dp[i][j]=coin+Math.max(up,left);
 }
 return dp[rows-1][cols-1];
}
export function check(input:Input,output:Output):Verdict{
 if(!inputSchema.safeParse(input).success)return {ok:false,reason:'Đầu vào không hợp lệ'};
 if(!outputSchema.safeParse(output).success)return {ok:false,reason:'Đầu ra sai định dạng'};
 const rows=input.grid.length,cols=input.grid[0].length;
 const path=output.path;
 if(path.length!==rows+cols-1)return {ok:false,reason:'Độ dài đường đi không đúng'};
 if(path[0][0]!==0||path[0][1]!==0)return {ok:false,reason:'Đường đi phải bắt đầu tại (0,0)'};
 if(path[path.length-1][0]!==rows-1||path[path.length-1][1]!==cols-1)return {ok:false,reason:'Đường đi phải kết thúc tại ô cuối'};
 for(let k=0;k+1<path.length;k++){
  const [r1,c1]=path[k],[r2,c2]=path[k+1];
  const right=r2===r1&&c2===c1+1;
  const down=c2===c1&&r2===r1+1;
  if(!right&&!down)return {ok:false,reason:'Mỗi bước phải đi sang phải hoặc xuống dưới'};
 }
 const sum=path.reduce((s,[r,c])=>s+(input.grid[r][c]?1:0),0);
 if(sum!==output.value)return {ok:false,reason:'Số đồng xu không khớp đường đi'};
 const best=optimum(input.grid);
 return {ok:true,optimal:output.value===best,score:output.value};
}
