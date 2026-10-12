import type {RunContext} from '../../../core/contracts';
import type {Input, Output} from '../../../problems/matrix-chain/definition';
import {assertActive, type VisualState} from '../shared';

const SAFE_MAX = 10;

export function run(input: Input, {rec, signal}: RunContext<VisualState>): Output {
  const {dims} = input;
  const n = dims.length - 1;
  if (n > SAFE_MAX) {
    throw new Error(`Vét cạn chỉ hỗ trợ đến ${SAFE_MAX} ma trận (nhận ${n}); hãy dùng quy hoạch động cho n lớn hơn.`);
  }

  function solve(i: number, j: number): {cost: number; paren: string} {
    assertActive(signal);
    rec.count('recurse');
    if (i === j) {
      rec.step('init', `solve(${i},${j}) = 0 (chuỗi một ma trận A${i}).`, (d) => { d.current = {i, w: j}; }, [], 'search');
      return {cost: 0, paren: `A${i}`};
    }
    let best = {cost: Infinity, paren: ''};
    for (let k = i; k < j; k++) {
      rec.count('compare');
      const left = solve(i, k);
      const right = solve(k + 1, j);
      const cost = left.cost + right.cost + dims[i - 1] * dims[k] * dims[j];
      const paren = `(${left.paren}${right.paren})`;
      rec.step(
        'try',
        `Đoạn [${i},${j}] chia tại k=${k}: chi phí ${cost}.`,
        (d) => {
          d.current = {i, w: j};
        },
        [{target: `cell-${i}-${j}`, role: 'current'}],
        'search',
      );
      if (cost < best.cost) {
        best = {cost, paren};
        rec.step(
          'compare',
          `Đoạn [${i},${j}]: cách chia tại k=${k} tốt hơn, chi phí ${cost}.`,
          (d) => {
            d.matrix[i][j] = cost;
            d.computed[i][j] = true;
          },
          [],
          'search',
        );
      }
    }
    return best;
  }

  if (n === 0) {
    rec.step('done', 'Không có ma trận nào.', (d) => { d.note = 'Hoàn tất'; }, [], 'done');
    return {cost: 0, parenthesization: ''};
  }
  const result = solve(1, n);
  rec.step(
    'done',
    `Hoàn tất: số phép nhân tối ưu là ${result.cost}.`,
    (d) => {
      d.matrix[1][n] = result.cost;
      d.computed[1][n] = true;
      d.note = 'Hoàn tất';
    },
    [],
    'done',
  );
  return {cost: result.cost, parenthesization: result.paren};
}
