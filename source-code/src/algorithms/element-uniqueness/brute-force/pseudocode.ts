export const pseudocode = [
  { id: 'init', text: 'Xét mảng A[0..n-1]', indent: 0 },
  {
    id: 'compare',
    text: 'for i ← 0 to n-2 do for j ← i+1 to n-1 do so sánh A[i], A[j]',
    indent: 0,
  },
  { id: 'found', text: 'if A[i] = A[j] then trả về "trùng tại A[i]"', indent: 1 },
  { id: 'done', text: 'hết vòng lặp: trả về "duy nhất"', indent: 0 },
];
