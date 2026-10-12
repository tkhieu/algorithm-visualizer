export const pseudocode = [
  {id: 'init', text: 'Cố định đỉnh xuất phát; sinh mọi hoán vị của các đỉnh còn lại', indent: 0},
  {id: 'assign', text: 'Xếp đỉnh tiếp theo vào vị trí hiện tại của hoán vị', indent: 0},
  {id: 'leaf', text: 'Khi hoán vị đầy đủ: kiểm tra mọi cạnh liên tiếp và cạnh khép vòng', indent: 0},
  {id: 'check', text: 'Nếu mọi cạnh tồn tại: đây là chu trình Hamilton', indent: 1},
  {id: 'done', text: 'Trả về nghiệm đầu tiên tìm được, hoặc báo vô nghiệm', indent: 0},
];
