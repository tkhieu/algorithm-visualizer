import type { RunContext } from '../../../core/contracts'
import type { Input, Output } from '../../../problems/bipartite-matching/definition'
import { syncPairs, type VisualState } from '../shared'
export function run(input: Input, { rec, signal }: RunContext<VisualState>): Output {
  const n = input.left + input.right + 2,
    s = n - 2,
    t = n - 1,
    capacity = Array.from({ length: n }, () => Array(n).fill(0) as number[])
  for (let a = 0; a < input.left; a++) capacity[s][a] = 1
  for (let b = 0; b < input.right; b++) capacity[input.left + b][t] = 1
  for (const [a, b] of input.edges) capacity[a][input.left + b] = 1
  rec.step('init', 'Tạo mạng luồng với dung lượng 1 cho mỗi đỉnh và cạnh.', (d) => {
    d.note = 'Đã dựng mạng luồng.'
  })
  while (true) {
    if (signal.aborted) throw new DOMException('Đã hủy', 'AbortError')
    const parent = Array(n).fill(-1) as number[],
      q = [s]
    parent[s] = s
    for (let h = 0; h < q.length && parent[t] < 0; h++)
      for (let v = 0; v < n; v++)
        if (parent[v] < 0 && capacity[q[h]][v] > 0) {
          parent[v] = q[h]
          q.push(v)
          rec.count('visit')
        }
    if (parent[t] < 0) break
    for (let v = t; v !== s; v = parent[v]) {
      capacity[parent[v]][v]--
      capacity[v][parent[v]]++
    }
    const pairs: [number, number][] = []
    for (const [a, b] of input.edges)
      if (capacity[input.left + b][a] > 0 && !pairs.some(([x]) => x === a)) pairs.push([a, b])
    rec.count('assign')
    rec.step('augment', `Tăng luồng một đơn vị; ghép được ${pairs.length} cặp.`, (d) => {
      syncPairs(input, pairs, d)
      d.path = []
    })
  }
  const pairs: [number, number][] = []
  for (const [a, b] of input.edges)
    if (capacity[input.left + b][a] > 0 && !pairs.some(([x]) => x === a)) pairs.push([a, b])
  pairs.sort((x, y) => x[0] - y[0])
  rec.step('done', `Luồng cực đại cho ${pairs.length} cặp.`, (d) => {
    syncPairs(input, pairs, d)
    d.path = []
  })
  return { pairs, size: pairs.length }
}
