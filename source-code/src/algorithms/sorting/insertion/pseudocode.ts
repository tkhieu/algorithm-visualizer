export const pseudocode = [
  { id: 'start', text: 'for i ← 1 to n-1 do khóa ← A[i]', indent: 0 },
  { id: 'compare', text: 'j ← i-1; while j ≥ 0 và A[j] > khóa', indent: 1 },
  { id: 'shift', text: 'A[j+1] ← A[j]; j ← j-1', indent: 2 },
  { id: 'place', text: 'A[j+1] ← khóa', indent: 1 },
  { id: 'done', text: 'Trả về dãy đã sắp', indent: 0 },
];
