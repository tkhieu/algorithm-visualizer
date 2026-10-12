import {describe,it,expect} from 'vitest';
import {algorithms,problems} from './manifest';
import {registry,problemRegistry} from './registry';

describe('catalog (status ready)',()=>{
 it('mọi algorithm ready đã đăng ký và mọi algorithm đăng ký đều có trong manifest',async()=>{
  const ready=algorithms.filter(a=>a.status==='ready');
  expect(ready.map(a=>a.id).sort()).toEqual(Object.keys(registry).sort());
  for(const m of ready){
   const a=(await registry[m.id]()).algorithm;
   for(const key of ['id','problemId','title','chapter','section','page','technique','exactness','complexity','views'] as const)
    expect(a[key]).toEqual(m[key]);
  }
 });
 it('mọi problem ready đã đăng ký và mọi problem đăng ký đều có trong manifest',async()=>{
  const ready=problems.filter(p=>p.status==='ready');
  expect(ready.map(p=>p.id).sort()).toEqual(Object.keys(problemRegistry).sort());
  for(const m of ready){
   const p=(await problemRegistry[m.id]()).problem;
   expect(p.id).toEqual(m.id);
   expect(p.title).toEqual(m.title);
  }
 });
 it('mọi problemId trong algorithms đều xuất hiện trong problems',()=>{
  const ids=new Set(problems.map(p=>p.id));
  for(const a of algorithms)expect(ids.has(a.problemId),a.id).toBe(true);
 });
 it('id không trùng lặp',()=>{
  expect(new Set(algorithms.map(a=>a.id)).size).toBe(algorithms.length);
  expect(new Set(problems.map(p=>p.id)).size).toBe(problems.length);
 });
 it('mọi thuật toán có chương, mục và trang tham chiếu nhất quán',()=>{
  for(const a of algorithms){
   expect(a.chapter,a.id).toBeGreaterThan(0);
   expect(a.section.startsWith(`${a.chapter}.`),a.id).toBe(true);
   expect(a.page,a.id).toBeGreaterThan(0);
  }
 });
});

// Chỉ chạy đầy đủ khi Phase B hoàn tất tất cả problems/algorithms (COVERAGE=strict).
// Mặc định (không strict) bài test này được bỏ qua để Phase F không chờ các phase sau.
describe.skipIf(process.env.COVERAGE!=='strict')('catalog (COVERAGE=strict — toàn bộ manifest)',()=>{
 it('mọi algorithm trong manifest đều ready và đã đăng ký',()=>{
  const planned=algorithms.filter(a=>a.status!=='ready');
  expect(planned.map(a=>a.id)).toEqual([]);
 });
 it('mọi problem trong manifest đều ready và đã đăng ký',()=>{
  const planned=problems.filter(p=>p.status!=='ready');
  expect(planned.map(p=>p.id)).toEqual([]);
 });
});
