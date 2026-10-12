import { z } from 'zod';
export const inputSchema = z
  .object({
    values: z.array(z.number().int().min(0).max(10000)).max(200),
    target: z.number().int().min(0).max(10000)
  })
  .refine(
    (v) => v.values.every((x, i) => i === 0 || v.values[i - 1] <= x),
    'Dãy phải tăng không giảm'
  );
export const outputSchema = z.object({ index: z.number().int().min(-1) });
export type Input = z.infer<typeof inputSchema>;
export type Output = z.infer<typeof outputSchema>;
export const statement =
  'Cho dãy số nguyên đã sắp xếp tăng không giảm và giá trị cần tìm. ' +
  'Trả về vị trí xuất hiện đầu tiên (đếm từ 0), hoặc −1 nếu không có. ' +
  'Ví dụ: [1,3,3,7], 3 → 1; [1,3], 2 → −1.';
export const constraints = [
  '0 ≤ số phần tử ≤ 200',
  '0 ≤ giá trị, mục tiêu ≤ 10000',
  'Dãy tăng không giảm'
];
