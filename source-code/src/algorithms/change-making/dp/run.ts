import type { RunContext } from '../../../core/contracts';
import type { Input, Output } from '../../../problems/change-making/definition';
import { assertActive, pack, type VisualState } from '../shared';

export function run(input: Input, { rec, signal }: RunContext<VisualState>): Output {
  const { amount, coins } = input;
  const dp = new Array<number>(amount + 1).fill(Infinity);
  const choice = new Array<number>(amount + 1).fill(-1);
  dp[0] = 0;
  rec.step(
    'init',
    'F(0) = 0: đổi 0 đồng cần 0 xu.',
    (d) => {
      d.matrix[0][0] = 0;
      d.computed[0][0] = true;
      d.current = { i: 0, w: 0 };
      d.note = 'F(0) = 0';
    },
    [],
    'fill',
  );
  for (let x = 1; x <= amount; x++) {
    assertActive(signal);
    for (const c of coins) {
      rec.count('compare');
      if (c <= x && dp[x - c] + 1 < dp[x]) {
        dp[x] = dp[x - c] + 1;
        choice[x] = c;
      }
    }
    const shown = dp[x] === Infinity ? '∞' : dp[x];
    rec.step(
      'fill',
      `F(${x}) = ${shown}${choice[x] >= 0 ? ` (dùng đồng ${choice[x]})` : ''}.`,
      (d) => {
        d.matrix[0][x] = shown;
        d.computed[0][x] = true;
        d.current = { i: 0, w: x };
        d.note = `F(${x}) = ${shown}`;
      },
      [],
      'fill',
    );
  }
  const used: number[] = [];
  let x = amount;
  while (x > 0) {
    assertActive(signal);
    const c = choice[x];
    used.push(c);
    rec.step(
      'trace',
      `Truy vết: dùng đồng ${c} tại F(${x}).`,
      (d) => {
        d.current = { i: 0, w: x };
        d.note = `Dùng đồng ${c}`;
      },
      [],
      'backtrack',
    );
    x -= c;
  }
  rec.step(
    'done',
    `Hoàn tất: cần ${used.length} đồng xu.`,
    (d) => {
      d.note = `Cần ${used.length} đồng xu`;
    },
    [],
    'done',
  );
  return pack(used);
}
