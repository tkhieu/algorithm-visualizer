import { describe, it, expect } from 'vitest';
import { problem } from './index';
import { cases } from './cases';
import { generate } from './generators';
import { check, optimum } from './checker';

describe('bài toán dãy đồng xu', () => {
  it('ví dụ Levitin có tổng tối ưu 17', () => {
    expect(optimum([5, 1, 2, 10, 6, 2])).toBe(17);
  });

  it('bộ chấm chấp nhận nghiệm tối ưu, phát hiện nghiệm kề nhau hoặc tổng sai', () => {
    const input = { values: [5, 1, 2, 10, 6, 2] };
    expect(check(input, { value: 17, selected: [0, 3, 5] })).toMatchObject({ ok: true, optimal: true });
    expect(check(input, { value: 17, selected: [3, 4] }).ok).toBe(false);
    expect(check(input, { value: 99, selected: [0, 3, 5] }).ok).toBe(false);
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
