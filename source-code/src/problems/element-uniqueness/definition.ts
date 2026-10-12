import { z } from 'zod';
export const inputSchema = z.object({
  values: z.array(z.number().int().min(-500).max(500)).max(80),
});
export const outputSchema = z.object({
  unique: z.boolean(),
  duplicate: z.number().int().nullable(),
  /** Số lần `duplicate` xuất hiện trong dãy — tuỳ chọn, chỉ các thuật toán tìm mode mới báo. */
  duplicateCount: z.number().int().min(2).optional(),
});
export type Input = z.infer<typeof inputSchema>;
export type Output = z.infer<typeof outputSchema>;
export const statement = `Cho một dãy gồm n số nguyên. Hãy xác định dãy có chứa hai phần tử bằng nhau hay không; nếu có, chỉ ra một giá trị bị lặp lại.`;
export const constraints = ['0 ≤ n ≤ 80', '-500 ≤ giá trị ≤ 500'];
