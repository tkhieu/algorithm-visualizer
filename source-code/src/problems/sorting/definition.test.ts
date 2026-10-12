import { describe, it, expect } from 'vitest';
import { problem } from './index';
import { cases } from './cases';
describe('bài toán sắp xếp', () => {
  it('schema chấp nhận ca hợp lệ và từ chối ca không hợp lệ', () => {
    for (const c of cases.filter(x => x.group !== 'invalid'))
      expect(problem.inputSchema.safeParse(c.input).success, c.id).toBe(true);
    for (const c of cases.filter(x => x.group === 'invalid'))
      expect(problem.inputSchema.safeParse(c.input).success, c.id).toBe(false);
  });
  it('bộ chấm từ chối dãy sai thứ tự hoặc sai tập giá trị', () => {
    expect(problem.check({ values: [3, 1, 2] }, { sorted: [1, 2, 3] })).toMatchObject({ ok: true });
    expect(problem.check({ values: [3, 1, 2] }, { sorted: [1, 3, 2] }).ok).toBe(false);
    expect(problem.check({ values: [3, 1, 2] }, { sorted: [1, 2] }).ok).toBe(false);
  });
});
