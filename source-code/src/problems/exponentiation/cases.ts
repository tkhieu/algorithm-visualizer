import type { TestCase } from '../../core/contracts';
import type { Input } from './definition';
import { generate } from './generators';
import { reference } from './checker';
const raw: TestCase<Input>[] = [
  { id: 'normal-1', name: 'Hai mũ năm', group: 'normal', input: { base: 2, exponent: 5 } },
  { id: 'normal-2', name: 'Cơ số âm', group: 'normal', input: { base: -2, exponent: 3 } },
  { id: 'edge-zero', name: 'Số mũ bằng không', group: 'edge', input: { base: 0, exponent: 0 } },
  { id: 'small-1', name: 'Dữ liệu nhỏ', group: 'small', input: generate(7, 'small') },
  { id: 'large-1', name: 'Dữ liệu lớn', group: 'large', input: generate(13, 'large') },
  {
    id: 'special-negative-even',
    name: 'Lũy thừa chẵn của số âm',
    group: 'special',
    input: { base: -3, exponent: 6 }
  },
  {
    id: 'invalid-negative-power',
    name: 'Số mũ âm',
    group: 'invalid',
    input: { base: 2, exponent: -1 }
  }
];
export const cases = raw.map((c) =>
  c.group === 'invalid' ? c : { ...c, expected: { value: reference(c.input as Input) } }
);
