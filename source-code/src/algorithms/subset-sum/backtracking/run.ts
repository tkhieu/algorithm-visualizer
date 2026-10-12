import type {RunContext} from '../../../core/contracts';
import type {Input, Output} from '../../../problems/subset-sum/definition';
import {assertActive, pack, type VisualState} from '../shared';
export function run(input: Input, {rec, signal}: RunContext<VisualState>): Output {
  const {values, target} = input;
  const n = values.length;
  const suffix = new Array(n + 1).fill(0);
  for (let i = n - 1; i >= 0; i--) suffix[i] = suffix[i + 1] + values[i];
  let nextId = 0;
  let found: number[] | null = null;
  const rootId = nextId++;
  rec.step(
    'init',
    'Khởi tạo tổng chạy bằng 0 tại gốc.',
    (d) => {
      d.nodes.push({id: rootId, parent: null, label: '∅ (0)', status: 'current', value: 0});
    },
    [],
    'search',
  );
  function solve(i: number, sum: number, chosen: number[], parent: number): boolean {
    assertActive(signal);
    rec.count('compare');
    if (sum === target) {
      found = chosen.slice();
      rec.step(
        'found',
        `Tổng hiện tại = ${sum} = S — tìm được tập con.`,
        (d) => {
          const node = d.nodes.find((x) => x.id === parent);
          if (node) node.status = 'best';
        },
        [],
        'done',
      );
      return true;
    }
    if (i === n || sum > target || sum + suffix[i] < target) {
      rec.count('prune');
      rec.step(
        'bound',
        `Cắt nhánh tại i=${i}, tổng=${sum}: ${i === n ? 'đã hết phần tử' : sum > target ? 'vượt S' : 'không thể đạt S dù lấy hết phần còn lại'}.`,
        (d) => {
          const node = d.nodes.find((x) => x.id === parent);
          if (node) node.status = 'pruned';
        },
        [],
        'search',
      );
      return false;
    }
    for (const take of [true, false]) {
      rec.count('visit');
      const id = nextId++;
      const newSum = sum + (take ? values[i] : 0);
      const newChosen = take ? [...chosen, i] : chosen;
      rec.step(
        'branch',
        `${take ? 'Lấy' : 'Bỏ'} phần tử ${i} (giá trị ${values[i]}); tổng mới = ${newSum}.`,
        (d) => {
          d.nodes.push({id, parent, label: `${take ? '+' : '-'}${values[i]}`, status: 'current', value: newSum});
        },
        [],
        'search',
      );
      if (solve(i + 1, newSum, newChosen, id)) return true;
    }
    rec.step(
      'backtrack',
      `Đã xét xong cả hai lựa chọn tại i=${i} — quay lui.`,
      (d) => {
        const node = d.nodes.find((x) => x.id === parent);
        if (node) node.status = 'done';
      },
      [],
      'search',
    );
    return false;
  }
  const ok = solve(0, 0, [], rootId);
  if (!ok)
    rec.step(
      'done',
      'Đã thử hết mọi khả năng — không có tập con.',
      (d) => {
        d.note = 'Không có tập con';
      },
      [],
      'done',
    );
  return pack(found);
}
