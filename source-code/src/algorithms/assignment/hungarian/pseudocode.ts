export const pseudocode = [
  {id: 'init', text: 'Khởi tạo thế vị u[i] = v[j] = 0 cho mọi hàng/cột', indent: 0},
  {id: 'worker', text: 'Với mỗi người i chưa ghép: tìm đường tăng cường từ i qua các cạnh có chi phí rút gọn = 0', indent: 0},
  {id: 'relax', text: 'Cập nhật thế vị theo chênh lệch nhỏ nhất để mở thêm cạnh 0 mới', indent: 1},
  {id: 'augment', text: 'Khi tìm được cột chưa ghép: lật đường tăng cường để ghép người i', indent: 1},
  {id: 'done', text: 'Trả về ghép cặp hoàn hảo với tổng chi phí nhỏ nhất', indent: 0},
];
