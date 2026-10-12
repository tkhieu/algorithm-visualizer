import type { TestCase } from '../../core/contracts'
import type { Input } from './definition'
import { generate } from './generators'
export const cases: TestCase<Input>[] = [
  {
    id: 'normal',
    name: 'Đường đi ngắn gián tiếp',
    group: 'normal',
    input: {
      n: 3,
      edges: [
        [0, 1, 7],
        [0, 2, 2],
        [2, 1, 2],
      ],
    },
  },
  { id: 'edge', name: 'Một đỉnh', group: 'edge', input: { n: 1, edges: [] } },
  { id: 'small', name: 'Đồ thị nhỏ', group: 'small', input: generate(5, 'tiny') },
  { id: 'large', name: 'Đồ thị lớn', group: 'large', input: generate(8, 'large') },
  {
    id: 'special',
    name: 'Cạnh song song',
    group: 'special',
    input: {
      n: 2,
      edges: [
        [0, 1, 9],
        [0, 1, 3],
      ],
    },
  },
  { id: 'invalid', name: 'Trọng số âm', group: 'invalid', input: { n: 2, edges: [[0, 1, -1]] } },
]
