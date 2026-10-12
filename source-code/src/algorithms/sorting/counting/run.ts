import type { RunContext } from '../../../core/contracts';
import type { Input, Output } from '../../../problems/sorting/definition';
export type Role = 'current' | 'place';
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
  if (n === 0) {
    rec.step('done', 'Dãy rỗng — không cần sắp xếp.', () => {}, [], 'done');
    return { sorted: [] };
  }
  const min = Math.min(...values),
    max = Math.max(...values);
  const k = max - min + 1;
  const count = new Array<number>(k).fill(0);
  rec.step(
    'range',
    `Giá trị nằm trong [${min},${max}] → cần ${k} ngăn đếm.`,
    d => {
      d.note = `Phạm vi [${min},${max}]`;
    },
    [],
    'count',
  );
  for (let idx = 0; idx < n; idx++) {
    const v = values[idx];
    count[v - min]++;
    rec.count('assign');
    rec.step(
      'tally',
      `Đếm thêm giá trị ${v} (vị trí ${idx}) vào ngăn ${v - min}.`,
      d => {
        d.marks = [{ index: idx, role: 'current' }];
      },
      [{ target: `bar-${idx}`, role: 'current' }],
      'count',
    );
  }
  const result: number[] = [];
  for (let v = 0; v < k; v++) {
    for (let c = 0; c < count[v]; c++) {
      result.push(v + min);
      rec.step(
        'place',
        `Ghi ${v + min} vào kết quả (đã có ${count[v]} lần xuất hiện).`,
        d => {
          d.values = [...result, ...values.slice(result.length)];
          d.marks = [{ index: result.length - 1, role: 'place' }];
          d.ranges = [{ from: 0, to: result.length - 1, role: 'sorted' }];
        },
        [{ target: `bar-${result.length - 1}`, role: 'place' }],
        'place',
      );
    }
  }
  rec.step(
    'done',
    'Hoàn tất sắp xếp đếm phân phối.',
    d => {
      d.values = [...result];
      d.marks = [];
      d.ranges = [{ from: 0, to: n - 1, role: 'sorted' }];
      d.note = 'Đã sắp xếp';
    },
    [],
    'done',
  );
  return { sorted: result };
}
