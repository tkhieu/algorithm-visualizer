import type {TestCase} from '../../core/contracts';
import type {Input} from './definition';
import {generate} from './generators';
export const cases: TestCase<Input>[] = [
  {id: 'normal-1', name: 'Ví dụ cơ bản có nghiệm', group: 'normal', input: {values: [3, 34, 4, 12, 5, 2], target: 9}},
  {id: 'normal-2', name: 'Ví dụ cơ bản vô nghiệm', group: 'normal', input: {values: [3, 34, 4, 12, 5, 2], target: 61}},
  {id: 'edge-single-match', name: 'Một số bằng đích', group: 'edge', input: {values: [7], target: 7}},
  {id: 'edge-single-miss', name: 'Một số khác đích', group: 'edge', input: {values: [7], target: 3}},
  {id: 'edge-zero', name: 'Đích bằng 0 (tập rỗng)', group: 'edge', input: {values: [1, 2, 3], target: 0}},
  {id: 'small-1', name: 'Cỡ nhỏ 1', group: 'small', input: generate(1, 'small')},
  {id: 'small-2', name: 'Cỡ nhỏ 2', group: 'small', input: generate(2, 'small')},
  {id: 'large-1', name: 'Cỡ lớn 1', group: 'large', input: generate(1, 'large')},
  {id: 'large-2', name: 'Cỡ lớn 2', group: 'large', input: generate(2, 'large')},
  {id: 'special-all', name: 'Đích bằng tổng tất cả', group: 'special', input: {values: [2, 3, 5], target: 10}},
  {id: 'invalid-negative', name: 'Giá trị âm', group: 'invalid', input: {values: [-1, 2], target: 1}},
];
