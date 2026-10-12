export const pseudocode = [
  { id: 'compare', text: 'sift-down(A, i, heapSize): so sánh A[i] với các con', indent: 0 },
  { id: 'swap', text: 'Nếu con lớn hơn: đổi chỗ, tiếp tục sift-down tại vị trí mới', indent: 1 },
  { id: 'built', text: 'Xây max-heap từ dưới lên (bottom-up) trên toàn bộ mảng', indent: 0 },
  {
    id: 'extract',
    text: 'Lặp: đổi A[0] (lớn nhất) với A[cuối đoạn đống], giảm đoạn đống, sift-down(A, 0, heapSize)',
    indent: 0,
  },
  { id: 'done', text: 'Trả về dãy đã sắp', indent: 0 },
];
