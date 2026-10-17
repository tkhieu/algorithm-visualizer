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
              // Kẹp n/p trước khi sinh để output luôn hợp lệ với inputSchema: n ≤ MAX_NODES (ô số
              // chỉ gợi ý max qua thuộc tính HTML, không chặn người dùng gõ tay một số lớn hơn), và
              // hạ p nếu n*p quá lớn (ví dụ n=320, p=1 — đồ thị đầy đủ — sẽ cho 51.040 cạnh, vượt xa
              // MAX_EDGES) để số cạnh kỳ vọng nằm trong giới hạn thay vì để randomGraph cắt cụt một
              // cách "vô hình" (không có cách nào feedback lại cho người dùng từ bên trong đó).
              const safeN = Math.min(Math.max(1, Math.round(n)), MAX_NODES);
              const maxPairs = (safeN * (safeN - 1)) / 2;
              const safeP = maxPairs > 0 ? Math.min(Math.max(0, p), MAX_EDGES / maxPairs) : p;
              const notices: string[] = [];
              if (safeN !== n) notices.push(`giảm n xuống ${safeN} (tối đa ${MAX_NODES} đỉnh)`);
              if (safeP < p) notices.push(`giảm p xuống ${safeP.toFixed(4)} để không vượt quá ${MAX_EDGES} cạnh`);
              setGenNotice(notices.length ? `Đã tự điều chỉnh để hợp lệ: ${notices.join('; ')}.` : null);
              onChange({...randomGraph(seed, safeN, safeP, data?.colors ?? 4), mode});
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
              const built = buildPreset(preset, presetN, presetQ);
              // Cùng một lưới an toàn như tab "Ngẫu nhiên": kích thước mẫu (n, p, q) do người dùng
              // gõ tay không bị HTML chặn, nên Kₙ hay vương miện với kích thước quá lớn vẫn phải
              // được kẹp lại trước khi đưa vào inputSchema, không để tràn MAX_NODES/MAX_EDGES.
              const nodes = built.nodes.length > MAX_NODES ? built.nodes.slice(0, MAX_NODES) : built.nodes;
              const keep = new Set(nodes);
              let edges = built.edges.filter((e) => keep.has(e.from) && keep.has(e.to));
              if (edges.length > MAX_EDGES) edges = edges.slice(0, MAX_EDGES);
              const notices: string[] = [];
              if (nodes.length !== built.nodes.length) notices.push(`giảm xuống ${nodes.length} đỉnh (tối đa ${MAX_NODES})`);
              if (edges.length !== built.edges.length) notices.push(`cắt bớt xuống ${edges.length} cạnh (tối đa ${MAX_EDGES})`);
              setGenNotice(notices.length ? `Đã tự điều chỉnh mẫu để hợp lệ: ${notices.join('; ')}.` : null);
              onChange({...built, nodes, edges, colors: data?.colors ?? built.colors, mode});
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
