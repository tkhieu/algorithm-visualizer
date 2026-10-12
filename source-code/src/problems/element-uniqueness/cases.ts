import type { TestCase } from '../../core/contracts';
import type { Input } from './definition';
import { generate } from './generators';
export const cases: TestCase<Input>[] = [
  {
    id: 'normal-unique',
    name: 'Dãy không trùng',
    group: 'normal',
    input: { values: [5, 3, 8, 1, 9, 2] },
  },
  {
    id: 'normal-duplicate',
    name: 'Dãy có trùng',
    group: 'normal',
    input: { values: [5, 3, 8, 1, 3, 2] },
  },
  { id: 'edge-empty', name: 'Dãy rỗng', group: 'edge', input: { values: [] } },
  { id: 'edge-single', name: 'Một phần tử', group: 'edge', input: { values: [7] } },
  {
    id: 'edge-all-same',
    name: 'Tất cả giống nhau',
    group: 'edge',
    input: { values: [4, 4, 4, 4, 4] },
  },
  { id: 'edge-pair', name: 'Hai phần tử bằng nhau', group: 'edge', input: { values: [9, 9] } },
  { id: 'small-1', name: 'Tập nhỏ 1', group: 'small', input: generate(1, 'tiny') },
  { id: 'small-2', name: 'Tập nhỏ 2', group: 'small', input: generate(2, 'small') },
  { id: 'large-1', name: 'Tập lớn 1', group: 'large', input: generate(11, 'large') },
  { id: 'large-2', name: 'Tập lớn 2', group: 'large', input: generate(12, 'large') },
  {
    id: 'special-negative',
    name: 'Trùng giá trị âm',
    group: 'special',
    input: { values: [-3, 2, -3, 7, 0] },
  },
  {
    id: 'special-heavy',
    name: 'Trùng lặp dày đặc (mode)',
    group: 'special',
    input: { values: [1, 2, 2, 3, 2, 4, 2, 5] },
  },
  {
    id: 'invalid-range',
    name: 'Giá trị ngoài phạm vi',
    group: 'invalid',
    input: { values: [1000] },
  },
  {
    id: 'invalid-length',
    name: 'Dãy quá dài',
    group: 'invalid',
    input: { values: Array.from({ length: 81 }, (_, i) => i) },
  },
];
