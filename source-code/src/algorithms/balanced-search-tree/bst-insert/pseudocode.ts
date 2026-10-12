export const pseudocode = [
  { id: 'start', text: 'for mỗi khóa k cần chèn', indent: 0 },
  { id: 'exists', text: 'if k đã có trong cây then bỏ qua', indent: 1 },
  {
    id: 'compare',
    text: 'while chưa tới lá: so sánh k với đỉnh hiện tại, rẽ trái/phải',
    indent: 1,
  },
  { id: 'insert', text: 'Chèn k làm lá mới tại vị trí rẽ tới', indent: 1 },
  { id: 'done', text: 'Trả về tập khóa và độ cao cây', indent: 0 },
];
