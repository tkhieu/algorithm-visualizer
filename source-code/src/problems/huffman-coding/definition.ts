import { z } from 'zod'
export const inputSchema = z
  .object({
    symbols: z
      .array(
        z.object({
          label: z.string().trim().min(1).max(12),
          frequency: z.number().int().min(1).max(10000),
        }),
      )
      .min(1)
      .max(30),
  })
  .superRefine((v, ctx) => {
    if (new Set(v.symbols.map((s) => s.label)).size !== v.symbols.length)
      ctx.addIssue({ code: 'custom', message: 'Ký hiệu phải khác nhau' })
  })
export const outputSchema = z.object({
  codes: z.array(z.string().regex(/^[01]+$/)),
  weightedBits: z.number().int().nonnegative(),
})
export type Input = z.infer<typeof inputSchema>
export type Output = z.infer<typeof outputSchema>
export const statement =
  'Cho các ký hiệu khác nhau và tần suất xuất hiện. Tạo mã nhị phân tiền tố để số bit có trọng số ' +
  'nhỏ nhất; mã độ dài cố định dùng để đối chiếu. Ví dụ: một ký hiệu tần suất 5 dùng mã 0, tốn 5 ' +
  'bit; hai ký hiệu tần suất 1 và 2 dùng mã 0,1, tốn 3 bit.'
export const constraints = ['1 ≤ số ký hiệu ≤ 30', 'Tần suất từ 1 đến 10000', 'Ký hiệu khác nhau']
