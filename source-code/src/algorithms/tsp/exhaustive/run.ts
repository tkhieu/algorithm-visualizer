import type {RunContext} from '../../../core/contracts';
import type {Input, Output} from '../../../problems/tsp/definition';
import {tourLength} from '../../../problems/tsp/checker';
import {assertActive, markTour, pack, type VisualState} from '../shared';

const SAFE_MAX = 9;

export function run(input: Input, {rec, signal}: RunContext<VisualState>): Output {
  const {points} = input;
  const n = points.length;
  if (n > SAFE_MAX) {
    throw new Error(
      `Vét cạn chỉ hỗ trợ đến ${SAFE_MAX} điểm (nhận ${n}); hãy dùng nhánh cận hoặc xấp xỉ cho n lớn hơn.`,
    );
  }
  if (n <= 1) {
    const tour = n === 1 ? [0] : [];
    rec.step('done', 'Chỉ có tối đa một điểm — hành trình tầm thường.', (d) => markTour(d, tour), [], 'done');
    return pack(points, tour);
  }

  let nextId = 0;
  const nodeAtDepth: number[] = [];
  let best: number[] | null = null;
  let bestLength = Infinity;
  const rootId = nextId++;
  nodeAtDepth[0] = rootId;
  rec.step(
    'init',
    `Cố định điểm 0 làm xuất phát; sinh mọi hoán vị của ${n - 1} điểm còn lại.`,
    (d) => {
      d.nodes.push({id: rootId, parent: null, label: '0', status: 'current', value: 0});
      markTour(d, [0]);
    },
    [],
    'search',
  );

  function permute(path: number[], remaining: number[], depth: number): void {
    assertActive(signal);
    if (!remaining.length) {
      rec.count('compare');
      const length = tourLength(points, path);
      const id = nextId++;
      const improved = length < bestLength;
      if (improved) {
        best = path.slice();
        bestLength = length;
      }
      rec.step(
        'leaf',
        `Hành trình ${path.join('-')} có độ dài ${length.toFixed(2)}${improved ? ' — tốt nhất hiện tại' : ''}.`,
        (d) => {
          d.nodes.push({
            id,
            parent: nodeAtDepth[depth - 1],
            label: length.toFixed(1),
            status: improved ? 'best' : 'done',
            value: length,
          });
          if (improved) markTour(d, path);
        },
        [],
        'leaf',
      );
      return;
    }
    for (let i = 0; i < remaining.length; i++) {
      rec.count('visit');
      const next = remaining[i];
      const id = nextId++;
      nodeAtDepth[depth] = id;
      const nextPath = [...path, next];
      rec.step(
        'assign',
        `Xếp điểm ${next} vào vị trí ${depth} của hoán vị.`,
        (d) => {
          d.nodes.push({id, parent: nodeAtDepth[depth - 1], label: String(next), status: 'current', value: 0});
          markTour(d, nextPath);
        },
        [],
        'search',
      );
      permute(nextPath, [...remaining.slice(0, i), ...remaining.slice(i + 1)], depth + 1);
    }
  }

  permute(
    [0],
    Array.from({length: n - 1}, (_, i) => i + 1),
    1,
  );
  rec.step(
    'done',
    `Hoàn tất: hành trình ngắn nhất có độ dài ${bestLength.toFixed(2)}.`,
    (d) => {
      markTour(d, best ?? [0]);
      d.note = 'Hoàn tất';
    },
    [],
    'done',
  );
  return pack(points, best ?? [0]);
}
