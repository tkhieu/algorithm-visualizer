import type { TestCase } from '../../core/contracts'
import type { Input } from './definition'
import { generate } from './generators'
export const cases: TestCase<Input>[] = [
  {
    id: 'normal',
    name: 'Hai đường tăng',
    group: 'normal',
    input: {
      n: 4,
      edges: [
        [0, 1, 3],
        [0, 2, 2],
        [1, 3, 3],
        [2, 3, 2],
      ],
      source: 0,
      sink: 3,
    },
  },
  {
    id: 'edge',
    name: 'Không có đường đến đích',
    group: 'edge',
    input: { n: 2, edges: [], source: 0, sink: 1 },
  },
  { id: 'small', name: 'Mạng nhỏ', group: 'small', input: generate(3, 'tiny') },
  { id: 'large', name: 'Mạng lớn', group: 'large', input: generate(8, 'large') },
  {
    id: 'special',
    name: 'Cần cạnh ngược',
    group: 'special',
    input: {
      n: 4,
      edges: [
        [0, 1, 1],
        [0, 2, 1],
        [1, 2, 1],
        [1, 3, 1],
        [2, 3, 1],
      ],
      source: 0,
      sink: 3,
    },
  },
  {
    id: 'invalid',
    name: 'Nguồn trùng đích',
    group: 'invalid',
    input: { n: 2, edges: [], source: 0, sink: 0 },
  },
]
