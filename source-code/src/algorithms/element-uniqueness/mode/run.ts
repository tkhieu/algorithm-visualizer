import type { RunContext } from '../../../core/contracts';
import type { Input, Output } from '../../../problems/element-uniqueness/definition';
export type Role = 'current' | 'found';
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
  const n = input.values.length;
  const sorted = [...input.values].sort((a, b) => a - b);
  rec.step(
    'sort',
    'Sắp xếp mảng trước để các giá trị bằng nhau nằm liền kề.',
    d => {
      d.values = [...sorted];
      d.ranges = [{ from: 0, to: n - 1, role: 'sorted' }];
      d.note = 'Đã sắp xếp';
    },
    [],
    'sort',
  );
  let bestValue: number | null = null,
    bestCount = 0,
    runStart = 0;
  for (let i = 0; i < n; i++) {
    rec.count('compare');
    if (i > 0 && sorted[i] !== sorted[i - 1]) {
      const runLength = i - runStart;
      rec.step(
        'close-run',
        `Kết thúc đoạn giá trị ${sorted[i - 1]} dài ${runLength}.`,
        d => {
          d.ranges = [
            { from: 0, to: n - 1, role: 'sorted' },
            { from: runStart, to: i - 1, role: 'active' },
          ];
          d.note = `Đoạn ${sorted[i - 1]} dài ${runLength}`;
        },
        [{ target: `range-${runStart}`, role: 'active' }],
        'scan',
      );
      if (runLength > bestCount) {
        bestCount = runLength;
        bestValue = sorted[i - 1];
      }
      runStart = i;
    }
    rec.step(
      'extend',
      `Xét A[${i}]=${sorted[i]} trong đoạn hiện tại.`,
      d => {
        d.marks = [{ index: i, role: 'current' }];
      },
      [{ target: `bar-${i}`, role: 'current' }],
      'scan',
    );
  }
  const runLength = n - runStart;
  if (n > 0) {
    rec.step(
      'close-run',
      `Kết thúc đoạn giá trị ${sorted[n - 1]} dài ${runLength}.`,
      d => {
        d.ranges = [
          { from: 0, to: n - 1, role: 'sorted' },
          { from: runStart, to: n - 1, role: 'active' },
        ];
        d.note = `Đoạn ${sorted[n - 1]} dài ${runLength}`;
      },
      [{ target: `range-${runStart}`, role: 'active' }],
      'scan',
    );
    if (runLength > bestCount) {
      bestCount = runLength;
      bestValue = sorted[n - 1];
    }
  }
  if (bestCount >= 2 && bestValue !== null) {
    rec.step(
      'done',
      `Mode là ${bestValue} xuất hiện ${bestCount} lần.`,
      d => {
        d.marks = d.values
          .map((v, i) => (v === bestValue ? { index: i, role: 'found' as const } : null))
          .filter((m): m is { index: number; role: 'found' } => m !== null);
        d.note = `Mode = ${bestValue} (${bestCount} lần)`;
      },
      [],
      'done',
    );
    return { unique: false, duplicate: bestValue, duplicateCount: bestCount };
  }
  rec.step(
    'done',
    'Mọi giá trị chỉ xuất hiện đúng một lần — dãy duy nhất.',
    d => {
      d.note = 'Duy nhất';
      d.marks = [];
    },
    [],
    'done',
  );
  return { unique: true, duplicate: null };
}
