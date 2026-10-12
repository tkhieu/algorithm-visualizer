import type { RunContext } from '../../../core/contracts'
import type { Input, Output } from '../../../problems/bipartite-matching/definition'
import { syncPairs, type VisualState } from '../shared'
export function run(input: Input, { rec, signal }: RunContext<VisualState>): Output {
  const adj = Array.from({ length: input.left }, () => [] as number[]),
    owner = Array(input.right).fill(-1) as number[]
  for (const [a, b] of input.edges) if (!adj[a].includes(b)) adj[a].push(b)
  rec.step('init', 'Khởi tạo các đỉnh chưa ghép.', (d) => {
    d.note = 'Chưa có cặp nào.'
  })
  function dfs(a: number, seen: Set<number>): boolean {
    for (const b of adj[a])
      if (!seen.has(b)) {
        seen.add(b)
        rec.count('visit')
        rec.step('try', `Thử cạnh từ trái ${a} sang phải ${b}.`, (d) => {
          d.path = [`L${a}`, `R${b}`]
          d.note = `Thử ${a}–${b}`
        })
        if (owner[b] < 0 || dfs(owner[b], seen)) {
          owner[b] = a
          return true
        }
      }
    return false
  }
  for (let a = 0; a < input.left; a++) {
    if (signal.aborted) throw new DOMException('Đã hủy', 'AbortError')
    if (dfs(a, new Set())) {
      const pairs = owner.flatMap((v, b) => (v < 0 ? [] : [[v, b] as [number, number]]))
      rec.count('assign')
      rec.step('augment', `Tăng ghép cặp từ đỉnh trái ${a}; hiện có ${pairs.length} cặp.`, (d) => {
        syncPairs(input, pairs, d)
        d.path = []
      })
    }
  }
  const pairs = owner
    .flatMap((v, b) => (v < 0 ? [] : [[v, b] as [number, number]]))
    .sort((x, y) => x[0] - y[0])
  rec.step('done', `Ghép cặp cực đại gồm ${pairs.length} cặp.`, (d) => {
    syncPairs(input, pairs, d)
    d.path = []
  })
  return { pairs, size: pairs.length }
}
