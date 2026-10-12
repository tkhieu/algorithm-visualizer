import { describe, it, expect } from 'vitest';
import { problem } from './index';
import { cases } from './cases';
describe('bài toán xây dựng đống', () => {
  it('schema chấp nhận ca hợp lệ và từ chối ca không hợp lệ', () => {
    for (const c of cases.filter(x => x.group !== 'invalid'))
      expect(problem.inputSchema.safeParse(c.input).success, c.id).toBe(true);
    for (const c of cases.filter(x => x.group === 'invalid'))
      expect(problem.inputSchema.safeParse(c.input).success, c.id).toBe(false);
  });
  it('bộ chấm từ chối mảng vi phạm tính chất đống', () => {
    expect(problem.check({ values: [5, 3, 8] }, { heap: [8, 3, 5] })).toMatchObject({ ok: true });
    expect(problem.check({ values: [5, 3, 8] }, { heap: [5, 3, 8] }).ok).toBe(false);
    expect(problem.check({ values: [5, 3, 8] }, { heap: [8, 3, 5, 1] }).ok).toBe(false);
  });
});
