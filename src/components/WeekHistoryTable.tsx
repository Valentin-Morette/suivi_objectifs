import { ACTIVITY_CONFIG } from '../data/activityConfig'
import { SPORT_STAKE } from '../data/stakeConfig'
import type { WeekSummary } from '../types/goal'
import { parseDate } from '../utils/week'
import { isWeekFailed, isWeekSucceeded } from '../utils/weekStatus'

interface WeekHistoryTableProps {
  weeks: WeekSummary[]
}

function StatusBadge({ week }: { week: WeekSummary }) {
  const failed = isWeekFailed(week)
  const done = isWeekSucceeded(week)

  if (failed) {
    return (
      <span className="rounded-full bg-red-600 px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-white ring-2 ring-red-400/50">
        Ratée · {SPORT_STAKE.label}
      </span>
    )
  }
  if (done) {
    return (
      <span className="rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-xs font-medium text-emerald-400 ring-1 ring-emerald-500/30">
        Atteint
      </span>
    )
  }
  return (
    <span className="rounded-full bg-amber-500/15 px-2.5 py-0.5 text-xs font-medium text-amber-300 ring-1 ring-amber-500/30">
      Partiel
    </span>
  )
}

export function WeekHistoryTable({ weeks }: WeekHistoryTableProps) {
  const history = weeks.filter((w) => !w.isCurrent)

  if (history.length === 0) {
    return null
  }

  return (
    <section className="mt-10">
      <div className="mb-4 text-left">
        <h3
          className="font-display text-xl font-semibold text-white"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Historique
        </h3>
        <p className="mt-1 text-sm text-zinc-500">
          Chaque ligne ratée = {SPORT_STAKE.label} pour {SPORT_STAKE.recipient}
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border border-white/8 bg-white/[0.02]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-white/8 bg-white/[0.03]">
                <th className="px-4 py-3 font-medium text-zinc-400">Semaine</th>
                <th className="w-24 px-4 py-3 text-center font-medium text-zinc-400">
                  Progression
                </th>
                <th className="px-4 py-3 font-medium text-zinc-400">Séances</th>
                <th className="w-36 px-4 py-3 font-medium text-zinc-400">Statut</th>
              </tr>
            </thead>
            <tbody>
              {history.map((week) => {
                const failed = isWeekFailed(week)
                const ratio = week.completed / week.target

                return (
                  <tr
                    key={week.weekKey}
                    className={
                      failed
                        ? 'failed-row-glow border-b border-red-500/40 bg-gradient-to-r from-red-950/80 via-red-900/30 to-red-950/80'
                        : 'border-b border-white/5 transition-colors hover:bg-white/[0.03]'
                    }
                  >
                    <td className="px-4 py-4">
                      <span
                        className={
                          failed
                            ? 'font-bold text-red-300 line-through decoration-red-500/60'
                            : 'font-medium text-zinc-200'
                        }
                      >
                        {week.label}
                      </span>
                      {failed && (
                        <p className="mt-1 text-xs font-semibold text-red-400">
                          −{SPORT_STAKE.label} pour {SPORT_STAKE.recipient}
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-col items-center gap-1.5">
                        <span
                          className={
                            failed
                              ? 'text-lg font-bold tabular-nums text-red-400'
                              : 'tabular-nums text-zinc-300'
                          }
                        >
                          {week.completed}/{week.target}
                        </span>
                        <div
                          className={`h-2 w-full max-w-[80px] overflow-hidden rounded-full ${
                            failed ? 'bg-red-950' : 'bg-white/10'
                          }`}
                        >
                          <div
                            className={`h-full rounded-full ${
                              failed
                                ? 'bg-red-600'
                                : ratio >= 1
                                  ? 'bg-emerald-500'
                                  : 'bg-amber-500'
                            }`}
                            style={{ width: `${Math.min(ratio * 100, 100)}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className={`px-4 py-4 ${failed ? 'opacity-60 grayscale' : ''}`}>
                      {week.sessions.length > 0 ? (
                        <ul className="flex flex-wrap gap-2">
                          {week.sessions.map((s) => {
                            const cfg = ACTIVITY_CONFIG[s.activity]
                            const day = parseDate(s.date).toLocaleDateString('fr-FR', {
                              weekday: 'short',
                            })
                            return (
                              <li
                                key={s.id}
                                className={`inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs ${cfg.bg} ${cfg.border}`}
                                title={s.note}
                              >
                                <span>{cfg.emoji}</span>
                                <span className={cfg.text}>{cfg.label}</span>
                                <span className="text-zinc-500 capitalize">{day}</span>
                              </li>
                            )
                          })}
                        </ul>
                      ) : (
                        <span className="font-medium italic text-red-500/80">
                          Rien. Semaine vide.
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <StatusBadge week={week} />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
