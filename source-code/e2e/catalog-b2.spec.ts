import { test, expect } from '@playwright/test';
const problems = [
  'sorting',
  'heap-construction',
  'binary-tree-traversal',
  'balanced-search-tree',
  'dictionary-hashing',
  'element-uniqueness',
];
const algorithms: Record<string, string[]> = {
  sorting: ['selection', 'bubble', 'insertion', 'mergesort', 'quicksort', 'heapsort', 'counting'],
  'heap-construction': ['bottom-up', 'top-down'],
  'binary-tree-traversal': ['preorder', 'inorder', 'postorder', 'level-order'],
  'balanced-search-tree': ['bst-insert', 'avl-insert', 'two-three-insert', 'b-tree-insert'],
  'dictionary-hashing': ['separate-chaining', 'linear-probing'],
  'element-uniqueness': ['brute-force', 'presort', 'mode'],
};

test('sắp xếp nhanh: chọn ca kiểm thử, chạy, tiến/lùi bước', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('console', m => {
    if (m.type() === 'error') errors.push(m.text());
  });
  await page.goto('/play/sorting/quicksort');
  await expect(page.getByRole('heading', { name: 'Sắp xếp nhanh' })).toBeVisible();
  await page.getByRole('tab', { name: 'Ca kiểm thử' }).click();
  await page.getByRole('combobox', { name: 'Ca kiểm thử' }).selectOption('normal-1');
  await page.getByRole('button', { name: 'Chạy', exact: true }).click();
  await expect(page.getByTestId('output')).toContainText('Hợp lệ');
  await page.getByRole('button', { name: 'Tiến bước' }).click();
  const first = await page.getByTestId('active-line').textContent();
  await expect(page.getByTestId('visual-state')).toHaveAttribute('data-step', '1');
  await page.getByRole('button', { name: 'Tiến bước' }).click();
  const second = await page.getByTestId('active-line').textContent();
  expect(second).not.toBe(first);
  await page.getByRole('button', { name: 'Lùi bước' }).click();
  await expect(page.getByTestId('active-line')).toHaveText(first || '');
  await expect(page.getByTestId('visual-state')).toHaveAttribute('data-step', '1');
  expect(errors).toEqual([]);
});

test('cây tìm kiếm cân bằng: so sánh bốn thuật toán chèn trên cùng dãy khóa', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('console', m => {
    if (m.type() === 'error') errors.push(m.text());
  });
  await page.goto(
    '/compare/balanced-search-tree?algos=bst-insert,avl-insert,two-three-insert,b-tree-insert',
  );
  await page.getByRole('button', { name: 'Chạy tất cả' }).click();
  await expect(page.getByTestId('results-table').locator('tbody tr')).toHaveCount(4);
  await expect(page.getByTestId('lane-bst-insert')).toBeVisible();
  await expect(page.getByTestId('lane-avl-insert')).toBeVisible();
  expect(errors).toEqual([]);
});

test('bảng băm: chạy toàn bộ ca kiểm thử', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('console', m => {
    if (m.type() === 'error') errors.push(m.text());
  });
  await page.goto('/testcases/dictionary-hashing');
  await page.getByRole('button', { name: 'Chạy tất cả' }).click();
  await expect(page.getByTestId('pass-count')).toHaveText('Đạt 11/11');
  expect(errors).toEqual([]);
});

test('duyệt cây nhị phân: chạy toàn bộ ca kiểm thử', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('console', m => {
    if (m.type() === 'error') errors.push(m.text());
  });
  await page.goto('/testcases/binary-tree-traversal');
  await page.getByRole('button', { name: 'Chạy tất cả' }).click();
  await expect(page.getByTestId('pass-count')).toHaveText('Đạt 12/12');
  expect(errors).toEqual([]);
});

test('mọi trang bài toán/thuật toán của nhóm B2 mở không lỗi console', async ({ page }) => {
  test.setTimeout(90000);
  const errors: string[] = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('console', m => {
    if (m.type() === 'error') errors.push(m.text());
  });
  for (const problemId of problems) {
    for (const path of [
      `/problem/${problemId}`,
      `/compare/${problemId}`,
      `/testcases/${problemId}`,
    ]) {
      await page.goto(path);
      await expect(page.locator('h1')).toBeVisible();
    }
    for (const algoId of algorithms[problemId]) {
      await page.goto(`/play/${problemId}/${algoId}`);
      await expect(page.locator('h1')).toBeVisible();
    }
  }
  expect(errors).toEqual([]);
});
