import type { Race, RaceType } from '../types/race'
import { parseDate } from '../utils/week'
import {
  formatDistanceKm,
  formatDuration,
  formatElevation,
} from '../utils/raceFormat'

const TYPE_CONFIG: Record<
  RaceType,
  { label: string; emoji: string; className: string }
> = {
  course: {
    label: 'Course',
    emoji: '🏃',
    className: 'bg-amber-500/15 text-amber-300 ring-1 ring-amber-500/40',
  },
  trail: {
    label: 'Trail',
    emoji: '⛰️',
    className: 'bg-lime-500/15 text-lime-300 ring-1 ring-lime-500/40',
  },
}

interface RaceListProps {
  races: Race[]
}

export function RaceList({ races }: RaceListProps) {
  if (races.length === 0) {
    return (
      <p className="rounded-xl border border-white/10 bg-white/5 p-6 text-zinc-400">
        Aucune course enregistrée pour le moment.
      </p>
    )
  }

  return (
    <ul className="space-y-3">
      {races.map((race) => {
        const typeCfg = TYPE_CONFIG[race.type]
        const dateLabel = parseDate(race.date).toLocaleDateString('fr-FR', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })

        return (
          <li
            key={race.id}
            className="rounded-xl border border-white/8 bg-white/[0.02] px-5 py-4 text-left transition hover:bg-white/[0.04]"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${typeCfg.className}`}
                  >
                    <span aria-hidden>{typeCfg.emoji}</span>
                    {typeCfg.label}
                  </span>
                  <span className="text-sm text-zinc-500">{dateLabel}</span>
                </div>
                <h2
                  className="mt-2 font-display text-xl font-semibold text-white"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {race.name}
                </h2>
              </div>

              {race.position && (
                <div className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-center">
                  <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-500">
                    Classement
                  </p>
                  <p className="mt-0.5 text-lg font-semibold tabular-nums text-white">
                    {race.position}
                  </p>
                </div>
              )}
            </div>

            <dl className="mt-4 grid grid-cols-3 gap-3">
              <div>
                <dt className="text-xs text-zinc-500">Distance</dt>
                <dd className="mt-0.5 text-sm font-medium tabular-nums text-zinc-200">
                  {formatDistanceKm(race.distanceKm)}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-zinc-500">Temps</dt>
                <dd className="mt-0.5 text-sm font-medium tabular-nums text-zinc-200">
                  {formatDuration(race.durationSeconds)}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-zinc-500">Dénivelé</dt>
                <dd className="mt-0.5 text-sm font-medium tabular-nums text-zinc-200">
                  {race.elevationM != null ? formatElevation(race.elevationM) : '—'}
                </dd>
              </div>
            </dl>
          </li>
        )
      })}
    </ul>
  )
}
