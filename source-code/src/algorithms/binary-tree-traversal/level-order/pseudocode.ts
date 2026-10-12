export const pseudocode = [
  { id: 'enqueue-root', text: 'Đưa gốc vào hàng đợi Q (nếu cây không rỗng)', indent: 0 },
  { id: 'dequeue', text: 'while Q không rỗng: lấy đỉnh v ở đầu Q', indent: 0 },
  { id: 'visit', text: 'Thăm v', indent: 1 },
  { id: 'enqueue-children', text: 'Đưa các con (nếu có) của v vào cuối Q', indent: 1 },
  { id: 'done', text: 'Trả về thứ tự thăm và độ cao', indent: 0 },
];
