import {describe, it, expect} from 'vitest';
import {inputSchema} from './definition';
import {check, existsColoring, chromaticNumberOracle, CHROMATIC_ORACLE_MAX_N} from './checker';
import {
  crownGraph,
  completeGraph,
  cycleGraph,
  completeBipartiteGraph,
  petersenGraph,
  grotzschGraph,
} from './generators';
const triangle = {
  nodes: ['A', 'B', 'C'],
  edges: [
    {from: 'A', to: 'B'},
    {from: 'B', to: 'C'},
    {from: 'C', to: 'A'},
  ],
  colors: 3,
};
describe('graph-coloring definition', () => {
  it('chấp nhận input hợp lệ và từ chối k=0', () => {
    expect(inputSchema.safeParse(triangle).success).toBe(true);
    expect(inputSchema.safeParse({...triangle, colors: 0}).success).toBe(false);
  });
  it('existsColoring đúng trên tam giác', () => {
    expect(existsColoring(triangle)).toBe(true);
    expect(existsColoring({...triangle, colors: 2})).toBe(false);
  });
  it('tham chiếu phân hoạch kiểm tra cả cách tô tồn tại và đồ thị rỗng', () => {
    const original = Array.prototype.fill;
    Array.prototype.fill = (() => { throw new Error('Không dùng mảng tô quay lui'); }) as typeof Array.prototype.fill;
    try {
      expect(existsColoring(triangle)).toBe(true);
      expect(existsColoring({...triangle, colors: 2})).toBe(false);
      expect(existsColoring({nodes: [], edges: [], colors: 1})).toBe(true);
    } finally {
      Array.prototype.fill = original;
    }
  });
  it('existsColoring loại nhánh ngay khi xung đột, không chỉ ở lá — K4 + 18 đỉnh cô lập, k=3 chạy nhanh', () => {
    // Trước khi thêm pruning theo lớp, hàm này chỉ kiểm xung đột khi đã gán hết n đỉnh, nên với 18
    // đỉnh cô lập (không cạnh) nó thử mọi tổ hợp lớp cho 18 đỉnh đó (lên tới kⁿ) trước khi chạm tới
    // 4 đỉnh của K4 — với k=3, n=22 là 3^22 ≈ 3,1×10^10 bước, vượt xa thời gian chờ worker (5 s).
    // Quay lui (backtracking) trả lời tức khắc vì nó loại nhánh ngay khi xung đột; oracle độc lập
    // (không dùng backtracking) phải nhanh tương đương bằng cách loại nhánh của riêng nó.
    const nodes = Array.from({length: 22}, (_, i) => `V${i}`);
    const edges: {from: string; to: string}[] = [];
    for (let i = 0; i < 4; i++) for (let j = i + 1; j < 4; j++) edges.push({from: nodes[i], to: nodes[j]});
    const input = {nodes, edges, colors: 3};
    const start = performance.now();
    const result = existsColoring(input);
    const ms = performance.now() - start;
    expect(result).toBe(false); // K4 cần đúng 4 màu, k=3 không đủ dù có thêm đỉnh cô lập
    expect(ms).toBeLessThan(1000);
  });
  it('check(found:false) trên K4 + 18 đỉnh cô lập, k=3 cũng chạy nhanh (dùng lại existsColoring)', () => {
    const nodes = Array.from({length: 22}, (_, i) => `V${i}`);
    const edges: {from: string; to: string}[] = [];
    for (let i = 0; i < 4; i++) for (let j = i + 1; j < 4; j++) edges.push({from: nodes[i], to: nodes[j]});
    const input = {nodes, edges, colors: 3};
    const start = performance.now();
    const verdict = check(input, {found: false, coloring: []});
    const ms = performance.now() - start;
    expect(verdict).toEqual({ok: true, optimal: true});
    expect(ms).toBeLessThan(1000);
  });
  it('found=false của thuật toán chính xác phải chứng minh vô nghiệm', () => {
    expect(check(triangle, {found: false, coloring: []}).ok).toBe(false);
    expect(check({...triangle, colors: 2}, {found: false, coloring: []})).toEqual({ok: true, optimal: true});
  });
  it('thất bại tham lam chỉ được chấm xấp xỉ', () => {
    expect(check(triangle, {found: false, coloring: [], heuristic: true})).toEqual({ok: true, optimal: false});
    expect(check({...triangle, colors: 2}, {found: false, coloring: [], heuristic: true}))
      .toEqual({ok: true, optimal: false});
  });
  it('đồ thị rỗng có cách tô rỗng hợp lệ', () => {
    const empty = {nodes: [], edges: [], colors: 1};
    expect(inputSchema.safeParse(empty).success).toBe(true);
    expect(check(empty, {found: true, coloring: []}).ok).toBe(true);
  });
  it('check chấm đúng tô màu tay', () => {
    expect(check(triangle, {found: true, coloring: [0, 1, 2]}).ok).toBe(true);
  });
  it('check từ chối hai đỉnh kề cùng màu', () => {
    expect(check(triangle, {found: true, coloring: [0, 0, 1]}).ok).toBe(false);
  });

  it('chấp nhận mode mới và từ chối giá trị mode không hợp lệ', () => {
    expect(inputSchema.safeParse({...triangle, mode: 'chromatic'}).success).toBe(true);
    expect(inputSchema.safeParse({...triangle, mode: 'k-coloring'}).success).toBe(true);
    expect(inputSchema.safeParse({...triangle, mode: 'invalid-mode'}).success).toBe(false);
  });

  it('nâng giới hạn số đỉnh lên 320 cho đồ thị lớn của heuristic', () => {
    const big = {nodes: Array.from({length: 320}, (_, i) => `V${i}`), edges: [], colors: 1};
    expect(inputSchema.safeParse(big).success).toBe(true);
    expect(inputSchema.safeParse({...big, nodes: [...big.nodes, 'overflow']}).success).toBe(false);
  });

  describe('chromaticNumberOracle — oracle độc lập tính χ(G) bằng cách tăng dần k', () => {
    it('đồ thị rỗng (0 đỉnh): χ = 0', () => {
      expect(chromaticNumberOracle({nodes: [], edges: [], colors: 1})).toBe(0);
    });
    it('vương miện (bipartite): χ = 2', () => {
      expect(chromaticNumberOracle(crownGraph(3))).toBe(2);
    });
    it('đầy đủ K5: χ = 5', () => {
      expect(chromaticNumberOracle(completeGraph(5))).toBe(5);
    });
    it('chu trình lẻ C5: χ = 3; chu trình chẵn C6: χ = 2', () => {
      expect(chromaticNumberOracle(cycleGraph(5))).toBe(3);
      expect(chromaticNumberOracle(cycleGraph(6))).toBe(2);
    });
    it('hai phía đầy đủ K(3,4): χ = 2', () => {
      expect(chromaticNumberOracle(completeBipartiteGraph(3, 4))).toBe(2);
    });
    it('Petersen: χ = 3 (nằm trong ngưỡng oracle vì có 10 đỉnh ≤ 12)', () => {
      expect(petersenGraph().nodes.length).toBeLessThanOrEqual(CHROMATIC_ORACLE_MAX_N);
      expect(chromaticNumberOracle(petersenGraph())).toBe(3);
    });
    it('Grötzsch (11 đỉnh, không tam giác): χ = 4', () => {
      expect(grotzschGraph().nodes.length).toBeLessThanOrEqual(CHROMATIC_ORACLE_MAX_N);
      expect(chromaticNumberOracle(grotzschGraph())).toBe(4);
    });
  });

  describe('check ở chế độ chromatic', () => {
    it('phải found=true — không có khái niệm "vô nghiệm" khi không giới hạn số màu', () => {
      expect(check({...triangle, mode: 'chromatic'}, {found: false, coloring: []}).ok).toBe(false);
    });
    it('chromaticExact đúng với χ(G) tính độc lập thì tối ưu, sai thì bị từ chối', () => {
      const input = {...crownGraph(3), mode: 'chromatic' as const};
      const correct = check(input, {found: true, coloring: [0, 1, 0, 1, 0, 1], colorsUsed: 2, chromaticExact: true});
      expect(correct).toEqual({ok: true, optimal: true});
      const wrong = check(input, {
        found: true,
        coloring: [0, 1, 2, 3, 4, 5],
        colorsUsed: 6,
        chromaticExact: true,
      });
      expect(wrong.ok).toBe(false);
    });
    it('heuristic (không chromaticExact): tối ưu nếu khớp χ(G), không bảo đảm nếu không khớp', () => {
      const input = {...crownGraph(3), mode: 'chromatic' as const};
      const optimal = check(input, {found: true, coloring: [0, 1, 0, 1, 0, 1], colorsUsed: 2, heuristic: true});
      expect(optimal).toEqual({ok: true, optimal: true});
      const suboptimal = check(input, {
        found: true,
        coloring: [0, 0, 1, 1, 2, 2],
        colorsUsed: 3,
        heuristic: true,
      });
      expect(suboptimal).toEqual({ok: true, optimal: false});
    });
    it('đồ thị lớn hơn ngưỡng oracle: không tính χ(G) độc lập, không đưa ra tuyên bố tối ưu nào', () => {
      const big = {
        nodes: Array.from({length: CHROMATIC_ORACLE_MAX_N + 1}, (_, i) => `V${i}`),
        edges: [],
        colors: 1,
        mode: 'chromatic' as const,
      };
      const coloring = big.nodes.map(() => 0);
      // Dù thuật toán tự xưng chromaticExact (không thể xảy ra trong thực tế vì precondition của
      // backtracking/exhaustive đã chặn n này, nhưng checker không được PHÉP tin một lời tự xưng
      // không kiểm chứng được), kết quả vẫn không có trường optimal — không hề là "tối ưu".
      expect(check(big, {found: true, coloring, colorsUsed: 1, chromaticExact: true})).toEqual({ok: true});
      expect(check(big, {found: true, coloring, colorsUsed: 1, heuristic: true})).toEqual({ok: true});
    });
    it('đồ thị lớn hơn ngưỡng oracle: chromaticExact SAI (coloring hợp lệ nhưng không tối thiểu) không được tin là tối ưu', () => {
      // Đồ thị hình sao (bipartite, χ thật = 2): V0 nối với V1..V12. Output đưa ra một cách tô HỢP
      // LỆ nhưng dùng 3 màu (V0=0, V1=1, V2=2, còn lại=1) và tự xưng chromaticExact — tuyên bố χ(G)
      // = 3 là SAI (χ thật = 2) nhưng không thể phát hiện bằng properColoringIssue vì cách tô vẫn
      // hợp lệ, chỉ không tối thiểu. Trước khi sửa, checker tin ngay và trả optimal:true cho tuyên
      // bố sai này vì n > ngưỡng oracle; sau khi sửa phải không còn trường optimal nào cả.
      const n = CHROMATIC_ORACLE_MAX_N + 1;
      const nodes = Array.from({length: n}, (_, i) => `V${i}`);
      const edges = nodes.slice(1).map((v) => ({from: nodes[0], to: v}));
      const input = {nodes, edges, colors: 1, mode: 'chromatic' as const};
      const coloring = nodes.map((_, i) => (i === 0 ? 0 : i === 1 ? 1 : i === 2 ? 2 : 1));
      const verdict = check(input, {found: true, coloring, colorsUsed: 3, chromaticExact: true});
      expect(verdict).toEqual({ok: true});
    });
    it('từ chối khi số màu báo cáo không khớp số màu thực dùng trong cách tô', () => {
      const input = {...crownGraph(3), mode: 'chromatic' as const};
      expect(check(input, {found: true, coloring: [0, 1, 0, 1, 0, 1], colorsUsed: 5, heuristic: true}).ok).toBe(false);
    });
  });
});
