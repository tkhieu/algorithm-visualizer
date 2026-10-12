import { z } from 'zod'
export const inputSchema = z
  .object({
    n: z.number().int().min(2).max(30),
    edges: z
      .array(z.tuple([z.number().int(), z.number().int(), z.number().int().min(1).max(100)]))
      .max(250),
    source: z.number().int(),
    sink: z.number().int(),
  })
  .superRefine((v, ctx) => {
    if (
      v.source < 0 ||
      v.sink < 0 ||
      v.source >= v.n ||
      v.sink >= v.n ||
      v.source === v.sink ||
      v.edges.some(([a, b]) => a < 0 || b < 0 || a >= v.n || b >= v.n || a === b)
    )
      ctx.addIssue({ code: 'custom', message: 'Đỉnh nguồn/đích hoặc cạnh không hợp lệ' })
  })
export const outputSchema = z.object({
  value: z.number().int().nonnegative(),
  flow: z.array(z.number().int().nonnegative()),
})
export type Input = z.infer<typeof inputSchema>
export type Output = z.infer<typeof outputSchema>
export const statement =
  'Cho mạng có hướng với dung lượng nguyên dương, nguồn s và đích t. Tìm luồng hợp lệ lớn nhất từ ' +
  's đến t. Ví dụ: một cạnh 0→1 dung lượng 4 cho luồng cực đại 4; không có đường s→t cho 0.'
export const constraints = [
  '2 ≤ n ≤ 30',
  'Tối đa 250 cạnh',
  'Dung lượng từ 1 đến 100',
  'Nguồn và đích khác nhau',
]
