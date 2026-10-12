export const pseudocode = [
  {id: 'init', text: 'Tô đỉnh theo thứ tự 0..n−1', indent: 0},
  {id: 'try', text: 'Thử màu c cho đỉnh hiện tại', indent: 0},
  {id: 'reject', text: 'Nếu c trùng màu một đỉnh kề đã tô: loại bỏ c', indent: 1},
  {id: 'place', text: 'Nếu c hợp lệ: gán màu, sang đỉnh kế tiếp', indent: 1},
  {id: 'backtrack', text: 'Nếu hết k màu mà không màu nào hợp lệ: quay lui', indent: 0},
  {id: 'done', text: 'Trả về cách tô nếu tô được hết n đỉnh, hoặc báo vô nghiệm', indent: 0},
];
