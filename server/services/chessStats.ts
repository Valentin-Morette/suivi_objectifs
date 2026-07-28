import { config } from '../config.js'

export type ChessTimeClass = 'rapid' | 'blitz' | 'bullet'

export interface ChessRating {
  timeClass: ChessTimeClass
  label: string
  rating: number | null
  best: number | null
}

export interface ChessStats {
  username: string
  profileUrl: string
  ratings: ChessRating[]
  error?: string
}

interface ChessComGameStats {
  last?: { rating?: number }
  best?: { rating?: number }
}

interface ChessComStatsResponse {
  chess_rapid?: ChessComGameStats
  chess_blitz?: ChessComGameStats
  chess_bullet?: ChessComGameStats
}

const TIME_CLASSES: { key: keyof ChessComStatsResponse; timeClass: ChessTimeClass; label: string }[] =
  [
    { key: 'chess_rapid', timeClass: 'rapid', label: 'Rapid' },
    { key: 'chess_blitz', timeClass: 'blitz', label: 'Blitz' },
    { key: 'chess_bullet', timeClass: 'bullet', label: 'Bullet' },
  ]

export async function fetchChessStats(): Promise<ChessStats> {
  const username = config.chess.username.replace(/^@/, '').toLowerCase()
  const profileUrl = `https://www.chess.com/member/${username}`

  try {
    const res = await fetch(`https://api.chess.com/pub/player/${username}/stats`, {
      headers: {
        Accept: 'application/json',
        'User-Agent': 'suivi_objectifs/1.0 (personal dashboard)',
      },
    })

    if (!res.ok) {
      return {
        username,
        profileUrl,
        ratings: emptyRatings(),
        error:
          res.status === 404
            ? `Joueur « ${username} » introuvable`
            : `Chess.com API ${res.status}`,
      }
    }

    const data = (await res.json()) as ChessComStatsResponse

    return {
      username,
      profileUrl,
      ratings: TIME_CLASSES.map(({ key, timeClass, label }) => {
        const stats = data[key]
        return {
          timeClass,
          label,
          rating: stats?.last?.rating ?? null,
          best: stats?.best?.rating ?? null,
        }
      }),
    }
  } catch (err) {
    return {
      username,
      profileUrl,
      ratings: emptyRatings(),
      error: err instanceof Error ? err.message : 'Erreur Chess.com',
    }
  }
}

function emptyRatings(): ChessRating[] {
  return TIME_CLASSES.map(({ timeClass, label }) => ({
    timeClass,
    label,
    rating: null,
    best: null,
  }))
}
