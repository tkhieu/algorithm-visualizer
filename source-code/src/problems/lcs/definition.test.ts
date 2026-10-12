import {describe, it, expect} from 'vitest';
import {inputSchema} from './definition';
import {check, isSubsequence, optimalLength} from './checker';

describe('lcs definition', () => {
  it('chấp nhận chuỗi hợp lệ và từ chối chuỗi quá dài', () => {
    expect(inputSchema.safeParse({a: 'ABC', b: 'DEF'}).success).toBe(true);
    expect(inputSchema.safeParse({a: 'A'.repeat(50), b: 'B'}).success).toBe(false);
  });

  it('optimalLength đúng trên ví dụ kinh điển (BCBA → 4)', () => {
    expect(optimalLength('ABCBDAB', 'BDCABA')).toBe(4);
  });

  it('isSubsequence đúng', () => {
    expect(isSubsequence('BCA', 'ABCBDAB')).toBe(true);
    expect(isSubsequence('CC', 'ABCBDAB')).toBe(false);
  });

  it('check chấm đúng LCS tối ưu tay', () => {
    const result = check({a: 'ABCBDAB', b: 'BDCABA'}, {length: 4, subsequence: 'BCBA'});
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.optimal).toBe(true);
  });

  it('check từ chối dãy con không phải dãy con của b', () => {
    expect(check({a: 'ABCBDAB', b: 'BDCABA'}, {length: 3, subsequence: 'ACB'}).ok).toBe(false);
  });

  it('check từ chối độ dài báo cáo sai', () => {
    expect(check({a: 'ABCBDAB', b: 'BDCABA'}, {length: 99, subsequence: 'BCBA'}).ok).toBe(false);
  });
});
