export const pseudocode = [
  {id: 'call', text: 'solve(i,j): nếu i=j trả về 0; nếu đã nhớ thì trả về giá trị đã lưu', indent: 0},
  {id: 'try', text: 'Thử mọi điểm chia k ∈ [i,j-1]: solve(i,k) + solve(k+1,j) + dims[i-1]·dims[k]·dims[j]', indent: 0},
  {id: 'memoize', text: 'Lưu kết quả nhỏ nhất và điểm chia tốt nhất vào bảng nhớ', indent: 1},
  {id: 'build', text: 'Dựng lại cách đặt ngoặc từ bảng điểm chia', indent: 0},
  {id: 'done', text: 'Trả về solve(1,n) và cách đặt ngoặc tương ứng', indent: 0},
];
