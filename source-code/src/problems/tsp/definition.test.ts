import {describe, it, expect} from 'vitest';
import {inputSchema} from './definition';
import {check, optimalLength, tourLength} from './checker';

const square = {
  points: [
    {x: 0, y: 0},
    {x: 0, y: 10},
    {x: 10, y: 10},
    {x: 10, y: 0},
  ],
};

describe('tsp definition', () => {
  it('chấp nhận input hợp lệ và từ chối toạ độ ngoài phạm vi', () => {
    expect(inputSchema.safeParse(square).success).toBe(true);
    expect(inputSchema.safeParse({points: [{x: 5000, y: 0}]}).success).toBe(false);
  });

  it('tourLength tính đúng chu vi hình vuông', () => {
    expect(tourLength(square.points, [0, 1, 2, 3])).toBeCloseTo(40);
  });

  it('optimalLength đúng trên hình vuông (chu vi là tối ưu)', () => {
    expect(optimalLength(square.points)).toBeCloseTo(40);
  });

  it('tham chiếu Held–Karp chấm được 9 điểm, kể cả hành trình không tối ưu', () => {
    const points = Array.from({length: 9}, (_, i) => ({x: i, y: 0}));
    expect(optimalLength(points)).toBe(16);
    const result = check({points}, {tour: [0, 8, 1, 2, 3, 4, 5, 6, 7], length: 28});
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.optimal).toBe(false);
  });

  it('check chấm đúng hành trình tay', () => {
    const result = check(square, {tour: [0, 1, 2, 3], length: 40});
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.optimal).toBe(true);
  });

  it('check từ chối độ dài báo cáo sai', () => {
    expect(check(square, {tour: [0, 1, 2, 3], length: 999}).ok).toBe(false);
  });
});
