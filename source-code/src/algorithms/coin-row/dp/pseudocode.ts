export const pseudocode=[
 {id:'init',text:'F(0) ← 0',indent:0},
 {id:'fill',text:'F(i) ← max(F(i−1), F(i−2)+cᵢ) với i=1..n',indent:0},
 {id:'take',text:'Truy vết: nếu F(i)≠F(i−1) thì chọn đồng xu i, i←i−2',indent:0},
 {id:'skip',text:'Ngược lại bỏ qua đồng xu i, i←i−1',indent:0},
 {id:'done',text:'Trả về F(n) và tập đã chọn',indent:0},
];
