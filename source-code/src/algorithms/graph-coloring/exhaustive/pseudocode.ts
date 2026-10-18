export const pseudocode = [
  {id: 'init', text: 'Sinh mọi cách tô (mỗi đỉnh chọn một trong k màu, kⁿ cách)', indent: 0},
  {id: 'assign', text: 'Gán màu cho đỉnh hiện tại', indent: 0},
  {id: 'check', text: 'Khi đã gán hết n đỉnh: kiểm tra toàn bộ đồ thị — nếu không có hai đỉnh kề cùng màu, đây là nghiệm', indent: 1},
  {id: 'done', text: 'Trả về nghiệm đầu tiên tìm được, hoặc báo vô nghiệm', indent: 0},
  {id: 'tryK', text: 'Chế độ χ(G): thử k = 1, 2, … và vét cạn lại với mỗi k', indent: 0},
  {id: 'foundChromatic', text: 'Chế độ χ(G): k nhỏ nhất khả thi chính là χ(G)', indent: 0},
];
