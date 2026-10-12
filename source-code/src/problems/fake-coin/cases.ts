import type { TestCase } from '../../core/contracts';
import type { Input } from './definition';
import { generate } from './generators';
import { reference } from './checker';
const raw: TestCase<Input>[] = [
  { id: 'normal-1', name: 'Ba đồng xu', group: 'normal', input: { weights: [10, 9, 10] } },
  { id: 'normal-2', name: 'Bốn đồng xu', group: 'normal', input: { weights: [10, 10, 9, 10] } },
  { id: 'edge-two', name: 'Hai đồng xu', group: 'edge', input: { weights: [9, 10] } },
  { id: 'small-1', name: 'Dữ liệu nhỏ', group: 'small', input: generate(7, 'small') },
  { id: 'large-1', name: 'Dữ liệu lớn', group: 'large', input: generate(13, 'large') },
  {
    id: 'special-last',
    name: 'Xu giả cuối dãy',
    group: 'special',
    input: { weights: [10, 10, 10, 9] }
  },
  { id: 'invalid-two', name: 'Hai xu giả', group: 'invalid', input: { weights: [9, 10, 9] } }
];
export const cases = raw.map((c) =>
  c.group === 'invalid' ? c : { ...c, expected: { index: reference(c.input as Input) } }
);
