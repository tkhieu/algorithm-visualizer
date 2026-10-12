import { test, expect } from '@playwright/test';

const groups = [
  [
    ['gcd', 'euclid', 'consecutive-integer', 'middle-school'],
    ['fibonacci', 'recursive', 'iterative', 'memo'],
    ['search-sorted', 'sequential', 'binary', 'interpolation'],
    ['fake-coin', 'divide-by-two', 'divide-by-three']
  ],
  [
    ['multiplication', 'russian-peasant', 'karatsuba', 'schoolbook'],
    ['josephus', 'simulation', 'recurrence'],
    [
      'combinatorial-generation',
      'johnson-trotter',
      'lexicographic-permutations',
      'subsets-bitstring',
      'gray-code'
    ]
  ],
  [
    ['kth-smallest', 'quickselect-lomuto', 'sort-then-pick'],
    ['polynomial-eval', 'horner', 'naive'],
    ['exponentiation', 'left-right-binary', 'right-left-binary', 'naive']
  ],
  [
    ['matrix-multiplication', 'strassen', 'standard'],
    ['linear-system', 'gaussian-elimination', 'lu-decomposition'],
    ['root-finding', 'bisection', 'false-position', 'newton'],
    ['nim', 'winning-strategy']
  ]
];

for (const [groupIndex, group] of groups.entries())
  test(`B1 nhóm ${groupIndex + 1}: mọi thuật toán chạy và tua trace trên Player`, async ({
    page
  }) => {
    test.setTimeout(120_000);
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('console', (message) => {
      if (message.type() === 'error') errors.push(message.text());
    });
    for (const [problemId, ...algorithmIds] of group)
      for (const algorithmId of algorithmIds) {
        await page.goto(`/play/${problemId}/${algorithmId}`);
        await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
        await page.getByRole('button', { name: 'Chạy', exact: true }).click();
        await expect(page.getByTestId('output')).toContainText('✓ Hợp lệ');
        await page.getByRole('button', { name: 'Về cuối' }).click();
        await expect(page.getByTestId('active-line')).toBeVisible();
        await expect(page.getByTestId('step-explanation')).not.toHaveText(
          'Chọn một bước để xem giải thích.'
        );
      }
    expect(errors).toEqual([]);
  });

test('B1: so sánh ba cách tìm ƯCLN trên cùng đầu vào', async ({ page }) => {
  await page.goto('/compare/gcd');
  await page.getByRole('button', { name: 'Chạy tất cả' }).click();
  await expect(page.getByTestId('results-table').locator('tbody tr')).toHaveCount(3);
  for (const row of await page.getByTestId('results-table').locator('tbody tr').all())
    await expect(row.locator('td').last()).toHaveText('6');
});

test('B1: bộ ca kiểm thử của mọi bài toán đạt đầy đủ', async ({ page }) => {
  test.setTimeout(120_000);
  for (const problemId of groups.flatMap((group) => group.map(([id]) => id))) {
    await page.goto(`/testcases/${problemId}`);
    await page.getByRole('button', { name: 'Chạy tất cả' }).click();
    await expect(page.getByTestId('pass-count')).toHaveText('Đạt 7/7');
  }
});
