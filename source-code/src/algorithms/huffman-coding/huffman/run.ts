import type { RunContext } from '../../../core/contracts'
import type { Input, Output } from '../../../problems/huffman-coding/definition'
import type { VisualState } from '../shared'
interface Node {
  id: number
  weight: number
  left?: Node
  right?: Node
}
function less(a: Node, b: Node) {
  return a.weight < b.weight || (a.weight === b.weight && a.id < b.id)
}
export function run(input: Input, { rec, signal }: RunContext<VisualState>): Output {
  const heap: Node[] = []
  function push(node: Node) {
    heap.push(node)
    for (let i = heap.length - 1; i > 0;) {
      const p = (i - 1) >> 1
      if (!less(heap[i], heap[p])) break
      ;[heap[i], heap[p]] = [heap[p], heap[i]]
      i = p
    }
  }
  function pop(): Node {
    const min = heap[0],
      last = heap.pop()!
    if (heap.length) {
      heap[0] = last
      for (let i = 0; ;) {
        let child = i * 2 + 1
        if (child >= heap.length) break
        if (child + 1 < heap.length && less(heap[child + 1], heap[child])) child++
        if (!less(heap[child], heap[i])) break
        ;[heap[i], heap[child]] = [heap[child], heap[i]]
        i = child
      }
    }
    return min
  }
  input.symbols.forEach((s, id) => push({ id, weight: s.frequency }))
  const n = heap.length
  rec.step('init', 'Đưa các ký hiệu vào hàng đợi ưu tiên theo tần suất.', (d) => {
    d.note = 'Các nút lá ban đầu.'
  })
  let next = n
  while (heap.length > 1) {
    if (signal.aborted) throw new DOMException('Đã hủy', 'AbortError')
    const left = pop(),
      right = pop(),
      node = { id: next++, weight: left.weight + right.weight, left, right }
    push(node)
    rec.count('compare')
    rec.count('assign')
    rec.step(
      'merge',
      `Ghép hai nút nhẹ nhất ${left.weight} và ${right.weight} thành ${node.weight}.`,
      (d) => {
        d.nodes.find((x) => x.id === String(left.id))!.parent = String(node.id)
        d.nodes.find((x) => x.id === String(right.id))!.parent = String(node.id)
        d.nodes.push({
          id: String(node.id),
          parent: null,
          label: String(node.weight),
          role: 'current',
        })
        d.note = `Còn ${heap.length} cây.`
      },
      [{ target: String(node.id), role: 'current' }],
    )
  }
  const codes = Array(n).fill('') as string[]
  function assign(node: Node, prefix: string) {
    if (node.id < n) {
      codes[node.id] = prefix || '0'
      return
    }
    assign(node.left!, prefix + '0')
    assign(node.right!, prefix + '1')
  }
  assign(pop(), '')
  const weightedBits = codes.reduce((s, c, i) => s + c.length * input.symbols[i].frequency, 0)
  rec.step('done', `Mã Huffman dùng ${weightedBits} bit có trọng số.`, (d) => {
    d.codes = [...codes]
    d.weightedBits = weightedBits
    d.note = 'Hoàn tất cây Huffman.'
  })
  return { codes, weightedBits }
}
