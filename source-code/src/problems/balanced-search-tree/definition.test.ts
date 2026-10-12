import { describe, it, expect } from 'vitest';
import { problem } from './index';
import { cases } from './cases';
describe('bài toán cây tìm kiếm cân bằng', () => {
  it('schema chấp nhận ca hợp lệ và từ chối ca không hợp lệ', () => {
    for (const c of cases.filter(x => x.group !== 'invalid'))
      expect(problem.inputSchema.safeParse(c.input).success, c.id).toBe(true);
    for (const c of cases.filter(x => x.group === 'invalid'))
      expect(problem.inputSchema.safeParse(c.input).success, c.id).toBe(false);
  });
  it('bộ chấm kiểm tra đúng tập khóa và độ cao hợp lý', () => {
    expect(problem.check({ keys: [3, 3, 3] }, { values: [3], height: 0 })).toMatchObject({
      ok: true,
    });
    expect(problem.check({ keys: [] }, { values: [], height: -1 })).toMatchObject({ ok: true });
    expect(problem.check({ keys: [3, 3, 3] }, { values: [3, 4], height: 0 }).ok).toBe(false);
    expect(problem.check({ keys: [] }, { values: [], height: 0 }).ok).toBe(false);
  });
});
