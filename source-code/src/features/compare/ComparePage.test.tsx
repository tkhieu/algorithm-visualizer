import {describe, it, expect, vi} from 'vitest';
import {render, screen, fireEvent, act} from '@testing-library/react';
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

const status = (testId: string) => screen.getByTestId(testId).getAttribute('data-status');
// Mọi hành động (render, click, resolve promise đã treo) được gói trong act(async…) — React
// tự xả hết hàng đợi microtask/effect phát sinh trước khi act() trả về, nên assert ngay sau đó
// là đồng bộ, xác định, không cần waitFor/timeout nào (không có chờ theo thời gian thực).
async function tick(fn: () => void) {
  await act(async () => {
    fn();
  });
}

describe('ComparePage — generation token bỏ qua kết quả của lượt chạy đã bị thay thế', () => {
  it('đổi lựa chọn giữa lúc đang chạy: làn bị bỏ chọn biến mất, kết quả muộn của nó bị bỏ qua, chọn lại chạy mới sạch', async () => {
    await tick(() => {
      render(
        <MemoryRouter initialEntries={['/compare/fake-problem']}>
          <ComparePage problemId="fake-problem" />
        </MemoryRouter>,
      );
    });
    expect(status('lane-slow')).toBe('idle');
    expect(status('lane-fast')).toBe('idle');

    await tick(() => fireEvent.click(screen.getByRole('button', {name: 'Chạy tất cả'})));
    expect(status('lane-slow')).toBe('running');
    expect(status('lane-fast')).toBe('running');

    const staleSlowRun = pendingRuns.get('fake-problem/slow')!;
    await tick(() => pendingRuns.get('fake-problem/fast')!.resolve(okResult()));
    expect(status('lane-fast')).toBe('ok');

    // Bỏ chọn Slow ngay khi lượt chạy của nó còn đang treo (chưa resolve).
    await tick(() => fireEvent.click(screen.getByRole('checkbox', {name: 'Slow'})));
    expect(screen.queryByTestId('lane-slow')).toBeNull();
    expect(cancelledIds).toContain('fake-problem/slow');

    // Chọn lại Slow NGAY (trước khi lượt chạy cũ resolve) — tạo một làn mới cùng id, idle, như
    // trong mô tả lỗi gốc: "kết quả muộn ghi đè lên làn đã bị xoá rồi chọn lại dưới cùng id".
    await tick(() => fireEvent.click(screen.getByRole('checkbox', {name: 'Slow'})));
    expect(status('lane-slow')).toBe('idle');

    // Giờ mới mô phỏng kết quả "muộn" của lượt chạy cũ (đã bị huỷ) tới, resolve thủ công promise
    // đã treo từ trước lúc bỏ chọn — gói trong act() để xả hết chuỗi .then cũ (await
    // task.promise → benchWorker → updateLane) nếu nó không bị chặn, rồi assert ngay, đồng bộ.
    // Nếu không có generation token, chuỗi này sẽ ghi đè lên làn mới (idle) vừa tạo ở trên,
    // khiến assert dưới đây thất bại (status chuyển 'ok').
    await tick(() => staleSlowRun.resolve(okResult()));
    expect(status('lane-slow')).toBe('idle');

    // Chạy lại: lượt chạy mới cho Slow phải là một promise mới, độc lập khỏi lượt đã bỏ qua.
    await tick(() => fireEvent.click(screen.getByRole('button', {name: 'Chạy tất cả'})));
    expect(status('lane-slow')).toBe('running');
    const freshSlowRun = pendingRuns.get('fake-problem/slow')!;
    expect(freshSlowRun).not.toBe(staleSlowRun);
    await tick(() => freshSlowRun.resolve(okResult()));
    expect(status('lane-slow')).toBe('ok');
  });

  it('đổi lựa chọn khi cả hai làn còn đang chạy: làn giữ lại trở về idle (không kẹt running), chạy lại thì xong', async () => {
    await tick(() => {
      render(
        <MemoryRouter initialEntries={['/compare/fake-problem']}>
          <ComparePage problemId="fake-problem" />
        </MemoryRouter>,
      );
    });
    await tick(() => fireEvent.click(screen.getByRole('button', {name: 'Chạy tất cả'})));
    expect(status('lane-slow')).toBe('running');
    expect(status('lane-fast')).toBe('running');

    // Bỏ chọn Fast khi CẢ HAI làn còn đang chạy (chưa lane nào có result) — Fast biến mất,
    // Slow (vẫn được chọn, vẫn running, chưa có result) phải bị đưa về idle ngay, không được
    // kẹt ở 'running' mãi vì lượt chạy cũ của nó đã bị cancel() và kết quả (nếu tới) sẽ bị
    // runGen chặn, nghĩa là running:true sẽ không bao giờ tự tắt nếu không reset ở đây.
    await tick(() => fireEvent.click(screen.getByRole('checkbox', {name: 'Fast'})));
    expect(screen.queryByTestId('lane-fast')).toBeNull();
    expect(status('lane-slow')).toBe('idle');
    expect(cancelledIds).toContain('fake-problem/slow');

    // Chạy lại (chỉ Slow còn được chọn): phải hoàn tất được, không kẹt running mãi.
    await tick(() => fireEvent.click(screen.getByRole('button', {name: 'Chạy tất cả'})));
    expect(status('lane-slow')).toBe('running');
    await tick(() => pendingRuns.get('fake-problem/slow')!.resolve(okResult()));
    expect(status('lane-slow')).toBe('ok');
  });

  it('rời trang (unmount) giữa lúc đang so sánh: huỷ hết worker đang chạy, kết quả muộn không gây setState sau unmount', async () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    let unmount!: () => void;
    await tick(() => {
      const result = render(
        <MemoryRouter initialEntries={['/compare/fake-problem']}>
          <ComparePage problemId="fake-problem" />
        </MemoryRouter>,
      );
      unmount = result.unmount;
    });
    await tick(() => fireEvent.click(screen.getByRole('button', {name: 'Chạy tất cả'})));
    expect(status('lane-slow')).toBe('running');
    expect(status('lane-fast')).toBe('running');

    const slowRun = pendingRuns.get('fake-problem/slow')!;
    const fastRun = pendingRuns.get('fake-problem/fast')!;
    const cancelledBefore = cancelledIds.length;

    // Rời trang khi cả hai làn còn đang chạy: cleanup unmount phải cancel() cả hai task.
    await tick(() => unmount());
    const newlyCancelled = cancelledIds.slice(cancelledBefore);
    expect(newlyCancelled).toEqual(expect.arrayContaining(['fake-problem/slow', 'fake-problem/fast']));

    // Hai worker "đã tính xong trước khi bị huỷ" vẫn gửi kết quả muộn tới sau khi unmount —
    // không được gây setState trên component đã unmount (không có console.error nào, kể cả
    // warning "state update on an unmounted component" hay act() warning).
    await tick(() => {
      slowRun.resolve(okResult());
      fastRun.resolve(okResult());
    });
    expect(errorSpy).not.toHaveBeenCalled();
    errorSpy.mockRestore();
  });
});
