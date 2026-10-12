import { z } from 'zod';
export const inputSchema = z
  .object({
    values: z.array(z.number().int().min(0).max(10000)).min(1).max(200),
    k: z.number().int().positive()
  })
  .refine((v) => v.k <= v.values.length, 'k không được vượt số phần tử');
export const outputSchema = z.object({ value: z.number().int().min(0).max(10000) });
export type Input = z.infer<typeof inputSchema>;
export type Output = z.infer<typeof outputSchema>;
export const statement =
  'Cho dãy n số nguyên và k (đếm từ 1). ' +
  'Hãy tìm giá trị đứng thứ k khi dãy được sắp xếp tăng, kể cả các giá trị trùng. ' +
  'Ví dụ: [7,2,5,2], k=2 → 2; [7,2,5], k=2 → 5.';
export const constraints = ['1 ≤ n ≤ 200', '1 ≤ k ≤ n', '0 ≤ giá trị ≤ 10000'];
