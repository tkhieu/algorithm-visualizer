import { z } from 'zod';
export const inputSchema = z.object({
  n: z.number().int().min(1).max(200),
  k: z.number().int().min(1).max(200)
});
export const outputSchema = z.object({ survivor: z.number().int().positive() });
export type Input = z.infer<typeof inputSchema>;
export type Output = z.infer<typeof outputSchema>;
export const statement =
  'Có n người mang số 1 đến n ngồi thành vòng tròn. ' +
  'Bắt đầu từ người 1, cứ đếm k người thì loại một người và tiếp tục từ người kế tiếp. ' +
  'Hãy tìm số của người sống sót. Ví dụ: (7,3) → 4; (1,5) → 1.';
export const constraints = ['1 ≤ n, k ≤ 200'];
