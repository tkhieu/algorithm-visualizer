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
});
