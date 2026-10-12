import type { RunContext } from '../../../core/contracts';
import type { Input, Output } from '../../../problems/sorting/definition';
export type Role = 'compare' | 'place';
export interface VisualState {
  values: number[];
  marks: { index: number; role: Role }[];
  ranges: { from: number; to: number; role: 'sorted' | 'active' }[];
  /** Cây đệ quy của mergesort: mỗi lần gọi mergeSort(lo,hi) là một đỉnh. */
  nodes: { id: string; parent: string | null; label: string; role?: string }[];
  note: string;
}
export function initVisual(input: Input): VisualState {
  return { values: [...input.values], marks: [], ranges: [], nodes: [], note: '' };
}
function setRole(d: VisualState, id: string, role: string) {
  const i = d.nodes.findIndex(n => n.id === id);
  if (i >= 0) d.nodes[i] = { ...d.nodes[i], role };
}
export function run(input: Input, { rec }: RunContext<VisualState>): Output {
  const values = [...input.values];
  const n = values.length;
  if (n === 0) {
    rec.step('done', 'Dãy rỗng — không cần sắp xếp.', () => {}, [], 'done');
    return { sorted: [] };
  }
  let nextNodeId = 0;
  function mergeSort(lo: number, hi: number, parent: string | null): string {
    const id = String(nextNodeId++);
    rec.step(
      'divide',
      lo === hi
        ? `Đoạn A[${lo}..${hi}] chỉ có 1 phần tử, đã sắp.`
        : `Chia A[${lo}..${hi}] tại giữa thành hai nửa.`,
      d => {
        d.nodes.push({ id, parent, label: `${lo}..${hi}`, role: 'current' });
        d.ranges = [{ from: lo, to: hi, role: 'active' }];
      },
      [{ target: `tree-node-${id}`, role: 'current' }],
      'divide',
    );
    if (lo >= hi) {
      rec.step(
        'merged',
        `Đoạn A[${lo}..${hi}] là trường hợp cơ sở, không cần trộn.`,
        d => setRole(d, id, 'done'),
        [{ target: `tree-node-${id}`, role: 'done' }],
        'merge',
      );
      return id;
    }
    const mid = Math.floor((lo + hi) / 2);
    mergeSort(lo, mid, id);
    mergeSort(mid + 1, hi, id);
    const left = values.slice(lo, mid + 1),
      right = values.slice(mid + 1, hi + 1);
    let i = 0,
      j = 0,
      k = lo;
    while (i < left.length && j < right.length) {
      rec.count('compare');
      rec.step(
        'compare',
        `So sánh ${left[i]} (trái) với ${right[j]} (phải).`,
        d => {
          d.marks = [
            { index: lo + i, role: 'compare' },
            { index: mid + 1 + j, role: 'compare' },
          ];
        },
        [
          { target: `bar-${lo + i}`, role: 'compare' },
          { target: `bar-${mid + 1 + j}`, role: 'compare' },
        ],
        'merge',
      );
      if (left[i] <= right[j]) {
        values[k] = left[i];
        i++;
      } else {
        values[k] = right[j];
        j++;
      }
      rec.count('assign');
      rec.step(
        'place',
        `Đặt ${values[k]} vào vị trí ${k}.`,
        d => {
          d.values = [...values];
          d.marks = [{ index: k, role: 'place' }];
        },
        [{ target: `bar-${k}`, role: 'place' }],
        'merge',
      );
      k++;
    }
    while (i < left.length) {
      values[k] = left[i];
      rec.step(
        'place',
        `Đặt phần còn lại ${values[k]} (trái) vào vị trí ${k}.`,
        d => {
          d.values = [...values];
          d.marks = [{ index: k, role: 'place' }];
        },
        [{ target: `bar-${k}`, role: 'place' }],
        'merge',
      );
      i++;
      k++;
    }
    while (j < right.length) {
      values[k] = right[j];
      rec.step(
        'place',
        `Đặt phần còn lại ${values[k]} (phải) vào vị trí ${k}.`,
        d => {
          d.values = [...values];
          d.marks = [{ index: k, role: 'place' }];
        },
        [{ target: `bar-${k}`, role: 'place' }],
        'merge',
      );
      j++;
      k++;
    }
    rec.step(
      'merged',
      `Đã trộn xong A[${lo}..${hi}].`,
      d => {
        d.ranges = [{ from: lo, to: hi, role: 'sorted' }];
        setRole(d, id, 'done');
      },
      [{ target: `tree-node-${id}`, role: 'done' }],
      'merge',
    );
    return id;
  }
  mergeSort(0, n - 1, null);
  rec.step(
    'done',
    'Hoàn tất sắp xếp trộn.',
    d => {
      d.marks = [];
      d.ranges = [{ from: 0, to: n - 1, role: 'sorted' }];
      d.note = 'Đã sắp xếp';
    },
    [],
    'done',
  );
  return { sorted: values };
}
