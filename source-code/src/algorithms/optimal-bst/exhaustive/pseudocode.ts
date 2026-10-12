export const pseudocode=[
 {id:'try',text:'solve(i,j): nếu i>j trả 0; ngược lại thử mọi k∈[i,j] làm gốc',indent:0},
 {id:'best',text:'C(i,j) ← min trên k của solve(i,k−1)+solve(k+1,j)+Σfreq[i..j]',indent:1},
 {id:'done',text:'Trả về solve(0,n−1) và bảng chọn gốc',indent:0},
];
