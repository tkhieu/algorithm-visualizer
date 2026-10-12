export const pseudocode = [
  {id: 'init', text: 'solve(i,j): nếu i=j trả về đặt ngoặc "Ai" với chi phí 0', indent: 0},
  {id: 'try', text: 'Với mỗi điểm chia k ∈ [i,j-1]: đệ quy giải hai nửa [i,k] và [k+1,j] rồi ghép', indent: 0},
  {id: 'compare', text: 'So sánh với cách đặt ngoặc tốt nhất đã tìm được cho đoạn [i,j]', indent: 1},
  {id: 'done', text: 'Trả về cách đặt ngoặc có chi phí nhỏ nhất cho toàn chuỗi', indent: 0},
];
