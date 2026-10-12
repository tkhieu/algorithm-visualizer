import type { TestCase } from '../../core/contracts';
import type { Input } from './definition';
import { generate } from './generators';
export const cases: TestCase<Input>[] = [
  {
    id: 'normal-1',
    name: 'Dãy nhỏ chưa sắp',
    group: 'normal',
    input: { values: [5, 3, 8, 1, 9, 2, 7] },
  },
  { id: 'normal-2', name: 'Bộ sinh ngẫu nhiên', group: 'normal', input: generate(3, 'small') },
  { id: 'edge-empty', name: 'Dãy rỗng', group: 'edge', input: { values: [] } },
  { id: 'edge-single', name: 'Một phần tử', group: 'edge', input: { values: [5] } },
  { id: 'edge-sorted', name: 'Đã sắp sẵn', group: 'edge', input: { values: [1, 2, 3, 4, 5] } },
  { id: 'edge-reverse', name: 'Sắp ngược', group: 'edge', input: { values: [5, 4, 3, 2, 1] } },
  { id: 'edge-same', name: 'Toàn bộ giống nhau', group: 'edge', input: { values: [4, 4, 4, 4] } },
  { id: 'small-1', name: 'Tập nhỏ 1', group: 'small', input: generate(7, 'tiny') },
  { id: 'large-1', name: 'Tập lớn 1', group: 'large', input: generate(19, 'large') },
  {
    id: 'special-negative',
    name: 'Có số âm',
    group: 'special',
    input: { values: [-3, 5, -8, 0, 2, -1] },
  },
  {
    id: 'special-duplicates',
    name: 'Nhiều trùng lặp (đếm phân phối)',
    group: 'special',
    input: { values: [2, 1, 2, 3, 1, 2, 3, 3, 1] },
  },
  {
    id: 'invalid-length',
    name: 'Dãy quá dài',
    group: 'invalid',
    input: { values: Array.from({ length: 61 }, (_, i) => i) },
  },
  {
    id: 'invalid-range',
    name: 'Giá trị ngoài phạm vi',
    group: 'invalid',
    input: { values: [1000] },
  },
];
