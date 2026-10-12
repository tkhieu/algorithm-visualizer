import type {Algorithm} from '../../../core/contracts';
import type {Input, Output} from '../../../problems/subset-sum/definition';
import {initVisual, limits, type VisualState} from '../shared';
import {run, SAFE_MAX} from './run';
import {pseudocode} from './pseudocode';
import {legend} from './legend';
export const algorithm: Algorithm<Input, Output, VisualState> = {
  id: 'subset-sum/exhaustive',
  problemId: 'subset-sum',
  title: 'Vét cạn mọi tập con',
  chapter: 12,
  section: '12.1',
  page: 427,
  technique: 'brute-force',
  exactness: 'exact',
  complexity: {time: 'O(2ⁿ)', space: 'O(n)'},
  views: ['state-space-tree', 'matrix'],
  pseudocode,
  legend,
  traceLimit: {...limits, maxInputSize: 14},
  // target=0 luôn trả ngay tập rỗng (xem run.ts) nên không cần chặn dù n lớn; còn lại, vét cạn
  // 2ⁿ chỉ an toàn tới n = SAFE_MAX — vượt quá thì báo "không áp dụng" bằng tiếng Việt thay vì
  // chạy 2ⁿ nhánh hoặc ném lỗi.
  precondition: (input) =>
    input.target !== 0 && input.values.length > SAFE_MAX
      ? `Vét cạn 2ⁿ chỉ hỗ trợ n ≤ ${SAFE_MAX} (nhận n=${input.values.length}); hãy dùng quy hoạch động hoặc quay lui cho n lớn hơn.`
      : undefined,
  initVisual,
  run,
};
