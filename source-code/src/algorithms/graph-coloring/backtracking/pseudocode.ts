export const pseudocode = [
  {id: 'init', text: 'Tô đỉnh theo thứ tự 0..n−1', indent: 0},
  {id: 'reject', text: 'Thử màu c cho đỉnh hiện tại; nếu trùng màu một đỉnh kề đã tô: loại bỏ c', indent: 1},
  {id: 'place', text: 'Nếu c hợp lệ: gán màu, sang đỉnh kế tiếp', indent: 1},
  {id: 'backtrack', text: 'Nếu hết k màu mà không màu nào hợp lệ: quay lui', indent: 0},
  {id: 'done', text: 'Trả về cách tô nếu tô được hết n đỉnh, hoặc báo vô nghiệm', indent: 0},
  {id: 'lowerBound', text: 'Chế độ χ(G): tìm một clique bằng tham lam để có chặn dưới', indent: 0},
  {id: 'upperBound', text: 'Chế độ χ(G): tô bằng DSATUR để có chặn trên', indent: 0},
  {id: 'tryK', text: 'Chế độ χ(G): tăng k từ chặn dưới, quay lui kiểm tra khả thi với từng k', indent: 0},
  {id: 'foundChromatic', text: 'Chế độ χ(G): k nhỏ nhất khả thi chính là χ(G)', indent: 0},
];
