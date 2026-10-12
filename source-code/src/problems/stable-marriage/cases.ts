import type { TestCase } from '../../core/contracts'
import type { Input } from './definition'
import { generate } from './generators'
export const cases: TestCase<Input>[] = [
  {
    id: 'normal',
    name: 'Hai cặp',
    group: 'normal',
    input: {
      men: [
        [0, 1],
        [0, 1],
      ],
      women: [
        [1, 0],
        [0, 1],
      ],
    },
  },
  { id: 'edge', name: 'Một cặp', group: 'edge', input: { men: [[0]], women: [[0]] } },
  { id: 'small', name: 'Ưu tiên nhỏ', group: 'small', input: generate(3, 'tiny') },
  { id: 'large', name: 'Ưu tiên lớn', group: 'large', input: generate(8, 'large') },
  {
    id: 'special',
    name: 'Hai phía muốn khác nhau',
    group: 'special',
    input: {
      men: [
        [0, 1],
        [1, 0],
      ],
      women: [
        [1, 0],
        [0, 1],
      ],
    },
  },
  {
    id: 'invalid',
    name: 'Ưu tiên trùng',
    group: 'invalid',
    input: {
      men: [
        [0, 0],
        [1, 0],
      ],
      women: [
        [0, 1],
        [1, 0],
      ],
    },
  },
]
