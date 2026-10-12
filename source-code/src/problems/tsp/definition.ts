import {z} from 'zod';

export const inputSchema = z.object({
  points: z
    .array(z.object({x: z.number().min(-1000).max(1000), y: z.number().min(-1000).max(1000)}))
    .min(1)
    .max(30),
});
export const outputSchema = z.object({
  tour: z.array(z.number().int().nonnegative()),
  length: z.number().nonnegative(),
});
export type Input = z.infer<typeof inputSchema>;
export type Output = z.infer<typeof outputSchema>;

export const statement =
  `Cho n thành phố trên mặt phẳng, mỗi thành phố là một điểm (x, y). Người du lịch phải xuất phát ` +
  `từ một thành phố, đi qua tất cả các thành phố còn lại đúng một lần rồi quay về thành phố xuất phát. ` +
  `Hãy tìm một hành trình (chu trình) có tổng độ dài (khoảng cách Euclid) nhỏ nhất, hoặc một hành trình ` +
  `tốt nếu dùng thuật toán xấp xỉ.`;
export const constraints = ['1 ≤ n ≤ 30', '-1000 ≤ x, y ≤ 1000'];
