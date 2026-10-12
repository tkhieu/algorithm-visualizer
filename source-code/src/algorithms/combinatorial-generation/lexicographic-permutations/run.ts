import type { RunContext } from '../../../core/contracts';
import type { Input, Output } from '../../../problems/combinatorial-generation/definition';
import { emit, finish, type VisualState } from '../shared';
export function run({ n }: Input, { rec, signal }: RunContext<VisualState>): Output {
  const a = Array.from({ length: n }, (_, i) => i + 1),
    objects: number[][] = [];
  while (true) {
    if (signal.aborted) throw new Error('Đã huỷ');
    objects.push([...a]);
    emit(rec, a, `Sinh hoán vị ${a.join(', ')} theo thứ tự từ điển.`);
    let i = n - 2;
    while (i >= 0 && a[i] >= a[i + 1]) i--;
    if (i < 0) break;
    let j = n - 1;
    while (a[j] <= a[i]) j--;
    [a[i], a[j]] = [a[j], a[i]];
    for (let l = i + 1, r = n - 1; l < r; l++, r--) [a[l], a[r]] = [a[r], a[l]];
    rec.count('swap');
  }
  return finish(rec, 'permutations', objects);
}
