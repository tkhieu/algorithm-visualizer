export const pseudocode = [
  { id: 'push', text: 'Thêm phần tử mới vào cuối mảng', indent: 0 },
  { id: 'compare', text: 'while chưa tới gốc: so sánh phần tử với cha', indent: 1 },
  {
    id: 'swap',
    text: 'Nếu con lớn hơn cha: đổi chỗ (sift-up), tiếp tục với vị trí mới',
    indent: 1,
  },
  { id: 'done', text: 'Lặp lại cho mọi phần tử; trả về mảng đã là max-heap', indent: 0 },
];
