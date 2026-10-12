import type {RunContext} from '../../../core/contracts';
import type {Input, Output} from '../../../problems/assignment/definition';
import {assertActive, marksFor, pack, type VisualState} from '../shared';

const SAFE_MAX = 9;

interface Node {
  id: number;
  parent: number | null;
  assignment: number[];
  used: Set<number>;
  cost: number;
  bound: number;
}

export function run(input: Input, {rec, signal}: RunContext<VisualState>): Output {
  const {cost} = input;
  const n = cost.length;
  if (n > SAFE_MAX) {
    throw new Error(`Nhánh cận chỉ hỗ trợ đến ${SAFE_MAX} người/việc (nhận ${n}); hãy dùng Hungary cho n lớn hơn.`);
  }
  if (n === 0) {
    rec.step('done', 'Không có người nào — phân công tầm thường.', (d) => { d.note = 'Hoàn tất'; }, [], 'done');
    return pack(cost, []);
  }

  const rowMin = cost.map((row) => Math.min(...row));
  const bound = (depth: number, currentCost: number) => {
    let remainder = 0;
    for (let i = depth; i < n; i++) remainder += rowMin[i];
    return currentCost + remainder;
  };

  let nextId = 0;
  const rootId = nextId++;
  const root: Node = {id: rootId, parent: null, assignment: [], used: new Set(), cost: 0, bound: bound(0, 0)};
  const queue: Node[] = [root];
  let best: number[] | null = null;
  let bestCost = Infinity;

  rec.step(
    'init',
    `Cận dưới gốc = tổng chi phí nhỏ nhất mỗi hàng = ${root.bound}.`,
    (d) => {
      d.nodes.push({id: rootId, parent: null, label: '∅', status: 'current', value: 0, bound: root.bound});
    },
    [],
    'search',
  );

  while (queue.length) {
    assertActive(signal);
    queue.sort((a, b) => a.bound - b.bound);
    const node = queue.shift()!;
    rec.count('visit');
    if (node.bound >= bestCost) {
      rec.count('prune');
      rec.step(
        'bound',
        `Cắt nhánh tại nút ${node.id}: cận dưới ${node.bound} ≥ chi phí tốt nhất ${bestCost}.`,
        (d) => {
          const vis = d.nodes.find((x) => x.id === node.id);
          if (vis) vis.status = 'pruned';
        },
        [],
        'search',
      );
      continue;
    }
    rec.step(
      'pop',
      `Xét nút ${node.id}: đã gán ${node.assignment.length} người, cận dưới ${node.bound}.`,
      (d) => {
        const vis = d.nodes.find((x) => x.id === node.id);
        if (vis) vis.status = 'current';
      },
      [],
      'search',
    );

    if (node.assignment.length === n) {
      rec.count('compare');
      const improved = node.cost < bestCost;
      if (improved) {
        best = node.assignment.slice();
        bestCost = node.cost;
      }
      rec.step(
        'leaf',
        `Phân công ${node.assignment.join(',')} hoàn tất: chi phí ${node.cost}${improved ? ' — tốt nhất hiện tại' : ''}.`,
        (d) => {
          const vis = d.nodes.find((x) => x.id === node.id);
          if (vis) vis.status = improved ? 'best' : 'done';
          if (improved) d.marks = marksFor(cost, node.assignment);
        },
        [],
        'leaf',
      );
      continue;
    }

    const worker = node.assignment.length;
    for (let job = 0; job < n; job++) {
      if (node.used.has(job)) continue;
      const childCost = node.cost + cost[worker][job];
      const childAssignment = [...node.assignment, job];
      const childUsed = new Set(node.used).add(job);
      const childBound = bound(childAssignment.length, childCost);
      const id = nextId++;
      rec.step(
        'branch',
        `Gán việc ${job} cho người ${worker}: chi phí ${childCost}, cận dưới ${childBound}.`,
        (d) => {
          d.nodes.push({id, parent: node.id, label: `${worker}:${job}`, status: 'open', value: childCost, bound: childBound});
        },
        [],
        'search',
      );
      if (childBound < bestCost) {
        queue.push({id, parent: node.id, assignment: childAssignment, used: childUsed, cost: childCost, bound: childBound});
      } else {
        rec.count('prune');
        rec.step(
          'bound',
          `Cắt nhánh tại nút ${id}: cận dưới ${childBound} ≥ chi phí tốt nhất ${bestCost}.`,
          (d) => {
            const vis = d.nodes.find((x) => x.id === id);
            if (vis) vis.status = 'pruned';
          },
          [],
          'search',
        );
      }
    }
  }

  rec.step(
    'done',
    `Hoàn tất: chi phí tối ưu ${bestCost}.`,
    (d) => {
      d.marks = marksFor(cost, best ?? []);
      d.note = 'Hoàn tất';
    },
    [],
    'done',
  );
  return pack(cost, best ?? []);
}
