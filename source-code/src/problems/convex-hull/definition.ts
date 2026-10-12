import { z } from 'zod';

export const pointSchema = z.object({
  x: z.number().int().min(-1000).max(1000),
  y: z.number().int().min(-1000).max(1000),
});
export const inputSchema = z.object({ points: z.array(pointSchema).min(1).max(120) });
export const outputSchema = z.object({ hull: z.array(z.number().int().nonnegative()) });
export type Input = z.infer<typeof inputSchema>;
export type Output = z.infer<typeof outputSchema>;

export const statement =
  'Cho n điểm trên mặt phẳng (giả sử không có ba điểm thẳng hàng). Hãy tìm bao lồi: ' +
  'tập đỉnh cực biên theo thứ tự quanh biên. Điểm trùng chỉ lấy chỉ số đầu tiên; nếu thẳng hàng chỉ lấy hai đầu mút.';
export const constraints = ['1 ≤ n ≤ 120', 'Toạ độ nguyên trong [-1000, 1000]'];
