export const pseudocode=[
 {id:'start',text:'Sắp điểm theo x',indent:0},
 {id:'split',text:'Chia tại đường thẳng x = midX thành hai nửa',indent:0},
 {id:'compare',text:'Giải đệ quy cho nhóm cơ sở (≤ 3 điểm): so từng cặp',indent:1},
 {id:'merge',text:'best ← nhỏ hơn giữa kết quả hai nửa',indent:0},
 {id:'strip',text:'Xét dải |x − midX| < best, sắp theo y, so các điểm gần nhau',indent:0},
 {id:'better',text:'Nếu tìm được cặp gần hơn trong dải, cập nhật best',indent:1},
 {id:'done',text:'Trả về best',indent:0},
];
