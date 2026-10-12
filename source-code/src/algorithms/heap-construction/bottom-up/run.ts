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
export function initVisual(input: Input): VisualState {
  return { values: [...input.values], marks: [], nodes: treeNodes(input.values), note: '' };
}
export function run(input: Input, { rec }: RunContext<VisualState>): Output {
  const values = [...input.values];
  const n = values.length;
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    rec.step(
      'heapify',
      `Vun đống (sift-down) từ đỉnh ${values[i]} (vị trí ${i}).`,
      d => {
        d.values = [...values];
        d.nodes = treeNodes(values);
        d.marks = [{ index: i, role: 'current' }];
        d.note = `Vun đống tại vị trí ${i}`;
      },
      [{ target: `bar-${i}`, role: 'current' }],
      'heapify',
    );
    let cur = i;
    while (true) {
      const l = 2 * cur + 1,
        r = 2 * cur + 2;
      let largest = cur;
      if (l < n) {
        rec.count('compare');
        rec.step(
          'compare',
          `So sánh ${values[cur]} (vị trí ${cur}) với con trái ${values[l]} (vị trí ${l}).`,
          d => {
            d.marks = [
              { index: cur, role: 'current' },
              { index: l, role: 'compare' },
            ];
          },
          [
            { target: `bar-${cur}`, role: 'current' },
            { target: `bar-${l}`, role: 'compare' },
          ],
          'heapify',
        );
        if (values[l] > values[largest]) largest = l;
      }
      if (r < n) {
        rec.count('compare');
        rec.step(
          'compare',
          `So sánh phần tử lớn nhất hiện tại ${values[largest]} với con phải ${values[r]} (vị trí ${r}).`,
          d => {
            d.marks = [
              { index: largest, role: 'current' },
              { index: r, role: 'compare' },
            ];
          },
          [
            { target: `bar-${largest}`, role: 'current' },
            { target: `bar-${r}`, role: 'compare' },
          ],
          'heapify',
        );
        if (values[r] > values[largest]) largest = r;
      }
      if (largest === cur) break;
      [values[cur], values[largest]] = [values[largest], values[cur]];
      rec.count('swap');
      rec.step(
        'swap',
        `Đổi chỗ vị trí ${cur} và ${largest}.`,
        d => {
          d.values = [...values];
          d.nodes = treeNodes(values);
          d.marks = [
            { index: cur, role: 'swap' },
            { index: largest, role: 'swap' },
          ];
        },
        [
          { target: `bar-${cur}`, role: 'swap' },
          { target: `bar-${largest}`, role: 'swap' },
        ],
        'heapify',
      );
      cur = largest;
    }
  }
  rec.step(
    'done',
    `Hoàn tất, đã xây xong max-heap với ${n} phần tử.`,
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
