import type {Algorithm} from '../../../core/contracts';
import type {Input, Output} from '../../../problems/tsp/definition';
import {initVisual, limits, type VisualState} from '../shared';
import {run, SAFE_MAX} from './run';
import {pseudocode} from './pseudocode';
import {legend} from './legend';

export const algorithm: Algorithm<Input, Output, VisualState> = {
  id: 'tsp/branch-and-bound',
  problemId: 'tsp',
  title: 'Nhánh cận',
  chapter: 12,
  section: '12.2',
  page: 438,
  technique: 'branch-and-bound',
  exactness: 'exact',
  complexity: {time: 'O(n!) xấu nhất', space: 'O(n·2ⁿ)'},
  views: ['points-2d', 'state-space-tree'],
  pseudocode,
  legend,
  traceLimit: {...limits, maxInputSize: 9},
  precondition: (input) =>
    input.points.length > SAFE_MAX
      ? `Nhánh cận chỉ hỗ trợ đến ${SAFE_MAX} điểm (nhận ${input.points.length}); hãy dùng thuật toán xấp xỉ cho n lớn hơn.`
      : undefined,
  initVisual,
  run,
};
