import { z } from 'zod';
export const inputSchema = z.object({
  base: z.number().int().min(-12).max(12),
  exponent: z.number().int().min(0).max(60)
});
export const outputSchema = z.object({ value: z.string().regex(/^-?(0|[1-9][0-9]*)$/) });
export type Input = z.infer<typeof inputSchema>;
export type Output = z.infer<typeof outputSchema>;
export const statement =
  'Cho số nguyên a và số mũ nguyên không âm n. Hãy tính chính xác aⁿ; quy ước a⁰=1, kể cả 0⁰. Trả kết quả bằng chuỗi thập phân. Ví dụ: 2⁵ → 32; (−2)³ → −8.';
export const constraints = ['−12 ≤ a ≤ 12', '0 ≤ n ≤ 60', 'Kết quả dạng chuỗi để giữ độ chính xác'];
