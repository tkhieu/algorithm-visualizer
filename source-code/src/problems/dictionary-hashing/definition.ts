import { z } from 'zod';
export const inputSchema = z.object({
  tableSize: z.number().int().min(1).max(23),
  keys: z.array(z.number().int().min(0).max(999)).max(40),
});
export const outputSchema = z.object({ buckets: z.array(z.array(z.number().int())) });
export type Input = z.infer<typeof inputSchema>;
export type Output = z.infer<typeof outputSchema>;
export const statement =
  `Cho một bảng băm có m ngăn (đánh số 0..m-1) và một dãy khóa nguyên cần chèn lần lượt ` +
  `theo thứ tự. Hàm băm h(k) = k mod m. Hãy chèn toàn bộ khóa vào bảng và cho biết nội ` +
  `dung từng ngăn sau khi chèn xong.`;
export const constraints = ['1 ≤ m ≤ 23', '0 ≤ số khóa ≤ 40', '0 ≤ khóa ≤ 999'];
