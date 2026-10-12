import type {TestCase} from '../../core/contracts';
import type {Input} from './definition';
import {generate} from './generators';

export const cases: TestCase<Input>[] = [
  {id: 'normal-1', name: 'Ví dụ cơ bản', group: 'normal', input: {a: 'ABCBDAB', b: 'BDCABA'}},
  {id: 'normal-2', name: 'Cỡ nhỏ ngẫu nhiên', group: 'normal', input: generate(1, 'small')},
  {id: 'edge-empty-a', name: 'Chuỗi a rỗng', group: 'edge', input: {a: '', b: 'ABC'}},
  {id: 'edge-empty-both', name: 'Cả hai chuỗi rỗng', group: 'edge', input: {a: '', b: ''}},
  {id: 'edge-identical', name: 'Hai chuỗi giống nhau', group: 'edge', input: {a: 'ABCDE', b: 'ABCDE'}},
  {id: 'small-1', name: 'Cỡ nhỏ 1', group: 'small', input: generate(2, 'small')},
  {id: 'small-2', name: 'Cỡ nhỏ 2', group: 'small', input: generate(3, 'small')},
  {id: 'large-1', name: 'Cỡ lớn 1', group: 'large', input: generate(1, 'large')},
  {id: 'large-2', name: 'Cỡ lớn 2', group: 'large', input: generate(2, 'large')},
  {id: 'special-disjoint', name: 'Không có ký tự chung', group: 'special', input: {a: 'AAA', b: 'BBB'}},
  {id: 'invalid-too-long', name: 'Chuỗi vượt giới hạn', group: 'invalid', input: {a: 'A'.repeat(50), b: 'B'}},
];
