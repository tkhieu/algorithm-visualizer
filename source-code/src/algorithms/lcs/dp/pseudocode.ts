export const pseudocode = [
  {id: 'init', text: 'dp[i][0] = dp[0][j] = 0 cho mọi i, j (chuỗi rỗng không có dãy con chung)', indent: 0},
  {id: 'match', text: 'Nếu a[i-1] = b[j-1]: dp[i][j] = dp[i-1][j-1] + 1', indent: 0},
  {id: 'mismatch', text: 'Ngược lại: dp[i][j] = max(dp[i-1][j], dp[i][j-1])', indent: 0},
  {id: 'backtrack', text: 'Truy vết từ dp[n][m] để dựng lại một dãy con chung dài nhất', indent: 0},
  {id: 'done', text: 'Trả về dp[n][m] và dãy con chung tương ứng', indent: 0},
];
