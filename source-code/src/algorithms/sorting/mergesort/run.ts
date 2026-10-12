import type { RunContext } from '../../../core/contracts';
import type { Input, Output } from '../../../problems/sorting/definition';
export type Role = 'compare' | 'place';
export interface VisualState {
  values: number[];
  marks: { index: number; role: Role }[];
  ranges: { from: number; to: number; role: 'sorted' | 'active' }[];
  note: string;
}
export function initVisual(input: Input): VisualState {
  return { values: [...input.values], marks: [], ranges: [], note: '' };
}
export function run(input: Input, { rec }: RunContext<VisualState>): Output {
  const values = [...input.values];
  const n = values.length;
  function mergeSort(lo: number, hi: number): void {
    if (lo >= hi) return;
    const mid = Math.floor((lo + hi) / 2);
    rec.step(
      'divide',
      `Chia A[${lo}..${hi}] tại giữa thành A[${lo}..${mid}] và A[${mid + 1}..${hi}].`,
      d => {
        d.ranges = [
          { from: lo, to: mid, role: 'active' },
          { from: mid + 1, to: hi, role: 'active' },
        ];
      },
      [],
      'divide',
    );
    mergeSort(lo, mid);
    mergeSort(mid + 1, hi);
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
      },
      [],
      'merge',
    );
  }
  mergeSort(0, n - 1);
  rec.step(
    'done',
    'Hoàn tất sắp xếp trộn.',
    d => {
      d.marks = [];
      d.ranges = n > 0 ? [{ from: 0, to: n - 1, role: 'sorted' }] : [];
      d.note = 'Đã sắp xếp';
    },
    [],
    'done',
  );
  return { sorted: values };
}
