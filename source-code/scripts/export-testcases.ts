import {mkdir,readdir,rm,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {problems} from '../src/catalog/manifest';
import type {TestCase} from '../src/core/contracts';

const root=resolve(process.cwd(),'../testcases');
await mkdir(root,{recursive:true});

// Dọn các file .json còn ở cấp gốc từ bố cục cũ (trước khi mỗi bài toán có thư mục riêng)
// để testcases/ không lẫn file cũ với cấu trúc testcases/<problemId>/ mới.
for(const entry of await readdir(root,{withFileTypes:true}))
 if(entry.isFile()&&entry.name.endsWith('.json'))await rm(resolve(root,entry.name));

const groupLabel:Record<string,string>={normal:'thông thường',edge:'biên',small:'nhỏ',large:'lớn',special:'đặc biệt',invalid:'không hợp lệ'};
const sections:string[]=[];
let totalCases=0;

for(const p of problems.filter(p=>p.status==='ready')){
 const mod=await import(`../src/problems/${p.id}/cases.ts`) as {cases:TestCase<unknown>[]};
 const cases=mod.cases;
 const dir=resolve(root,p.id);
 // Xoá sạch rồi tạo lại để một lần chạy lại là một bản sinh sạch: nếu cases.ts đổi tên/xoá
 // một ca, file .json cũ của ca đó không còn mồ côi trong thư mục. knapsack-01 được xoá ở
 // đây cũng an toàn — khối bên dưới sinh lại đủ 8 ca hiệu năng bổ sung ngay sau vòng lặp này.
 await rm(dir,{recursive:true,force:true});
 await mkdir(dir,{recursive:true});
 for(const c of cases)
  await writeFile(resolve(dir,`${c.id}.json`),JSON.stringify({id:c.id,name:c.name,group:c.group,input:c.input,expected:c.expected??null,note:c.note??null},null,2)+'\n');
 const counts=new Map<string,number>();
 for(const c of cases)counts.set(c.group,(counts.get(c.group)??0)+1);
 const groupsText=[...counts.entries()].map(([g,n])=>`${groupLabel[g]??g} ${n}`).join(', ');
 sections.push(`- **${p.id}** (${p.title}) — ${cases.length} ca: ${groupsText}`);
 totalCases+=cases.length;
 console.log(`Đã xuất ${cases.length} ca cho ${p.id} vào ${dir}`);
}

// Bộ ca hiệu năng bổ sung riêng cho knapsack-01 (seed cố định, cỡ 'large'), dùng để đo thời gian
// theo n ngoài trang testcase-runner. Giữ lại hành vi gốc của lệnh export trước Phase I.
{
 const {generate}=await import('../src/problems/knapsack-01/generators.ts');
 const {optimum}=await import('../src/problems/knapsack-01/checker.ts');
 const dir=resolve(root,'knapsack-01');
 for(let seed=201;seed<=208;seed++){
  const input=generate(seed,'large');
  await writeFile(resolve(dir,`generated-large-${seed}.json`),JSON.stringify({id:`generated-large-${seed}`,group:'large',seed,input,expected:optimum(input)},null,2)+'\n');
  totalCases++;
 }
 console.log(`Đã xuất 8 ca hiệu năng bổ sung cho knapsack-01 vào ${dir}`);
}

const readme=`# Bộ testcase toàn bộ catalog

Mỗi bài toán \`ready\` trong \`src/catalog/manifest.ts\` có một thư mục \`testcases/<problemId>/\`
chứa các file JSON, mỗi file một ca: \`{id, name, group, input, expected, note}\`.

\`expected\`, khi không phải \`null\`, là kết quả tham chiếu tính sẵn từ \`checker.ts\` của bài toán
đó (ví dụ ƯCLN, độ dài hành trình tối ưu) để so sánh trực tiếp với kết quả một thuật toán trả về.

\`expected: null\` xảy ra ở hai trường hợp khác nhau — phân biệt bằng \`group\`:
- \`group: "invalid"\` — input phải bị bộ parse (\`inputSchema\`) từ chối; không có "kết quả" vì
  không được phép chạy.
- Mọi \`group\` khác (ví dụ các ca của \`graph-coloring\`, \`subset-sum\`, \`n-queens\`) — bài toán
  không có một đáp số cố định duy nhất để so khớp (nhiều cách tô màu/nhiều tập con/nhiều cách đặt
  hậu đều đúng), nên \`checker.ts\` chấm bằng cách **kiểm tra tính hợp lệ của output** (ví dụ: có
  đúng là một cách tô màu hợp lệ với số màu cho phép không) thay vì so với một giá trị cố định.
  Dùng \`check(input, output)\` từ \`checker.ts\` của bài toán đó để chấm những ca này, không so
  \`output\` với \`expected\`.

\`group\` là một trong sáu nhóm dùng chung toàn catalog:

- \`normal\` — dữ liệu điển hình
- \`edge\` — trường hợp biên (rỗng, 0, một phần tử, …)
- \`small\` — dữ liệu nhỏ kiểm tra tay được
- \`large\` — dữ liệu lớn, dùng đo hiệu năng
- \`special\` — trường hợp đặc biệt (ví dụ tham lam cho kết quả sai, nhiều nghiệm tối ưu)
- \`invalid\` — đầu vào phải bị bộ parse từ chối (\`expected\` luôn là \`null\`)

knapsack-01 có thêm 8 ca \`generated-large-201..208.json\` (seed cố định) để đo hiệu năng ngoài
trang \`/testcases/knapsack-01\`.

Chạy lại từ \`source-code\` bằng \`npm run export:testcases\` (script đọc \`cases.ts\` của từng bài
toán trong manifest nên không cần sửa file này khi thêm bài toán mới — cứ thêm bài toán và chuyển
trạng thái \`ready\`).

## Theo bài toán (${totalCases} ca, ${problems.filter(p=>p.status==='ready').length} bài toán)

${sections.join('\n')}
`;
await writeFile(resolve(root,'README.md'),readme);
console.log(`Tổng cộng đã xuất ${totalCases} ca vào ${root}`);
