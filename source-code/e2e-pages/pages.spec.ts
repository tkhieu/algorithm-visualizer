import {readFile,stat} from 'node:fs/promises';
import {expect,test,type Page} from '@playwright/test';

function collectErrors(page:Page){
  const errors:string[]=[];
  page.on('pageerror',error=>errors.push(error.message));
  page.on('console',message=>{if(message.type()==='error')errors.push(message.text())});
  page.on('requestfailed',request=>errors.push(`${request.url()}: ${request.failure()?.errorText}`));
  return errors;
}

test('Pages build serves the catalog and a seeded DP deep link',async({page})=>{
  const errors=collectErrors(page);
  const assetUrls:string[]=[];
  page.on('request',request=>{if(request.url().includes('/assets/'))assetUrls.push(request.url())});
  expect(await readFile('dist/404.html','utf8')).toBe(await readFile('dist/index.html','utf8'));
  await stat('dist/.nojekyll');
  await page.goto('./');
  await expect(page.getByRole('heading',{name:'Toàn bộ catalog thuật toán Levitin'})).toBeVisible();
  await expect(page.getByRole('link',{name:'Mở trình phát'}).first()).toHaveAttribute('href',/^\/kv-test\/play\//);

  await page.goto('/kv-test/play/knapsack-01/dp-table?seed=42');
  await expect(page.getByRole('heading',{name:'Quy hoạch động — bảng'})).toBeVisible();
  await page.getByRole('button',{name:'Chạy',exact:true}).click();
  await expect(page.getByTestId('output')).toContainText(/Giá trị: \d+/);
  await expect(page.getByTestId('output')).toContainText('Tối ưu');
  await page.getByRole('tab',{name:'Ngẫu nhiên'}).click();
  await page.getByRole('spinbutton',{name:'Hạt giống'}).fill('43');
  await page.getByRole('button',{name:'Sinh dữ liệu'}).click();
  await expect(page).toHaveURL('/kv-test/play/knapsack-01/dp-table?seed=43&size=small');
  await page.getByRole('combobox',{name:'Đổi thuật toán'}).selectOption('dp-memo');
  await expect(page).toHaveURL('/kv-test/play/knapsack-01/dp-memo?seed=43&size=small');
  expect(assetUrls.length).toBeGreaterThan(0);
  expect(assetUrls.every(url=>new URL(url).pathname.startsWith('/kv-test/assets/'))).toBe(true);
  expect(errors).toEqual([]);
});

test('Pages compare route runs all five algorithms and their workers',async({page})=>{
  const errors=collectErrors(page);
  const workers:string[]=[];
  page.on('request',request=>{if(/\/(?:run|bench)\.worker-[^/]+\.js(?:\?|$)/.test(request.url()))workers.push(new URL(request.url()).pathname)});
  await page.goto('/kv-test/compare/knapsack-01?case=normal-1&algos=exhaustive,dp-table,dp-memo,branch-and-bound,greedy-approx');
  await page.getByRole('button',{name:'Chạy tất cả'}).click();
  const rows=page.getByTestId('results-table').locator('tbody tr');
  await expect(rows).toHaveCount(5);
  for(const [i,value] of [9,9,9,9,8].entries())await expect(rows.nth(i).locator('td').nth(2)).toHaveText(String(value));
  expect(workers.some(url=>url.startsWith('/kv-test/assets/run.worker-'))).toBe(true);
  expect(workers.some(url=>url.startsWith('/kv-test/assets/bench.worker-'))).toBe(true);
  expect(workers.every(url=>url.startsWith('/kv-test/assets/'))).toBe(true);
  expect(errors).toEqual([]);
});
