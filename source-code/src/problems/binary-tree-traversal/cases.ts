import type { TestCase } from '../../core/contracts';
import type { Input } from './definition';
import { generate } from './generators';
const small: Input = {
  nodes: [
    { id: 0, value: 8, left: 1, right: 2 },
    { id: 1, value: 3, left: null, right: null },
    { id: 2, value: 10, left: null, right: null },
  ],
  root: 0,
};
const leftChain: Input = {
  nodes: [
    { id: 0, value: 4, left: 1, right: null },
    { id: 1, value: 3, left: 2, right: null },
    { id: 2, value: 2, left: 3, right: null },
    { id: 3, value: 1, left: null, right: null },
  ],
  root: 0,
};
const rightChain: Input = {
  nodes: [
    { id: 0, value: 1, left: null, right: 1 },
    { id: 1, value: 2, left: null, right: 2 },
    { id: 2, value: 3, left: null, right: 3 },
    { id: 3, value: 4, left: null, right: null },
  ],
  root: 0,
};
const perfect: Input = {
  nodes: [
    { id: 0, value: 4, left: 1, right: 2 },
    { id: 1, value: 2, left: 3, right: 4 },
    { id: 2, value: 6, left: 5, right: 6 },
    { id: 3, value: 1, left: null, right: null },
    { id: 4, value: 3, left: null, right: null },
    { id: 5, value: 5, left: null, right: null },
    { id: 6, value: 7, left: null, right: null },
  ],
  root: 0,
};
export const cases: TestCase<Input>[] = [
  { id: 'normal-1', name: 'Cây nhỏ cân đối', group: 'normal', input: small },
  { id: 'normal-2', name: 'Bộ sinh ngẫu nhiên', group: 'normal', input: generate(3, 'small') },
  { id: 'edge-empty', name: 'Cây rỗng', group: 'edge', input: { nodes: [], root: null } },
  {
    id: 'edge-single',
    name: 'Một đỉnh',
    group: 'edge',
    input: { nodes: [{ id: 0, value: 5, left: null, right: null }], root: 0 },
  },
  { id: 'edge-left-chain', name: 'Chuỗi lệch trái', group: 'edge', input: leftChain },
  { id: 'edge-right-chain', name: 'Chuỗi lệch phải', group: 'edge', input: rightChain },
  { id: 'small-1', name: 'Tập nhỏ 1', group: 'small', input: generate(7, 'tiny') },
  { id: 'large-1', name: 'Tập lớn 1', group: 'large', input: generate(19, 'large') },
  { id: 'special-perfect', name: 'Cây hoàn chỉnh 7 đỉnh', group: 'special', input: perfect },
  {
    id: 'invalid-duplicate',
    name: 'Trùng id',
    group: 'invalid',
    input: {
      nodes: [
        { id: 0, value: 1, left: null, right: null },
        { id: 0, value: 2, left: null, right: null },
      ],
      root: 0,
    },
  },
  {
    id: 'invalid-dangling',
    name: 'Con tham chiếu id không tồn tại',
    group: 'invalid',
    input: { nodes: [{ id: 0, value: 1, left: 5, right: null }], root: 0 },
  },
  {
    id: 'invalid-cycle',
    name: 'Có chu trình',
    group: 'invalid',
    input: {
      nodes: [
        { id: 0, value: 1, left: 1, right: null },
        { id: 1, value: 2, left: 0, right: null },
      ],
      root: 0,
    },
  },
];
