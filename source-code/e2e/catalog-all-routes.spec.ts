import {test, expect, type Page} from '@playwright/test';
import {algorithms, problems} from '../src/catalog/manifest';

// Sinh tự động từ manifest — không liệt kê tay — để Phase I không bao giờ lệch khỏi
// catalog thật: mỗi id ready mới trong manifest tự động có route được kiểm tra ở đây.
const readyAlgorithms = algorithms.filter((a) => a.status === 'ready');
const readyProblems = problems.filter((p) => p.status === 'ready');
const algosByProblem = new Map<string, typeof readyAlgorithms>();
for (const a of readyAlgorithms) algosByProblem.set(a.problemId, [...(algosByProblem.get(a.problemId) ?? []), a]);

type Precondition = (input: unknown) => string | undefined;

async function loadPrecondition(algoId: string): Promise<Precondition | undefined> {
  const [problemId, techniqueId] = algoId.split('/');
  const mod = (await import(`../src/algorithms/${problemId}/${techniqueId}/index.ts`)) as {
    algorithm: {precondition?: Precondition};
  };
  return mod.algorithm.precondition;
}

async function loadCases(problemId: string): Promise<{input: unknown}[]> {
  const mod = (await import(`../src/problems/${problemId}/cases.ts`)) as {cases: {input: unknown}[]};
  return mod.cases;
}

// Player và Compare đều khởi tạo input bằng problem.cases[0]?.input (xem PlayerPage.tsx,
// ComparePage.tsx) — tính trước đúng input mặc định đó cho từng bài toán, và với mỗi thuật
// toán, gọi thẳng precondition thật của nó trên input đó để biết trước kết quả PHẢI là gì:
// 'ok' (thành công) nếu precondition không chặn, hoặc đúng lý do 'not-applicable' nếu có.
// Nhờ vậy test khẳng định một kết quả cụ thể, có thể fail, thay vì chấp nhận bất kỳ text nào.
const defaultCasesByProblem = new Map<string, {input: unknown}[]>();
for (const p of readyProblems) defaultCasesByProblem.set(p.id, await loadCases(p.id));

const expectedReasonByAlgo = new Map<string, string | undefined>();
for (const a of readyAlgorithms) {
  const precondition = await loadPrecondition(a.id);
  const defaultInput = defaultCasesByProblem.get(a.problemId)?.[0]?.input ?? {};
  expectedReasonByAlgo.set(a.id, precondition?.(defaultInput));
}

function trackErrors(page: Page) {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text());
  });
  return errors;
}

test.describe('smoke toàn bộ /play/:problem/:algorithm (ca mặc định)', () => {
  for (const a of readyAlgorithms) {
    const [problemId, algoId] = a.id.split('/');
    const expectedReason = expectedReasonByAlgo.get(a.id);
    test(`/play/${a.id}: chạy ca mặc định, đúng trạng thái kết thúc, không lỗi console`, async ({page}) => {
      const errors = trackErrors(page);
      await page.goto(`/play/${problemId}/${algoId}`);
      await expect(page.getByRole('heading', {level: 1})).toBeVisible();
      await expect(page.getByRole('button', {name: 'Chạy', exact: true})).toBeEnabled();
      await page.getByRole('button', {name: 'Chạy', exact: true}).click();
      const output = page.getByTestId('output');
      // data-status là tín hiệu "đã xong" thật (idle → running → trạng thái cuối của
      // RunResult) do PlayerPage.tsx phát ra — chờ đúng giá trị cuối kỳ vọng, không suy đoán
      // qua nội dung text và không chấp nhận 'error'/'timeout'/'invalid-input'/'cancelled'.
      if (expectedReason !== undefined) {
        await expect(output, `kỳ vọng not-applicable: ${expectedReason}`).toHaveAttribute(
          'data-status',
          'not-applicable',
          {timeout: 30_000},
        );
        await expect(output).toContainText(expectedReason);
      } else {
        await expect(output).toHaveAttribute('data-status', 'ok', {timeout: 30_000});
      }
      expect(errors, `console/page errors on /play/${a.id}`).toEqual([]);
    });
  }
});

test.describe('smoke toàn bộ /compare/:problem (bài toán có ≥ 2 thuật toán ready)', () => {
  for (const [problemId, algos] of algosByProblem) {
    if (algos.length < 2) continue;
    test(`/compare/${problemId}: mọi làn chạy xong đúng trạng thái, không lỗi console`, async ({page}) => {
      const errors = trackErrors(page);
      await page.goto(`/compare/${problemId}`);
      await expect(page.getByRole('heading', {level: 1})).toBeVisible();
      // Trước khi bấm "Chạy tất cả", mọi làn đã được chọn phải hiện sẵn ở trạng thái idle —
      // chưa dispatch run nào — không phải 'running' (xem ComparePage.tsx).
      for (const a of algos)
        await expect(page.getByTestId(`lane-${a.id.split('/')[1]}`), `làn ${a.id} phải idle khi mới vào trang`).toHaveAttribute(
          'data-status',
          'idle',
        );
      await page.getByRole('button', {name: 'Chạy tất cả'}).click();
      await expect(page.getByTestId('results-table').locator('tbody tr')).toHaveCount(algos.length);
      for (const a of algos) {
        const laneId = a.id.split('/')[1];
        const expectedReason = expectedReasonByAlgo.get(a.id);
        const expectedStatus = expectedReason !== undefined ? 'not-applicable' : 'ok';
        const lane = page.getByTestId(`lane-${laneId}`);
        await expect(lane, `làn ${a.id} kỳ vọng ${expectedStatus}`).toHaveAttribute('data-status', expectedStatus, {
          timeout: 30_000,
        });
        const row = page.getByTestId(`result-row-${laneId}`);
        if (expectedStatus === 'ok') {
          // Cột "Kết quả chung" (projected qua ComparisonAdapter) phải có giá trị thật —
          // bắt buộc có adapter khi bài toán ≥ 2 thuật toán (xem docs/adding-an-algorithm.md),
          // nên '—' ở đây nghĩa là lane chưa thật sự có kết quả.
          await expect(row.locator('td').last()).not.toHaveText('—');
        }
      }
      expect(errors, `console/page errors on /compare/${problemId}`).toEqual([]);
    });
  }
});

test.describe('smoke toàn bộ /testcases/:problem', () => {
  for (const p of readyProblems) {
    const expectedCount = defaultCasesByProblem.get(p.id)?.length ?? 0;
    test(`/testcases/${p.id}: đạt đúng ${expectedCount}/${expectedCount} ca, không lỗi console`, async ({page}) => {
      test.setTimeout(60_000);
      const errors = trackErrors(page);
      await page.goto(`/testcases/${p.id}`);
      await expect(page.getByRole('heading', {level: 1})).toBeVisible();
      await page.getByRole('button', {name: 'Chạy tất cả'}).click();
      const passCount = page.getByTestId('pass-count');
      // data-status='done' do TestcasePage.tsx phát ra khi benchPool đã trả hết — chờ đúng tín
      // hiệu này rồi mới đọc text, không suy đoán qua số khác 0.
      await expect(passCount).toHaveAttribute('data-status', 'done', {timeout: 45_000});
      await expect(passCount).toHaveText(`Đạt ${expectedCount}/${expectedCount}`);
      expect(errors, `console/page errors on /testcases/${p.id}`).toEqual([]);
    });
  }
});
