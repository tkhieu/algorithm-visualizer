import type {TestCase} from '../../core/contracts';
import type {Input} from './definition';
import {generate} from './generators';
import {optimum} from './checker';

const raw: TestCase<Input>[] = [
 {
  id: 'normal-1',
  name: 'Ví dụ Levitin (4 khoá)',
  group: 'normal',
  input: {freq: [0.1, 0.2, 0.4, 0.3].map(x => x * 100)},
 },
 {id: 'normal-2', name: 'Ngẫu nhiên nhỏ', group: 'normal', input: generate(1, 'small')},
 {id: 'edge-single', name: 'Một khoá', group: 'edge', input: {freq: [7]}},
 {id: 'edge-two', name: 'Hai khoá', group: 'edge', input: {freq: [3, 9]}},
 {id: 'small-1', name: 'Tập nhỏ 1', group: 'small', input: generate(7, 'tiny')},
 {id: 'small-2', name: 'Tập nhỏ 2', group: 'small', input: generate(13, 'small')},
 {id: 'large-1', name: 'Tập lớn 1', group: 'large', input: generate(21, 'large')},
 {id: 'large-2', name: 'Tập lớn 2', group: 'large', input: generate(22, 'large')},
 {
  id: 'special-skewed',
  name: 'Tần suất lệch mạnh về một khoá',
  group: 'special',
  input: {freq: [1, 1, 100, 1, 1]},
 },
 {id: 'invalid-empty', name: 'Không có khoá nào', group: 'invalid', input: {freq: []}},
];

export const cases: TestCase<Input>[] = raw.map(c => {
 if (c.group === 'invalid') return c;
 const input = c.input as Input;
 return {...c, expected: optimum(input.freq)};
});
