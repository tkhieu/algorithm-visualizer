export const pseudocode = [
  {id: 'call', text: 'solve(i,j): nếu i=0 hoặc j=0 trả về 0; nếu đã nhớ thì trả về giá trị đã lưu', indent: 0},
  {id: 'match', text: 'Nếu a[i-1] = b[j-1]: kết quả = solve(i-1,j-1) + 1', indent: 0},
  {id: 'mismatch', text: 'Ngược lại: kết quả = max(solve(i-1,j), solve(i,j-1))', indent: 0},
  {id: 'memoize', text: 'Lưu kết quả vào bảng nhớ trước khi trả về', indent: 1},
  {id: 'backtrack', text: 'Truy vết trên bảng nhớ để dựng lại dãy con chung', indent: 0},
  {id: 'done', text: 'Trả về solve(n,m) và dãy con chung tương ứng', indent: 0},
];
