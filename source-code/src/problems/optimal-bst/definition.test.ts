import {describe, it, expect} from 'vitest';
import {problem} from './index';
import {cases} from './cases';
import {generate} from './generators';
import {check, optimum} from './checker';

describe('bài toán cây tìm kiếm nhị phân tối ưu', () => {
 it('ví dụ Levitin 4 khoá có chi phí tối ưu đúng', () => {
  expect(optimum([10, 20, 40, 30])).toBe(170);
 });

 it('bộ chấm chấp nhận cây một khoá và từ chối bảng gốc sai hoặc chi phí sai', () => {
  const freq = [7];
  expect(check({freq}, {cost: 7, roots: [[0]]})).toMatchObject({ok: true, optimal: true});
  expect(check({freq}, {cost: 99, roots: [[0]]}).ok).toBe(false);
  expect(check({freq}, {cost: 7, roots: [[5]]}).ok).toBe(false);
 });

 it('cây hai khoá: chọn khoá rẻ hơn ở gốc cho chi phí nhỏ hơn', () => {
  const freq = [10, 1];
  expect(optimum(freq)).toBe(12);
  expect(check({freq}, {cost: 12, roots: [[0, 0], [0, 1]]})).toMatchObject({ok: true, optimal: true});
  expect(check({freq}, {cost: 21, roots: [[0, 1], [0, 1]]})).toMatchObject({ok: true, optimal: false});
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
