import type { TestCase } from '../../core/contracts';
import type { Input } from './definition';
import { generate } from './generators';
export const cases: TestCase<Input>[] = [
  {
    id: 'normal-1',
    name: 'Mảng nhỏ chưa có thứ tự',
    group: 'normal',
    input: { values: [5, 3, 8, 1, 9, 2, 7] },
  },
  { id: 'normal-2', name: 'Bộ sinh ngẫu nhiên', group: 'normal', input: generate(3, 'small') },
  { id: 'edge-empty', name: 'Mảng rỗng', group: 'edge', input: { values: [] } },
  { id: 'edge-single', name: 'Một phần tử', group: 'edge', input: { values: [5] } },
  {
    id: 'edge-already-heap',
    name: 'Đã là max-heap',
    group: 'edge',
    input: { values: [9, 7, 8, 3, 6, 2, 5] },
  },
  { id: 'small-1', name: 'Tập nhỏ 1', group: 'small', input: generate(7, 'tiny') },
  { id: 'large-1', name: 'Tập lớn 1', group: 'large', input: generate(19, 'large') },
  {
    id: 'special-ascending',
    name: 'Dãy tăng dần (nhiều lần đổi chỗ)',
    group: 'special',
    input: { values: [1, 2, 3, 4, 5, 6, 7, 8] },
  },
  {
    id: 'special-duplicates',
    name: 'Nhiều giá trị trùng',
    group: 'special',
    input: { values: [4, 4, 4, 4, 4] },
  },
  {
    id: 'invalid-length',
    name: 'Mảng quá dài',
    group: 'invalid',
    input: { values: Array.from({ length: 41 }, (_, i) => i) },
  },
  {
    id: 'invalid-range',
    name: 'Giá trị ngoài phạm vi',
    group: 'invalid',
    input: { values: [1000] },
  },
];
