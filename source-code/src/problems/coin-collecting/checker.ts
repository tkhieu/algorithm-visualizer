import type { Verdict } from '../../core/contracts';
import { inputSchema, outputSchema, type Input, type Output } from './definition';
export function optimum(grid: boolean[][]): number {
  const rows = grid.length,
    cols = grid[0].length;
  // Small grids: enumerate complete paths rather than reuse the algorithm's F(i,j).
  if (rows + cols <= 12) {
    function visit(r: number, c: number, count: number): number {
      const next = count + (grid[r][c] ? 1 : 0);
      if (r === rows - 1 && c === cols - 1) return next;
      return Math.max(
        r + 1 < rows ? visit(r + 1, c, next) : -Infinity,
        c + 1 < cols ? visit(r, c + 1, next) : -Infinity,
      );
    }
    return visit(0, 0, 0);
  }
  // For larger grids, relax edges of the acyclic grid graph in topological order.
  const distance = new Array<number>(rows * cols).fill(-Infinity);
  distance[0] = grid[0][0] ? 1 : 0;
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++) {
      const from = r * cols + c;
      for (const [nr, nc] of [
        [r + 1, c],
        [r, c + 1],
      ]) {
        if (nr < rows && nc < cols) {
          const to = nr * cols + nc;
          distance[to] = Math.max(distance[to], distance[from] + (grid[nr][nc] ? 1 : 0));
        }
      }
    }
  return distance.at(-1)!;
}
export function check(input: Input, output: Output): Verdict {
  if (!inputSchema.safeParse(input).success) return { ok: false, reason: 'Đầu vào không hợp lệ' };
  if (!outputSchema.safeParse(output).success) return { ok: false, reason: 'Đầu ra sai định dạng' };
  const rows = input.grid.length,
    cols = input.grid[0].length;
  const path = output.path;
  if (path.length !== rows + cols - 1) return { ok: false, reason: 'Độ dài đường đi không đúng' };
  if (path[0][0] !== 0 || path[0][1] !== 0) return { ok: false, reason: 'Đường đi phải bắt đầu tại (0,0)' };
  if (path[path.length - 1][0] !== rows - 1 || path[path.length - 1][1] !== cols - 1)
    return { ok: false, reason: 'Đường đi phải kết thúc tại ô cuối' };
  for (let k = 0; k + 1 < path.length; k++) {
    const [r1, c1] = path[k],
      [r2, c2] = path[k + 1];
    const right = r2 === r1 && c2 === c1 + 1;
    const down = c2 === c1 && r2 === r1 + 1;
    if (!right && !down) return { ok: false, reason: 'Mỗi bước phải đi sang phải hoặc xuống dưới' };
  }
  const sum = path.reduce((s, [r, c]) => s + (input.grid[r][c] ? 1 : 0), 0);
  if (sum !== output.value) return { ok: false, reason: 'Số đồng xu không khớp đường đi' };
  const best = optimum(input.grid);
  return { ok: true, optimal: output.value === best, score: output.value };
}
