import { z } from 'zod';
const matrix = z
  .array(z.array(z.number().int().min(-10).max(10)).min(1).max(4))
  .min(1)
  .max(4);
export const inputSchema = z.object({ a: matrix, b: matrix }).refine((v) => {
  const n = v.a.length;
  return (
    v.b.length === n && v.a.every((row) => row.length === n) && v.b.every((row) => row.length === n)
  );
}, 'Hai ma trận phải vuông cùng cấp');
export const outputSchema = z.object({ matrix: z.array(z.array(z.number().int())) });
export type Input = z.infer<typeof inputSchema>;
export type Output = z.infer<typeof outputSchema>;
export const statement =
  'Cho hai ma trận vuông A và B cùng cấp n. ' +
  'Tính C=A×B, với C[i][j]=Σ A[i][k]B[k][j]. ' +
  'Ví dụ: [[1,2],[3,4]] × ma trận đơn vị → [[1,2],[3,4]]; [[2]]×[[3]]→[[6]].';
export const constraints = ['1 ≤ n ≤ 4', '−10 ≤ mỗi phần tử ≤ 10', 'Hai ma trận vuông cùng cấp'];
