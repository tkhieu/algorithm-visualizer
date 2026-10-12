import { z } from 'zod';
export const inputSchema = z.object({
  values: z.array(z.number().int().min(-500).max(500)).max(60),
});
export const outputSchema = z.object({ sorted: z.array(z.number().int()) });
export type Input = z.infer<typeof inputSchema>;
export type Output = z.infer<typeof outputSchema>;
export const statement = `Cho một dãy số nguyên. Hãy sắp xếp dãy theo thứ tự không giảm.`;
export const constraints = ['0 ≤ n ≤ 60', '-500 ≤ giá trị ≤ 500'];
