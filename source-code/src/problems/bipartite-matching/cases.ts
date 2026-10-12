import type { TestCase } from '../../core/contracts'
import type { Input } from './definition'
import { generate } from './generators'
export const cases: TestCase<Input>[] = [
  {
    id: 'normal',
    name: 'Hai cặp độc lập',
    group: 'normal',
    input: {
      left: 2,
      right: 2,
      edges: [
        [0, 0],
        [1, 1],
      ],
    },
  },
  { id: 'edge', name: 'Không có cạnh', group: 'edge', input: { left: 2, right: 2, edges: [] } },
  { id: 'small', name: 'Đồ thị nhỏ', group: 'small', input: generate(3, 'tiny') },
  { id: 'large', name: 'Đồ thị lớn', group: 'large', input: generate(8, 'large') },
  {
    id: 'special',
    name: 'Cần đổi cặp',
    group: 'special',
    input: {
      left: 2,
      right: 2,
      edges: [
        [0, 0],
        [0, 1],
        [1, 0],
      ],
    },
  },
  {
    id: 'invalid',
    name: 'Đỉnh phải ngoài phạm vi',
    group: 'invalid',
    input: { left: 2, right: 2, edges: [[0, 2]] },
  },
]
