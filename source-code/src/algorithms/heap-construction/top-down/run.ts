import type { RunContext } from '../../../core/contracts';
import type { Input, Output } from '../../../problems/heap-construction/definition';
export type Role = 'compare' | 'swap' | 'current';
export interface VisualState {
  values: number[];
  marks: { index: number; role: Role }[];
  nodes: { id: string; parent: string | null; label: string; role?: string }[];
  note: string;
}
function treeNodes(values: number[]): VisualState['nodes'] {
  return values.map((v, i) => ({
    id: String(i),
    parent: i === 0 ? null : String(Math.floor((i - 1) / 2)),
    label: String(v),
  }));
}
export function initVisual(_input: Input): VisualState {
  void _input;
  return { values: [], marks: [], nodes: [], note: '' };
}
export function run(input: Input, { rec }: RunContext<VisualState>): Output {
  const values: number[] = [];
  for (const v of input.values) {
    values.push(v);
    let i = values.length - 1;
    rec.step(
      'push',
      `Thêm ${v} vào cuối mảng (vị trí ${i}).`,
      d => {
        d.values = [...values];
        d.nodes = treeNodes(values);
        d.marks = [{ index: i, role: 'current' }];
        d.note = `Thêm ${v}`;
      },
      [{ target: `bar-${i}`, role: 'current' }],
      'insert',
    );
    while (i > 0) {
      const parent = Math.floor((i - 1) / 2);
      rec.count('compare');
      rec.step(
        'compare',
        `So sánh ${values[i]} (vị trí ${i}) với cha ${values[parent]} (vị trí ${parent}).`,
        d => {
          d.marks = [
            { index: i, role: 'current' },
            { index: parent, role: 'compare' },
          ];
        },
        [
          { target: `bar-${i}`, role: 'current' },
          { target: `bar-${parent}`, role: 'compare' },
        ],
        'insert',
      );
      if (values[parent] >= values[i]) break;
      [values[parent], values[i]] = [values[i], values[parent]];
      rec.count('swap');
      rec.step(
        'swap',
        `Đổi chỗ vị trí ${i} và ${parent} vì con lớn hơn cha.`,
        d => {
          d.values = [...values];
          d.nodes = treeNodes(values);
          d.marks = [
            { index: i, role: 'swap' },
            { index: parent, role: 'swap' },
          ];
        },
        [
          { target: `bar-${i}`, role: 'swap' },
          { target: `bar-${parent}`, role: 'swap' },
        ],
        'insert',
      );
      i = parent;
    }
  }
  rec.step(
    'done',
    `Hoàn tất, đã xây xong max-heap với ${values.length} phần tử.`,
    d => {
      d.values = [...values];
      d.nodes = treeNodes(values);
      d.marks = [];
      d.note = 'Hoàn tất';
    },
    [],
    'done',
  );
  return { heap: values };
}
