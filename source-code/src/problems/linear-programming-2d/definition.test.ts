import {describe, it, expect} from 'vitest';
import {problem} from './index';
import {cases} from './cases';
import {generate} from './generators';
import {check, optimum} from './checker';

describe('bài toán quy hoạch tuyến tính 2 chiều', () => {
 it('ví dụ Levitin: tối ưu tại (2,6) giá trị 36', () => {
  const input = {
   objective: {cx: 3, cy: 5},
   constraints: [{a: 1, b: 0, c: 4}, {a: 0, b: 2, c: 12}, {a: 3, b: 2, c: 18}],
  };
  const best = optimum(input);
  expect(best.value).toBeCloseTo(36);
  expect(best.x).toBeCloseTo(2);
  expect(best.y).toBeCloseTo(6);
 });

 it('bộ chấm từ chối điểm ngoài miền khả thi hoặc giá trị sai', () => {
  const input = {objective: {cx: 1, cy: 1}, constraints: [{a: 1, b: 0, c: 5}, {a: 0, b: 1, c: 5}]};
  expect(check(input, {x: 5, y: 5, value: 10})).toMatchObject({ok: true, optimal: true});
  expect(check(input, {x: 6, y: 5, value: 11}).ok).toBe(false);
  expect(check(input, {x: 5, y: 5, value: 999}).ok).toBe(false);
  expect(check(input, {x: 0, y: 0, value: 0})).toMatchObject({ok: true, optimal: false});
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
