import type { Verdict } from '../../core/contracts'
import { inputSchema, outputSchema, type Input, type Output } from './definition'
export function check(input: Input, output: Output): Verdict {
  if (!inputSchema.safeParse(input).success) return { ok: false, reason: 'Đầu vào không hợp lệ' }
  const n = input.men.length
  if (
    !outputSchema.safeParse(output).success ||
    output.wifeOfMen.length !== n ||
    new Set(output.wifeOfMen).size !== n ||
    output.wifeOfMen.some((x) => x >= n)
  )
    return { ok: false, reason: 'Ghép cặp không phải hoán vị' }
  const husband = Array(n).fill(-1) as number[]
  output.wifeOfMen.forEach((w, m) => (husband[w] = m))
  // Một cặp chặn tồn tại khi cả hai thích nhau hơn bạn đời hiện tại.
  for (let m = 0; m < n; m++)
    for (let w = 0; w < n; w++)
      if (
        w !== output.wifeOfMen[m] &&
        input.men[m].indexOf(w) < input.men[m].indexOf(output.wifeOfMen[m]) &&
        input.women[w].indexOf(m) < input.women[w].indexOf(husband[w])
      )
        return { ok: false, reason: `Cặp (${m},${w}) chặn ghép cặp` }
  return { ok: true }
}
