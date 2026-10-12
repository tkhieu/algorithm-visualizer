export const pseudocode = [
  { id: 'start', text: 'Lập bảng vị trí cuối của ký tự xấu và bảng dịch hậu tố tốt', indent: 0 },
  { id: 'shift', text: 'Đặt mẫu tại vị trí s', indent: 0 },
  { id: 'compare', text: 'So sánh P[k] với T[s+k] từ phải sang trái', indent: 1 },
  { id: 'match', text: 'Nếu khớp hết, ghi nhận s', indent: 1 },
  { id: 'shift-by', text: 'Dịch max(k − last(T[s+k]), goodSuffix[k+1]); nếu khớp hết dùng goodSuffix[0]', indent: 0 },
  { id: 'done', text: 'Trả về mọi vị trí đã ghi nhận', indent: 0 },
];
