import {z} from 'zod';

export const inputSchema = z.object({
  dims: z.array(z.number().int().min(1).max(200)).min(2).max(15),
});
export const outputSchema = z.object({
  cost: z.number().int().nonnegative(),
  parenthesization: z.string(),
});
export type Input = z.infer<typeof inputSchema>;
export type Output = z.infer<typeof outputSchema>;

export const statement =
  `Cho dãy n ma trận A₁, A₂, …, Aₙ với kích thước lần lượt là d₀×d₁, d₁×d₂, …, dₙ₋₁×dₙ ` +
  `(mảng dims = [d₀, d₁, …, dₙ]). Phép nhân ma trận có tính kết hợp nên có nhiều cách đặt ngoặc để ` +
  `tính A₁A₂…Aₙ. Hãy tìm cách đặt ngoặc sao cho tổng số phép nhân vô hướng là nhỏ nhất.`;
export const constraints = ['2 ≤ số phần tử dims ≤ 15 (tức n = dims.length − 1 ma trận, 1 ≤ n ≤ 14)', '1 ≤ dims[i] ≤ 200'];
