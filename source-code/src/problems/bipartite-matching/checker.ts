import type { Verdict } from '../../core/contracts'
import { inputSchema, outputSchema, type Input, type Output } from './definition'
export function reference(input: Input): number {
  const owner = Array(input.right).fill(-1) as number[]
  const adj = Array.from({ length: input.left }, () => [] as number[])
  for (const [a, b] of input.edges) adj[a].push(b)
  let count = 0
  function visit(a: number, seen: Set<number>): boolean {
    for (const b of adj[a])
      if (!seen.has(b)) {
        seen.add(b)
        if (owner[b] < 0 || visit(owner[b], seen)) {
          owner[b] = a
          return true
        }
      }
    return false
  }
  for (let a = 0; a < input.left; a++) if (visit(a, new Set())) count++
  return count
}
export function check(input: Input, output: Output): Verdict {
  if (!inputSchema.safeParse(input).success) return { ok: false, reason: 'Đầu vào không hợp lệ' }
  if (!outputSchema.safeParse(output).success || output.pairs.length !== output.size)
    return { ok: false, reason: 'Đầu ra sai định dạng' }
  const left = new Set<number>(),
    right = new Set<number>(),
    edges = new Set(input.edges.map(([a, b]) => `${a}-${b}`))
  for (const [a, b] of output.pairs) {
    if (!edges.has(`${a}-${b}`) || left.has(a) || right.has(b))
      return { ok: false, reason: 'Cặp không hợp lệ hoặc trùng đỉnh' }
    left.add(a)
    right.add(b)
  }
  const best = reference(input)
  return {
    ok: true,
    optimal: output.size === best,
    score: output.size,
    ratio: best ? output.size / best : 1,
  }
}
