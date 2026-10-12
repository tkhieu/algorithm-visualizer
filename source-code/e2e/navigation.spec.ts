import {test,expect} from '@playwright/test';

test('thanh bên có ba cách xếp: theo chương, theo kỹ thuật, theo bài toán',async({page})=>{
 const errors:string[]=[];
 page.on('pageerror',e=>errors.push(e.message));
 page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});
 await page.goto('/');

 await page.getByRole('button',{name:'Theo chương'}).click();
 await expect(page.getByRole('button',{name:/^▸ Ch\.\d+/}).first().or(page.getByRole('button',{name:/^▾ Ch\.\d+/}).first())).toBeVisible();

 await page.getByRole('button',{name:'Theo kỹ thuật'}).click();
 await expect(page.getByRole('button',{name:/Quy hoạch động/})).toBeVisible();

 await page.getByRole('button',{name:'Theo bài toán'}).click();
 await expect(page.getByRole('button',{name:/Bài toán cái túi 0\/1/})).toBeVisible();

 expect(errors).toEqual([]);
});

test('bảng lệnh Ctrl+K tìm và mở được một thuật toán',async({page})=>{
 const errors:string[]=[];
 page.on('pageerror',e=>errors.push(e.message));
 page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});
 await page.goto('/');

 await page.keyboard.press('Control+k');
 await page.getByPlaceholder('Tìm bài toán, thuật toán, chương…').fill('Quy hoạch động — bảng');
 await page.getByText('Quy hoạch động — bảng',{exact:false}).first().click();

 await expect(page).toHaveURL(/\/play\/knapsack-01\/dp-table/);
 await expect(page.getByRole('heading',{name:'Quy hoạch động — bảng'})).toBeVisible();
 expect(errors).toEqual([]);
});

test('/algorithms lọc theo chương và theo trạng thái',async({page})=>{
 const errors:string[]=[];
 page.on('pageerror',e=>errors.push(e.message));
 page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});
 await page.goto('/algorithms');

 const table=page.getByTestId('algorithms-table');
 await expect(table).toBeVisible();
 const rows=table.locator('tbody tr');
 const total=await rows.count();
 expect(total).toBeGreaterThan(5);

 await page.getByRole('combobox',{name:'Lọc chương (bảng)'}).selectOption('8');
 const afterChapterFilter=await rows.count();
 expect(afterChapterFilter).toBeLessThan(total);
 expect(afterChapterFilter).toBeGreaterThan(0);
 await expect(rows.first().locator('td').nth(2)).toContainText('8 · §8');

 await page.getByRole('combobox',{name:'Lọc trạng thái (bảng)'}).selectOption('ready');
 const afterStatusFilter=await rows.count();
 expect(afterStatusFilter).toBeLessThanOrEqual(afterChapterFilter);
 expect(afterStatusFilter).toBeGreaterThan(0);
 await expect(page.getByTestId('algo-row-knapsack-01/dp-table').getByText('Quy hoạch động — bảng',{exact:true})).toBeVisible();

 expect(errors).toEqual([]);
});

test('/problems lọc theo chương, kỹ thuật và trạng thái',async({page})=>{
 await page.goto('/problems');
 await page.getByRole('combobox',{name:'Lọc chương bài toán'}).selectOption('8');
 await page.getByRole('combobox',{name:'Lọc kỹ thuật bài toán'}).selectOption('dp');
 await page.getByRole('combobox',{name:'Lọc trạng thái bài toán'}).selectOption('ready');
 await expect(page.getByRole('heading',{name:'Bài toán cái túi 0/1'})).toBeVisible();
 await expect(page.getByRole('heading',{name:'Sắp xếp'})).toHaveCount(0);
 await page.getByRole('combobox',{name:'Lọc trạng thái bài toán'}).selectOption('planned');
 await expect(page.getByRole('heading',{name:'Bài toán cái túi 0/1'})).toHaveCount(0);
 await expect(page.getByRole('heading',{name:'Dãy đồng xu'})).toBeVisible();
});
