import type {TestCase} from '../../core/contracts';
import type {Input} from './definition';
import {generate} from './generators';
const triangle: Input = {
  nodes: ['A', 'B', 'C'],
  edges: [
    {from: 'A', to: 'B'},
    {from: 'B', to: 'C'},
    {from: 'C', to: 'A'},
  ],
  colors: 3,
};
export const cases: TestCase<Input>[] = [
  {id: 'normal-1', name: 'Tam giác với 3 màu — khả thi', group: 'normal', input: triangle},
  {id: 'normal-2', name: 'Tam giác với 2 màu — vô nghiệm', group: 'normal', input: {...triangle, colors: 2}},
  {id: 'edge-single', name: 'Một đỉnh, một màu', group: 'edge', input: {nodes: ['A'], edges: [], colors: 1}},
  {
    id: 'edge-no-edges',
    name: 'Không có cạnh nào — luôn khả thi với 1 màu',
    group: 'edge',
    input: {nodes: ['A', 'B', 'C'], edges: [], colors: 1},
  },
  {id: 'small-1', name: 'Cỡ nhỏ 1', group: 'small', input: generate(1, 'small')},
  {id: 'small-2', name: 'Cỡ nhỏ 2', group: 'small', input: generate(2, 'small')},
  {id: 'large-1', name: 'Cỡ lớn 1', group: 'large', input: generate(1, 'large')},
  {id: 'large-2', name: 'Cỡ lớn 2', group: 'large', input: generate(2, 'large')},
  {
    id: 'special-complete4',
    name: 'Đồ thị đủ K4 cần đúng 4 màu',
    group: 'special',
    input: {
      nodes: ['A', 'B', 'C', 'D'],
      edges: [
        ['A', 'B'],
        ['A', 'C'],
        ['A', 'D'],
        ['B', 'C'],
        ['B', 'D'],
        ['C', 'D'],
      ].map(([from, to]) => ({from, to})),
      colors: 4,
    },
  },
  {id: 'invalid-zero-colors', name: 'k bằng 0', group: 'invalid', input: {nodes: ['A'], edges: [], colors: 0}},
];
