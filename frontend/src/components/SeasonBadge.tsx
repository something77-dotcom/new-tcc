import type { Season } from '../types'
import { seasonLabel, seasonEmoji, seasonBadgeClass } from '../utils/labels'

interface SeasonBadgeProps {
  season: Season
  size?: 'sm' | 'md'
}

export default function SeasonBadge({ season, size = 'sm' }: SeasonBadgeProps) {
  const sizeClass = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm'
  return (
    <span className={`badge ${seasonBadgeClass[season]} ${sizeClass} gap-1`}>
      <span>{seasonEmoji[season]}</span>
      {seasonLabel[season]}
    </span>
  )
}
