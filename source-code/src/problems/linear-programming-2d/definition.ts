import { z } from 'zod';

export const inputSchema = z.object({
  objective: z.object({ cx: z.number().finite(), cy: z.number().finite() }),
  constraints: z
    .array(
      z.object({
        a: z.number().finite(),
        b: z.number().finite(),
        c: z.number().finite(),
      }),
    )
    .min(1)
    .max(8),
});
export const outputSchema = z.discriminatedUnion('status', [
  z.object({
    status: z.literal('optimal'),
    x: z.number().finite(),
    y: z.number().finite(),
    value: z.number().finite(),
  }),
  z.object({ status: z.literal('infeasible'), message: z.string() }),
  z.object({ status: z.literal('unbounded'), message: z.string() }),
]);
export type Input = z.infer<typeof inputSchema>;
export type Output = z.infer<typeof outputSchema>;

export const statement =
  'Cho miền x≥0, y≥0 và các ràng buộc aᵢx + bᵢy ≤ cᵢ. ' +
  'Tối đa hoá cₓx + c_y y; báo không khả thi hoặc không bị chặn khi thích hợp.';
export const constraints = ['x ≥ 0, y ≥ 0', '1 ≤ số ràng buộc ≤ 8', 'Miền khả thi có thể rỗng hoặc không bị chặn'];
