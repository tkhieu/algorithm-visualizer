import {describe, it, expect} from 'vitest';
import {problem} from './index';
import {cases} from './cases';
import {generate} from './generators';
import {check, bruteForceClosest} from './checker';

describe('bài toán cặp điểm gần nhất', () => {
 it('bốn điểm cơ bản có cặp gần nhất đúng', () => {
  const c = cases.find(x => x.id === 'normal-1')!;
  const best = bruteForceClosest(c.input as never);
  expect(best.distance).toBeCloseTo(Math.sqrt(17));
 });

 it('bộ chấm chấp nhận nghiệm tối ưu và phát hiện nghiệm không tối ưu hoặc sai định dạng', () => {
  const input = {points: [{x: 0, y: 0}, {x: 3, y: 4}, {x: 0, y: 1}]};
  expect(check(input, {i: 0, j: 2, distance: 1})).toMatchObject({ok: true, optimal: true});
  expect(check(input, {i: 0, j: 1, distance: 5})).toMatchObject({ok: true, optimal: false});
  expect(check(input, {i: 0, j: 1, distance: 999}).ok).toBe(false);
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
