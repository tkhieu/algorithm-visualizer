import {expect,it} from 'vitest';
import {estimateSize} from './estimate-size';

it('ước lượng kích thước đầu vào cho nhiều nhóm bài toán',()=>{
 expect(estimateSize({items:[1,2,3]})).toBe(3);
 expect(estimateSize({vertices:['a','b'],edges:[['a','b']]})).toBe(2);
 expect(estimateSize({points:Array.from({length:301},(_,i)=>i)})).toBe(301);
 expect(estimateSize({text:'abcd',pattern:'b'})).toBe(4);
 expect(estimateSize({n:8})).toBe(8);
});
