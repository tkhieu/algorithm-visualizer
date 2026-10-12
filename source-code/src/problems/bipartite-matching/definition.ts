import { z } from 'zod'
export const inputSchema = z
  .object({
    left: z.number().int().min(1).max(25),
    right: z.number().int().min(1).max(25),
    edges: z.array(z.tuple([z.number().int(), z.number().int()])).max(300),
  })
  .superRefine((v, ctx) => {
    if (v.edges.some(([a, b]) => a < 0 || b < 0 || a >= v.left || b >= v.right))
      ctx.addIssue({ code: 'custom', message: 'Đỉnh ngoài phạm vi' })
  })
export const outputSchema = z.object({
  pairs: z.array(z.tuple([z.number().int(), z.number().int()])),
  size: z.number().int().nonnegative(),
})
export type Input = z.infer<typeof inputSchema>
export type Output = z.infer<typeof outputSchema>
export const statement =
  'Cho đồ thị hai phía: đỉnh trái và đỉnh phải, cạnh biểu thị cặp có thể ghép. Hãy tìm số cặp ' +
  'không trùng đỉnh lớn nhất. Ví dụ: cạnh (0,0),(1,1) cho 2 cặp; không có cạnh cho 0 cặp.'
export const constraints = [
  '1 ≤ số đỉnh mỗi phía ≤ 25',
  'Tối đa 300 cạnh',
  'Mỗi cặp chỉ dùng một lần',
]
