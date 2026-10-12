export const pseudocode = [
  { id: 'range', text: 'Tìm min, max của A; k ← max - min + 1 ngăn đếm', indent: 0 },
  { id: 'tally', text: 'for mỗi A[i] do count[A[i]-min] ← count[A[i]-min] + 1', indent: 0 },
  { id: 'place', text: 'for v ← 0 to k-1 do ghi v+min vào kết quả count[v] lần', indent: 0 },
  { id: 'done', text: 'Trả về dãy đã sắp', indent: 0 },
];
