import type {TestCase} from '../../core/contracts';
import type {Input} from './definition';
import {generate} from './generators';
import {bruteForceClosest} from './checker';

const raw: TestCase<Input>[] = [
 {
  id: 'normal-1',
  name: 'Bốn điểm cơ bản',
  group: 'normal',
  input: {points: [{x: 0, y: 0}, {x: 4, y: 1}, {x: 1, y: 4}, {x: 5, y: 5}]},
 },
 {id: 'normal-2', name: 'Ngẫu nhiên nhỏ', group: 'normal', input: generate(1, 'small')},
 {id: 'edge-two', name: 'Chỉ hai điểm', group: 'edge', input: {points: [{x: 0, y: 0}, {x: 3, y: 4}]}},
 {
  id: 'edge-duplicate',
  name: 'Hai điểm trùng nhau',
  group: 'edge',
  input: {points: [{x: 2, y: 2}, {x: 2, y: 2}, {x: 10, y: 10}]},
 },
 {id: 'small-1', name: 'Tập nhỏ 1', group: 'small', input: generate(7, 'tiny')},
 {id: 'small-2', name: 'Tập nhỏ 2', group: 'small', input: generate(13, 'small')},
 {id: 'large-1', name: 'Tập lớn 1', group: 'large', input: generate(21, 'large')},
 {id: 'large-2', name: 'Tập lớn 2', group: 'large', input: generate(22, 'large')},
 {
  id: 'special-cluster',
  name: 'Một cặp rất gần giữa đám điểm thưa',
  group: 'special',
  input: {points: [{x: -100, y: -100}, {x: 100, y: 100}, {x: 0, y: 0}, {x: 1, y: 0}, {x: -80, y: 60}]},
 },
 {id: 'invalid-one-point', name: 'Chỉ một điểm', group: 'invalid', input: {points: [{x: 0, y: 0}]}},
 {id: 'invalid-empty', name: 'Không có điểm', group: 'invalid', input: {points: []}},
];

export const cases: TestCase<Input>[] = raw.map(c =>
 c.group === 'invalid' ? c : {...c, expected: bruteForceClosest(c.input as Input).distance},
);
