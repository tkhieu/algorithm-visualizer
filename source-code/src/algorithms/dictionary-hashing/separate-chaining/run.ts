import type { RunContext } from '../../../core/contracts';
import type { Input, Output } from '../../../problems/dictionary-hashing/definition';
export interface HashBucketState {
  index: number;
  entries: { key: number; role?: string }[];
  role?: string;
}
export interface VisualState {
  buckets: HashBucketState[];
  note: string;
}
export function initVisual(input: Input): VisualState {
  return {
    buckets: Array.from({ length: input.tableSize }, (_, i) => ({ index: i, entries: [] })),
    note: '',
  };
}
const hash = (k: number, m: number) => ((k % m) + m) % m;
export function run(input: Input, { rec }: RunContext<VisualState>): Output {
  const m = input.tableSize;
  const buckets: number[][] = Array.from({ length: m }, () => []);
  for (const key of input.keys) {
    const idx = hash(key, m);
    rec.count('hash');
    rec.step(
      'hash',
      `h(${key}) = ${key} mod ${m} = ${idx}.`,
      d => {
        for (const b of d.buckets) b.role = undefined;
        d.buckets[idx].role = 'current';
      },
      [{ target: `bucket-${idx}`, role: 'current' }],
      'insert',
    );
    buckets[idx].push(key);
    rec.step(
      'insert',
      `Thêm ${key} vào cuối danh sách liên kết của ngăn ${idx}.`,
      d => {
        d.buckets[idx].entries.push({ key, role: 'current' });
        d.note = `Chèn ${key} vào ngăn ${idx}`;
      },
      [{ target: `entry-${idx}-${buckets[idx].length - 1}`, role: 'current' }],
      'insert',
    );
  }
  rec.step(
    'done',
    `Đã chèn ${input.keys.length} khóa.`,
    d => {
      for (const b of d.buckets) {
        b.role = undefined;
        for (const e of b.entries) e.role = undefined;
      }
      d.note = 'Hoàn tất';
    },
    [],
    'done',
  );
  return { buckets };
}
