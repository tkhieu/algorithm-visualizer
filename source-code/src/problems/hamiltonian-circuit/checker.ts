import type {Verdict} from '../../core/contracts';
import {inputSchema, outputSchema, type Input, type Output} from './definition';
export function adjacency(input: Input): Set<string> {
  const adj = new Set<string>();
  for (const e of input.edges) {
    if (!input.nodes.includes(e.from) || !input.nodes.includes(e.to) || e.from === e.to) continue;
    adj.add(`${e.from}|${e.to}`);
    adj.add(`${e.to}|${e.from}`);
  }
  return adj;
}
export function connected(adj: Set<string>, a: string, b: string): boolean {
  return adj.has(`${a}|${b}`);
}
/** DP theo bitmask (Held–Karp) — dùng làm nguồn tham chiếu đáng tin cậy để kiểm tra thuật toán và output. */
export function existsHamiltonianCircuit(input: Input): boolean {
  const n = input.nodes.length;
  if (n === 1) return true;
  if (n === 2) return false;
  const adj = adjacency(input);
  const idx = (i: number, j: number) => connected(adj, input.nodes[i], input.nodes[j]);
  const dp: boolean[][] = Array.from({length: 1 << n}, () => new Array(n).fill(false));
  dp[1][0] = true;
  for (let mask = 1; mask < 1 << n; mask++) {
    if (!(mask & 1)) continue;
    for (let v = 0; v < n; v++) {
      if (!dp[mask][v]) continue;
      for (let u = 0; u < n; u++) {
        if (mask & (1 << u)) continue;
        if (idx(v, u)) dp[mask | (1 << u)][u] = true;
      }
    }
  }
  const full = (1 << n) - 1;
  for (let v = 1; v < n; v++) if (dp[full][v] && idx(v, 0)) return true;
  return false;
}
export function check(input: Input, output: Output): Verdict {
  if (!inputSchema.safeParse(input).success) return {ok: false, reason: 'Đầu vào không hợp lệ'};
  if (!outputSchema.safeParse(output).success) return {ok: false, reason: 'Đầu ra sai định dạng'};
  const expect = existsHamiltonianCircuit(input);
  if (output.found !== expect)
    return {
      ok: false,
      reason: expect ? 'Phải tìm được chu trình Hamilton' : 'Không thể có chu trình Hamilton với đồ thị này',
    };
  if (!output.found) return {ok: true, optimal: true};
  const n = input.nodes.length;
  if (output.circuit.length !== n) return {ok: false, reason: 'Số đỉnh trong chu trình không khớp'};
  if (new Set(output.circuit).size !== n || output.circuit.some((v) => !input.nodes.includes(v)))
    return {ok: false, reason: 'Chu trình không phải hoán vị hợp lệ của các đỉnh'};
  const adj = adjacency(input);
  for (let i = 0; i < n; i++) {
    const a = output.circuit[i],
      b = output.circuit[(i + 1) % n];
    if (!connected(adj, a, b)) return {ok: false, reason: `Không có cạnh giữa ${a} và ${b}`};
  }
  return {ok: true, optimal: true};
}
