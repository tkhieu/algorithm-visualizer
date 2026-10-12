import {test, expect} from '@playwright/test';

const ALGOS = [
  'n-queens/backtracking',
  'n-queens/exhaustive',
  'hamiltonian-circuit/backtracking',
  'hamiltonian-circuit/exhaustive',
  'subset-sum/backtracking',
  'subset-sum/dp',
  'subset-sum/exhaustive',
  'graph-coloring/greedy',
  'graph-coloring/welsh-powell',
  'graph-coloring/dsatur',
  'graph-coloring/backtracking',
  'graph-coloring/exhaustive',
  'tsp/exhaustive',
  'tsp/branch-and-bound',
  'tsp/nearest-neighbor',
  'tsp/twice-around-tree',
  'tsp/christofides',
  'assignment/exhaustive',
  'assignment/branch-and-bound',
  'assignment/hungarian',
  'matrix-chain/dp',
  'matrix-chain/memo',
  'matrix-chain/exhaustive',
  'lcs/dp',
  'lcs/memo',
  'lcs/brute-force',
];

for (const id of ALGOS) {
  const [problemId, algoId] = id.split('/');
  test(`${id}: chạy ca mặc định không lỗi console và hiện kết quả`, async ({page}) => {
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(e.message));
    page.on('console', (m) => {
      if (m.type() === 'error') errors.push(m.text());
    });
    await page.goto(`/play/${problemId}/${algoId}`);
    await expect(page.getByRole('button', {name: 'Chạy', exact: true})).toBeEnabled();
    await page.getByRole('button', {name: 'Chạy', exact: true}).click();
    await expect(page.getByTestId('output')).not.toContainText('Không thể chạy');
    await expect(page.getByTestId('output')).not.toHaveText('Chạy thuật toán để xem kết quả.');
    expect(errors).toEqual([]);
  });
}

test('tsp/branch-and-bound: tua bước và đường dẫn testcases/compare mở được', async ({page}) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text());
  });
  await page.goto('/play/tsp/branch-and-bound');
  await page.getByRole('button', {name: 'Chạy', exact: true}).click();
  await expect(page.getByTestId('output')).not.toContainText('Không thể chạy');
  await expect(page.getByTestId('output')).not.toHaveText('Chạy thuật toán để xem kết quả.');
  await page.getByRole('button', {name: 'Tiến bước'}).click();
  await expect(page.getByTestId('visual-state')).toHaveAttribute('data-step', '1');

  await page.goto('/testcases/matrix-chain');
  await expect(page.locator('h1')).toBeVisible();

  await page.goto('/compare/lcs');
  await expect(page.locator('h1')).toBeVisible();
  expect(errors).toEqual([]);
});
