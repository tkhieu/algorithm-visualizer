import { describe, it, expect } from 'vitest';
import { problem } from './index';
import { inputSchema } from './definition';
import { cases } from './cases';
import { generate } from './generators';
import { check, optimum } from './checker';

describe('bài toán đổi tiền tối thiểu đồng xu', () => {
  it('ví dụ tham lam thất bại: tối ưu là 2 đồng (3+3), không phải 3', () => {
    expect(optimum(6, [1, 3, 4])).toBe(2);
  });

  it('bộ chấm chấp nhận nghiệm đúng và từ chối nghiệm sai', () => {
    const input = { amount: 6, coins: [1, 3, 4] };
    expect(check(input, { count: 2, coins: [3, 3] })).toMatchObject({ ok: true, optimal: true });
    expect(check(input, { count: 3, coins: [4, 1, 1] })).toMatchObject({ ok: true, optimal: false });
    expect(check(input, { count: 2, coins: [4, 1] }).ok).toBe(false);
    expect(check(input, { count: 2, coins: [5, 1] }).ok).toBe(false);
  });

  it('đầu vào sai bị từ chối', () => {
    for (const c of cases.filter((x) => x.group === 'invalid')) {
      expect(problem.inputSchema.safeParse(c.input).success).toBe(false);
    }
  });

  it('generate luôn sinh input hợp lệ và chứa mệnh giá 1', () => {
    for (const seed of [1, 2, 3, 4, 5]) {
      for (const size of ['tiny', 'small', 'medium', 'large'] as const) {
        const input = generate(seed, size);
        expect(problem.inputSchema.safeParse(input).success).toBe(true);
        expect(input.coins).toContain(1);
      }
    }
  });
});

it('từ chối hệ mệnh giá không có đồng xu 1', () => {
  expect(inputSchema.safeParse({ amount: 3, coins: [2, 4] }).success).toBe(false);
});
