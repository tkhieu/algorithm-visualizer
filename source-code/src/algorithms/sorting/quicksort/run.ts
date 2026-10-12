import type { RunContext } from '../../../core/contracts';
import type { Input, Output } from '../../../problems/sorting/definition';
export type Role = 'pivot' | 'compare' | 'swap';
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
  function partition(lo: number, hi: number): number {
    const pivot = values[hi];
    rec.step(
      'pivot',
      `Chọn chốt = A[${hi}] = ${pivot}.`,
      d => {
        d.marks = [{ index: hi, role: 'pivot' }];
        d.ranges = [{ from: lo, to: hi, role: 'active' }];
      },
      [{ target: `bar-${hi}`, role: 'pivot' }],
      'partition',
    );
    let i = lo - 1;
    for (let j = lo; j < hi; j++) {
      rec.count('compare');
      rec.step(
        'compare',
        `So sánh A[${j}]=${values[j]} với chốt ${pivot}.`,
        d => {
          d.marks = [
            { index: hi, role: 'pivot' },
            { index: j, role: 'compare' },
          ];
        },
        [
          { target: `bar-${hi}`, role: 'pivot' },
          { target: `bar-${j}`, role: 'compare' },
        ],
        'partition',
      );
      if (values[j] < pivot) {
        i++;
        [values[i], values[j]] = [values[j], values[i]];
        rec.count('swap');
        rec.step(
          'swap',
          `A[${j}] < chốt: đổi chỗ A[${i}] và A[${j}].`,
          d => {
            d.values = [...values];
            d.marks = [
              { index: i, role: 'swap' },
              { index: j, role: 'swap' },
            ];
          },
          [
            { target: `bar-${i}`, role: 'swap' },
            { target: `bar-${j}`, role: 'swap' },
          ],
          'partition',
        );
      }
    }
    [values[i + 1], values[hi]] = [values[hi], values[i + 1]];
    rec.count('swap');
    rec.step(
      'swap',
      `Đặt chốt vào vị trí ${i + 1}.`,
      d => {
        d.values = [...values];
        d.marks = [{ index: i + 1, role: 'pivot' }];
      },
      [{ target: `bar-${i + 1}`, role: 'pivot' }],
      'partition',
    );
    return i + 1;
  }
  function quickSort(lo: number, hi: number): void {
    if (lo >= hi) return;
    const p = partition(lo, hi);
    rec.step(
      'partitioned',
      `Chốt ở vị trí ${p} chia A[${lo}..${hi}] thành hai phần.`,
      d => {
        d.marks = [];
        d.ranges = [
          { from: lo, to: p - 1, role: 'active' },
          { from: p + 1, to: hi, role: 'active' },
        ];
      },
      [],
      'partition',
    );
    quickSort(lo, p - 1);
    quickSort(p + 1, hi);
  }
  quickSort(0, n - 1);
  rec.step(
    'done',
    'Hoàn tất sắp xếp nhanh.',
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
