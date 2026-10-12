import type { RunContext } from '../../core/contracts'
import type { Input, Output } from '../../problems/maximum-flow/definition'
import type { GraphVisualState } from '../../visualizers/graph'
export interface VisualState extends GraphVisualState {
  flow: number[]
  value: number
  path: number[]
}
export function initVisual(input: Input): VisualState {
  return {
    nodes: Array.from({ length: input.n }, (_, i) => ({ id: String(i), label: String(i) })),
    edges: input.edges.map(([a, b, c]) => ({
      from: String(a),
      to: String(b),
      capacity: c,
      flow: 0,
      directed: true,
    })),
    flow: Array(input.edges.length).fill(0),
    value: 0,
    path: [],
    note: '',
  }
}
interface Arc {
  to: number
  rev: number
  cap: number
  edge: number
  forward: boolean
}
export function runFlow(
  input: Input,
  { rec, signal }: RunContext<VisualState>,
  method: 'bfs' | 'dfs',
): Output {
  const adj = Array.from({ length: input.n }, () => [] as Arc[]),
    flow = Array(input.edges.length).fill(0) as number[]
  // Mỗi cạnh gốc có một cung dư ngược để có thể hoàn tác luồng trên đường tăng sau.
  for (let i = 0; i < input.edges.length; i++) {
    const [a, b, c] = input.edges[i],
      forward: Arc = { to: b, rev: adj[b].length, cap: c, edge: i, forward: true },
      backward: Arc = { to: a, rev: adj[a].length, cap: 0, edge: i, forward: false }
    adj[a].push(forward)
    adj[b].push(backward)
  }
  let value = 0
  rec.step('init', 'Khởi tạo mạng dư với dung lượng ban đầu.', (d) => {
    d.note = 'Luồng ban đầu bằng 0.'
  })
  while (true) {
    if (signal.aborted) throw new DOMException('Đã hủy', 'AbortError')
    const parent = Array(input.n).fill(null) as ({ from: number; index: number } | null)[],
      seen = new Set([input.source])
    if (method === 'bfs') {
      const q = [input.source]
      for (let h = 0; h < q.length && !seen.has(input.sink); h++)
        for (let i = 0; i < adj[q[h]].length; i++) {
          const arc = adj[q[h]][i]
          if (arc.cap > 0 && !seen.has(arc.to)) {
            seen.add(arc.to)
            parent[arc.to] = { from: q[h], index: i }
            q.push(arc.to)
            rec.count('visit')
          }
        }
    } else {
      function dfs(v: number): boolean {
        if (v === input.sink) return true
        seen.add(v)
        for (let i = 0; i < adj[v].length; i++) {
          const arc = adj[v][i]
          if (arc.cap > 0 && !seen.has(arc.to)) {
            parent[arc.to] = { from: v, index: i }
            rec.count('visit')
            if (dfs(arc.to)) return true
          }
        }
        return false
      }
      dfs(input.source)
    }
    if (!parent[input.sink]) break
    const path: number[] = []
    let delta = Infinity
    // Nút thắt của đường tăng là dung lượng dư nhỏ nhất dọc đường.
    for (let v = input.sink; v !== input.source;) {
      const p = parent[v]!,
        arc = adj[p.from][p.index]
      path.push(v)
      delta = Math.min(delta, arc.cap)
      v = p.from
    }
    path.push(input.source)
    path.reverse()
    rec.step('path', `Tìm đường tăng ${path.join('→')} với nút thắt ${delta}.`, (d) => {
      d.path = [...path]
      d.note = `Đường tăng ${path.join('→')}`
    })
    // Đi ngược đường tăng và cập nhật đồng thời cung xuôi, cung ngược, luồng cạnh gốc.
    for (let v = input.sink; v !== input.source;) {
      const p = parent[v]!,
        arc = adj[p.from][p.index]
      arc.cap -= delta
      adj[v][arc.rev].cap += delta
      flow[arc.edge] += arc.forward ? delta : -delta
      v = p.from
    }
    value += delta
    rec.count('assign')
    rec.step('augment', `Tăng thêm ${delta}; giá trị luồng hiện tại ${value}.`, (d) => {
      d.flow = [...flow]
      d.value = value
      d.edges.forEach((e, i) => {
        e.flow = flow[i]
        e.role = flow[i] > 0 ? 'path' : undefined
      })
      d.note = `Luồng hiện tại ${value}`
    })
  }
  rec.step('done', `Không còn đường tăng; luồng cực đại bằng ${value}.`, (d) => {
    d.flow = [...flow]
    d.value = value
    d.path = []
    d.note = 'Hoàn tất.'
  })
  return { value, flow }
}
export const legend = { 'Cạnh có luồng': 'Nét đậm', 'Đường tăng': 'Đường được xét' }
export const limits = { maxInputSize: 30, maxSteps: 6000, maxBytes: 7000000 }
