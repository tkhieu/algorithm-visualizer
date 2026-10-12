import type { TestCase } from '../../core/contracts';
import type { Input } from './definition';
import { generate } from './generators';
export const cases: TestCase<Input>[] = [
  {
    id: 'normal-1',
    name: 'Chèn ngẫu nhiên nhỏ',
    group: 'normal',
    input: { keys: [5, 2, 8, 1, 3, 7, 9] },
  },
  { id: 'normal-2', name: 'Bộ sinh ngẫu nhiên', group: 'normal', input: generate(3, 'small') },
  { id: 'edge-empty', name: 'Không có khóa', group: 'edge', input: { keys: [] } },
  { id: 'edge-single', name: 'Một khóa', group: 'edge', input: { keys: [5] } },
  {
    id: 'edge-duplicate',
    name: 'Khóa trùng lặp (bỏ qua)',
    group: 'edge',
    input: { keys: [3, 3, 3] },
  },
  { id: 'small-1', name: 'Tập nhỏ 1', group: 'small', input: generate(7, 'tiny') },
  { id: 'large-1', name: 'Tập lớn 1', group: 'large', input: generate(21, 'large') },
  {
    id: 'special-ascending',
    name: 'Dãy tăng dần (trường hợp xấu cho BST thường)',
    group: 'special',
    input: { keys: [1, 2, 3, 4, 5, 6, 7, 8] },
  },
  {
    id: 'special-descending',
    name: 'Dãy giảm dần',
    group: 'special',
    input: { keys: [8, 7, 6, 5, 4, 3, 2, 1] },
  },
  {
    id: 'invalid-length',
    name: 'Quá nhiều khóa',
    group: 'invalid',
    input: { keys: Array.from({ length: 25 }, (_, i) => i) },
  },
  { id: 'invalid-range', name: 'Khóa ngoài phạm vi', group: 'invalid', input: { keys: [10000] } },
];
