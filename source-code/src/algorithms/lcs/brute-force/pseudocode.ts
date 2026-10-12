export const pseudocode = [
  {id: 'check', text: 'solve(i,j): nếu i=0 hoặc j=0 trả về chuỗi rỗng', indent: 0},
  {id: 'branch', text: 'Nếu a[i-1] = b[j-1]: trả về solve(i-1,j-1) nối thêm ký tự đó', indent: 0},
  {id: 'compare', text: 'Ngược lại: đệ quy giải solve(i-1,j) và solve(i,j-1), không nhớ kết quả, chọn dãy dài hơn', indent: 0},
  {id: 'done', text: 'Trả về solve(n,m) — độ phức tạp mũ O(2^(n+m)) vì không nhớ các lời gọi lặp lại', indent: 0},
];
