import {z} from 'zod';
export const inputSchema = z.object({
  values: z.array(z.number().int().min(1).max(1000)).min(1).max(20),
  target: z.number().int().min(0).max(20000),
});
export const outputSchema = z.object({found: z.boolean(), indices: z.array(z.number().int().nonnegative())});
export type Input = z.infer<typeof inputSchema>;
export type Output = z.infer<typeof outputSchema>;
export const statement = `Cho một tập n số nguyên dương và một giá trị đích S. Hãy tìm một tập con các số có tổng đúng bằng S, hoặc báo không tồn tại.`;
export const constraints = ['1 ≤ n ≤ 20', '1 ≤ mỗi giá trị ≤ 1000', '0 ≤ S ≤ 20000'];
