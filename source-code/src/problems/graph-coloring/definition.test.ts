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
  it('check chấm đúng tô màu tay', () => {
    expect(check(triangle, {found: true, coloring: [0, 1, 2]}).ok).toBe(true);
  });
  it('check từ chối hai đỉnh kề cùng màu', () => {
    expect(check(triangle, {found: true, coloring: [0, 0, 1]}).ok).toBe(false);
  });
});
