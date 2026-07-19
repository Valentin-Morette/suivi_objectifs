import { Link } from 'react-router-dom'
import { RaceList } from '../components/RaceList'
import { useRaces } from '../hooks/useRaces'

export function RacesPage() {
  const { races, loading, error, reload } = useRaces()

  const courseCount = races.filter((r) => r.type === 'course').length
  const trailCount = races.filter((r) => r.type === 'trail').length

  return (
    <>
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4 text-left">
        <div>
          <h1
            className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Mes courses
          </h1>
          <p className="mt-2 text-sm text-zinc-400">
            Historique des courses et trails réalisés
          </p>
        </div>
        <Link
          to="/courses/ajouter"
          className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-indigo-950/50 transition hover:bg-indigo-500"
        >
          + Ajouter une course
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

      {!loading && !error && races.length > 0 && (
        <div className="mb-6 grid grid-cols-3 gap-px overflow-hidden rounded-xl border border-white/8 bg-white/5">
          <div className="bg-[#0c0f14] px-4 py-3 text-left">
            <p className="text-xs text-zinc-500">Total</p>
            <p className="mt-1 text-2xl font-semibold tabular-nums text-white">
              {races.length}
            </p>
          </div>
          <div className="bg-[#0c0f14] px-4 py-3 text-left">
            <p className="text-xs text-amber-300/80">🏃 Courses</p>
            <p className="mt-1 text-2xl font-semibold tabular-nums text-amber-300">
              {courseCount}
            </p>
          </div>
          <div className="bg-[#0c0f14] px-4 py-3 text-left">
            <p className="text-xs text-lime-300/80">⛰️ Trails</p>
            <p className="mt-1 text-2xl font-semibold tabular-nums text-lime-300">
              {trailCount}
            </p>
          </div>
        </div>
      )}

      {!loading && !error && <RaceList races={races} />}
    </>
  )
}
