import type { RunContext } from '../../../core/contracts';
import type { Input, Output } from '../../../problems/sorting/definition';
export type Role = 'compare' | 'swap' | 'current';
export interface VisualState {
  values: number[];
  marks: { index: number; role: Role }[];
  ranges: { from: number; to: number; role: 'sorted' | 'active' }[];
  nodes: { id: string; parent: string | null; label: string; role?: string }[];
  note: string;
}
function treeNodes(values: number[], heapSize: number): VisualState['nodes'] {
  return values
    .slice(0, heapSize)
    .map((v, i) => ({
      id: String(i),
      parent: i === 0 ? null : String(Math.floor((i - 1) / 2)),
      label: String(v),
    }));
}
export function initVisual(input: Input): VisualState {
  return {
    values: [...input.values],
    marks: [],
    ranges: [],
    nodes: treeNodes(input.values, input.values.length),
    note: '',
  };
}
export function run(input: Input, { rec }: RunContext<VisualState>): Output {
  const values = [...input.values];
  const n = values.length;
  function siftDown(heapSize: number, i: number) {
    while (true) {
      const l = 2 * i + 1,
        r = 2 * i + 2;
      let largest = i;
      if (l < heapSize) {
        rec.count('compare');
        if (values[l] > values[largest]) largest = l;
      }
      if (r < heapSize) {
        rec.count('compare');
        if (values[r] > values[largest]) largest = r;
      }
      rec.step(
        'compare',
        `Xét đỉnh A[${i}]=${values[i]} và các con trong đoạn đống A[0..${heapSize - 1}].`,
        d => {
          d.marks = [{ index: i, role: 'current' }];
          d.nodes = treeNodes(values, heapSize);
        },
        [{ target: `bar-${i}`, role: 'current' }],
        'heapify',
      );
      if (largest === i) break;
      [values[i], values[largest]] = [values[largest], values[i]];
      rec.count('swap');
      rec.step(
        'swap',
        `Đổi chỗ A[${i}] và A[${largest}] để giữ tính chất đống.`,
        d => {
          d.values = [...values];
          d.nodes = treeNodes(values, heapSize);
          d.marks = [
            { index: i, role: 'swap' },
            { index: largest, role: 'swap' },
          ];
        },
        [
          { target: `bar-${i}`, role: 'swap' },
          { target: `bar-${largest}`, role: 'swap' },
        ],
        'heapify',
      );
      i = largest;
    }
  }
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) siftDown(n, i);
  rec.step(
    'built',
    `Đã xây xong max-heap trên toàn bộ ${n} phần tử.`,
    d => {
      d.nodes = treeNodes(values, n);
    },
    [],
    'extract',
  );
  for (let end = n - 1; end > 0; end--) {
    [values[0], values[end]] = [values[end], values[0]];
    rec.count('swap');
    rec.step(
      'extract',
      `Lấy phần tử lớn nhất A[0]=${values[end]} ra cuối (vị trí ${end}).`,
      d => {
        d.values = [...values];
        d.ranges = [{ from: end, to: n - 1, role: 'sorted' }];
        d.nodes = treeNodes(values, end);
        d.marks = [{ index: end, role: 'swap' }];
      },
      [{ target: `bar-${end}`, role: 'swap' }],
      'extract',
    );
    siftDown(end, 0);
  }
  rec.step(
    'done',
    'Hoàn tất sắp xếp vun đống.',
    d => {
      d.marks = [];
      d.ranges = n > 0 ? [{ from: 0, to: n - 1, role: 'sorted' }] : [];
      d.nodes = [];
      d.note = 'Đã sắp xếp';
    },
    [],
    'done',
  );
  return { sorted: values };
}
