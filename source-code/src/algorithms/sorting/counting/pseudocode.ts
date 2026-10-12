export const pseudocode = [
  { id: 'range', text: 'Tìm min, max của A; k ← max - min + 1 ngăn đếm', indent: 0 },
  { id: 'tally', text: 'for mỗi A[i] do D[A[i]-min] ← D[A[i]-min] + 1  (tần suất)', indent: 0 },
  { id: 'distribute', text: 'for j ← 1 to k-1 do D[j] ← D[j] + D[j-1]  (phân phối tích lũy)', indent: 0 },
  {
    id: 'place',
    text: 'for i ← n-1 downto 0 do: j ← A[i]-min; D[j] ← D[j]-1; S[D[j]] ← A[i]',
    indent: 0,
  },
  { id: 'done', text: 'Trả về dãy đã sắp S (ổn định)', indent: 0 },
];
