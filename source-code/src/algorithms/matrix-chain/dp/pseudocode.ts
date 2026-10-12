export const pseudocode = [
  {id: 'init', text: 'dp[i][i] ← 0 cho mọi i (chuỗi một ma trận không cần nhân)', indent: 0},
  {id: 'cell', text: 'dp[i][j] ← min trên k của dp[i][k] + dp[k+1][j] + dims[i-1]·dims[k]·dims[j]', indent: 0},
  {id: 'split', text: 'Lưu điểm chia k tốt nhất cho đoạn [i,j]', indent: 1},
  {id: 'build', text: 'Dựng lại cách đặt ngoặc từ bảng điểm chia', indent: 0},
  {id: 'done', text: 'Trả về dp[1][n] và cách đặt ngoặc tương ứng', indent: 0},
];
