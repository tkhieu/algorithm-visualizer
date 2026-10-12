import {it,expect} from 'vitest';import {problem} from './index';import {cases} from './cases';
it('Phép nhân: lược đồ và ví dụ tay',()=>{expect(problem.check({a:'123',b:'45'},{product:'5535'}).ok).toBe(true);expect(problem.check({a:'123',b:'45'},{product:'5534'}).ok).toBe(false);for(const c of cases)expect(problem.inputSchema.safeParse(c.input).success).toBe(c.group!=='invalid')});
