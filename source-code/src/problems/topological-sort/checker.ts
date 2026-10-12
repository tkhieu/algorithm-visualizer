import type { Verdict } from '../../core/contracts'
import { inputSchema, outputSchema, type Input, type Output } from './definition'
export function check(input: Input, output: Output): Verdict {
  if (!inputSchema.safeParse(input).success) return { ok: false, reason: 'Đầu vào không hợp lệ' }
  if (!outputSchema.safeParse(output).success) return { ok: false, reason: 'Đầu ra sai định dạng' }
  if (
    output.order.length !== input.n ||
    new Set(output.order).size !== input.n ||
    output.order.some((v) => v < 0 || v >= input.n)
  )
    return { ok: false, reason: 'Thiếu hoặc lặp đỉnh' }
  const position = Array(input.n).fill(-1) as number[]
  output.order.forEach((v, i) => (position[v] = i))
  return input.edges.every(([a, b]) => position[a] < position[b])
    ? { ok: true }
    : { ok: false, reason: 'Vi phạm thứ tự cạnh' }
}
