import {mkdir,writeFile,access} from 'node:fs/promises';
import {resolve} from 'node:path';

const ID_RE=/^[a-z][a-z0-9-]*$/;

function fail(message:string):never{
 console.error(message);
 process.exit(1);
}

function validateId(id:string|undefined,label:string):string{
 if(!id||!ID_RE.test(id))fail(`${label} phải là kebab-case (chữ thường, số, gạch ngang), ví dụ "coin-row". Nhận: "${id}"`);
 return id as string;
}

async function ensureFresh(dir:string){
 try{
  await access(dir);
  fail(`Thư mục đã tồn tại: ${dir}. Xoá hoặc chọn id khác.`);
 }catch{
  // chưa tồn tại — đúng như mong đợi
 }
}

async function writeFiles(dir:string,files:Record<string,string>){
 await mkdir(dir,{recursive:true});
 for(const [name,content] of Object.entries(files))await writeFile(resolve(dir,name),content);
}

async function scaffoldProblem(id:string){
 const dir=resolve('src/problems',id);
 await ensureFresh(dir);
 await writeFiles(dir,{
  'definition.ts':`import {z} from 'zod';
// TODO: định nghĩa schema input/output thật cho bài toán "${id}".
export const inputSchema=z.object({});
export const outputSchema=z.object({});
export type Input=z.infer<typeof inputSchema>;
export type Output=z.infer<typeof outputSchema>;
export const statement=\`TODO: mô tả bài toán kiểu Wecode (markdown, tiếng Việt).\`;
export const constraints:string[]=['TODO: ràng buộc'];
`,
  'generators.ts':`import type {SizeClass} from '../../core/contracts';
import type {Input} from './definition';
// TODO: sinh dữ liệu ngẫu nhiên có seed theo kích thước tiny/small/medium/large.
export function generate(seed:number,size:SizeClass):Input{
 void seed;void size;
 return {} as Input;
}
`,
  'checker.ts':`import type {Verdict} from '../../core/contracts';
import {outputSchema,type Input,type Output} from './definition';
// TODO: kiểm tra output hợp lệ so với input; trả optimal/score nếu bài toán có objective.
export function check(input:Input,output:Output):Verdict{
 void input;
 if(!outputSchema.safeParse(output).success)return {ok:false,reason:'Đầu ra sai định dạng'};
 return {ok:true};
}
`,
  'cases.ts':`import type {TestCase} from '../../core/contracts';
import type {Input} from './definition';
// TODO: thêm ca kiểm thử theo nhóm normal/edge/small/large/special/invalid.
export const cases:TestCase<Input>[]=[];
`,
  'index.ts':`import type {Problem} from '../../core/contracts';
import {inputSchema,outputSchema,statement,constraints,type Input,type Output} from './definition';
import {generate} from './generators';
import {cases} from './cases';
import {check} from './checker';
export const problem:Problem<Input,Output>={
 id:'${id}',
 title:'TODO: tên tiếng Việt',
 statement,
 inputSchema,
 outputSchema,
 constraints,
 generate,
 cases,
 check,
 // objective:{sense:'max',score:(_input,output)=>0}, // bỏ comment nếu bài toán có mục tiêu tối ưu
};
`,
  'definition.test.ts':`import {describe,it,expect} from 'vitest';
import {inputSchema} from './definition';
describe('${id} definition',()=>{
 it('schema khởi tạo hợp lệ với object rỗng (TODO: thay bằng test thật khi định nghĩa input)',()=>{
  expect(inputSchema.safeParse({}).success).toBe(true);
 });
});
`,
 });
 console.log(`Đã tạo src/problems/${id}/. Việc tiếp theo:`);
 console.log(`  1. Điền definition.ts (schema, statement, constraints).`);
 console.log(`  2. Điền generators.ts, cases.ts, checker.ts.`);
 console.log(`  3. Thêm dòng cho "${id}" (status 'ready') vào src/catalog/manifest.ts.`);
 console.log(`  4. Chạy: npm run new:algo -- ${id} <techniqueId>`);
}

async function scaffoldAlgorithm(problemId:string,techniqueId:string){
 const problemDir=resolve('src/problems',problemId);
 try{await access(problemDir)}catch{fail(`Chưa có src/problems/${problemId}/. Chạy npm run new:problem -- ${problemId} trước.`)}
 const dir=resolve('src/algorithms',problemId,techniqueId);
 await ensureFresh(dir);
 await writeFiles(dir,{
  'run.ts':`import type {RunContext} from '../../../core/contracts';
import type {Input,Output} from '../../../problems/${problemId}/definition';
// TODO: đổi VisualState cho đúng view sẽ dùng (xem src/visualizers/<kind>/index.tsx).
export interface VisualState{note:string}
export function initVisual(input:Input):VisualState{
 void input;
 return {note:''};
}
export function run(input:Input,{rec}:RunContext<VisualState>):Output{
 void input;
 rec.step('start','TODO: giải thích bước đầu tiên',d=>{d.note='TODO'});
 // TODO: cài đặt thuật toán thật, gọi rec.step(...) cho mỗi bước có ý nghĩa và rec.count(...) cho mỗi phép toán.
 return {} as Output;
}
`,
  'pseudocode.ts':`export const pseudocode=[{id:'start',text:'TODO: mã giả',indent:0}];
`,
  'legend.ts':`import type {Legend} from '../../../core/contracts';
export const legend:Legend={};
`,
  'index.ts':`import type {Algorithm} from '../../../core/contracts';
import type {Input,Output} from '../../../problems/${problemId}/definition';
import {initVisual,run,type VisualState} from './run';
import {pseudocode} from './pseudocode';
import {legend} from './legend';
export const algorithm:Algorithm<Input,Output,VisualState>={
 id:'${problemId}/${techniqueId}',
 problemId:'${problemId}',
 title:'TODO: tên tiếng Việt',
 chapter:0,
 section:'0',
 technique:'TODO', // xem src/catalog/techniques.ts
 exactness:'exact',
 complexity:{time:'TODO',space:'TODO'},
 views:['sequence'], // xem src/catalog/manifest.ts và docs/adding-an-algorithm.md
 pseudocode,
 legend,
 traceLimit:{maxInputSize:100,maxSteps:5000,maxBytes:2500000},
 initVisual,
 run,
};
`,
  'run.test.ts':`import {it,expect} from 'vitest';
import {algorithm} from './index';
// TODO: kiểm tra kết quả đúng trên seed ngẫu nhiên đối chiếu với vét cạn/thuật toán đã tin cậy,
// và rằng trace tua lại (TraceStore) ra đúng trạng thái cuối — xem docs/adding-an-algorithm.md.
it('đã khai báo mã giả',()=>{
 expect(algorithm.pseudocode.length).toBeGreaterThan(0);
});
`,
 });
 console.log(`Đã tạo src/algorithms/${problemId}/${techniqueId}/. Việc tiếp theo:`);
 console.log(`  1. Cài đặt run.ts (initVisual, run, rec.step cho mỗi bước).`);
 console.log(`  2. Viết pseudocode.ts với lineId khớp các rec.step(...).`);
 console.log(`  3. Viết run.test.ts thật (đối chiếu kết quả, bất biến trace).`);
 console.log(`  4. Đổi dòng tương ứng trong src/catalog/manifest.ts sang status 'ready'.`);
}

async function main(){
 const [kind,a,b]=process.argv.slice(2);
 if(kind==='problem')await scaffoldProblem(validateId(a,'problemId'));
 else if(kind==='algo')await scaffoldAlgorithm(validateId(a,'problemId'),validateId(b,'techniqueId'));
 else fail('Dùng: npm run new:problem -- <problemId>  hoặc  npm run new:algo -- <problemId> <techniqueId>');
}

main().catch(e=>fail(e instanceof Error?e.message:String(e)));
