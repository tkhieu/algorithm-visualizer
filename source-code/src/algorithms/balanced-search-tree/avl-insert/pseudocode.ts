export const pseudocode = [
  { id: 'start', text: 'for mỗi khóa k cần chèn', indent: 0 },
  { id: 'exists', text: 'if k đã có trong cây then bỏ qua', indent: 1 },
  {
    id: 'compare',
    text: 'while chưa tới lá: so sánh k với đỉnh hiện tại, rẽ trái/phải',
    indent: 1,
  },
  { id: 'insert', text: 'Chèn k làm lá mới', indent: 1 },
  {
    id: 'rebalance',
    text: 'Đi lên theo đường chèn: cập nhật độ cao, nếu |cân bằng| > 1 thì xoay đơn/kép',
    indent: 1,
  },
  { id: 'done', text: 'Trả về tập khóa và độ cao cây', indent: 0 },
];
