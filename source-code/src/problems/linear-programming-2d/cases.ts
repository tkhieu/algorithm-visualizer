import type {TestCase} from '../../core/contracts';
import type {Input} from './definition';
import {generate} from './generators';
import {optimum} from './checker';

const raw: TestCase<Input>[] = [
 {
  id: 'normal-1',
  name: 'Ví dụ Levitin (3x+5y)',
  group: 'normal',
  input: {
   objective: {cx: 3, cy: 5},
   constraints: [{a: 1, b: 0, c: 4}, {a: 0, b: 2, c: 12}, {a: 3, b: 2, c: 18}],
  },
 },
 {id: 'normal-2', name: 'Ngẫu nhiên nhỏ', group: 'normal', input: generate(1, 'small')},
 {
  id: 'edge-box-only',
  name: 'Chỉ ràng buộc hộp',
  group: 'edge',
  input: {objective: {cx: 2, cy: 1}, constraints: [{a: 1, b: 0, c: 5}, {a: 0, b: 1, c: 5}]},
 },
 {
  id: 'edge-tight',
  name: 'Miền khả thi rất nhỏ',
  group: 'edge',
  input: {
   objective: {cx: 1, cy: 1},
   constraints: [{a: 1, b: 0, c: 1}, {a: 0, b: 1, c: 1}, {a: 1, b: 1, c: 1}],
  },
 },
 {id: 'small-1', name: 'Tập nhỏ 1', group: 'small', input: generate(7, 'tiny')},
 {id: 'small-2', name: 'Tập nhỏ 2', group: 'small', input: generate(13, 'small')},
 {id: 'large-1', name: 'Tập lớn 1', group: 'large', input: generate(21, 'large')},
 {id: 'large-2', name: 'Tập lớn 2', group: 'large', input: generate(22, 'large')},
 {
  id: 'special-tie',
  name: 'Nhiều đỉnh cùng giá trị tối ưu',
  group: 'special',
  input: {
   objective: {cx: 1, cy: 1},
   constraints: [{a: 1, b: 0, c: 4}, {a: 0, b: 1, c: 4}, {a: 1, b: 1, c: 6}],
  },
 },
 {
  id: 'invalid-no-constraints',
  name: 'Không có ràng buộc',
  group: 'invalid',
  input: {objective: {cx: 1, cy: 1}, constraints: []},
 },
];

export const cases: TestCase<Input>[] = raw.map(c =>
 c.group === 'invalid' ? c : {...c, expected: optimum(c.input as Input).value},
);
