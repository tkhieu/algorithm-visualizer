import type {TestCase} from '../../core/contracts';
import type {Input} from './definition';
import {generate} from './generators';

const classic: Input = {
  cost: [
    [9, 2, 7, 8],
    [6, 4, 3, 7],
    [5, 8, 1, 8],
    [7, 6, 9, 4],
  ],
};

export const cases: TestCase<Input>[] = [
  {id: 'normal-1', name: 'Ma trận 4×4 kinh điển', group: 'normal', input: classic},
  {id: 'normal-2', name: 'Cỡ nhỏ ngẫu nhiên', group: 'normal', input: generate(1, 'small')},
  {id: 'edge-single', name: 'Một người một việc', group: 'edge', input: {cost: [[5]]}},
  {id: 'edge-zero', name: 'Chi phí toàn 0', group: 'edge', input: {cost: [[0, 0], [0, 0]]}},
  {id: 'small-1', name: 'Cỡ nhỏ 1', group: 'small', input: generate(2, 'small')},
  {id: 'small-2', name: 'Cỡ nhỏ 2', group: 'small', input: generate(3, 'small')},
  {id: 'large-1', name: 'Cỡ lớn 1', group: 'large', input: generate(1, 'large')},
  {id: 'large-2', name: 'Cỡ lớn 2', group: 'large', input: generate(2, 'large')},
  {id: 'special-tie', name: 'Nhiều nghiệm tối ưu bằng nhau', group: 'special', input: {cost: [[1, 1], [1, 1]]}},
  {id: 'invalid-rectangular', name: 'Ma trận không vuông', group: 'invalid', input: {cost: [[1, 2, 3], [4, 5]]}},
];
