import type {RunContext} from '../../../core/contracts';
import type {Input, Output} from '../../../problems/matrix-chain/definition';
import {assertActive, type VisualState} from '../shared';

const SAFE_MAX = 10;

interface Candidate {
  cost: number;
  paren: string;
}

export function run(input: Input, {rec, signal}: RunContext<VisualState>): Output {
  const {dims} = input;
  const n = dims.length - 1;
  if (n > SAFE_MAX) {
    throw new Error('Vét cạn chỉ hỗ trợ đến ' + SAFE_MAX + ' ma trận (nhận ' + n + '); hãy dùng quy hoạch động.');
  }

  // Keep every complete tree, including trees with non-optimal subchains.
  function enumerate(i: number, j: number): Candidate[] {
    assertActive(signal);
    rec.count('recurse');
    if (i === j) return [{cost: 0, paren: 'A' + i}];
    const candidates: Candidate[] = [];
    for (let k = i; k < j; k++) {
      const left = enumerate(i, k);
      const right = enumerate(k + 1, j);
      for (const a of left) {
        for (const b of right) {
          candidates.push({
            cost: a.cost + b.cost + dims[i - 1] * dims[k] * dims[j],
            paren: '(' + a.paren + b.paren + ')',
          });
        }
      }
    }
    return candidates;
  }

  const candidates = enumerate(1, n);
  let best: Candidate = {cost: Infinity, paren: ''};
  for (const candidate of candidates) {
    assertActive(signal);
    rec.count('compare');
    rec.step(
      'try',
      'Đặt ngoặc ' + candidate.paren + ': chi phí ' + candidate.cost + '.',
      (d) => {
        d.current = {i: 1, w: n};
      },
      [{target: 'cell-1-' + n, role: 'current'}],
      'search',
    );
    if (candidate.cost < best.cost) {
      best = candidate;
      rec.step(
        'compare',
        'Tốt nhất hiện tại: ' + best.paren + ', chi phí ' + best.cost + '.',
        (d) => {
          d.matrix[1][n] = best.cost;
          d.computed[1][n] = true;
        },
        [],
        'search',
      );
    }
  }
  rec.step(
    'done',
    'Đã xét đủ ' + candidates.length + ' cách đặt ngoặc; chi phí tối ưu là ' + best.cost + '.',
    (d) => {
      d.note = 'Hoàn tất';
    },
    [],
    'done',
  );
  return {cost: best.cost, parenthesization: best.paren};
}
