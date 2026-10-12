import { describe, it, expect } from 'vitest';
import { problem } from './index';
import { cases } from './cases';
describe('bài toán kiểm tra phần tử duy nhất', () => {
  it('schema chấp nhận ca hợp lệ và từ chối ca không hợp lệ', () => {
    for (const c of cases.filter(x => x.group !== 'invalid'))
      expect(problem.inputSchema.safeParse(c.input).success, c.id).toBe(true);
    for (const c of cases.filter(x => x.group === 'invalid'))
      expect(problem.inputSchema.safeParse(c.input).success, c.id).toBe(false);
  });
  it('ví dụ cơ bản có đúng hai nhóm duy nhất/trùng', () => {
    expect(
      problem.check({ values: [5, 3, 8, 1, 9, 2] }, { unique: true, duplicate: null }),
    ).toMatchObject({ ok: true });
    expect(
      problem.check({ values: [5, 3, 8, 1, 3, 2] }, { unique: false, duplicate: 3 }),
    ).toMatchObject({ ok: true });
    expect(
      problem.check({ values: [5, 3, 8, 1, 3, 2] }, { unique: true, duplicate: null }).ok,
    ).toBe(false);
    expect(problem.check({ values: [5, 3, 8, 1, 9, 2] }, { unique: false, duplicate: 5 }).ok).toBe(
      false,
    );
  });
});
