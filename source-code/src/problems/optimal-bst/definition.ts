import { z } from 'zod';

export const inputSchema = z.object({ freq: z.array(z.number().positive().max(1000)).min(1).max(12) });
export const outputSchema = z.object({
  cost: z.number().nonnegative(),
  roots: z.array(z.array(z.number().int().nonnegative())),
});
export type Input = z.infer<typeof inputSchema>;
export type Output = z.infer<typeof outputSchema>;

export const statement =
  'Cho n khoá đã sắp xếp tăng dần, khoá thứ i có tần suất tìm kiếm freq[i]. ' +
  'Hãy xây cây tìm kiếm nhị phân trên n khoá này sao cho tổng chi phí tìm kiếm có trọng số ' +
  '(tần suất × độ sâu, gốc ở độ sâu 1) là nhỏ nhất.';
export const constraints = ['1 ≤ n ≤ 12', '0 < freq[i] ≤ 1000'];
