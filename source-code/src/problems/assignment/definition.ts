import {z} from 'zod';

export const inputSchema = z.object({
  cost: z
    .array(z.array(z.number().int().min(0).max(1000)))
    .min(1)
    .max(9)
    .refine((rows) => rows.every((row) => row.length === rows.length), 'Ma trận chi phí phải vuông'),
});
export const outputSchema = z.object({
  assignment: z.array(z.number().int().nonnegative()),
  cost: z.number().nonnegative(),
});
export type Input = z.infer<typeof inputSchema>;
export type Output = z.infer<typeof outputSchema>;

export const statement =
  `Cho n người và n việc, cùng ma trận chi phí cost[i][j] là chi phí khi gán người i làm việc j. ` +
  `Mỗi người được gán đúng một việc và mỗi việc được gán đúng một người (ghép cặp hoàn hảo). ` +
  `Hãy tìm cách gán có tổng chi phí nhỏ nhất.`;
export const constraints = ['1 ≤ n ≤ 9', 'Ma trận chi phí vuông n×n', '0 ≤ cost[i][j] ≤ 1000'];
