import type { StateInspectorProps } from '../../catalog/ui-registry'
import type { VisualState } from '../../algorithms/graph-traversal/shared'
export function StateInspector({ state }: StateInspectorProps) {
  const current = state as VisualState | null
  return (
    <div className="space-y-1 text-sm">
      <p>Đang chờ (ngăn xếp / hàng đợi): {current?.frontier.join(', ') || 'Rỗng'}</p>
      <p>Đã duyệt: {current?.order.join(', ') || 'Chưa có'}</p>
    </div>
  )
}
