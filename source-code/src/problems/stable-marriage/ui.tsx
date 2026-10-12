import type { StateInspectorProps } from '../../catalog/ui-registry'
import type { VisualState } from '../../algorithms/stable-marriage/shared'

function Preferences({ label, rows }: { label: string; rows: number[][] }) {
  return (
    <div>
      <strong>{label}</strong>
      <div className="overflow-auto max-h-40">
        <table className="data-table">
          <thead>
            <tr>
              <th>Người</th>
              <th>Ưu tiên (từ cao xuống thấp)</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i}>
                <td>{i}</td>
                <td>{row.join(' › ')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
export function StateInspector({ state }: StateInspectorProps) {
  const s = state as VisualState | null
  if (!s) return null
  return (
    <div className="space-y-2">
      <p>Đã đề xuất: {s.proposals}</p>
      <p>Người đang tự do: {s.free.join(', ') || 'Không còn'}</p>
      <Preferences label="Bảng ưu tiên nam" rows={s.menPreferences} />
      <Preferences label="Bảng ưu tiên nữ" rows={s.womenPreferences} />
    </div>
  )
}
