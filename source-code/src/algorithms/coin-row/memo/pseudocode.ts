export const pseudocode = [
  { id: 'call', text: 'F(i): nếu chưa tính, gọi đệ quy', indent: 0 },
  { id: 'memo-hit', text: 'Nếu F(i) đã nhớ, trả về ngay', indent: 1 },
  { id: 'compute', text: 'F(i) ← max(F(i−1), F(i−2)+cᵢ); lưu vào bộ nhớ', indent: 1 },
  { id: 'take', text: 'Truy vết: nếu F(i)≠F(i−1) thì chọn đồng xu i, i←i−2', indent: 0 },
  { id: 'skip', text: 'Ngược lại bỏ qua đồng xu i, i←i−1', indent: 0 },
  { id: 'done', text: 'Trả về F(n) và tập đã chọn', indent: 0 },
];
