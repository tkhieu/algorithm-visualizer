import {describe, it, expect} from 'vitest';
import {inputSchema, outputSchema} from './definition';
import {check, hasSolution, valid} from './checker';
describe('n-queens definition', () => {
  it('chấp nhận n hợp lệ và từ chối n ngoài phạm vi', () => {
    expect(inputSchema.safeParse({n: 8}).success).toBe(true);
    expect(inputSchema.safeParse({n: 0}).success).toBe(false);
    expect(inputSchema.safeParse({n: 13}).success).toBe(false);
  });
  it('outputSchema chấp nhận kết quả hợp lệ', () => {
    expect(outputSchema.safeParse({found: true, positions: [1, 3, 0, 2]}).success).toBe(true);
  });
  it('check chấm đúng nghiệm 4-quân-hậu tay', () => {
    expect(check({n: 4}, {found: true, positions: [1, 3, 0, 2]}).ok).toBe(true);
  });
  it('check từ chối nghiệm sai', () => {
    expect(check({n: 4}, {found: true, positions: [0, 1, 2, 3]}).ok).toBe(false);
  });
  it('hasSolution đúng cho n=2,3', () => {
    expect(hasSolution(2)).toBe(false);
    expect(hasSolution(3)).toBe(false);
    expect(hasSolution(4)).toBe(true);
  });
  it('valid phát hiện tấn công đường chéo', () => {
    expect(valid([0, 1])).toBe(false);
    expect(valid([1, 3, 0, 2])).toBe(true);
  });
});
