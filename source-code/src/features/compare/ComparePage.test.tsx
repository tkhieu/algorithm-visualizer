import {describe, it, expect, vi} from 'vitest';
import {render, screen, fireEvent, waitFor} from '@testing-library/react';
import {MemoryRouter} from 'react-router-dom';
import {z} from 'zod';
import {opNames, type RunResult} from '../../core/contracts';
import {ComparePage} from './ComparePage';

// runWorker trả về {promise,cancel} có thể điều khiển thủ công từ test (không resolve tự động,
// không sleep) để tái hiện đúng race: một lượt chạy còn "treo" khi người dùng đổi lựa chọn.
// cancel() chỉ ghi nhận đã gọi (không tự resolve) — đúng tinh thần kiểm tra runGen trong
// ComparePage.tsx là lưới an toàn thật, không phải việc cancel() tự dọn promise.
const {runWorkerMock, benchWorkerMock, pendingRuns, cancelledIds} = vi.hoisted(() => {
  const pendingRuns = new Map<string, {resolve: (r: unknown) => void}>();
  const cancelledIds: string[] = [];
  const runWorkerMock = vi.fn((algoId: string) => {
    let resolveFn!: (r: unknown) => void;
    const promise = new Promise((resolve) => {
      resolveFn = resolve;
    });
    pendingRuns.set(algoId, {resolve: resolveFn});
    return {promise, cancel: () => cancelledIds.push(algoId)};
  });
  const benchWorkerMock = vi.fn(async () => ({medianMs: 1}));
  return {runWorkerMock, benchWorkerMock, pendingRuns, cancelledIds};
});
vi.mock('../../core/worker-protocol/client', () => ({runWorker: runWorkerMock, benchWorker: benchWorkerMock}));

vi.mock('../../catalog/manifest', () => ({
  algorithms: [
    {
      id: 'fake-problem/slow', problemId: 'fake-problem', title: 'Slow', chapter: 1, section: '1.1', page: 1,
      technique: 'brute-force', exactness: 'exact', complexity: {time: 'O(1)', space: 'O(1)'}, views: ['sequence'], status: 'ready',
    },
    {
      id: 'fake-problem/fast', problemId: 'fake-problem', title: 'Fast', chapter: 1, section: '1.1', page: 1,
      technique: 'brute-force', exactness: 'exact', complexity: {time: 'O(1)', space: 'O(1)'}, views: ['sequence'], status: 'ready',
    },
  ],
}));

const fakeProblem = {
  id: 'fake-problem', title: 'Bài toán giả', statement: '', inputSchema: z.object({}).passthrough(),
  outputSchema: z.object({}).passthrough(), constraints: [], generate: () => ({}),
  cases: [{id: 'c1', name: 'c1', group: 'normal' as const, input: {}}], check: () => ({ok: true as const}),
};
function fakeAlgorithm(id: string) {
  return {
    id, problemId: 'fake-problem', title: id.split('/')[1], chapter: 1, section: '1.1', page: 1,
    technique: 'brute-force', exactness: 'exact' as const, complexity: {time: 'O(1)', space: 'O(1)'},
    views: ['sequence' as const], pseudocode: [{id: 'done', text: 'done', indent: 0}],
    traceLimit: {maxInputSize: 100, maxSteps: 100, maxBytes: 100_000},
    initVisual: () => ({items: []}), run: () => ({}),
  };
}
vi.mock('../../catalog/registry', () => ({
  loadProblem: vi.fn(async () => fakeProblem),
  loadAlgorithm: vi.fn(async (id: string) => fakeAlgorithm(id)),
}));
vi.mock('../../catalog/ui-registry', () => ({
  loadProblemUi: vi.fn(async () => ({})),
  loadComparisonAdapter: vi.fn(async () => ({
    problemId: 'fake-problem', project: (_i: unknown, o: unknown) => o,
    metrics: [{id: 'ms', label: 'Thời gian', better: 'lower' as const}],
  })),
}));

function okResult(): RunResult<unknown> {
  const counters = Object.fromEntries(opNames.map((o) => [o, 0])) as RunResult<unknown> extends {counters: infer C} ? C : never;
  return {status: 'ok', output: {}, verdict: {ok: true}, counters, ms: 1, truncated: false};
}

const status=(testId:string)=>screen.getByTestId(testId).getAttribute('data-status');
// Chờ một điều kiện tối đa `timeout`ms rồi bỏ qua nếu nó không bao giờ đúng — dùng để chứng
// minh một vế âm (ví dụ "không bao giờ chuyển sang 'ok'") một cách xác định: nếu điều kiện có
// xảy ra, waitFor trả về ngay (vài tick, không chờ hết timeout); nếu không, test vẫn tiếp tục
// sau đúng khoảng timeout đó rồi assert trạng thái cuối — không phải sleep vô điều kiện.
async function settleOrTimeout(predicate:()=>void,timeout=300){
 try{await waitFor(predicate,{timeout})}catch{/* không xảy ra trong thời gian chờ — như kỳ vọng khi đã fix */}
}

describe('ComparePage — generation token bỏ qua kết quả của lượt chạy đã bị thay thế', () => {
  it('đổi lựa chọn giữa lúc đang chạy: làn bị bỏ chọn biến mất, kết quả muộn của nó bị bỏ qua, chọn lại chạy mới sạch', async () => {
    render(
      <MemoryRouter initialEntries={['/compare/fake-problem']}>
        <ComparePage problemId="fake-problem" />
      </MemoryRouter>,
    );
    await screen.findByTestId('lane-slow');
    expect(status('lane-slow')).toBe('idle');
    expect(status('lane-fast')).toBe('idle');

    fireEvent.click(screen.getByRole('button', {name: 'Chạy tất cả'}));
    await waitFor(() => expect(status('lane-slow')).toBe('running'));
    expect(status('lane-fast')).toBe('running');

    const staleSlowRun = pendingRuns.get('fake-problem/slow')!;
    pendingRuns.get('fake-problem/fast')!.resolve(okResult());
    await waitFor(() => expect(status('lane-fast')).toBe('ok'));

    // Bỏ chọn Slow ngay khi lượt chạy của nó còn đang treo (chưa resolve).
    fireEvent.click(screen.getByRole('checkbox', {name: 'Slow'}));
    expect(screen.queryByTestId('lane-slow')).toBeNull();
    expect(cancelledIds).toContain('fake-problem/slow');

    // Chọn lại Slow NGAY (trước khi lượt chạy cũ resolve) — tạo một làn mới cùng id, idle, như
    // trong mô tả lỗi gốc: "kết quả muộn ghi đè lên làn đã bị xoá rồi chọn lại dưới cùng id".
    fireEvent.click(screen.getByRole('checkbox', {name: 'Slow'}));
    await screen.findByTestId('lane-slow');
    expect(status('lane-slow')).toBe('idle');

    // Giờ mới mô phỏng kết quả "muộn" của lượt chạy cũ (đã bị huỷ) tới — không sleep vô điều
    // kiện, chỉ resolve thủ công promise đã treo từ trước lúc bỏ chọn, rồi chờ có điều kiện
    // (settleOrTimeout) đủ lâu để chuỗi .then cũ (nếu không bị chặn) có cơ hội chạy hết và ghi
    // đè làn. Nếu không có generation token, kết quả muộn này sẽ ghi đè lên làn mới (idle) vừa
    // tạo ở trên, hiện 'ok' một cách sai lệch — settleOrTimeout sẽ bắt được điều đó ngay khi nó
    // xảy ra; nếu được chặn đúng (đã fix), nó sẽ không bao giờ xảy ra và ta vẫn thấy 'idle'.
    staleSlowRun.resolve(okResult());
    await settleOrTimeout(()=>expect(status('lane-slow')).toBe('ok'));
    expect(status('lane-slow')).toBe('idle');

    // Chạy lại: lượt chạy mới cho Slow phải là một promise mới, độc lập khỏi lượt đã bỏ qua.
    fireEvent.click(screen.getByRole('button', {name: 'Chạy tất cả'}));
    await waitFor(() => expect(status('lane-slow')).toBe('running'));
    const freshSlowRun = pendingRuns.get('fake-problem/slow')!;
    expect(freshSlowRun).not.toBe(staleSlowRun);
    freshSlowRun.resolve(okResult());
    await waitFor(() => expect(status('lane-slow')).toBe('ok'));
  });
});
