export const pseudocode = [
  {id: 'init', text: 'Cận dưới mỗi nhánh = độ dài đã đi + (số điểm còn lại) × cạnh ngắn nhất toàn cục', indent: 0},
  {id: 'pop', text: 'Lấy nhánh có cận dưới nhỏ nhất trong hàng chờ', indent: 0},
  {id: 'bound', text: 'Nếu cận dưới ≥ độ dài tốt nhất hiện tại: cắt nhánh', indent: 1},
  {id: 'branch', text: 'Mở rộng sang một điểm chưa thăm, tính cận dưới mới', indent: 0},
  {id: 'leaf', text: 'Khi đã thăm hết mọi điểm: so với hành trình tốt nhất hiện tại', indent: 0},
  {id: 'done', text: 'Trả về hành trình ngắn nhất tìm được', indent: 0},
];
