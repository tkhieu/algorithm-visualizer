import {describe, it, expect} from 'vitest';
import {problem} from './index';
import {cases} from './cases';
import {generate} from './generators';
import {check} from './checker';

describe('bài toán bao lồi', () => {
 it('tam giác: bao lồi là chính ba điểm', () => {
  const c = cases.find(x => x.id === 'edge-triangle')!;
  expect(check(c.input as never, {hull: [0, 1, 2]})).toMatchObject({ok: true});
 });

 it('bộ chấm từ chối đỉnh không lồi hoặc bỏ sót điểm', () => {
  const input = {points: [{x: 0, y: 0}, {x: 10, y: 0}, {x: 10, y: 10}, {x: 0, y: 10}, {x: 5, y: 5}]};
  expect(check(input, {hull: [0, 1, 2, 3]})).toMatchObject({ok: true});
  expect(check(input, {hull: [0, 1, 4, 3]}).ok).toBe(false);
  expect(check(input, {hull: [0, 1]}).ok).toBe(false);
 });

 it('đầu vào sai bị từ chối', () => {
  for (const c of cases.filter(x => x.group === 'invalid')) {
   expect(problem.inputSchema.safeParse(c.input).success).toBe(false);
  }
 });

 it('generate luôn sinh input hợp lệ', () => {
  for (const seed of [1, 2, 3, 4, 5]) {
   for (const size of ['tiny', 'small', 'medium', 'large'] as const) {
    expect(problem.inputSchema.safeParse(generate(seed, size)).success).toBe(true);
   }
  }
 });
});
