import {test, expect} from '@playwright/test';
import {algorithms, problems} from '../src/catalog/manifest';

// Sinh tự động từ manifest — không liệt kê tay — để Phase I không bao giờ lệch khỏi
// catalog thật: mỗi id ready mới trong manifest tự động có route được kiểm tra ở đây.
const readyAlgorithms = algorithms.filter((a) => a.status === 'ready');
const readyProblems = problems.filter((p) => p.status === 'ready');
const algosByProblem = new Map<string, typeof readyAlgorithms>();
for (const a of readyAlgorithms) algosByProblem.set(a.problemId, [...(algosByProblem.get(a.problemId) ?? []), a]);

function trackErrors(page: import('@playwright/test').Page) {
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
    test(`/play/${a.id}: chạy ca mặc định, không lỗi console, có kết quả thật`, async ({page}) => {
      const errors = trackErrors(page);
      await page.goto(`/play/${problemId}/${algoId}`);
      await expect(page.getByRole('heading', {level: 1})).toBeVisible();
      await expect(page.getByRole('button', {name: 'Chạy', exact: true})).toBeEnabled();
      await page.getByRole('button', {name: 'Chạy', exact: true}).click();
      await expect(page.getByTestId('output')).not.toHaveText('Chạy thuật toán để xem kết quả.');
      await expect(page.getByTestId('output')).not.toContainText('Không thể chạy');
      expect(errors, `console/page errors on /play/${a.id}`).toEqual([]);
    });
  }
});

test.describe('smoke toàn bộ /compare/:problem (bài toán có ≥ 2 thuật toán ready)', () => {
  for (const [problemId, algos] of algosByProblem) {
    if (algos.length < 2) continue;
    test(`/compare/${problemId}: chạy tất cả ${algos.length} thuật toán, không lỗi console`, async ({page}) => {
      const errors = trackErrors(page);
      await page.goto(`/compare/${problemId}`);
      await expect(page.getByRole('heading', {level: 1})).toBeVisible();
      await page.getByRole('button', {name: 'Chạy tất cả'}).click();
      await expect(page.getByTestId('results-table').locator('tbody tr')).toHaveCount(algos.length);
      for (const a of algos) await expect(page.getByTestId(`lane-${a.id.split('/')[1]}`)).toBeVisible();
      expect(errors, `console/page errors on /compare/${problemId}`).toEqual([]);
    });
  }
});

test.describe('smoke toàn bộ /testcases/:problem', () => {
  for (const p of readyProblems) {
    test(`/testcases/${p.id}: chạy toàn bộ ca, đạt hết, không lỗi console`, async ({page}) => {
      test.setTimeout(60_000);
      const errors = trackErrors(page);
      await page.goto(`/testcases/${p.id}`);
      await expect(page.getByRole('heading', {level: 1})).toBeVisible();
      await page.getByRole('button', {name: 'Chạy tất cả'}).click();
      await expect(page.getByTestId('pass-count')).not.toHaveText('Đạt 0/0');
      await expect(page.getByTestId('pass-count')).toHaveText(/^Đạt (\d+)\/\1$/);
      expect(errors, `console/page errors on /testcases/${p.id}`).toEqual([]);
    });
  }
});
