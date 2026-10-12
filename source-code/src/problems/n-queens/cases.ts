import type {TestCase} from '../../core/contracts';
import type {Input} from './definition';
import {generate} from './generators';
export const cases: TestCase<Input>[] = [
  {id: 'normal-1', name: 'Bàn cờ 4×4', group: 'normal', input: {n: 4}},
  {id: 'normal-2', name: 'Bàn cờ 8×8 cổ điển', group: 'normal', input: {n: 8}},
  {id: 'edge-single', name: 'Bàn cờ 1×1', group: 'edge', input: {n: 1}},
  {id: 'edge-two', name: 'Bàn cờ 2×2 — vô nghiệm', group: 'edge', input: {n: 2}},
  {id: 'edge-three', name: 'Bàn cờ 3×3 — vô nghiệm', group: 'edge', input: {n: 3}},
  {id: 'small-1', name: 'Cỡ nhỏ 1', group: 'small', input: generate(1, 'small')},
  {id: 'small-2', name: 'Cỡ nhỏ 2', group: 'small', input: generate(2, 'small')},
  {id: 'large-1', name: 'Cỡ lớn 1', group: 'large', input: generate(1, 'large')},
  {id: 'large-2', name: 'Cỡ lớn 2', group: 'large', input: generate(2, 'large')},
  {id: 'special-five', name: 'n = 5', group: 'special', input: {n: 5}},
  {id: 'invalid-zero', name: 'n bằng 0', group: 'invalid', input: {n: 0}},
  {id: 'invalid-large', name: 'n vượt giới hạn', group: 'invalid', input: {n: 13}},
];
