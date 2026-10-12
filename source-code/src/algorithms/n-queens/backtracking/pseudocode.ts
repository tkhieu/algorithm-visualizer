export const pseudocode=[
{id:'init',text:'promising(row,col) ← kiểm tra cột và hai đường chéo với các hàng trước',indent:0},
{id:'try',text:'Thử đặt quân hậu ở (hàng, cột)',indent:0},
{id:'reject',text:'Nếu bị tấn công: loại bỏ cột này',indent:1},
{id:'place',text:'Nếu an toàn: đặt quân hậu, sang hàng kế tiếp',indent:1},
{id:'backtrack',text:'Nếu không còn cột khả thi: quay lui hàng trước',indent:0},
{id:'found',text:'Nếu đã đặt hết n hàng: trả về nghiệm',indent:0},
{id:'done',text:'Nếu quay lui khỏi hàng 0: không có nghiệm',indent:0},
];
