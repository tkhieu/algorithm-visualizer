import type { RunContext } from '../../core/contracts'
import type { Input, Output } from '../../problems/topological-sort/definition'
import type { GraphVisualState } from '../../visualizers/graph'
export interface VisualState extends GraphVisualState {
  order: number[]
  frontier: number[]
  indegree: number[]
}
export function initVisual(input: Input): VisualState {
  return {
    nodes: Array.from({ length: input.n }, (_, i) => ({ id: String(i), label: String(i) })),
    edges: input.edges.map(([a, b]) => ({ from: String(a), to: String(b), directed: true })),
    order: [],
    frontier: [],
    indegree: Array(input.n).fill(0),
    note: '',
  }
}
export function runTopo(
  input: Input,
  { rec, signal }: RunContext<VisualState>,
  method: 'dfs-based' | 'source-removal',
): Output {
  const adj = Array.from({ length: input.n }, () => [] as number[]),
    indegree = Array(input.n).fill(0) as number[]
  for (const [a, b] of input.edges) {
    adj[a].push(b)
    indegree[b]++
  }
  const order: number[] = []
  rec.step('init', 'Lập danh sách cạnh và bậc vào của từng đỉnh.', (d) => {
    d.indegree = [...indegree]
    d.note = 'Đã chuẩn bị đồ thị.'
  })
  if (method === 'source-removal') {
    const queue = Array.from({ length: input.n }, (_, i) => i).filter((i) => indegree[i] === 0)
    rec.step('source', `Các đỉnh nguồn ban đầu: ${queue.join(', ')}.`, (d) => {
      d.frontier = [...queue]
    })
    for (let head = 0; head < queue.length; head++) {
      if (signal.aborted) throw new DOMException('Đã hủy', 'AbortError')
      const v = queue[head]
      order.push(v)
      rec.count('visit')
      rec.step('emit', `Lấy đỉnh nguồn ${v} vào thứ tự tô pô.`, (d) => {
        d.order = [...order]
        d.nodes[v].role = 'visited'
        d.frontier = queue.slice(head + 1)
      })
      for (const w of adj[v]) {
        indegree[w]--
        rec.count('assign')
        if (indegree[w] === 0) queue.push(w)
        rec.step('remove', `Xóa cạnh ${v}→${w}; bậc vào của ${w} còn ${indegree[w]}.`, (d) => {
          d.indegree = [...indegree]
          d.frontier = queue.slice(head + 1)
          const edge = d.edges.find((e) => e.from === String(v) && e.to === String(w))
          if (edge) edge.role = 'visited'
        })
      }
    }
  } else {
    const color = Array(input.n).fill(0) as number[]
    function dfs(v: number) {
      if (signal.aborted) throw new DOMException('Đã hủy', 'AbortError')
      color[v] = 1
      rec.count('visit')
      rec.step('visit', `Đi sâu vào đỉnh ${v}.`, (d) => {
        d.nodes[v].role = 'current'
        d.frontier.push(v)
      })
      for (const w of adj[v]) if (color[w] === 0) dfs(w)
      color[v] = 2
      order.push(v)
      rec.step('finish', `Hoàn tất đỉnh ${v}; đưa vào cuối thứ tự ngược.`, (d) => {
        d.nodes[v].role = 'visited'
        d.order = [...order]
        d.frontier.pop()
      })
    }
    for (let v = 0; v < input.n; v++) if (color[v] === 0) dfs(v)
    order.reverse()
  }
  rec.step('done', `Thứ tự tô pô: ${order.join(', ')}.`, (d) => {
    d.order = [...order]
    d.frontier = []
    d.note = 'Hoàn tất.'
  })
  return { order }
}
export const legend = { 'Đang xét': 'Nền xám', 'Đã xếp': 'Nền đen' }
export const limits = { maxInputSize: 60, maxSteps: 5000, maxBytes: 3000000 }
