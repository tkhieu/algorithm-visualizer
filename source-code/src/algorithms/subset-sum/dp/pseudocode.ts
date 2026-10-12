export const pseudocode=[
{id:'init',text:'dp[0][0] ← true; dp[0][s] ← false với s > 0',indent:0},
{id:'cell',text:'dp[i][s] ← dp[i−1][s] OR (s ≥ giá trị[i] AND dp[i−1][s−giá trị[i]])',indent:0},
{id:'backtrack',text:'Truy vết từ dp[n][S] để lấy tập con',indent:0},
{id:'done',text:'Trả về tập con nếu dp[n][S] = true',indent:0},
];
