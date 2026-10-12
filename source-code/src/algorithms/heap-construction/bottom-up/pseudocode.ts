export const pseudocode = [
  { id: 'heapify', text: 'for i ← ⌊n/2⌋-1 downto 0 do sift-down(A, i, n)', indent: 0 },
  { id: 'compare', text: 'So sánh A[i] với các con để tìm phần tử lớn nhất', indent: 1 },
  {
    id: 'swap',
    text: 'Nếu con lớn hơn: đổi chỗ A[i] với con đó, tiếp tục sift-down tại vị trí mới',
    indent: 1,
  },
  { id: 'done', text: 'Trả về mảng đã là max-heap', indent: 0 },
];
