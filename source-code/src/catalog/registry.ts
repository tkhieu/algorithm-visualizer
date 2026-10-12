import type {Algorithm,Problem} from '../core/contracts';
// Quy ước: mỗi bài toán là src/problems/<problemId>/index.ts (export `problem`), mỗi cách giải là
// src/algorithms/<problemId>/<techniqueId>/index.ts (export `algorithm`). Thêm thư mục mới là đủ —
// không cần sửa file này. Generic bị xoá kiểu (unknown) ở biên registry vì mỗi module giữ kiểu I/O/V
// cụ thể riêng; xem docs/adding-an-algorithm.md.
export type AnyAlgorithm=Algorithm<unknown,unknown,unknown>;
export type AnyProblem=Problem<unknown,unknown>;

const algorithmModules=import.meta.glob<{algorithm:AnyAlgorithm}>('../algorithms/*/*/index.ts');
const problemModules=import.meta.glob<{problem:AnyProblem}>('../problems/*/index.ts');

function parseAlgorithmPath(path:string):string|null{
 const m=path.match(/\.\.\/algorithms\/([^/]+)\/([^/]+)\/index\.ts$/);
 return m?`${m[1]}/${m[2]}`:null;
}
function parseProblemPath(path:string):string|null{
 const m=path.match(/\.\.\/problems\/([^/]+)\/index\.ts$/);
 return m?m[1]:null;
}

export const registry:Record<string,()=>Promise<{algorithm:AnyAlgorithm}>>={};
for(const path in algorithmModules){
 const id=parseAlgorithmPath(path);
 if(id)registry[id]=algorithmModules[path];
}

export const problemRegistry:Record<string,()=>Promise<{problem:AnyProblem}>>={};
for(const path in problemModules){
 const id=parseProblemPath(path);
 if(id)problemRegistry[id]=problemModules[path];
}

export async function loadAlgorithm(id:string):Promise<AnyAlgorithm|undefined>{
 return (await registry[id]?.())?.algorithm;
}
export async function loadProblem(id:string):Promise<AnyProblem|undefined>{
 return (await problemRegistry[id]?.())?.problem;
}
export function registeredAlgorithmIds():string[]{return Object.keys(registry)}
export function registeredProblemIds():string[]{return Object.keys(problemRegistry)}
