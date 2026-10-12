import type {RunContext} from '../../../core/contracts';
import type {Input, Output} from '../../../problems/assignment/definition';
import {assertActive, marksFor, pack, type VisualState} from '../shared';

const SAFE_MAX = 9;

export function run(input: Input, {rec, signal}: RunContext<VisualState>): Output {
  const {cost} = input;
  const n = cost.length;
  if (n > SAFE_MAX) {
    throw new Error(`Vét cạn chỉ hỗ trợ đến ${SAFE_MAX} người/việc (nhận ${n}); hãy dùng nhánh cận hoặc Hungary cho n lớn hơn.`);
  }

  let nextId = 0;
  const nodeAtDepth: number[] = [];
  let best: number[] | null = null;
  let bestCost = Infinity;
  const rootId = nextId++;
  rec.step(
    'init',
    `Sinh mọi hoán vị của ${n} việc để gán cho ${n} người.`,
    (d) => {
      d.nodes.push({id: rootId, parent: null, label: '∅', status: 'current', value: 0});
    },
    [],
    'search',
  );

  function permute(assignment: number[], remaining: number[], depth: number): void {
    assertActive(signal);
    if (!remaining.length) {
      rec.count('compare');
      const total = assignment.reduce((sum, job, worker) => sum + cost[worker][job], 0);
      const improved = total < bestCost;
      if (improved) {
        best = assignment.slice();
        bestCost = total;
      }
      const id = nextId++;
      rec.step(
        'leaf',
        `Phân công ${assignment.join(',')} có chi phí ${total}${improved ? ' — tốt nhất hiện tại' : ''}.`,
        (d) => {
          d.nodes.push({id, parent: nodeAtDepth[depth - 1], label: String(total), status: improved ? 'best' : 'done', value: total});
          if (improved) d.marks = marksFor(cost, assignment);
        },
        [],
        'leaf',
      );
      return;
    }
    for (let i = 0; i < remaining.length; i++) {
      rec.count('visit');
      const job = remaining[i];
      const id = nextId++;
      nodeAtDepth[depth] = id;
      const nextAssignment = [...assignment, job];
      rec.step(
        'assign',
        `Gán việc ${job} cho người ${depth}.`,
        (d) => {
          d.nodes.push({id, parent: nodeAtDepth[depth - 1] ?? rootId, label: `${depth}:${job}`, status: 'current', value: 0});
        },
        [],
        'search',
      );
      permute(nextAssignment, [...remaining.slice(0, i), ...remaining.slice(i + 1)], depth + 1);
    }
  }

  permute([], Array.from({length: n}, (_, i) => i), 0);
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
