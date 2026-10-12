import { z } from 'zod'
export const inputSchema = z
  .object({
    n: z.number().int().min(1).max(60),
    edges: z
      .array(z.tuple([z.number().int(), z.number().int(), z.number().int().min(1).max(100)]))
      .max(400),
    source: z.number().int(),
  })
  .superRefine((v, ctx) => {
    if (
      v.source < 0 ||
      v.source >= v.n ||
      v.edges.some(([a, b]) => a < 0 || b < 0 || a >= v.n || b >= v.n)
    )
      ctx.addIssue({ code: 'custom', message: 'Đỉnh ngoài phạm vi' })
  })
export const outputSchema = z.object({ distance: z.array(z.number().nonnegative().nullable()) })
export type Input = z.infer<typeof inputSchema>
export type Output = z.infer<typeof outputSchema>
export const statement =
  'Cho đồ thị có hướng với trọng số nguyên dương, tìm khoảng cách ngắn nhất từ đỉnh nguồn đến mọi ' +
  'đỉnh; dùng null nếu không đến được. BFS chỉ áp dụng khi mọi trọng số bằng 1. Ví dụ: 0→1 trọng ' +
  'số 3 cho [0,3]; đồ thị hai đỉnh không cạnh cho [0,null].'
export const constraints = [
  '1 ≤ n ≤ 60',
  'Tối đa 400 cạnh',
  'Trọng số nguyên từ 1 đến 100',
  'BFS chỉ dùng khi mọi trọng số bằng 1',
]
