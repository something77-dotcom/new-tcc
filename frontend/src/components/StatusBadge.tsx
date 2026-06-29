import type { PlantStatus } from '../types'
import { statusLabel, statusEmoji, statusBadgeClass } from '../utils/labels'

interface StatusBadgeProps {
  status: PlantStatus
  size?: 'sm' | 'md'
}

export default function StatusBadge({ status, size = 'sm' }: StatusBadgeProps) {
  const sizeClass = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm'
  return (
    <span className={`badge ${statusBadgeClass[status]} ${sizeClass} gap-1`}>
      <span>{statusEmoji[status]}</span>
      {statusLabel[status]}
    </span>
  )
}
