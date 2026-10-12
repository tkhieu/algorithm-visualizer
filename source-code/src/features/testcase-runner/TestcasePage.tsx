import { useEffect, useState } from 'react'
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { algorithms } from '../../catalog/manifest'
import { loadProblem, type AnyProblem } from '../../catalog/registry'
import { benchPool } from '../../core/bench'
import { benchWorker } from '../../core/worker-protocol/client'
import { download, estimateSize } from '../../lib/utils'
import { useTestcaseStore } from '../../state/testcase.store'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Breadcrumbs } from '../nav/Breadcrumbs'

type Row = { id: string; pass: boolean; ms: number; message: string; notApplicable?: boolean }
const groupNames: Record<string, string> = {
  normal: 'Thông thường',
  edge: 'Biên',
  small: 'Dữ liệu nhỏ',
  large: 'Dữ liệu lớn',
  special: 'Đặc biệt',
  invalid: 'Không hợp lệ',
}

export function TestcasePage({ problemId }: { problemId: string }) {
  const [problem, setProblem] = useState<AnyProblem | null>(null)
  const [loaded, setLoaded] = useState(false)
  useEffect(() => {
    let active = true
    setLoaded(false)
    loadProblem(problemId).then((p) => {
      if (active) {
        setProblem(p ?? null)
        setLoaded(true)
      }
    })
    return () => {
      active = false
    }
  }, [problemId])
  if (!problem) return <p>{loaded ? 'Bài toán này chưa được triển khai.' : 'Đang tải bài toán…'}</p>
  return <LoadedTestcasePage problemId={problemId} problem={problem} />
}

function LoadedTestcasePage({ problemId, problem }: { problemId: string; problem: AnyProblem }) {
  const [rows, setRows] = useState<Row[]>([])
  const [chart, setChart] = useState<{ n: number; ms: number }[]>([])
  const running = useTestcaseStore((s) => s.running),
    setRunning = useTestcaseStore((s) => s.setRunning)
  const readyAlgos = algorithms.filter((a) => a.problemId === problemId && a.status === 'ready')
  // Ưu tiên một thuật toán chính xác KHÔNG phải vét cạn/quay lui/nhánh cận làm chuẩn đối chiếu,
  // vì các kỹ thuật đó có thể quá chậm trên ca dữ liệu lớn (ví dụ vét cạn 2ⁿ trên cỡ 'large').
  const slowTechniques = new Set(['brute-force', 'backtracking', 'branch-and-bound'])
  const referenceAlgo =
    readyAlgos.find((a) => a.exactness === 'exact' && !slowTechniques.has(a.technique)) ??
    readyAlgos.find((a) => a.exactness === 'exact') ??
    readyAlgos[0]
  const cases = problem.cases

  const runAll = async () => {
    setRows([])
    setRunning(true)
    const invalid = cases
      .filter((c) => c.group === 'invalid')
      .map((c) => ({
        id: c.id,
        pass: !problem.inputSchema.safeParse(c.input).success,
        ms: 0,
        message: 'Đầu vào phải bị từ chối',
      }))
    setRows(invalid)
    if (!referenceAlgo) {
      setRunning(false)
      return
    }
    const jobs = cases
      .filter((c) => c.group !== 'invalid')
      .map((c) => ({ id: c.id, algoId: referenceAlgo.id, input: c.input }))
    await benchPool(jobs, (id, response) => {
      const c = cases.find((x) => x.id === id)!
      const r = response.result
      const score =
        r.status === 'ok' && problem.objective
          ? problem.objective.score(c.input, r.output)
          : undefined
      const actual =
        typeof c.expected === 'number' && score !== undefined
          ? score
          : r.status === 'ok'
            ? r.output
            : undefined
      const matches =
        c.expected === undefined || JSON.stringify(actual) === JSON.stringify(c.expected)
      const pass = r.status === 'ok' && r.verdict.ok && matches
      const message =
        r.status === 'ok'
          ? c.expected !== undefined
            ? `Kết quả ${JSON.stringify(actual)}; kỳ vọng ${JSON.stringify(c.expected)}`
            : 'Kết quả hợp lệ'
          : r.status === 'not-applicable'
            ? `Không áp dụng: ${r.reason}`
            : r.status
      setRows((prev) => [
        ...prev,
        { id, pass, ms: response.medianMs, message, notApplicable: r.status === 'not-applicable' },
      ])
    })
    setRunning(false)
  }
  const benchmark = async () => {
    if (!referenceAlgo) return
    const values = []
    for (const size of ['tiny', 'small', 'medium', 'large'] as const) {
      const input = problem.generate(77, size)
      const r = await benchWorker(referenceAlgo.id, input)
      values.push({ n: estimateSize(input), ms: r.medianMs })
    }
    setChart(values)
  }
  const pass = rows.filter((r) => r.pass).length
  const exportRows = rows.map((r) => ({ ...r, group: cases.find((c) => c.id === r.id)?.group }))

  return (
    <div className="space-y-4">
      <Breadcrumbs
        items={[
          {
            label: `Chương ${referenceAlgo?.chapter ?? '—'}`,
            to: referenceAlgo ? `/chapter/${referenceAlgo.chapter}` : undefined,
          },
          { label: problem.title, to: `/problem/${problemId}` },
          { label: 'Ca kiểm thử' },
        ]}
      />
      <div>
        <p className="eyebrow">Thực nghiệm</p>
        <h1>Bộ ca kiểm thử</h1>
        <p className="muted">
          {cases.length} ca dữ liệu, kiểm tra bằng {referenceAlgo?.title ?? '—'} và bộ chấm độc lập.
          Ca không hợp lệ phải bị từ chối.
        </p>
      </div>
      <div className="flex gap-2 flex-wrap">
        <Button onClick={runAll} disabled={running}>
          {running ? 'Đang chạy…' : 'Chạy tất cả'}
        </Button>
        <Button
          variant="outline"
          disabled={!rows.length}
          onClick={() =>
            download(
              'ket-qua-testcase.json',
              JSON.stringify(exportRows, null, 2),
              'application/json',
            )
          }
        >
          Xuất JSON
        </Button>
        <Button
          variant="outline"
          disabled={!rows.length}
          onClick={() =>
            download(
              'ket-qua-testcase.csv',
              [
                'id,nhom,dat,ms,ghi_chu',
                ...exportRows.map((r) => `${r.id},${r.group},${r.pass},${r.ms},"${r.message}"`),
              ].join('\n'),
              'text/csv',
            )
          }
        >
          Xuất CSV
        </Button>
        <span data-testid="pass-count" className="self-center font-semibold">
          Đạt {pass}/{rows.length}
        </span>
      </div>
      {Object.keys(groupNames).map((group) => (
        <Card key={group}>
          <CardHeader>
            <CardTitle>{groupNames[group]}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Ca kiểm thử</th>
                    <th>Kỳ vọng</th>
                    <th>Kết quả</th>
                    <th>Trung vị ms</th>
                    <th>Chi tiết</th>
                  </tr>
                </thead>
                <tbody>
                  {cases
                    .filter((c) => c.group === group)
                    .map((c) => {
                      const row = rows.find((r) => r.id === c.id)
                      return (
                        <tr key={c.id}>
                          <td>{c.name}</td>
                          <td>{c.expected !== undefined ? String(c.expected) : 'Từ chối'}</td>
                          <td>
                            {row
                              ? row.notApplicable
                                ? 'Không áp dụng'
                                : row.pass
                                  ? 'Đạt'
                                  : 'Không đạt'
                              : 'Chưa chạy'}
                          </td>
                          <td>{row?.ms.toFixed(2) ?? '—'}</td>
                          <td>{row?.message ?? c.note ?? '—'}</td>
                        </tr>
                      )
                    })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      ))}
      <Card>
        <CardHeader>
          <CardTitle>Hiệu năng theo n</CardTitle>
        </CardHeader>
        <CardContent>
          <Button variant="outline" onClick={benchmark}>
            Đo thời gian
          </Button>
          {chart.length > 0 && (
            <div className="h-64 mt-3">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chart}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#bbb" />
                  <XAxis dataKey="n" />
                  <YAxis />
                  <Tooltip />
                  <Line dataKey="ms" stroke="#111" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
