import type {TestCase} from '../../core/contracts';
import type {Input} from './definition';
import {generate} from './generators';

export const cases: TestCase<Input>[] = [
  {id: 'normal-1', name: 'Ví dụ kinh điển (4 ma trận)', group: 'normal', input: {dims: [10, 100, 5, 50]}},
  {id: 'normal-2', name: 'Ví dụ 6 ma trận', group: 'normal', input: {dims: [30, 35, 15, 5, 10, 20, 25]}},
  {id: 'edge-single', name: 'Một ma trận duy nhất', group: 'edge', input: {dims: [4, 7]}},
  {id: 'edge-two', name: 'Hai ma trận', group: 'edge', input: {dims: [2, 3, 4]}},
  {id: 'small-1', name: 'Cỡ nhỏ 1', group: 'small', input: generate(1, 'small')},
  {id: 'small-2', name: 'Cỡ nhỏ 2', group: 'small', input: generate(2, 'small')},
  {id: 'large-1', name: 'Cỡ lớn 1', group: 'large', input: generate(1, 'large')},
  {id: 'large-2', name: 'Cỡ lớn 2', group: 'large', input: generate(2, 'large')},
  {id: 'special-equal', name: 'Mọi kích thước bằng nhau', group: 'special', input: {dims: [10, 10, 10, 10, 10]}},
  {id: 'invalid-empty', name: 'Không có kích thước nào', group: 'invalid', input: {dims: []}},
];
