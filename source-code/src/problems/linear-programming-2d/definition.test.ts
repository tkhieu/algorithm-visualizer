import { describe, it, expect } from 'vitest';
import { problem } from './index';
import { cases } from './cases';
import { generate } from './generators';
import { check, optimum } from './checker';

describe('bài toán quy hoạch tuyến tính 2 chiều', () => {
  it('ví dụ Levitin: tối ưu tại (2,6) giá trị 36', () => {
    const input = {
      objective: { cx: 3, cy: 5 },
      constraints: [
        { a: 1, b: 0, c: 4 },
        { a: 0, b: 2, c: 12 },
        { a: 3, b: 2, c: 18 },
      ],
    };
    const best = optimum(input);
    if (best.status !== 'optimal') throw new Error('Ví dụ phải có nghiệm tối ưu');
    expect(best.value).toBeCloseTo(36);
    expect(best.x).toBeCloseTo(2);
    expect(best.y).toBeCloseTo(6);
  });

  it('bộ chấm từ chối điểm ngoài miền khả thi hoặc giá trị sai', () => {
    const input = {
      objective: { cx: 1, cy: 1 },
      constraints: [
        { a: 1, b: 0, c: 5 },
        { a: 0, b: 1, c: 5 },
      ],
    };
    expect(check(input, { x: 5, y: 5, value: 10, status: 'optimal' })).toMatchObject({ ok: true, optimal: true });
    expect(check(input, { x: 6, y: 5, value: 11, status: 'optimal' }).ok).toBe(false);
    expect(check(input, { x: 5, y: 5, value: 999, status: 'optimal' }).ok).toBe(false);
    expect(check(input, { x: 0, y: 0, value: 0, status: 'optimal' })).toMatchObject({ ok: true, optimal: false });
  });

  it('đầu vào sai bị từ chối', () => {
    for (const c of cases.filter((x) => x.group === 'invalid')) {
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

it('checker xác nhận trạng thái bằng đỉnh và tia khả thi', () => {
  const infeasible = { objective: { cx: 1, cy: 1 }, constraints: [{ a: 1, b: 0, c: -1 }] };
  const unbounded = { objective: { cx: 1, cy: 1 }, constraints: [{ a: -1, b: -1, c: -1 }] };
  expect(check(infeasible, { status: 'infeasible', message: 'Bài toán không khả thi' })).toMatchObject({ ok: true, optimal: true });
  expect(check(unbounded, { status: 'unbounded', message: 'Bài toán không bị chặn' })).toMatchObject({ ok: true, optimal: true });
  expect(check(infeasible, { status: 'optimal', x: 0, y: 0, value: 0 }).ok).toBe(false);
  expect(check(unbounded, { status: 'infeasible', message: 'Bài toán không khả thi' }).ok).toBe(false);
});
