export const pseudocode = [
  { id: 'pivot', text: 'Chọn chốt p = A[hi]', indent: 0 },
  { id: 'compare', text: 'for j ← lo to hi-1 do so sánh A[j] với p', indent: 0 },
  { id: 'swap', text: 'Nếu A[j] < p: đổi chỗ để dồn phần tử nhỏ hơn p về đầu', indent: 1 },
  { id: 'partitioned', text: 'Đặt chốt vào vị trí phân hoạch; đệ quy trên hai phần', indent: 0 },
  { id: 'done', text: 'Trả về dãy đã sắp', indent: 0 },
];
