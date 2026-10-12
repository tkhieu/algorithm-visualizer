import { z } from 'zod';
const rows = z
  .array(z.array(z.number().int().min(-20).max(20)).min(1).max(4))
  .min(1)
  .max(4);
export const inputSchema = z
  .object({ a: rows, b: z.array(z.number().int().min(-100).max(100)).min(1).max(4) })
  .refine((v) => {
    const n = v.a.length;
    return (
      v.b.length === n &&
      v.a.every(
        (row, i) =>
          row.length === n &&
          Math.abs(row[i]) > row.reduce((sum, x, j) => sum + (j === i ? 0 : Math.abs(x)), 0)
      )
    );
  }, 'Ma trận phải vuông và trội chéo nghiêm ngặt');
export const outputSchema = z.object({ solution: z.array(z.number().finite()).min(1).max(4) });
export type Input = z.infer<typeof inputSchema>;
export type Output = z.infer<typeof outputSchema>;
export const statement =
  'Cho hệ phương trình A·x=b với A vuông, trội chéo nghiêm ngặt nên có nghiệm duy nhất. ' +
  'Tìm vector nghiệm x. ' +
  'Ví dụ: A=[[2,0],[0,3]], b=[4,9] → [2,3]; A=[[5]], b=[10] → [2].';
export const constraints = [
  '1 ≤ n ≤ 4',
  '−20 ≤ A[i][j] ≤ 20',
  '−100 ≤ b[i] ≤ 100',
  'A trội chéo nghiêm ngặt'
];
