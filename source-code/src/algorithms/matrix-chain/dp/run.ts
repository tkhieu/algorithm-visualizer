import type {RunContext} from '../../../core/contracts';
import type {Input, Output} from '../../../problems/matrix-chain/definition';
import {assertActive, buildTree, pack, type VisualState} from '../shared';

export function run(input: Input, {rec, signal}: RunContext<VisualState>): Output {
  const {dims} = input;
  const n = dims.length - 1;
  const dp = Array.from({length: n + 1}, () => new Array<number>(n + 1).fill(0));
  const split = Array.from({length: n + 1}, () => new Array<number>(n + 1).fill(0));

  rec.step(
    'init',
    'dp[i][i] = 0 cho mọi i vì chuỗi một ma trận không cần nhân.',
    (d) => {
      for (let i = 1; i <= n; i++) {
        d.matrix[i][i] = 0;
        d.computed[i][i] = true;
      }
    },
    [],
    'build-table',
  );

  for (let len = 2; len <= n; len++) {
    assertActive(signal);
    for (let i = 1; i <= n - len + 1; i++) {
      const j = i + len - 1;
      let best = Infinity;
      let bestK = i;
      for (let k = i; k < j; k++) {
        rec.count('compare');
        const cost = dp[i][k] + dp[k + 1][j] + dims[i - 1] * dims[k] * dims[j];
        if (cost < best) {
          best = cost;
          bestK = k;
        }
      }
      dp[i][j] = best;
      split[i][j] = bestK;
      rec.count('assign');
      rec.step(
        'cell',
        `dp[${i}][${j}] = ${best} với điểm chia tốt nhất k = ${bestK}.`,
        (d) => {
          d.matrix[i][j] = best;
          d.computed[i][j] = true;
          d.current = {i, w: j};
          d.dependencies = [[i, bestK], [bestK + 1, j]];
        },
        [{target: `cell-${i}-${j}`, role: 'current'}],
        'build-table',
      );
      rec.step(
        'split',
        's[' + i + '][' + j + '] = ' + bestK + ': chia thành [' + i + ',' + bestK + '] và [' + (bestK + 1) + ',' + j + '].',
        (d) => {
          d.matrix[n + 1 + i][j] = bestK;
          d.computed[n + 1 + i][j] = true;
        },
        [],
        'build-table',
      );
    }
  }

  const nodes: VisualState['nodes'] = [];
  if (n >= 1) buildTree(1, n, split, null, nodes);
  rec.step(
    'build',
    'Dựng lại cách đặt ngoặc từ bảng điểm chia.',
    (d) => {
      d.nodes = nodes;
    },
    [],
    'backtrack',
  );

  const output = pack(dims, n === 0 ? 0 : dp[1][n], split);
  rec.step('done', `Số phép nhân tối ưu là ${output.cost}.`, (d) => { d.note = 'Hoàn tất'; }, [], 'done');
  return output;
}
