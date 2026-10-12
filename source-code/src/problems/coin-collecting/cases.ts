import type {TestCase} from '../../core/contracts';
import type {Input} from './definition';
import {generate} from './generators';
import {optimum} from './checker';

const raw: TestCase<Input>[] = [
 {
  id: 'normal-1',
  name: 'Lưới 3x3 có đồng xu',
  group: 'normal',
  input: {grid: [[false, true, false], [false, false, true], [true, false, false]]},
 },
 {id: 'normal-2', name: 'Ngẫu nhiên nhỏ', group: 'normal', input: generate(1, 'small')},
 {id: 'edge-single-cell', name: 'Lưới 1x1', group: 'edge', input: {grid: [[true]]}},
 {id: 'edge-single-row', name: 'Một hàng', group: 'edge', input: {grid: [[true, false, true, true]]}},
 {id: 'edge-single-col', name: 'Một cột', group: 'edge', input: {grid: [[true], [false], [true]]}},
 {id: 'small-1', name: 'Tập nhỏ 1', group: 'small', input: generate(7, 'tiny')},
 {id: 'small-2', name: 'Tập nhỏ 2', group: 'small', input: generate(13, 'small')},
 {id: 'large-1', name: 'Tập lớn 1', group: 'large', input: generate(21, 'large')},
 {id: 'large-2', name: 'Tập lớn 2', group: 'large', input: generate(22, 'large')},
 {
  id: 'special-no-coins',
  name: 'Không có đồng xu nào',
  group: 'special',
  input: {grid: [[false, false], [false, false]]},
 },
 {
  id: 'invalid-uneven',
  name: 'Các hàng không cùng độ dài',
  group: 'invalid',
  input: {grid: [[true, false], [true]]},
 },
];

export const cases: TestCase<Input>[] = raw.map(c => {
 if (c.group === 'invalid') return c;
 const input = c.input as Input;
 return {...c, expected: optimum(input.grid)};
});
