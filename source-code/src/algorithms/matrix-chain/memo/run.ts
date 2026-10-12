import type {RunContext} from '../../../core/contracts';
import type {Input, Output} from '../../../problems/matrix-chain/definition';
import {assertActive, buildTree, pack, type VisualState} from '../shared';

export function run(input: Input, {rec, signal}: RunContext<VisualState>): Output {
  const {dims} = input;
  const n = dims.length - 1;
  const memo = Array.from({length: n + 1}, () => new Array<number | null>(n + 1).fill(null));
  const split = Array.from({length: n + 1}, () => new Array<number>(n + 1).fill(0));

  function solve(i: number, j: number): number {
    assertActive(signal);
    if (i === j) {
      rec.step(
        'call',
        `solve(${i},${j}) = 0 (chuỗi một ma trận).`,
        (d) => {
          d.matrix[i][j] = 0;
          d.computed[i][j] = true;
          d.current = {i, w: j};
        },
        [],
        'call',
      );
      return 0;
    }
    if (memo[i][j] !== null) {
      rec.step(
        'call',
        `solve(${i},${j}) đã có trong bảng nhớ: ${memo[i][j]}.`,
        (d) => {
          d.current = {i, w: j};
        },
        [],
        'call',
      );
      return memo[i][j]!;
    }
    let best = Infinity;
    let bestK = i;
    for (let k = i; k < j; k++) {
      rec.count('compare');
      rec.count('recurse');
      const cost = solve(i, k) + solve(k + 1, j) + dims[i - 1] * dims[k] * dims[j];
      rec.step('try', `Thử điểm chia k=${k} cho đoạn [${i},${j}]: chi phí ${cost}.`, (d) => { d.current = {i, w: j}; }, [], 'call');
      if (cost < best) {
        best = cost;
        bestK = k;
      }
    }
    memo[i][j] = best;
    split[i][j] = bestK;
    rec.count('assign');
    rec.step(
      'memoize',
      `Nhớ solve(${i},${j}) = ${best} với điểm chia k = ${bestK}.`,
      (d) => {
        d.matrix[i][j] = best;
        d.computed[i][j] = true;
        d.current = {i, w: j};
        d.dependencies = [[i, bestK], [bestK + 1, j]];
      },
      [{target: `cell-${i}-${j}`, role: 'current'}],
      'call',
    );
    rec.step(
      'split',
      's[' + i + '][' + j + '] = ' + bestK + ': chia thành [' + i + ',' + bestK + '] và [' + (bestK + 1) + ',' + j + '].',
      (d) => {
        d.matrix[n + 1 + i][j] = bestK;
        d.computed[n + 1 + i][j] = true;
      },
      [],
      'call',
    );
    return best;
  }

  const cost = n === 0 ? 0 : solve(1, n);
  const nodes: VisualState['nodes'] = [];
  if (n >= 1) buildTree(1, n, split, null, nodes);
  rec.step('build', 'Dựng lại cách đặt ngoặc từ bảng điểm chia.', (d) => { d.nodes = nodes; }, [], 'backtrack');
  const output = pack(dims, cost, split);
  rec.step('done', `Số phép nhân tối ưu là ${output.cost}.`, (d) => { d.note = 'Hoàn tất'; }, [], 'done');
  return output;
}
