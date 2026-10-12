import type {TestCase} from '../../core/contracts';
import type {Input} from './definition';
import {generate} from './generators';
const cycle4: Input = {
  nodes: ['A', 'B', 'C', 'D'],
  edges: [
    {from: 'A', to: 'B'},
    {from: 'B', to: 'C'},
    {from: 'C', to: 'D'},
    {from: 'D', to: 'A'},
  ],
};
const noCircuit: Input = {
  nodes: ['A', 'B', 'C', 'D'],
  edges: [
    {from: 'A', to: 'B'},
    {from: 'B', to: 'C'},
    {from: 'C', to: 'D'},
  ],
};
export const cases: TestCase<Input>[] = [
  {id: 'normal-1', name: 'Chu trình vuông A-B-C-D', group: 'normal', input: cycle4},
  {
    id: 'normal-2',
    name: 'Đồ thị đủ 5 đỉnh (K5)',
    group: 'normal',
    input: {
      nodes: ['A', 'B', 'C', 'D', 'E'],
      edges: [
        ['A', 'B'],
        ['A', 'C'],
        ['A', 'D'],
        ['A', 'E'],
        ['B', 'C'],
        ['B', 'D'],
        ['B', 'E'],
        ['C', 'D'],
        ['C', 'E'],
        ['D', 'E'],
      ].map(([from, to]) => ({from, to})),
    },
  },
  {id: 'edge-single', name: 'Một đỉnh duy nhất', group: 'edge', input: {nodes: ['A'], edges: []}},
  {
    id: 'edge-two',
    name: 'Hai đỉnh — vô nghiệm',
    group: 'edge',
    input: {nodes: ['A', 'B'], edges: [{from: 'A', to: 'B'}]},
  },
  {id: 'small-1', name: 'Cỡ nhỏ 1', group: 'small', input: generate(1, 'small')},
  {id: 'small-2', name: 'Cỡ nhỏ 2', group: 'small', input: generate(2, 'small')},
  {id: 'large-1', name: 'Cỡ lớn 1', group: 'large', input: generate(1, 'large')},
  {id: 'large-2', name: 'Cỡ lớn 2', group: 'large', input: generate(2, 'large')},
  {id: 'special-path', name: 'Đường đi thẳng — không có chu trình', group: 'special', input: noCircuit},
  {id: 'invalid-empty', name: 'Không có đỉnh nào', group: 'invalid', input: {nodes: [], edges: []}},
];
