import type { TestCase } from '../../core/contracts';
import type { Input } from './definition';
import { generate } from './generators';
import { reference } from './checker';
const raw: TestCase<Input>[] = [
  { id: 'normal-1', name: 'Bảy người đếm ba', group: 'normal', input: { n: 7, k: 3 } },
  { id: 'normal-2', name: 'Mười người đếm hai', group: 'normal', input: { n: 10, k: 2 } },
  { id: 'edge-one', name: 'Một người', group: 'edge', input: { n: 1, k: 5 } },
  { id: 'small-1', name: 'Dữ liệu nhỏ', group: 'small', input: generate(7, 'small') },
  { id: 'large-1', name: 'Dữ liệu lớn', group: 'large', input: generate(13, 'large') },
  { id: 'special-k-one', name: 'Đếm từng người', group: 'special', input: { n: 6, k: 1 } },
  { id: 'invalid-zero', name: 'Không có người', group: 'invalid', input: { n: 0, k: 3 } }
];
export const cases = raw.map((c) =>
  c.group === 'invalid' ? c : { ...c, expected: { survivor: reference(c.input as Input) } }
);
