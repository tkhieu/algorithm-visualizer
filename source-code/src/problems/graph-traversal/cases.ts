import type { TestCase } from '../../core/contracts'
import type { Input } from './definition'
import { generate } from './generators'
export const cases: TestCase<Input>[] = [
  {
    id: 'normal',
    name: 'Đồ thị phân nhánh',
    group: 'normal',
    input: {
      n: 4,
      edges: [
        [0, 1],
        [0, 2],
        [1, 3],
      ],
      start: 0,
    },
  },
  { id: 'edge', name: 'Đỉnh cô lập', group: 'edge', input: { n: 2, edges: [], start: 1 } },
  { id: 'small', name: 'Đồ thị nhỏ', group: 'small', input: generate(2, 'tiny') },
  { id: 'large', name: 'Đồ thị lớn', group: 'large', input: generate(7, 'large') },
  {
    id: 'special',
    name: 'Có chu trình',
    group: 'special',
    input: {
      n: 3,
      edges: [
        [0, 1],
        [1, 2],
        [2, 0],
      ],
      start: 0,
    },
  },
  {
    id: 'invalid',
    name: 'Đỉnh ngoài phạm vi',
    group: 'invalid',
    input: { n: 2, edges: [[0, 2]], start: 0 },
  },
]
