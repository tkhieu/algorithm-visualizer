import { describe, it, expect } from 'vitest';
import { problem } from './index';
import { cases } from './cases';
import { generate } from './generators';
import { check, bruteForcePositions } from './checker';

describe('bài toán so khớp chuỗi', () => {
  it('ví dụ Horspool có vị trí khớp đúng', () => {
    const c = cases.find((x) => x.id === 'normal-1')!;
    expect(bruteForcePositions(c.input as never)).toEqual([3, 9]);
  });

  it('bộ chấm chấp nhận nghiệm đúng và từ chối nghiệm sai', () => {
    const input = { text: 'ABCABC', pattern: 'ABC' };
    expect(check(input, { positions: [0, 3] }).ok).toBe(true);
    expect(check(input, { positions: [0] }).ok).toBe(false);
    expect(check(input, { positions: [1] }).ok).toBe(false);
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
