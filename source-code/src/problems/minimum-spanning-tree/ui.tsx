import type { StateInspectorProps } from '../../catalog/ui-registry'
import type { VisualState } from '../../algorithms/minimum-spanning-tree/shared'
export function StateInspector({ state }: StateInspectorProps) {
  const s = state as VisualState | null
  return (
    <div className="text-sm space-y-1">
      <p>Cạnh đã chọn: {s?.edgeIndices.join(', ') || 'Chưa có'}</p>
      <p>Tổng trọng số: {s?.weight ?? 0}</p>
      <p>
        Thành phần hợp nhất:{' '}
        {s?.components.length ? s.components.join(', ') : 'Chỉ áp dụng với Kruskal'}
      </p>
    </div>
  )
}
