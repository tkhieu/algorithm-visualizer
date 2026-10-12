import {describe, it, expect} from 'vitest';
import {inputSchema} from './definition';
import {check, optimalCost} from './checker';

describe('matrix-chain definition', () => {
  it('chấp nhận dims hợp lệ và từ chối dims rỗng', () => {
    expect(inputSchema.safeParse({dims: [10, 100, 5, 50]}).success).toBe(true);
    expect(inputSchema.safeParse({dims: []}).success).toBe(false);
  });

  it('optimalCost đúng trên ví dụ kinh điển (dims=[10,100,5,50] → 7500)', () => {
    expect(optimalCost([10, 100, 5, 50])).toBe(7500);
  });

  it('tham chiếu thứ tự ghép không dựng bảng DP đoạn', () => {
    const original = Array.from;
    Array.from = (() => { throw new Error('Không dùng bảng DP đoạn'); }) as typeof Array.from;
    try {
      expect(optimalCost([10, 100, 5, 50])).toBe(7500);
      expect(optimalCost([4, 7])).toBe(0);
    } finally {
      Array.from = original;
    }
  });

  it('check chấm đúng đặt ngoặc tối ưu tay', () => {
    const result = check({dims: [10, 100, 5, 50]}, {cost: 7500, parenthesization: '((A1A2)A3)'});
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.optimal).toBe(true);
  });

  it('check chấm đúng đặt ngoặc không tối ưu nhưng hợp lệ', () => {
    const result = check({dims: [10, 100, 5, 50]}, {cost: 75000, parenthesization: '(A1(A2A3))'});
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.optimal).toBe(false);
  });

  it('check từ chối đặt ngoặc sai cú pháp', () => {
    expect(check({dims: [10, 100, 5, 50]}, {cost: 0, parenthesization: '(A1A2'}).ok).toBe(false);
  });

  it('check từ chối chi phí báo cáo không khớp đặt ngoặc', () => {
    expect(check({dims: [10, 100, 5, 50]}, {cost: 1, parenthesization: '((A1A2)A3)'}).ok).toBe(false);
  });

  it('xử lý đúng chuỗi một ma trận', () => {
    expect(check({dims: [4, 7]}, {cost: 0, parenthesization: 'A1'}).ok).toBe(true);
  });
});
