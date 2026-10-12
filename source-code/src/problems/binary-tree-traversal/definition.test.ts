import { describe, it, expect } from 'vitest';
import { problem } from './index';
import { cases } from './cases';
describe('bài toán duyệt cây nhị phân', () => {
  it('schema chấp nhận ca hợp lệ và từ chối ca không hợp lệ', () => {
    for (const c of cases.filter(x => x.group !== 'invalid'))
      expect(problem.inputSchema.safeParse(c.input).success, c.id).toBe(true);
    for (const c of cases.filter(x => x.group === 'invalid'))
      expect(problem.inputSchema.safeParse(c.input).success, c.id).toBe(false);
  });
  it('bộ chấm kiểm tra đúng tập giá trị và độ cao', () => {
    const small = cases.find(c => c.id === 'normal-1')!.input as import('./definition').Input;
    expect(problem.check(small, { order: [8, 3, 10], height: 1 })).toMatchObject({ ok: true });
    expect(problem.check(small, { order: [8, 3], height: 1 }).ok).toBe(false);
    expect(problem.check(small, { order: [8, 3, 10], height: 2 }).ok).toBe(false);
  });
});
