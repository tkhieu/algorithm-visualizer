import type {TestCase} from '../../core/contracts';
import type {Input} from './definition';
import {generate} from './generators';

const raw: TestCase<Input>[] = [
 {
  id: 'normal-1',
  name: 'Hình vuông có điểm trong',
  group: 'normal',
  input: {points: [{x: 0, y: 0}, {x: 10, y: 0}, {x: 10, y: 10}, {x: 0, y: 10}, {x: 5, y: 5}]},
 },
 {id: 'normal-2', name: 'Ngẫu nhiên nhỏ', group: 'normal', input: generate(1, 'small')},
 {
  id: 'edge-triangle',
  name: 'Tam giác (3 điểm)',
  group: 'edge',
  input: {points: [{x: 0, y: 0}, {x: 4, y: 0}, {x: 2, y: 5}]},
 },
 {
  id: 'edge-all-on-hull',
  name: 'Mọi điểm đều ở biên (ngũ giác lồi)',
  group: 'edge',
  input: {points: [{x: 0, y: 3}, {x: 3, y: 0}, {x: 6, y: 1}, {x: 5, y: 5}, {x: 2, y: 6}]},
 },
 {id: 'small-1', name: 'Tập nhỏ 1', group: 'small', input: generate(7, 'tiny')},
 {id: 'small-2', name: 'Tập nhỏ 2', group: 'small', input: generate(13, 'small')},
 {id: 'large-1', name: 'Tập lớn 1', group: 'large', input: generate(21, 'large')},
 {id: 'large-2', name: 'Tập lớn 2', group: 'large', input: generate(22, 'large')},
 {
  id: 'special-many-interior',
  name: 'Nhiều điểm trong, bao lồi nhỏ',
  group: 'special',
  input: {
   points: [
    {x: -20, y: -20}, {x: 20, y: -20}, {x: 20, y: 20}, {x: -20, y: 20},
    {x: 0, y: 0}, {x: 1, y: 1}, {x: -1, y: 2}, {x: 3, y: -4}, {x: -5, y: 3},
   ],
  },
 },
 {
  id: 'invalid-two-points',
  name: 'Chỉ hai điểm',
  group: 'invalid',
  input: {points: [{x: 0, y: 0}, {x: 1, y: 1}]},
 },
];

export const cases: TestCase<Input>[] = raw;
