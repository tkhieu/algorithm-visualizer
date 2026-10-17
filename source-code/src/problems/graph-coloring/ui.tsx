import {useEffect, useRef, useState} from 'react';
import {useSearchParams} from 'react-router-dom';
import {Tabs, TabsList, TabsTrigger, TabsContent} from '../../components/ui/tabs';
import {Button} from '../../components/ui/button';
import type {InputEditorProps, OutputRendererProps} from '../../catalog/ui-registry';
import {inputSchema, MAX_EDGES, MAX_NODES, type Input, type Output} from './definition';
import {cases} from './cases';
import {
  randomGraph,
  crownGraph,
  completeGraph,
  cycleGraph,
  completeBipartiteGraph,
  petersenGraph,
  grotzschGraph,
} from './generators';

const groupLabel: Record<string, string> = {
  normal: 'Thông thường',
  edge: 'Biên',
  small: 'Nhỏ',
  large: 'Lớn',
  special: 'Đặc biệt',
  invalid: 'Không hợp lệ',
};

type PresetId = 'crown' | 'complete' | 'cycle' | 'bipartite' | 'petersen' | 'grotzsch';
const presetLabel: Record<PresetId, string> = {
  crown: 'Vương miện (2 nhóm kích thước m, χ = 2)',
  complete: 'Đầy đủ Kₙ (χ = n)',
  cycle: 'Chu trình Cₙ (χ = 2 nếu n chẵn, 3 nếu n lẻ)',
  bipartite: 'Hai phía đầy đủ K(p,q) (χ = 2)',
  petersen: 'Petersen (10 đỉnh, χ = 3)',
  grotzsch: 'Grötzsch — Mycielski của C5, không tam giác (11 đỉnh, χ = 4)',
};
function buildPreset(preset: PresetId, n: number, q: number): Input {
  if (preset === 'crown') return crownGraph(Math.max(2, n));
  if (preset === 'complete') return completeGraph(Math.max(1, n));
  if (preset === 'cycle') return cycleGraph(Math.max(3, n));
  if (preset === 'bipartite') return completeBipartiteGraph(Math.max(1, n), Math.max(1, q));
  if (preset === 'petersen') return petersenGraph();
  return grotzschGraph();
}
/** Số đỉnh/cạnh một mẫu SẼ có, tính trước bằng công thức — không dựng đồ thị thật — để kiểm xem
 * tham số người dùng gõ có vượt MAX_NODES/MAX_EDGES hay không TRƯỚC khi gọi buildPreset. Bắt buộc
 * phải kiểm trước: với preset 'complete' hay 'crown', một n gõ tay lớn (hoặc NaN/Infinity) khiến
 * buildPreset dựng hẳn mảng cạnh O(n²) — có thể treo hoặc hết bộ nhớ tab trước khi code JS nào
 * kịp kiểm tra độ dài mảng kết quả. Không dùng số liệu này để CẮT đồ thị: nếu vượt ngưỡng, từ chối
 * hẳn (không gọi buildPreset) — cắt bớt đỉnh/cạnh của một mẫu đã biết (Kₙ, vương miện, …) phá vỡ
 * đúng cấu trúc khiến χ đã ghi trong tên mẫu không còn đúng (ví dụ K128 cắt còn 8000 cạnh không
 * còn là K128, K(320,1) cắt còn 320 đỉnh phía trái mất hết cạnh nên χ thật thành 1 chứ không phải 2). */
function presetSize(preset: PresetId, n: number, q: number): {nodes: number; edges: number} | null {
  if (!Number.isFinite(n) || !Number.isFinite(q)) return null;
  if (preset === 'crown') {
    const m = Math.max(2, Math.round(n));
    return {nodes: 2 * m, edges: m * (m - 1)};
  }
  if (preset === 'complete') {
    const c = Math.max(1, Math.round(n));
    return {nodes: c, edges: (c * (c - 1)) / 2};
  }
  if (preset === 'cycle') {
    const c = Math.max(3, Math.round(n));
    return {nodes: c, edges: c};
  }
  if (preset === 'bipartite') {
    const p = Math.max(1, Math.round(n));
    const r = Math.max(1, Math.round(q));
    return {nodes: p + r, edges: p * r};
  }
  if (preset === 'petersen') return {nodes: 10, edges: 15};
  return {nodes: 11, edges: 20}; // grotzsch
}

/** Trình nhập liệu riêng cho Tô màu đồ thị: thêm chọn chế độ (k-coloring/chromatic), bộ sinh đồ
 * thị ngẫu nhiên G(n,p) theo seed, và các mẫu đồ thị đã biết χ (vương miện, Kₙ, chu trình, hai
 * phía, Petersen, Grötzsch/Mycielski) — xem phần 2 của kế hoạch nâng cấp. */
export function InputEditor({input, onChange, disabled = false}: InputEditorProps) {
  const [params, setParams] = useSearchParams();
  const parsed = inputSchema.safeParse(input);
  const data = parsed.success ? parsed.data : null;
  const [tab, setTab] = useState('random');
  const [seed, setSeed] = useState(42);
  const [n, setN] = useState(10);
  const [p, setP] = useState(0.3);
  const [genNotice, setGenNotice] = useState<string | null>(null);
  const [preset, setPreset] = useState<PresetId>('crown');
  const [presetN, setPresetN] = useState(4);
  const [presetQ, setPresetQ] = useState(3);
  const [raw, setRaw] = useState(JSON.stringify(input, null, 2));
  const editingJson = useRef(false);
  useEffect(() => {
    if (!editingJson.current) setRaw(JSON.stringify(input, null, 2));
    editingJson.current = false;
  }, [input]);
  const mode = data?.mode ?? 'k-coloring';
  const setMode = (nextMode: 'k-coloring' | 'chromatic') => {
    if (!data) return;
    onChange({...data, mode: nextMode});
  };
  const setColors = (colors: number) => {
    if (!data) return;
    onChange({...data, colors});
  };
  return (
    <div>
      <label className="field-label">
        Chế độ
        <select
          aria-label="Chế độ"
          value={mode}
          disabled={disabled}
          onChange={(e) => setMode(e.target.value as 'k-coloring' | 'chromatic')}
        >
          <option value="k-coloring">Tô bằng k màu cho sẵn</option>
          <option value="chromatic">Tìm sắc số χ(G)</option>
        </select>
      </label>
      {mode === 'k-coloring' && (
        <label className="field-label">
          Số màu k
          <input
            aria-label="Số màu k"
            type="number"
            min={1}
            max={10}
            value={data?.colors ?? 1}
            disabled={disabled}
            onChange={(e) => setColors(Number(e.target.value))}
          />
        </label>
      )}
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="w-full">
          <TabsTrigger value="random">Ngẫu nhiên</TabsTrigger>
          <TabsTrigger value="preset">Mẫu</TabsTrigger>
          <TabsTrigger value="case">Ca kiểm thử</TabsTrigger>
          <TabsTrigger value="json">Chỉnh JSON</TabsTrigger>
        </TabsList>
        <TabsContent value="random">
          <label className="field-label">
            Hạt giống
            <input aria-label="Hạt giống" type="number" value={seed} onChange={(e) => setSeed(Number(e.target.value))} />
          </label>
          <label className="field-label">
            Số đỉnh n
            <input
              aria-label="Số đỉnh n"
              type="number"
              min={1}
              max={320}
              value={n}
              onChange={(e) => setN(Number(e.target.value))}
            />
          </label>
          <label className="field-label">
            Xác suất cạnh p
            <input
              aria-label="Xác suất cạnh p"
              type="number"
              min={0}
              max={1}
              step={0.01}
              value={p}
              onChange={(e) => setP(Number(e.target.value))}
            />
          </label>
          <Button
            disabled={disabled}
            onClick={() => {
              // randomGraph sinh đúng mẫu G(n,p) thật, không tự cắt cạnh (cắt làm lệch mẫu — xem
              // chú thích tại randomGraph). Ở đây: kẹp n ≤ MAX_NODES (ô số chỉ gợi ý max qua thuộc
              // tính HTML, không chặn người dùng gõ tay một số lớn hơn), rồi hạ p để số cạnh KỲ
              // VỌNG chỉ còn 90% MAX_EDGES — còn dư nhiều lần độ lệch chuẩn của phân phối nhị thức
              // nên số cạnh THỰC SINH RA hiếm khi vượt MAX_EDGES. Nếu lần hiếm đó vẫn xảy ra: từ
              // chối hẳn (không cắt, không lặng lẽ nhận một đồ thị khác với cái vừa báo), giữ nguyên
              // dữ liệu hiện tại.
              const safeN = Math.min(Math.max(1, Math.round(n)), MAX_NODES);
              const maxPairs = (safeN * (safeN - 1)) / 2;
              const safeP = maxPairs > 0 ? Math.min(Math.max(0, p), (MAX_EDGES * 0.9) / maxPairs) : Math.max(0, p);
              const graph = randomGraph(seed, safeN, safeP, data?.colors ?? 4);
              if (graph.edges.length > MAX_EDGES) {
                setGenNotice(
                  `Không áp dụng: với hạt giống ${seed}, n=${safeN}, p=${safeP.toFixed(4)} sinh ra ${graph.edges.length} ` +
                    `cạnh — vẫn vượt giới hạn ${MAX_EDGES}. Giữ nguyên dữ liệu hiện tại; hãy giảm p/n hoặc đổi hạt giống rồi thử lại.`,
                );
                return;
              }
              const notices: string[] = [];
              if (safeN !== n) notices.push(`giảm n xuống ${safeN} (tối đa ${MAX_NODES} đỉnh)`);
              if (safeP < p)
                notices.push(
                  `giảm xác suất cạnh từ ${p} xuống ${safeP.toFixed(4)} — kỳ vọng khoảng ${Math.round(safeP * maxPairs)} cạnh (tối đa ${MAX_EDGES})`,
                );
              setGenNotice(
                notices.length
                  ? `Đã tự điều chỉnh để hợp lệ: ${notices.join('; ')}. Đồ thị sinh ra thực tế có ${graph.edges.length} cạnh.`
                  : null,
              );
              onChange({...graph, mode});
              setParams((prev) => {
                prev.delete('case');
                return prev;
              });
            }}
          >
            Sinh đồ thị
          </Button>
          {genNotice && <p role="status" className="text-sm mt-2">{genNotice}</p>}
        </TabsContent>
        <TabsContent value="preset">
          <label className="field-label">
            Mẫu đồ thị
            <select aria-label="Mẫu đồ thị" value={preset} onChange={(e) => setPreset(e.target.value as PresetId)}>
              {Object.entries(presetLabel).map(([id, label]) => (
                <option key={id} value={id}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          {(preset === 'crown' || preset === 'complete' || preset === 'cycle' || preset === 'bipartite') && (
            <label className="field-label">
              {preset === 'bipartite' ? 'Kích thước p' : 'Kích thước n'}
              <input
                aria-label={preset === 'bipartite' ? 'Kích thước p' : 'Kích thước n'}
                type="number"
                min={1}
                value={presetN}
                onChange={(e) => setPresetN(Number(e.target.value))}
              />
            </label>
          )}
          {preset === 'bipartite' && (
            <label className="field-label">
              Kích thước q
              <input
                aria-label="Kích thước q"
                type="number"
                min={1}
                value={presetQ}
                onChange={(e) => setPresetQ(Number(e.target.value))}
              />
            </label>
          )}
          <Button
            disabled={disabled}
            onClick={() => {
              // Kiểm kích thước BẰNG CÔNG THỨC trước, không dựng đồ thị thật — một n/q gõ tay quá
              // lớn (hoặc NaN) không được phép khiến buildPreset cố dựng một mảng cạnh khổng lồ.
              // Nếu vượt ngưỡng: từ chối hẳn, giữ nguyên dữ liệu hiện tại — không cắt bớt (cắt bớt
              // một mẫu đã biết phá vỡ đúng cấu trúc của nó, xem chú thích ở presetSize).
              const size = presetSize(preset, presetN, presetQ);
              if (!size || size.nodes > MAX_NODES || size.edges > MAX_EDGES) {
                setGenNotice(
                  `Không áp dụng: mẫu này cần ${size ? `${size.nodes} đỉnh, ${size.edges} cạnh` : 'một kích thước hợp lệ'} — ` +
                    `vượt giới hạn (tối đa ${MAX_NODES} đỉnh, ${MAX_EDGES} cạnh). Giữ nguyên dữ liệu hiện tại; hãy chọn kích thước nhỏ hơn.`,
                );
                return;
              }
              setGenNotice(null);
              const built = buildPreset(preset, presetN, presetQ);
              onChange({...built, colors: data?.colors ?? built.colors, mode});
              setParams((prev) => {
                prev.delete('case');
                return prev;
              });
            }}
          >
            Chèn mẫu
          </Button>
          {genNotice && <p role="status" className="text-sm mt-2">{genNotice}</p>}
        </TabsContent>
        <TabsContent value="case">
          <label className="field-label">
            Ca kiểm thử
            <select
              aria-label="Ca kiểm thử"
              value={params.get('case') || ''}
              onChange={(e) => {
                const c = cases.find((x) => x.id === e.target.value);
                if (c) {
                  onChange(c.input);
                  setParams((prev) => {
                    prev.set('case', c.id);
                    return prev;
                  });
                }
              }}
            >
              <option value="">Chọn testcase</option>
              {cases.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({groupLabel[c.group] ?? c.group})
                </option>
              ))}
            </select>
          </label>
        </TabsContent>
        <TabsContent value="json">
          <textarea
            aria-label="Dữ liệu JSON"
            rows={10}
            disabled={disabled}
            value={raw}
            onChange={(e) => {
              editingJson.current = true;
              setRaw(e.target.value);
              try {
                onChange(JSON.parse(e.target.value) as unknown);
              } catch {
                onChange(undefined);
              }
            }}
          />
        </TabsContent>
      </Tabs>
      <div role="status" className={`mt-3 text-sm ${parsed.success ? '' : 'font-semibold'}`}>
        {parsed.success
          ? '✓ Dữ liệu hợp lệ'
          : `Dữ liệu không hợp lệ: ${parsed.error.issues.map((x) => `${x.path.join('.')}: ${x.message}`).join('; ')}`}
      </div>
    </div>
  );
}

export function OutputRenderer({output, verdict, truncated}: OutputRendererProps) {
  const typed = output as Output;
  return (
    <>
      <p>Tô được: <strong>{typed.found ? 'Có' : 'Không'}</strong></p>
      {typed.colorsUsed !== undefined && (
        <p>
          Số màu đã dùng: <strong>{typed.colorsUsed}</strong>
          {typed.chromaticExact ? ' — đã chứng minh là χ(G)' : typed.heuristic ? ' — chặn trên, chưa chắc tối ưu' : ''}
        </p>
      )}
      <p>Cách tô: {typed.coloring.length ? typed.coloring.join(', ') : '—'}</p>
      <p>
        {verdict.ok
          ? verdict.optimal === false
            ? 'Hợp lệ · không bảo đảm tối ưu'
            : verdict.optimal
              ? '✓ Hợp lệ · tối ưu'
              : '✓ Hợp lệ'
          : verdict.reason}
      </p>
      {truncated && <p className="font-semibold">Trace đã rút gọn; kết quả vẫn hoàn chỉnh.</p>}
    </>
  );
}
