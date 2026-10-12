export const pseudocode = [
  { id: 'start', text: 'Thêm biến dư; thêm biến giả khi vế phải âm và lập bảng đơn hình', indent: 0 },
  { id: 'phase-one', text: 'Pha I: tối đa hoá đối của tổng biến giả để tìm cơ sở khả thi', indent: 0 },
  {
    id: 'pivot',
    text: 'Chọn biến vào chỉ số nhỏ nhất (Bland); chọn biến ra bằng tỉ số nhỏ nhất, rồi pivot',
    indent: 1,
  },
  { id: 'infeasible', text: 'Nếu pha I còn biến giả dương, báo không khả thi', indent: 0 },
  { id: 'phase-two', text: 'Pha II: thay hàm mục tiêu và tiếp tục pivot', indent: 0 },
  { id: 'unbounded', text: 'Nếu biến vào không có biến ra, báo không bị chặn', indent: 0 },
  { id: 'done', text: 'Đọc nghiệm tối ưu và giá trị mục tiêu từ bảng cuối', indent: 0 },
];
