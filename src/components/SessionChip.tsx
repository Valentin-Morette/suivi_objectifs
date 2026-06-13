import { ACTIVITY_CONFIG } from '../data/activityConfig'
import type { Session } from '../types/goal'
import { parseDate } from '../utils/week'

interface SessionChipProps {
  session: Session
  compact?: boolean
}

export function SessionChip({ session, compact }: SessionChipProps) {
  const config = ACTIVITY_CONFIG[session.activity]
  const day = parseDate(session.date).toLocaleDateString('fr-FR', {
    weekday: 'short',
    day: 'numeric',
  })

  return (
    <div
      className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 ${config.bg} ${config.border} ${compact ? 'text-xs' : 'text-sm'}`}
      title={session.note}
    >
      <span aria-hidden>{config.emoji}</span>
      <span className={`font-medium ${config.text}`}>{config.label}</span>
      {!compact && (
        <span className="text-zinc-500 capitalize">{day}</span>
      )}
      {session.note && !compact && (
        <span className="text-zinc-500">· {session.note}</span>
      )}
    </div>
  )
}
