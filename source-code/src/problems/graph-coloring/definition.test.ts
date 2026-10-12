import {describe, it, expect} from 'vitest';
import {inputSchema} from './definition';
import {check, existsColoring} from './checker';
const triangle = {
  nodes: ['A', 'B', 'C'],
  edges: [
    {from: 'A', to: 'B'},
    {from: 'B', to: 'C'},
    {from: 'C', to: 'A'},
  ],
  colors: 3,
};
describe('graph-coloring definition', () => {
  it('chấp nhận input hợp lệ và từ chối k=0', () => {
    expect(inputSchema.safeParse(triangle).success).toBe(true);
    expect(inputSchema.safeParse({...triangle, colors: 0}).success).toBe(false);
  });
  it('existsColoring đúng trên tam giác', () => {
    expect(existsColoring(triangle)).toBe(true);
    expect(existsColoring({...triangle, colors: 2})).toBe(false);
  });
  it('tham chiếu phân hoạch kiểm tra cả cách tô tồn tại và đồ thị rỗng', () => {
    const original = Array.prototype.fill;
    Array.prototype.fill = (() => { throw new Error('Không dùng mảng tô quay lui'); }) as typeof Array.prototype.fill;
    try {
      expect(existsColoring(triangle)).toBe(true);
      expect(existsColoring({...triangle, colors: 2})).toBe(false);
      expect(existsColoring({nodes: [], edges: [], colors: 1})).toBe(true);
    } finally {
      Array.prototype.fill = original;
    }
  });
  it('found=false của thuật toán chính xác phải chứng minh vô nghiệm', () => {
    expect(check(triangle, {found: false, coloring: []}).ok).toBe(false);
    expect(check({...triangle, colors: 2}, {found: false, coloring: []})).toEqual({ok: true, optimal: true});
  });
  it('thất bại tham lam chỉ được chấm xấp xỉ', () => {
    expect(check(triangle, {found: false, coloring: [], heuristic: true})).toEqual({ok: true, optimal: false});
    expect(check({...triangle, colors: 2}, {found: false, coloring: [], heuristic: true}))
      .toEqual({ok: true, optimal: false});
  });
  it('đồ thị rỗng có cách tô rỗng hợp lệ', () => {
    const empty = {nodes: [], edges: [], colors: 1};
    expect(inputSchema.safeParse(empty).success).toBe(true);
    expect(check(empty, {found: true, coloring: []}).ok).toBe(true);
  });
  it('check chấm đúng tô màu tay', () => {
    expect(check(triangle, {found: true, coloring: [0, 1, 2]}).ok).toBe(true);
  });
  it('check từ chối hai đỉnh kề cùng màu', () => {
    expect(check(triangle, {found: true, coloring: [0, 0, 1]}).ok).toBe(false);
  });
});
