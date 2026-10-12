import { z } from 'zod';
export const inputSchema = z.object({
  values: z.array(z.number().int().min(-500).max(500)).max(40),
});
export const outputSchema = z.object({ heap: z.array(z.number().int()) });
export type Input = z.infer<typeof inputSchema>;
export type Output = z.infer<typeof outputSchema>;
export const statement =
  `Cho một dãy số nguyên. Hãy xây dựng một đống lớn (max-heap) chứa đúng các giá trị ` +
  `này, lưu dưới dạng mảng theo chỉ số chuẩn (con trái của i là 2i+1, con phải là 2i+2).`;
export const constraints = ['0 ≤ n ≤ 40', '-500 ≤ giá trị ≤ 500'];
