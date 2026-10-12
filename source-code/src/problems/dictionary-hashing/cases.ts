import type { TestCase } from '../../core/contracts';
import type { Input } from './definition';
import { generate } from './generators';
export const cases: TestCase<Input>[] = [
  {
    id: 'normal-1',
    name: 'Va chạm cơ bản',
    group: 'normal',
    input: { tableSize: 7, keys: [10, 22, 31, 4, 15, 28, 17] },
  },
  { id: 'normal-2', name: 'Bộ khóa ngẫu nhiên', group: 'normal', input: generate(3, 'small') },
  { id: 'edge-empty', name: 'Không có khóa', group: 'edge', input: { tableSize: 7, keys: [] } },
  { id: 'edge-single', name: 'Một khóa', group: 'edge', input: { tableSize: 7, keys: [5] } },
  {
    id: 'edge-full',
    name: 'Bảng đầy vừa khít',
    group: 'edge',
    input: { tableSize: 5, keys: [0, 1, 2, 3, 4] },
  },
  {
    id: 'edge-duplicate',
    name: 'Khóa trùng lặp',
    group: 'edge',
    input: { tableSize: 7, keys: [9, 9, 9] },
  },
  { id: 'small-1', name: 'Tập nhỏ 1', group: 'small', input: generate(9, 'tiny') },
  { id: 'large-1', name: 'Tập lớn 1', group: 'large', input: generate(21, 'large') },
  {
    id: 'special-collision',
    name: 'Toàn bộ khóa cùng dư',
    group: 'special',
    input: { tableSize: 5, keys: [3, 8, 13, 18] },
  },
  {
    id: 'invalid-table',
    name: 'Kích thước bảng không hợp lệ',
    group: 'invalid',
    input: { tableSize: 0, keys: [] },
  },
  { id: 'invalid-key', name: 'Khóa âm', group: 'invalid', input: { tableSize: 5, keys: [-1] } },
];
