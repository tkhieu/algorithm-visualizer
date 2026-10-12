import type { Verdict } from '../../core/contracts'
import { inputSchema, outputSchema, type Input, type Output } from './definition'
export function reference(input: Input): boolean[][] {
  const adj = Array.from({ length: input.n }, () => [] as number[])
  for (const [a, b] of input.edges) adj[a].push(b)
  return Array.from({ length: input.n }, (_, s) => {
    const seen = Array(input.n).fill(false) as boolean[],
      stack = [s]
    seen[s] = true
    while (stack.length)
      for (const v of adj[stack.pop()!])
        if (!seen[v]) {
          seen[v] = true
          stack.push(v)
        }
    return seen
  })
}
export function check(input: Input, output: Output): Verdict {
  if (!inputSchema.safeParse(input).success) return { ok: false, reason: 'Đầu vào không hợp lệ' }
  if (!outputSchema.safeParse(output).success) return { ok: false, reason: 'Đầu ra sai định dạng' }
  return JSON.stringify(output.reachable) === JSON.stringify(reference(input))
    ? { ok: true }
    : { ok: false, reason: 'Ma trận đường đi sai' }
}
