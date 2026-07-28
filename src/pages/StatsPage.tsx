import { ChessStatsCard } from '../components/ChessStatsCard'
import { SocialStatsCards } from '../components/SocialStatsCards'
import { useStatsPage } from '../hooks/useStatsPage'

export function StatsPage() {
  const { social, chess, loading, error, reload } = useStatsPage()

  const fetchedAt = social?.fetchedAt ?? chess?.fetchedAt
  const fetchedLabel = fetchedAt
    ? new Date(fetchedAt).toLocaleString('fr-FR', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      })
    : null

  return (
    <>
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4 text-left">
        <div>
          <h1
            className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Statistiques
          </h1>
          <p className="mt-2 text-sm text-zinc-400">
            Réseaux & Chess.com
            {fetchedLabel && <> · mis à jour {fetchedLabel}</>}
          </p>
        </div>
        <button
          type="button"
          onClick={() => void reload()}
          disabled={loading}
          className="rounded-xl border border-white/10 px-4 py-2.5 text-sm font-medium text-zinc-300 transition hover:bg-white/5 disabled:opacity-50"
        >
          Actualiser
        </button>
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

      {!loading && !error && (
        <div className="space-y-10">
          {social && (
            <section>
              <h2 className="mb-4 text-left text-sm font-medium uppercase tracking-wide text-zinc-500">
                Réseaux
              </h2>
              <SocialStatsCards platforms={social.platforms} />
            </section>
          )}

          {chess && (
            <section>
              <h2 className="mb-4 text-left text-sm font-medium uppercase tracking-wide text-zinc-500">
                Chess.com
              </h2>
              <ChessStatsCard data={chess} />
            </section>
          )}
        </div>
      )}
    </>
  )
}
