import type { Verdict } from '../../core/contracts'
import { inputSchema, outputSchema, type Input, type Output } from './definition'
export function check(input: Input, output: Output): Verdict {
  if (!inputSchema.safeParse(input).success) return { ok: false, reason: 'Đầu vào không hợp lệ' }
  if (!outputSchema.safeParse(output).success) return { ok: false, reason: 'Đầu ra sai định dạng' }
  const adj = Array.from({ length: input.n }, () => [] as number[])
  for (const [a, b] of input.edges) adj[a].push(b)
  const reached = new Set([input.start]),
    q = [input.start]
  for (let i = 0; i < q.length; i++)
    for (const b of adj[q[i]])
      if (!reached.has(b)) {
        reached.add(b)
        q.push(b)
      }
  if (
    output.order.length !== reached.size ||
    new Set(output.order).size !== reached.size ||
    output.order[0] !== input.start ||
    output.order.some((v) => !reached.has(v))
  )
    return { ok: false, reason: 'Tập hoặc thứ tự duyệt sai' }
  if (output.parent.length !== input.n || output.parent[input.start] !== null)
    return { ok: false, reason: 'Mảng cha không hợp lệ' }
  const seen = new Set<number>()
  for (const v of output.order) {
    if (v !== input.start) {
      const p = output.parent[v]
      if (p === null || !seen.has(p) || !adj[p].includes(v))
        return { ok: false, reason: 'Cạnh cha không tạo cây duyệt' }
    }
    seen.add(v)
  }
  return { ok: true }
}
