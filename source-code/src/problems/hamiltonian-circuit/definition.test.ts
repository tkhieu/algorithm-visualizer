import {describe, it, expect} from 'vitest';
import {inputSchema} from './definition';
import {check, existsHamiltonianCircuit} from './checker';
const cycle4 = {
  nodes: ['A', 'B', 'C', 'D'],
  edges: [
    {from: 'A', to: 'B'},
    {from: 'B', to: 'C'},
    {from: 'C', to: 'D'},
    {from: 'D', to: 'A'},
  ],
};
describe('hamiltonian-circuit definition', () => {
  it('chấp nhận đồ thị hợp lệ và từ chối rỗng', () => {
    expect(inputSchema.safeParse(cycle4).success).toBe(true);
    expect(inputSchema.safeParse({nodes: [], edges: []}).success).toBe(false);
  });
  it('existsHamiltonianCircuit đúng trên chu trình vuông', () => {
    expect(existsHamiltonianCircuit(cycle4)).toBe(true);
  });
  it('existsHamiltonianCircuit đúng trên đường thẳng (không có chu trình)', () => {
    expect(
      existsHamiltonianCircuit({
        nodes: ['A', 'B', 'C', 'D'],
        edges: [
          {from: 'A', to: 'B'},
          {from: 'B', to: 'C'},
          {from: 'C', to: 'D'},
        ],
      }),
    ).toBe(false);
  });
  it('check chấm đúng chu trình tay', () => {
    expect(check(cycle4, {found: true, circuit: ['A', 'B', 'C', 'D']}).ok).toBe(true);
  });
  it('check từ chối chu trình sai cạnh', () => {
    expect(check(cycle4, {found: true, circuit: ['A', 'C', 'B', 'D']}).ok).toBe(false);
  });
  it('quy ước một đỉnh là chu trình tầm thường', () => {
    const single = {nodes: ['A'], edges: []};
    expect(existsHamiltonianCircuit(single)).toBe(true);
    expect(check(single, {found: true, circuit: ['A']})).toEqual({ok: true, optimal: true});
  });
  it('hai đỉnh nối một cạnh chỉ có đường đi qua lại, không có chu trình đơn', () => {
    const pair = {nodes: ['A', 'B'], edges: [{from: 'A', to: 'B'}]};
    expect(existsHamiltonianCircuit(pair)).toBe(false);
    expect(check(pair, {found: true, circuit: ['A', 'B']}).ok).toBe(false);
    expect(check(pair, {found: false, circuit: []}).ok).toBe(true);
  });
});
