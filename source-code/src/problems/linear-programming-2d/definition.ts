import {z} from 'zod';
export const inputSchema=z.object({
 objective:z.object({cx:z.number(),cy:z.number()}),
 constraints:z.array(z.object({a:z.number(),b:z.number(),c:z.number()})).min(1).max(8),
});
export const outputSchema=z.object({x:z.number(),y:z.number(),value:z.number()});
export type Input=z.infer<typeof inputSchema>;export type Output=z.infer<typeof outputSchema>;
export const statement=`Cho miền khả thi x≥0, y≥0 và các ràng buộc tuyến tính aᵢ·x + bᵢ·y ≤ cᵢ. Hãy tìm (x,y) trong miền khả thi tối đa hoá cₓ·x + c_y·y.`;
export const constraints=['x ≥ 0, y ≥ 0','1 ≤ số ràng buộc ≤ 8','Miền khả thi bị chặn (luôn có ràng buộc hộp x ≤ Bₓ, y ≤ B_y)'];
