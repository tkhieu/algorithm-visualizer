import type {TestCase} from '../../core/contracts';
import type {Input} from './definition';
import {generate} from './generators';
import {optimum} from './checker';

const raw: TestCase<Input>[] = [
 {id: 'normal-1', name: 'Ví dụ Levitin', group: 'normal', input: {values: [5, 1, 2, 10, 6, 2]}},
 {id: 'normal-2', name: 'Ngẫu nhiên nhỏ', group: 'normal', input: generate(1, 'small')},
 {id: 'edge-empty', name: 'Không có đồng xu', group: 'edge', input: {values: []}},
 {id: 'edge-single', name: 'Một đồng xu', group: 'edge', input: {values: [7]}},
 {id: 'edge-two', name: 'Hai đồng xu', group: 'edge', input: {values: [3, 9]}},
 {id: 'small-1', name: 'Tập nhỏ 1', group: 'small', input: generate(7, 'tiny')},
 {id: 'small-2', name: 'Tập nhỏ 2', group: 'small', input: generate(13, 'small')},
 {id: 'large-1', name: 'Tập lớn 1', group: 'large', input: generate(21, 'large')},
 {id: 'large-2', name: 'Tập lớn 2', group: 'large', input: generate(22, 'large')},
 {id: 'special-tie', name: 'Hai lựa chọn ngang nhau', group: 'special', input: {values: [4, 4]}},
 {id: 'invalid-negative', name: 'Giá trị âm', group: 'invalid', input: {values: [-1, 2]}},
 {
  id: 'invalid-too-long',
  name: 'Dãy quá dài',
  group: 'invalid',
  input: {values: Array.from({length: 61}, () => 1)},
 },
];

export const cases: TestCase<Input>[] = raw.map(c =>
 c.group === 'invalid' ? c : {...c, expected: optimum((c.input as Input).values)},
);
