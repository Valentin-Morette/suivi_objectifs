import type { Goal, WeekSummary } from '../types/goal'
import { daysLeftInWeek } from '../utils/week'
import { ProgressRing } from './ProgressRing'
import { SessionChip } from './SessionChip'

interface CurrentWeekCardProps {
  goal: Goal
  week: WeekSummary
  referenceDate?: Date
}

export function CurrentWeekCard({ goal, week, referenceDate }: CurrentWeekCardProps) {
  const remaining = Math.max(0, week.target - week.completed)
  const done = week.completed >= week.target
  const daysLeft = daysLeftInWeek(referenceDate)

  return (
    <section className="relative overflow-hidden rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-indigo-950/80 via-[#12151c] to-[#0c0f14] p-6 shadow-xl shadow-indigo-950/40 sm:p-8">
      <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-indigo-500/20 blur-3xl" />
      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex-1 text-left">
          <p className="text-xs font-semibold uppercase tracking-widest text-indigo-300/80">
            Semaine en cours
          </p>
          <h2
            className="mt-1 font-display text-2xl font-semibold text-white sm:text-3xl"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {goal.label}
          </h2>
          <p className="mt-1 text-sm text-zinc-400">{goal.description}</p>
          <p className="mt-3 text-sm text-zinc-500">{week.label}</p>

          <p className="mt-4 text-base text-zinc-300">
            {done ? (
              <span className="font-medium text-emerald-400">
                Objectif atteint cette semaine
              </span>
            ) : (
              <>
                Encore{' '}
                <span className="font-semibold text-white">
                  {remaining} séance{remaining > 1 ? 's' : ''}
                </span>{' '}
                pour valider la semaine
                {daysLeft > 0 && (
                  <span className="text-zinc-500">
                    {' '}
                    · il reste {daysLeft} jour{daysLeft > 1 ? 's' : ''}
                  </span>
                )}
              </>
            )}
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            {week.sessions.length > 0 ? (
              week.sessions.map((s) => <SessionChip key={s.id} session={s} />)
            ) : (
              <p className="text-sm italic text-zinc-500">
                Aucune séance enregistrée cette semaine
              </p>
            )}
          </div>

          {!done && week.completed > 0 && (
            <div className="mt-5 flex gap-1">
              {Array.from({ length: week.target }).map((_, i) => (
                <div
                  key={i}
                  className={`h-2 flex-1 rounded-full transition-colors ${
                    i < week.completed ? 'bg-indigo-400' : 'bg-white/10'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        <div className="flex shrink-0 flex-col items-center gap-2">
          <ProgressRing completed={week.completed} target={week.target} size={140} />
          <span className="text-xs text-zinc-500">{goal.unit} cette semaine</span>
        </div>
      </div>
    </section>
  )
}
