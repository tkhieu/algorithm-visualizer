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

test('mẫu Kₙ quá lớn (K128, 8128 cạnh > 8000): bị từ chối bằng tiếng Việt, không đổi dữ liệu hiện tại, không lỗi', async ({page}) => {
  const errors = trackErrors(page);
  await page.goto('/play/graph-coloring/dsatur');
  await page.getByRole('tab', {name: 'Chỉnh JSON'}).click();
  const jsonBefore = await page.getByLabel('Dữ liệu JSON').inputValue();
  await page.getByRole('tab', {name: 'Mẫu'}).click();
  await page.getByLabel('Mẫu đồ thị').selectOption('complete');
  await page.getByLabel('Kích thước n').fill('128');
  await page.getByRole('button', {name: 'Chèn mẫu'}).click();
  await expect(page.getByText(/Không áp dụng.*128 đỉnh, 8128 cạnh/)).toBeVisible();
  // Dữ liệu hiện tại (ca mặc định) phải còn nguyên — nút "Chèn mẫu" không được âm thầm nhận một
  // K128 bị cắt bớt (không còn là K128 thật, χ không còn đúng 128 như tên mẫu).
  await page.getByRole('tab', {name: 'Chỉnh JSON'}).click();
  await expect(page.getByLabel('Dữ liệu JSON')).toHaveValue(jsonBefore);
  expect(errors).toEqual([]);
});

test('mẫu hai phía K(320,1) (321 đỉnh > MAX_NODES): bị từ chối, không cắt mất toàn bộ phía phải (sẽ làm χ sai thành 1)', async ({page}) => {
  const errors = trackErrors(page);
  await page.goto('/play/graph-coloring/dsatur');
  await page.getByRole('tab', {name: 'Chỉnh JSON'}).click();
  const jsonBefore = await page.getByLabel('Dữ liệu JSON').inputValue();
  await page.getByRole('tab', {name: 'Mẫu'}).click();
  await page.getByLabel('Mẫu đồ thị').selectOption('bipartite');
  await page.getByLabel('Kích thước p').fill('320');
  await page.getByLabel('Kích thước q').fill('1');
  await page.getByRole('button', {name: 'Chèn mẫu'}).click();
  await expect(page.getByText(/Không áp dụng.*321 đỉnh/)).toBeVisible();
  await page.getByRole('tab', {name: 'Chỉnh JSON'}).click();
  await expect(page.getByLabel('Dữ liệu JSON')).toHaveValue(jsonBefore);
  expect(errors).toEqual([]);
});

test('mẫu với giá trị vô lý (Kₙ, n=99999999): bị từ chối ngay, không treo trang', async ({page}) => {
  const errors = trackErrors(page);
  await page.goto('/play/graph-coloring/dsatur');
  await page.getByRole('tab', {name: 'Mẫu'}).click();
  await page.getByLabel('Mẫu đồ thị').selectOption('complete');
  await page.getByLabel('Kích thước n').fill('99999999');
  await page.getByRole('button', {name: 'Chèn mẫu'}).click();
  await expect(page.getByText(/Không áp dụng/)).toBeVisible({timeout: 2000});
  // Trang vẫn phản hồi được sau đó — không bị treo bởi việc dựng một mảng khổng lồ.
  await page.getByLabel('Mẫu đồ thị').selectOption('petersen');
  expect(errors).toEqual([]);
});

test('bộ sinh ngẫu nhiên: n=320, p=1 (đồ thị đầy đủ ở kích thước lớn nhất) vẫn tự điều chỉnh để hợp lệ, không lỗi', async ({page}) => {
  const errors = trackErrors(page);
  await page.goto('/play/graph-coloring/greedy');
  await page.getByRole('tab', {name: 'Ngẫu nhiên'}).click();
  await page.getByLabel('Số đỉnh n').fill('320');
  await page.getByLabel('Xác suất cạnh p').fill('1');
  await page.getByRole('button', {name: 'Sinh đồ thị'}).click();
  await expect(page.getByText(/Đã tự điều chỉnh để hợp lệ/)).toBeVisible();
  await expect(page.getByText('✓ Dữ liệu hợp lệ')).toBeVisible();
  await page.getByRole('button', {name: 'Chạy', exact: true}).click();
  await expect(page.getByTestId('output')).not.toContainText('Không thể chạy');
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
