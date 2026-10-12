import { z } from 'zod'
export const inputSchema = z
  .object({
    n: z.number().int().min(1).max(60),
    edges: z.array(z.tuple([z.number().int(), z.number().int()])).max(300),
    start: z.number().int(),
  })
  .superRefine((v, ctx) => {
    if (v.start < 0 || v.start >= v.n)
      ctx.addIssue({ code: 'custom', message: 'Đỉnh bắt đầu ngoài phạm vi' })
    for (const [a, b] of v.edges)
      if (a < 0 || b < 0 || a >= v.n || b >= v.n)
        ctx.addIssue({ code: 'custom', message: 'Cạnh có đỉnh ngoài phạm vi' })
  })
export const outputSchema = z.object({
  order: z.array(z.number().int()),
  parent: z.array(z.number().int().nullable()),
})
export type Input = z.infer<typeof inputSchema>
export type Output = z.infer<typeof outputSchema>
export const statement =
  'Cho đồ thị có hướng gồm n đỉnh đánh số từ 0 đến n−1, các cạnh và đỉnh bắt đầu s. Hãy duyệt các ' +
  'đỉnh đến được từ s. Các đỉnh kề được xét theo chỉ số tăng dần. Ví dụ: n=3, cạnh (0,1),(0,2), ' +
  's=0 cho thứ tự 0,1,2; n=2 không có cạnh, s=1 cho thứ tự 1.'
export const constraints = [
  '1 ≤ n ≤ 60',
  '0 ≤ số cạnh ≤ 300',
  'Mọi đỉnh và đỉnh bắt đầu thuộc [0,n−1]',
]
