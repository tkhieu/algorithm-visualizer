import {test, expect} from '@playwright/test';

function trackErrors(page: import('@playwright/test').Page) {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text());
  });
  return errors;
}

test('dsatur: chuyển sang chế độ χ(G) và chạy hiện số màu đã dùng', async ({page}) => {
  const errors = trackErrors(page);
  await page.goto('/play/graph-coloring/dsatur');
  await page.getByLabel('Chế độ').selectOption('chromatic');
  await page.getByRole('button', {name: 'Chạy', exact: true}).click();
  await expect(page.getByTestId('output')).toContainText('Số màu đã dùng');
  expect(errors).toEqual([]);
});

test('greedy: bộ sinh ngẫu nhiên G(n,p) tạo đồ thị > 300 đỉnh dùng Canvas', async ({page}) => {
  const errors = trackErrors(page);
  await page.goto('/play/graph-coloring/greedy');
  await page.getByRole('tab', {name: 'Ngẫu nhiên'}).click();
  await page.getByLabel('Số đỉnh n').fill('310');
  await page.getByLabel('Xác suất cạnh p').fill('0.01');
  await page.getByRole('button', {name: 'Sinh đồ thị'}).click();
  await expect(page.getByTestId('graph-view')).toHaveAttribute('data-renderer', 'canvas');
  await page.getByRole('button', {name: 'Chạy', exact: true}).click();
  await expect(page.getByTestId('output')).not.toContainText('Không thể chạy');
  expect(errors).toEqual([]);
});

test('backtracking: đồ thị quá lớn ở chế độ χ(G) báo "Không áp dụng" bằng tiếng Việt, không lỗi', async ({page}) => {
  const errors = trackErrors(page);
  await page.goto('/play/graph-coloring/backtracking');
  await page.getByLabel('Chế độ').selectOption('chromatic');
  await page.getByRole('tab', {name: 'Ngẫu nhiên'}).click();
  await page.getByLabel('Số đỉnh n').fill('20');
  await page.getByLabel('Xác suất cạnh p').fill('0.2');
  await page.getByRole('button', {name: 'Sinh đồ thị'}).click();
  await page.getByRole('button', {name: 'Chạy', exact: true}).click();
  await expect(page.getByTestId('output')).toContainText('Không áp dụng');
  expect(errors).toEqual([]);
});

test('mẫu đồ thị: chèn Petersen và chạy quay lui tìm χ(G) = 3 (hiện chặn dưới/chặn trên)', async ({page}) => {
  const errors = trackErrors(page);
  await page.goto('/play/graph-coloring/backtracking');
  await page.getByLabel('Chế độ', {exact: true}).selectOption('chromatic');
  await page.getByRole('tab', {name: 'Mẫu'}).click();
  await page.getByLabel('Mẫu đồ thị').selectOption('petersen');
  await page.getByRole('button', {name: 'Chèn mẫu'}).click();
  await page.getByRole('button', {name: 'Chạy', exact: true}).click();
  await expect(page.getByTestId('output')).toContainText('Số màu đã dùng: 3');
  await expect(page.getByTestId('output')).toContainText('đã chứng minh là χ(G)');
  expect(errors).toEqual([]);
});

test('So sánh: chế độ χ(G) hiện cột Giá trị (số màu) có giá trị số sau khi chạy', async ({page}) => {
  const errors = trackErrors(page);
  await page.goto('/compare/graph-coloring');
  await page.getByLabel('Chế độ', {exact: true}).selectOption('chromatic');
  await page.getByRole('button', {name: 'Chạy tất cả'}).click();
  const table = page.getByTestId('results-table');
  await expect(table).toContainText('Giá trị');
  const valueCell = table.getByTestId('result-row-greedy').locator('td').nth(2);
  await expect(valueCell).not.toHaveText('—');
  expect(errors).toEqual([]);
});
