import {z} from 'zod';

export const pointSchema = z.object({
 x: z.number().int().min(-1000).max(1000),
 y: z.number().int().min(-1000).max(1000),
});
export const inputSchema = z.object({points: z.array(pointSchema).min(3).max(120)});
export const outputSchema = z.object({hull: z.array(z.number().int().nonnegative())});
export type Input = z.infer<typeof inputSchema>;
export type Output = z.infer<typeof outputSchema>;

export const statement = 'Cho n điểm trên mặt phẳng (giả sử không có ba điểm thẳng hàng). Hãy tìm bao lồi: ' +
 'đa giác lồi nhỏ nhất chứa tất cả các điểm, liệt kê các điểm đỉnh theo thứ tự quanh biên.';
export const constraints = ['3 ≤ n ≤ 120', 'Toạ độ nguyên trong [-1000, 1000]'];
