import {test, expect} from '@playwright/test';

const b4Algorithms = [
 'string-matching/brute-force',
 'string-matching/horspool',
 'string-matching/boyer-moore',
 'closest-pair/brute-force',
 'closest-pair/divide-and-conquer',
 'convex-hull/brute-force',
 'convex-hull/quickhull',
 'coin-row/dp',
 'coin-row/memo',
 'coin-row/exhaustive',
 'change-making/dp',
 'change-making/greedy',
 'coin-collecting/dp',
 'coin-collecting/exhaustive-paths',
 'optimal-bst/dp',
 'optimal-bst/exhaustive',
 'linear-programming-2d/simplex',
 'linear-programming-2d/vertex-enumeration',
];
const b4Problems = [
 'string-matching',
 'closest-pair',
 'convex-hull',
 'coin-row',
 'change-making',
 'coin-collecting',
 'optimal-bst',
 'linear-programming-2d',
];

for (const id of b4Algorithms) {
 test(`chạy trang thuật toán ${id} ra kết quả hợp lệ, không lỗi console`, async ({page}) => {
  const errors: string[] = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });

  await page.goto(`/play/${id}`);
  await expect(page.getByRole('button', {name: 'Chạy', exact: true})).toBeEnabled({timeout: 20000});
  await page.getByRole('button', {name: 'Chạy', exact: true}).click();
  await expect(page.getByTestId('output')).toContainText('Hợp lệ', {timeout: 20000});

  await page.getByRole('button', {name: 'Tiến bước'}).click();
  await expect(page.getByTestId('visual-state')).toHaveAttribute('data-step', '1');

  expect(errors).toEqual([]);
 });
}

for (const id of b4Problems) {
 test(`trang so sánh và bộ ca kiểm thử của ${id} mở không lỗi console`, async ({page}) => {
  const errors: string[] = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });

  await page.goto(`/compare/${id}`);
  await expect(page.locator('h1')).toBeVisible();

  await page.goto(`/testcases/${id}`);
  await expect(page.locator('h1')).toBeVisible();

  expect(errors).toEqual([]);
 });
}

test('so sánh Horspool và Boyer–Moore trên cùng văn bản cho cùng số vị trí khớp', async ({page}) => {
 const errors: string[] = [];
 page.on('pageerror', e => errors.push(e.message));
 page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });

 await page.goto('/compare/string-matching?algos=horspool,boyer-moore');
 await page.getByRole('button', {name: 'Chạy tất cả'}).click();
 await expect(page.getByRole('button', {name: 'Chạy tất cả'})).toBeEnabled({timeout: 20000});
 await expect(page.getByTestId('results-table').locator('tbody tr')).toHaveCount(2);
 const values = page.getByTestId('results-table').locator('tbody tr').locator('td').nth(2);
 await expect(values.first()).toHaveText(await values.last().innerText());

 expect(errors).toEqual([]);
});

for (const id of b4Problems) {
 test(`bộ ca kiểm thử của ${id} đều đạt khi chạy toàn bộ`, async ({page}) => {
  test.setTimeout(60000);
  const errors: string[] = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });

  await page.goto(`/testcases/${id}`);
  await page.getByRole('button', {name: 'Chạy tất cả'}).click();
  await expect(page.getByRole('button', {name: 'Chạy tất cả'})).toBeEnabled({timeout: 40000});
  const passCount = page.getByTestId('pass-count');
  const text = await passCount.textContent();
  const [pass, total] = text!.replace('Đạt ', '').split('/').map(Number);
  expect(pass).toBe(total);

  expect(errors).toEqual([]);
 });
}
