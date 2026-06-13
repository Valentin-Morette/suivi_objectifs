import { Link } from 'react-router-dom'
import { CurrentWeekCard } from '../components/CurrentWeekCard'
import { GlobalStatsCard } from '../components/GlobalStatsCard'
import { WeekHistoryTable } from '../components/WeekHistoryTable'
import { useSportGoal } from '../hooks/useSportGoal'
import { buildWeekSummariesForGoal } from '../utils/week'

export function DashboardPage() {
  const { goal, loading, error, reload } = useSportGoal()

  const weeks = goal ? buildWeekSummariesForGoal(goal) : []
  const currentWeek = weeks.find((w) => w.isCurrent)

  return (
    <>
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4 text-left">
        <div>
          <h1
            className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Tableau de bord
          </h1>
          <p className="mt-2 text-sm text-zinc-400">Objectif sport — 3 séances par semaine</p>
        </div>
        <Link
          to="/ajouter"
          className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-indigo-950/50 transition hover:bg-indigo-500"
        >
          + Ajouter une séance
        </Link>
      </header>

      {loading && (
        <p className="rounded-xl border border-white/10 bg-white/5 p-6 text-zinc-400">
          Chargement…
        </p>
      )}

      {!loading && error && (
        <div className="rounded-xl border border-red-500/30 bg-red-950/30 p-6 text-left">
          <p className="font-medium text-red-300">{error}</p>
          <button
            type="button"
            onClick={() => void reload()}
            className="mt-4 rounded-lg bg-white/10 px-4 py-2 text-sm text-white hover:bg-white/15"
          >
            Réessayer
          </button>
        </div>
      )}

      {!loading && !error && goal && (
        <>
          {currentWeek ? (
            <CurrentWeekCard goal={goal} week={currentWeek} />
          ) : (
            <p className="rounded-xl border border-white/10 bg-white/5 p-6 text-zinc-400">
              Aucune donnée pour la semaine en cours.
            </p>
          )}

          <GlobalStatsCard sessions={goal.sessions} />

          <WeekHistoryTable weeks={weeks} />
        </>
      )}
    </>
  )
}
