export const pseudocode = [
  { id: 'base', text: 'C(i,i) ← freq[i] với mọi i', indent: 0 },
  { id: 'fill', text: 'C(i,j) ← min trên k∈[i,j] của C(i,k−1)+C(k+1,j)+Σfreq[i..j]', indent: 0 },
  { id: 'done', text: 'Trả về C(0,n−1) và bảng chọn gốc', indent: 0 },
];
