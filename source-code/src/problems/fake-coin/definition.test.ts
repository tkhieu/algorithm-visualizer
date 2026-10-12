import {it,expect} from 'vitest';import {problem} from './index';import {cases} from './cases';
it('Đồng xu giả: lược đồ và ví dụ tay',()=>{expect(problem.check({weights:[10,9,10]},{index:1}).ok).toBe(true);expect(problem.check({weights:[10,9,10]},{index:0}).ok).toBe(false);for(const c of cases)expect(problem.inputSchema.safeParse(c.input).success).toBe(c.group!=='invalid')});
