import { ACTIVITY_CONFIG, KM_ACTIVITIES } from '../data/activityConfig'
import type { ActivityType, Session } from '../types/goal'
import { buildGlobalStats, formatKm } from '../utils/stats'

interface GlobalStatsCardProps {
  sessions: Session[]
}

export function GlobalStatsCard({ sessions }: GlobalStatsCardProps) {
  const stats = buildGlobalStats(sessions)

  if (stats.totalSessions === 0) {
    return null
  }

  const activities = Object.keys(ACTIVITY_CONFIG) as ActivityType[]

  return (
    <section className="mt-10 text-left">
      <div className="mb-4">
        <h3
          className="font-display text-xl font-semibold text-white"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Récap global
        </h3>
        {stats.statsSinceLabel && (
          <p className="mt-1 text-sm text-zinc-500">
            Stats depuis le {stats.statsSinceLabel}
          </p>
        )}
      </div>

      <div className="overflow-hidden rounded-xl border border-white/8 bg-white/[0.02]">
        <div className="border-b border-white/8 bg-white/[0.03] px-5 py-4">
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
            Total séances
          </p>
          <p className="mt-1 font-display text-4xl font-bold tabular-nums text-white">
            {stats.totalSessions}
          </p>
        </div>

        <div className="grid gap-px bg-white/5 sm:grid-cols-2 lg:grid-cols-4">
          {activities.map((key) => {
            const cfg = ACTIVITY_CONFIG[key]
            const count = stats.byActivity[key]
            const tracksKm = KM_ACTIVITIES.includes(key)
            const kmStats = stats.kmByActivity[key]

            return (
              <div key={key} className="bg-[#0c0f14] px-5 py-4">
                <div className="flex items-center gap-2">
                  <span aria-hidden>{cfg.emoji}</span>
                  <span className={`text-sm font-medium ${cfg.text}`}>{cfg.label}</span>
                </div>
                <p className="mt-2 text-2xl font-semibold tabular-nums text-white">
                  {count}
                  <span className="ml-1 text-sm font-normal text-zinc-500">
                    séance{count > 1 ? 's' : ''}
                  </span>
                </p>
                {tracksKm && kmStats && kmStats.fromNotes > 0 && (
                  <p className={`mt-2 text-sm ${cfg.text}`}>
                    {formatKm(kmStats.total)} cumulés
                  </p>
                )}
                {tracksKm && count > 0 && kmStats && kmStats.fromNotes === 0 && (
                  <p className="mt-2 text-xs text-zinc-600">
                    Ajoute « 5,5km » dans la note pour cumuler les km
                  </p>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
