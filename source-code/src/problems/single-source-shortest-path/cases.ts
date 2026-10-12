import type { TestCase } from '../../core/contracts'
import type { Input } from './definition'
import { generate } from './generators'
export const cases: TestCase<Input>[] = [
  {
    id: 'normal',
    name: 'Cạnh đơn vị',
    group: 'normal',
    input: {
      n: 4,
      edges: [
        [0, 1, 1],
        [1, 2, 1],
        [0, 3, 1],
      ],
      source: 0,
    },
  },
  { id: 'edge', name: 'Không có cạnh', group: 'edge', input: { n: 2, edges: [], source: 0 } },
  { id: 'small', name: 'Đồ thị nhỏ', group: 'small', input: generate(3, 'tiny') },
  { id: 'large', name: 'Đồ thị lớn', group: 'large', input: generate(6, 'large') },
  {
    id: 'special',
    name: 'Đường nhẹ gián tiếp',
    group: 'special',
    input: {
      n: 3,
      edges: [
        [0, 1, 9],
        [0, 2, 2],
        [2, 1, 2],
      ],
      source: 0,
    },
  },
  {
    id: 'invalid',
    name: 'Trọng số âm',
    group: 'invalid',
    input: { n: 2, edges: [[0, 1, -1]], source: 0 },
  },
]
