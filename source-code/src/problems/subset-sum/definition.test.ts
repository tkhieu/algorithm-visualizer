import {describe, it, expect} from 'vitest';
import {inputSchema} from './definition';
import {check, existsSubset} from './checker';
describe('subset-sum definition', () => {
  it('chấp nhận input hợp lệ và từ chối giá trị âm', () => {
    expect(inputSchema.safeParse({values: [1, 2, 3], target: 3}).success).toBe(true);
    expect(inputSchema.safeParse({values: [-1, 2], target: 1}).success).toBe(false);
  });
  it('existsSubset đúng trên ví dụ tay', () => {
    expect(existsSubset({values: [3, 34, 4, 12, 5, 2], target: 9})).toBe(true);
    expect(existsSubset({values: [3, 34, 4, 12, 5, 2], target: 61})).toBe(false);
  });
  it('check chấm đúng tập con tay', () => {
    expect(check({values: [3, 34, 4, 12, 5, 2], target: 9}, {found: true, indices: [0, 2, 5]}).ok).toBe(true);
  });
  it('check từ chối tổng sai', () => {
    expect(check({values: [3, 34, 4, 12, 5, 2], target: 9}, {found: true, indices: [1]}).ok).toBe(false);
  });
});
