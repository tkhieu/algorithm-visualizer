import type { TestCase } from '../../core/contracts';
import type { Input } from './definition';
import { generate } from './generators';
import { reference } from './checker';
const raw: TestCase<Input>[] = [
  { id: 'normal-1', name: 'Hai số có ước chung', group: 'normal', input: { a: 18, b: 12 } },
  { id: 'normal-2', name: 'Hai số nguyên tố cùng nhau', group: 'normal', input: { a: 35, b: 64 } },
  { id: 'edge-zero', name: 'Một số bằng không', group: 'edge', input: { a: 0, b: 7 } },
  { id: 'small-1', name: 'Dữ liệu nhỏ', group: 'small', input: generate(7, 'small') },
  { id: 'large-1', name: 'Dữ liệu lớn', group: 'large', input: generate(13, 'large') },
  { id: 'special-equal', name: 'Hai số bằng nhau', group: 'special', input: { a: 144, b: 144 } },
  { id: 'invalid-zero', name: 'Cả hai bằng không', group: 'invalid', input: { a: 0, b: 0 } }
];
export const cases = raw.map((c) =>
  c.group === 'invalid' ? c : { ...c, expected: { gcd: reference(c.input as Input) } }
);
