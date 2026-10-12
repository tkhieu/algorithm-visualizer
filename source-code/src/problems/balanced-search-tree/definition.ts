import { z } from 'zod';
export const inputSchema = z.object({ keys: z.array(z.number().int().min(-999).max(999)).max(24) });
export const outputSchema = z.object({
  values: z.array(z.number().int()),
  height: z.number().int(),
});
export type Input = z.infer<typeof inputSchema>;
export type Output = z.infer<typeof outputSchema>;
export const statement =
  `Cho một dãy khóa nguyên. Hãy chèn từng khóa (bỏ qua nếu đã có) vào một cây tìm kiếm ` +
  `theo đúng quy tắc của kỹ thuật được chọn, rồi cho biết tập khóa cuối cùng trong cây ` +
  `và độ cao của cây.`;
export const constraints = ['0 ≤ số khóa ≤ 24', '-999 ≤ khóa ≤ 999'];
