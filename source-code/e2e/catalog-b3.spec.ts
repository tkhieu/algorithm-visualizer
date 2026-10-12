import {test,expect} from '@playwright/test';

const algorithms:Record<string,string[]>={
 'graph-traversal':['dfs','bfs'],
 'topological-sort':['dfs-based','source-removal'],
 'transitive-closure':['warshall','dfs-each-vertex'],
 'all-pairs-shortest-path':['floyd','dijkstra-all-sources'],
 'single-source-shortest-path':['dijkstra','bfs-unweighted'],
 'minimum-spanning-tree':['prim','kruskal'],
 'huffman-coding':['huffman','fixed-length'],
 'maximum-flow':['shortest-augmenting-path','ford-fulkerson-dfs'],
 'bipartite-matching':['augmenting-path','via-max-flow'],
 'stable-marriage':['gale-shapley-men-propose','gale-shapley-women-propose'],
};

test('B3: mọi thuật toán mở trang, chạy đầu vào mặc định và hiện kết quả',async({page})=>{
 test.setTimeout(180000);
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});
 for(const [problem,methods] of Object.entries(algorithms))for(const method of methods){
  await page.goto(`/play/${problem}/${method}`);
  await expect(page.locator('h1'),`${problem}/${method}`).toBeVisible();
  await page.getByRole('button',{name:'Chạy',exact:true}).click();
  await expect(page.getByTestId('output')).toContainText('Hợp lệ');
  await page.getByRole('button',{name:'Về cuối'}).click();
  await expect(page.getByTestId('step-count')).not.toHaveText('0/0');
 }
 expect(errors).toEqual([]);
});

test('B3: so sánh và bộ ca kiểm thử hoạt động cho từng bài toán',async({page})=>{
 test.setTimeout(180000);
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});
 for(const [problem,methods] of Object.entries(algorithms)){
  await page.goto(`/compare/${problem}`);
  await page.getByRole('button',{name:'Chạy tất cả'}).click();
  await expect(page.getByTestId('results-table').locator('tbody tr')).toHaveCount(methods.length);
  for(const method of methods)await expect(page.getByTestId(`lane-${method}`)).toBeVisible();
  await page.goto(`/testcases/${problem}`);
  await page.getByRole('button',{name:'Chạy tất cả'}).click();
  await expect(page.getByTestId('pass-count')).toHaveText('Đạt 6/6');
 }
 expect(errors).toEqual([]);
});
