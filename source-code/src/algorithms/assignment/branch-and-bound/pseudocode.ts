export const pseudocode = [
  {id: 'init', text: 'Cận dưới mỗi nhánh = chi phí đã gán + tổng chi phí nhỏ nhất của mỗi người còn lại', indent: 0},
  {id: 'pop', text: 'Lấy nhánh có cận dưới nhỏ nhất trong hàng chờ', indent: 0},
  {id: 'bound', text: 'Nếu cận dưới ≥ chi phí tốt nhất hiện tại: cắt nhánh', indent: 1},
  {id: 'branch', text: 'Gán một việc chưa dùng cho người tiếp theo, tính cận dưới mới', indent: 0},
  {id: 'leaf', text: 'Khi đã gán hết n người: so với chi phí tốt nhất hiện tại', indent: 0},
  {id: 'done', text: 'Trả về phân công có chi phí nhỏ nhất', indent: 0},
];
