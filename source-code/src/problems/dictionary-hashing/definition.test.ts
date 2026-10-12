import { describe, it, expect } from 'vitest';
import { problem } from './index';
import { cases } from './cases';
describe('bài toán từ điển bằng bảng băm', () => {
  it('schema chấp nhận ca hợp lệ và từ chối ca không hợp lệ', () => {
    for (const c of cases.filter(x => x.group !== 'invalid'))
      expect(problem.inputSchema.safeParse(c.input).success, c.id).toBe(true);
    for (const c of cases.filter(x => x.group === 'invalid'))
      expect(problem.inputSchema.safeParse(c.input).success, c.id).toBe(false);
  });
  it('bộ chấm từ chối bảng có khóa không tồn tại trong đầu vào', () => {
    const input = { tableSize: 3, keys: [1] };
    expect(problem.check(input, { buckets: [[], [1], []] }).ok).toBe(true);
    expect(problem.check(input, { buckets: [[], [1, 2], []] }).ok).toBe(false);
    expect(problem.check(input, { buckets: [[], [1]] }).ok).toBe(false);
  });
});
