import {describe, it, expect} from 'vitest';
import {problem} from './index';
import {cases} from './cases';
import {generate} from './generators';
import {check, optimum} from './checker';

describe('bài toán gom đồng xu trên lưới', () => {
 it('lưới 3x3 có tổng tối ưu đúng', () => {
  const c = cases.find(x => x.id === 'normal-1')!;
  expect(optimum((c.input as never as {grid: boolean[][]}).grid)).toBe(2);
 });

 it('bộ chấm từ chối đường đi sai hướng hoặc tổng sai', () => {
  const input = {grid: [[false, true], [true, false]]};
  expect(check(input, {value: 1, path: [[0, 0], [0, 1], [1, 1]]})).toMatchObject({ok: true, optimal: true});
  expect(check(input, {value: 1, path: [[0, 0], [1, 0], [1, 1]]})).toMatchObject({ok: true, optimal: true});
  expect(check(input, {value: 1, path: [[0, 0], [1, 1]]}).ok).toBe(false);
  expect(check(input, {value: 5, path: [[0, 0], [0, 1], [1, 1]]}).ok).toBe(false);
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
