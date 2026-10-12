export const pseudocode = [
  { id: 'start', text: 'for mỗi khóa k cần chèn', indent: 0 },
  {
    id: 'descend',
    text: 'Đi từ gốc xuống lá, chọn nhánh con theo so sánh với các khóa của nút',
    indent: 1,
  },
  { id: 'exists', text: 'if k đã có trong lá then bỏ qua', indent: 1 },
  { id: 'insert-leaf', text: 'Thêm k vào lá (nút lá có 1 hoặc 2 khóa)', indent: 1 },
  {
    id: 'split',
    text: 'Nếu nút có 3 khóa: tách thành hai nút 1-khóa, đưa khóa giữa lên nút cha (lặp lại nếu cha cũng đầy)',
    indent: 1,
  },
  { id: 'done', text: 'Trả về tập khóa và độ cao cây', indent: 0 },
];
