import {it,expect} from 'vitest';import {problem} from './index';import {cases} from './cases';
it('Tìm kiếm: lược đồ và ví dụ tay',()=>{expect(problem.check({values:[1,3,3,7],target:3},{index:1}).ok).toBe(true);expect(problem.check({values:[1,3,3,7],target:3},{index:2}).ok).toBe(false);for(const c of cases)expect(problem.inputSchema.safeParse(c.input).success).toBe(c.group!=='invalid')});
