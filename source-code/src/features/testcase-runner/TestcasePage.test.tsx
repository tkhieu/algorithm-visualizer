import {describe, it, expect, vi} from 'vitest';
import {render, screen, fireEvent, act} from '@testing-library/react';
import {MemoryRouter} from 'react-router-dom';
import type {RunResult} from '../../core/contracts';
import {TestcasePage} from './TestcasePage';

// Tái hiện đúng tình huống của graph-coloring: một thuật toán chính xác "chậm" (ví dụ quay lui)
// được chọn làm chuẩn đối chiếu, tự khai "Không áp dụng" cho ca dữ liệu lớn qua precondition, còn
// một heuristic không có precondition (luôn áp dụng được) có thể chạy ca đó. 'huge' mô phỏng ca mà
// NGAY CẢ heuristic cũng không áp dụng được (để kiểm cơ chế đếm riêng "Không áp dụng" khi không
// thuật toán nào giải quyết được, không chỉ trường hợp mọi thứ cuối cùng đều được một thuật toán
// nào đó giải quyết).
type Size = 'small' | 'big' | 'huge';
const {benchWorkerMock} = vi.hoisted(() => {
  const zeros = Object.fromEntries(
    ['compare', 'swap', 'assign', 'visit', 'relax', 'prune', 'hash', 'recurse'].map((o) => [o, 0]),
  ) as Record<string, number>;
  function ok(): RunResult<unknown> {
    return {status: 'ok', output: {}, verdict: {ok: true}, counters: zeros as never, ms: 1, truncated: false};
  }
  function notApplicable(reason: string): RunResult<unknown> {
    return {status: 'not-applicable', reason};
  }
  const benchWorkerMock = vi.fn(async (algoId: string, input: unknown) => {
    const size = (input as {size: Size}).size;
    const result =
      algoId === 'fake-problem/exact'
        ? size === 'small'
          ? ok()
          : notApplicable('Không áp dụng: đồ thị quá lớn cho quay lui')
        : size === 'huge'
          ? notApplicable('Không áp dụng: vẫn quá lớn cho heuristic giả định này')
          : ok();
    return {type: 'bench-result' as const, result, medianMs: 1, counters: zeros as never};
  });
  return {benchWorkerMock};
});
vi.mock('../../core/worker-protocol/client', () => ({benchWorker: benchWorkerMock, runWorker: vi.fn()}));

vi.mock('../../catalog/manifest', () => ({
  algorithms: [
    {
      id: 'fake-problem/exact', problemId: 'fake-problem', title: 'Chính xác (chậm)', chapter: 1, section: '1.1',
      page: 1, technique: 'backtracking', exactness: 'exact', complexity: {time: 'O(1)', space: 'O(1)'},
      views: ['sequence'], status: 'ready',
    },
    {
      id: 'fake-problem/heuristic', problemId: 'fake-problem', title: 'Heuristic', chapter: 1, section: '1.1',
      page: 1, technique: 'greedy', exactness: 'approximate', complexity: {time: 'O(1)', space: 'O(1)'},
      views: ['sequence'], status: 'ready',
    },
  ],
}));

const fakeProblem = {
  id: 'fake-problem', title: 'Bài toán giả', statement: '', inputSchema: {safeParse: () => ({success: true})},
  outputSchema: {safeParse: () => ({success: true})}, constraints: [], generate: () => ({size: 'small'}),
  cases: [
    {id: 'small', name: 'small', group: 'normal' as const, input: {size: 'small'}},
    {id: 'big', name: 'big', group: 'large' as const, input: {size: 'big'}},
    {id: 'huge', name: 'huge', group: 'large' as const, input: {size: 'huge'}},
  ],
  check: () => ({ok: true as const}),
};
vi.mock('../../catalog/registry', () => ({loadProblem: vi.fn(async () => fakeProblem)}));

async function tick(fn: () => void | Promise<void>) {
  await act(async () => {
    await fn();
  });
}

describe('TestcasePage — ca bị thuật toán tham chiếu khai "Không áp dụng" vẫn được kiểm chứng bằng thuật toán khác', () => {
  it('ca lớn thử lại bằng heuristic khi thuật toán tham chiếu không áp dụng được; đếm riêng ca không thuật toán nào giải quyết', async () => {
    await tick(() => {
      render(
        <MemoryRouter initialEntries={['/testcases/fake-problem']}>
          <TestcasePage problemId="fake-problem" />
        </MemoryRouter>,
      );
    });
    await tick(() => {
      fireEvent.click(screen.getByRole('button', {name: 'Chạy tất cả'}));
    });

    // 'big': thuật toán tham chiếu (chính xác, chậm) khai "Không áp dụng" nhưng heuristic chạy
    // được — phải hiện "Đạt", không phải "Không áp dụng" (đây là lỗi của #12: heuristic không bao
    // giờ được thử vì trang luôn dùng đúng một thuật toán tham chiếu).
    const bigRow = screen.getByText('big').closest('tr')!;
    expect(bigRow.textContent).toContain('Đạt');
    expect(bigRow.textContent).not.toContain('Không áp dụng');

    // 'huge': không thuật toán nào áp dụng được — phải hiện "Không áp dụng", và KHÔNG được tính
    // vào tổng "Đạt" (đây là lỗi khác của #12: đếm not-applicable vào "Đạt").
    const hugeRow = screen.getByText('huge').closest('tr')!;
    expect(hugeRow.textContent).toContain('Không áp dụng');

    // Tổng: 'small' và 'big' đạt, 'huge' không áp dụng, tách riêng khỏi tổng đạt.
    expect(screen.getByTestId('pass-count').textContent).toBe('Đạt 2/3 · Không áp dụng 1');
  });
});
