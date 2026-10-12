export const pseudocode = [
  { id: 'table', text: 'Xây bảng dịch t(c) từ m−1 ký tự đầu của mẫu', indent: 0 },
  { id: 'shift', text: 'Đặt mẫu tại vị trí s', indent: 0 },
  { id: 'compare', text: 'So sánh từ phải sang trái P[j] với T[s+j]', indent: 1 },
  { id: 'match', text: 'Nếu khớp hết, ghi nhận vị trí s', indent: 1 },
  { id: 'shift-by', text: 'Dịch s theo t(T[s+m−1])', indent: 0 },
  { id: 'done', text: 'Trả về mọi vị trí đã ghi nhận', indent: 0 },
];
