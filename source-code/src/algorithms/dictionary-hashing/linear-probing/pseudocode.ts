export const pseudocode = [
  { id: 'hash', text: 'h(k) ← k mod m', indent: 0 },
  {
    id: 'probe',
    text: 'while ngăn hiện tại đã có khóa: sang ngăn kế tiếp (có xoay vòng)',
    indent: 0,
  },
  { id: 'full', text: 'Nếu dò hết m ngăn mà không trống: bảng đầy, bỏ qua k', indent: 1 },
  { id: 'insert', text: 'Chèn k vào ngăn trống tìm được', indent: 0 },
  { id: 'done', text: 'Lặp lại cho mọi khóa còn lại', indent: 0 },
];
