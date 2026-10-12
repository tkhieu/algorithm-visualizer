import type { TestCase } from '../../core/contracts';
import type { Input } from './definition';
import { generate } from './generators';
import { reference } from './checker';
const raw: TestCase<Input>[] = [
  {
    id: 'normal-1',
    name: 'Đa thức bậc hai',
    group: 'normal',
    input: { coefficients: [2, 3, 1], x: 2 }
  },
  {
    id: 'normal-2',
    name: 'Giá trị âm',
    group: 'normal',
    input: { coefficients: [1, 2, 3], x: -2 }
  },
  { id: 'edge-constant', name: 'Đa thức hằng', group: 'edge', input: { coefficients: [5], x: -2 } },
  { id: 'small-1', name: 'Dữ liệu nhỏ', group: 'small', input: generate(7, 'small') },
  { id: 'large-1', name: 'Dữ liệu lớn', group: 'large', input: generate(13, 'large') },
  {
    id: 'special-zero',
    name: 'Tính tại 0',
    group: 'special',
    input: { coefficients: [7, 9, 3], x: 0 }
  },
  {
    id: 'invalid-empty',
    name: 'Không có hệ số',
    group: 'invalid',
    input: { coefficients: [], x: 2 }
  }
];
export const cases = raw.map((c) =>
  c.group === 'invalid' ? c : { ...c, expected: { value: reference(c.input as Input) } }
);
