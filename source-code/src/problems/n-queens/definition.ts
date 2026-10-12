import {z} from 'zod';
export const inputSchema = z.object({n: z.number().int().min(1).max(12)});
export const outputSchema = z.object({found: z.boolean(), positions: z.array(z.number().int().nonnegative())});
export type Input = z.infer<typeof inputSchema>;
export type Output = z.infer<typeof outputSchema>;
export const statement =
  `Cho một bàn cờ n×n. Hãy đặt n quân hậu lên bàn cờ sao cho không có hai quân hậu nào cùng hàng, ` +
  `cùng cột hoặc cùng đường chéo. Trả về một cách đặt hợp lệ nếu có, hoặc báo không tồn tại.`;
export const constraints = ['1 ≤ n ≤ 12'];
