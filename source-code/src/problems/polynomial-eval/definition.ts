import { z } from 'zod';
export const inputSchema = z.object({
  coefficients: z.array(z.number().int().min(-20).max(20)).min(1).max(11),
  x: z.number().int().min(-3).max(3)
});
export const outputSchema = z.object({ value: z.number().int().safe() });
export type Input = z.infer<typeof inputSchema>;
export type Output = z.infer<typeof outputSchema>;
export const statement =
  'Cho hệ số a₀,a₁,…,aₙ (theo bậc tăng) và x. Tính P(x)=a₀+a₁x+…+aₙxⁿ. Ví dụ: [2,3,1], x=2 → 12; [5], x=−2 → 5.';
export const constraints = ['1 ≤ số hệ số ≤ 11', '−20 ≤ aᵢ ≤ 20', '−3 ≤ x ≤ 3'];
