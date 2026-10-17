import {describe, it, expect} from 'vitest';
import {
  generate,
  randomGraph,
  crownGraph,
  completeGraph,
  cycleGraph,
  completeBipartiteGraph,
  petersenGraph,
  mycielskian,
  grotzschGraph,
} from './generators';
import {inputSchema, MAX_EDGES, MAX_NODES} from './definition';
import {chromaticNumberOracle, existsColoring} from './checker';

describe('graph-coloring generators (hồi quy cho đồ thị cấu trúc mới)', () => {
  it('generate(seed,size) không đổi hành vi gốc (tiny/small/medium/large)', () => {
    const sizes = {tiny: 4, small: 5, medium: 6, large: 7} as const;
    for (const [size, n] of Object.entries(sizes) as [keyof typeof sizes, number][]) {
      const input = generate(1, size);
      expect(input.nodes.length).toBe(n);
      expect(inputSchema.safeParse(input).success).toBe(true);
    }
  });

  it('randomGraph(seed,n,p): hợp lệ, đúng số đỉnh, tái lập được theo seed', () => {
    const a = randomGraph(7, 50, 0.1);
    const b = randomGraph(7, 50, 0.1);
    expect(a.nodes.length).toBe(50);
    expect(a.edges).toEqual(b.edges);
    expect(inputSchema.safeParse(a).success).toBe(true);
  });

  it('randomGraph(seed, MAX_NODES, 1): đồ thị đầy đủ ở n lớn nhất vẫn hợp lệ (không vượt MAX_EDGES)', () => {
    // n=320, p=1 lẽ ra sinh đồ thị đầy đủ C(320,2) = 51.040 cạnh — vượt xa MAX_EDGES (8000). Trước
    // khi cắt bớt, input này không hợp lệ với inputSchema (mọi giá trị n,p mà trình nhập liệu cho
    // chọn phải luôn sinh ra input hợp lệ).
    const g = randomGraph(1, MAX_NODES, 1);
    expect(g.nodes.length).toBe(MAX_NODES);
    expect(g.edges.length).toBe(MAX_EDGES);
    expect(inputSchema.safeParse(g).success).toBe(true);
  });

  it('randomGraph với p nhỏ và n vừa phải không bị cắt (không đổi hành vi bình thường)', () => {
    const g = randomGraph(7, 50, 0.1);
    expect(g.edges.length).toBeLessThan(MAX_EDGES);
  });

  it('crownGraph(m): hai phía (χ = 2 với oracle độc lập), K_{m,m} bỏ một ghép cặp', () => {
    const g = crownGraph(4);
    expect(g.nodes.length).toBe(8);
    expect(g.edges.length).toBe(4 * 4 - 4); // m*m cặp i,j trừ m cặp i===j
    expect(chromaticNumberOracle(g)).toBe(2);
    expect(existsColoring({...g, colors: 2})).toBe(true);
    expect(existsColoring({...g, colors: 1})).toBe(false);
  });

  it('completeGraph(n): χ = n, đúng C(n,2) cạnh', () => {
    const g = completeGraph(5);
    expect(g.edges.length).toBe((5 * 4) / 2);
    expect(chromaticNumberOracle(g)).toBe(5);
  });

  it('cycleGraph(n): χ = 2 khi n chẵn, χ = 3 khi n lẻ (n ≥ 3), đúng n cạnh', () => {
    const odd = cycleGraph(7);
    const even = cycleGraph(8);
    expect(odd.edges.length).toBe(7);
    expect(even.edges.length).toBe(8);
    expect(chromaticNumberOracle(odd)).toBe(3);
    expect(chromaticNumberOracle(even)).toBe(2);
  });

  it('completeBipartiteGraph(p,q): χ = 2, đúng p*q cạnh', () => {
    const g = completeBipartiteGraph(2, 5);
    expect(g.nodes.length).toBe(7);
    expect(g.edges.length).toBe(10);
    expect(chromaticNumberOracle(g)).toBe(2);
  });

  it('petersenGraph(): 10 đỉnh, 15 cạnh, 3-đều, χ = 3 (kết quả toán học đã biết)', () => {
    const g = petersenGraph();
    expect(g.nodes.length).toBe(10);
    expect(g.edges.length).toBe(15);
    const degree = new Map<string, number>();
    for (const e of g.edges) {
      degree.set(e.from, (degree.get(e.from) ?? 0) + 1);
      degree.set(e.to, (degree.get(e.to) ?? 0) + 1);
    }
    expect([...degree.values()].every((d) => d === 3)).toBe(true);
    expect(chromaticNumberOracle(g)).toBe(3);
  });

  it('mycielskian(G): giữ không tam giác, χ tăng đúng 1; không tam giác kiểm bằng vét tam giác độc lập', () => {
    const base = cycleGraph(5); // χ(C5) = 3, không tam giác
    const result = mycielskian(base);
    expect(result.nodes.length).toBe(2 * base.nodes.length + 1);
    expect(result.edges.length).toBe(base.edges.length * 3 + base.nodes.length);
    expect(chromaticNumberOracle(result)).toBe(chromaticNumberOracle(base) + 1);
    const adjacentPairs = new Set(result.edges.map((e) => `${e.from}|${e.to}`));
    const hasTriangle = result.nodes.some((a) =>
      result.nodes.some(
        (b) =>
          a !== b &&
          (adjacentPairs.has(`${a}|${b}`) || adjacentPairs.has(`${b}|${a}`)) &&
          result.nodes.some(
            (c) =>
              c !== a &&
              c !== b &&
              (adjacentPairs.has(`${a}|${c}`) || adjacentPairs.has(`${c}|${a}`)) &&
              (adjacentPairs.has(`${b}|${c}`) || adjacentPairs.has(`${c}|${b}`)),
          ),
      ),
    );
    expect(hasTriangle).toBe(false);
  });

  it('grotzschGraph(): 11 đỉnh, 20 cạnh, χ = 4 — chính là Mycielski(C5)', () => {
    const g = grotzschGraph();
    expect(g.nodes.length).toBe(11);
    expect(g.edges.length).toBe(20);
    expect(chromaticNumberOracle(g)).toBe(4);
  });
});
