import type {RunContext} from '../../../core/contracts';
import type {Input, Output} from '../../../problems/optimal-bst/definition';
import {assertActive, buildTree, pack, type VisualState} from '../shared';

export function run(input: Input, {rec, signal}: RunContext<VisualState>): Output {
 const freq = input.freq;
 const n = freq.length;
 const prefix = [0];
 for (const f of freq) prefix.push(prefix[prefix.length - 1] + f);
 const roots = Array.from({length: n}, () => new Array<number>(n).fill(0));

 function solve(i: number, j: number): number {
  assertActive(signal);
  rec.count('recurse');
  if (i > j) return 0;

  rec.step('try', `Thử mọi gốc cho đoạn khoá [${i + 1}..${j + 1}].`, d => {
   d.current = {i, w: j};
   d.note = `Thử gốc cho [${i + 1}..${j + 1}]`;
  }, [], 'search');

  let best = Infinity, bestK = i;
  for (let k = i; k <= j; k++) {
   rec.count('compare');
   const left = solve(i, k - 1);
   const right = solve(k + 1, j);
   const total = left + right + (prefix[j + 1] - prefix[i]);
   if (total < best) { best = total; bestK = k; }
  }
  roots[i][j] = bestK;

  rec.step('best', `Đoạn [${i + 1}..${j + 1}]: chi phí tốt nhất ${best} với gốc khoá ${bestK + 1}.`, d => {
   d.matrix[i][j] = best;
   d.computed[i][j] = true;
   d.note = `C(${i},${j}) = ${best}`;
  }, [], 'search');
  return best;
 }

 const total = n > 0 ? solve(0, n - 1) : 0;
 const nodes = n > 0 ? buildTree(roots, 0, n - 1, null) : [];
 rec.step('done', `Hoàn tất: chi phí tối ưu ${total} (đã thử mọi cây có thể).`, d => {
  d.nodes = nodes;
  d.note = `Chi phí tối ưu ${total}`;
 }, [], 'done');
 return pack(total, roots);
}
