import type { ChessStatsResponse } from '../types/stats'

interface ChessStatsCardProps {
  data: ChessStatsResponse
}

export function ChessStatsCard({ data }: ChessStatsCardProps) {
  return (
    <div className="rounded-xl border border-white/8 bg-white/[0.02] px-5 py-5 text-left">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-emerald-300">Chess.com</p>
          <p className="mt-1 text-xs text-zinc-500">{data.username}</p>
        </div>
        <a
          href={data.profileUrl}
          target="_blank"
          rel="noreferrer"
          className="text-xs text-zinc-400 underline-offset-2 hover:text-zinc-200 hover:underline"
        >
          Voir le profil
        </a>
      </div>

      {data.error ? (
        <p className="mt-4 text-sm text-amber-300/90">{data.error}</p>
      ) : (
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {data.ratings.map((r) => (
            <div
              key={r.timeClass}
              className="rounded-lg border border-white/6 bg-black/20 px-4 py-3"
            >
              <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                {r.label}
              </p>
              {r.rating != null ? (
                <>
                  <p className="mt-2 font-display text-3xl font-bold tabular-nums text-white">
                    {r.rating}
                  </p>
                  {r.best != null && (
                    <p className="mt-1 text-xs text-zinc-500">
                      record {r.best}
                    </p>
                  )}
                </>
              ) : (
                <p className="mt-2 text-sm text-zinc-500">—</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
