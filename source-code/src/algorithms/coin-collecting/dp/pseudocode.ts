export const pseudocode = [
  { id: 'init', text: 'F(0,0) ← coin(0,0)', indent: 0 },
  { id: 'fill', text: 'F(i,j) ← coin(i,j) + max(F(i−1,j), F(i,j−1))', indent: 0 },
  { id: 'trace', text: 'Truy vết từ (n−1,m−1) theo hướng cho giá trị lớn hơn', indent: 0 },
  { id: 'done', text: 'Trả về F(n−1,m−1) và đường đi', indent: 0 },
];
