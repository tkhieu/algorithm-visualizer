export const pseudocode = [
  {id: 'init', text: 'Khởi tạo độ bão hoà (số màu khác nhau ở các đỉnh kề) bằng 0', indent: 0},
  {id: 'pick', text: 'Chọn đỉnh chưa tô có độ bão hoà lớn nhất, hoà thì chọn bậc lớn hơn', indent: 0},
  {id: 'assign', text: 'Gán màu nhỏ nhất trong k màu chưa dùng ở các đỉnh kề đã tô', indent: 0},
  {id: 'fail', text: 'Nếu không còn màu nào khả dụng: báo không thể với k màu', indent: 1},
  {id: 'done', text: 'Trả về cách tô nếu tô được hết mọi đỉnh', indent: 0},
];
