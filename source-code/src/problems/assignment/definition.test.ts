import {describe, it, expect} from 'vitest';
import {inputSchema} from './definition';
import {check, optimalCost} from './checker';

const classic = {
  cost: [
    [9, 2, 7, 8],
    [6, 4, 3, 7],
    [5, 8, 1, 8],
    [7, 6, 9, 4],
  ],
};

describe('assignment definition', () => {
  it('chấp nhận ma trận vuông và từ chối ma trận không vuông', () => {
    expect(inputSchema.safeParse(classic).success).toBe(true);
    expect(inputSchema.safeParse({cost: [[1, 2, 3], [4, 5]]}).success).toBe(false);
  });

  it('optimalCost đúng trên ví dụ kinh điển (13)', () => {
    expect(optimalCost(classic.cost)).toBe(13);
  });

  it('tham chiếu tập việc chấm được ma trận 9×9', () => {
    const cost = Array.from({length: 9}, (_, i) =>
      Array.from({length: 9}, (_, j) => (i === j ? 1 : 10)),
    );
    expect(optimalCost(cost)).toBe(9);
    const result = check({cost}, {assignment: [1, 0, 2, 3, 4, 5, 6, 7, 8], cost: 27});
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.optimal).toBe(false);
  });

  it('check chấm đúng phân công tối ưu tay', () => {
    const result = check(classic, {assignment: [1, 0, 2, 3], cost: 13});
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.optimal).toBe(true);
  });

  it('check từ chối chi phí báo cáo sai', () => {
    expect(check(classic, {assignment: [1, 3, 2, 0], cost: 999}).ok).toBe(false);
  });

  it('check từ chối phân công không phải hoán vị', () => {
    expect(check(classic, {assignment: [0, 0, 1, 2], cost: 20}).ok).toBe(false);
  });
});
