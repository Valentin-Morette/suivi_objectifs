import { useCallback, useEffect, useState } from 'react'
import { ApiError } from '../api/client'
import { fetchChessStats, fetchSocialStats } from '../api/stats'
import type { ChessStatsResponse, SocialStatsResponse } from '../types/stats'

interface UseStatsPageResult {
  social: SocialStatsResponse | null
  chess: ChessStatsResponse | null
  loading: boolean
  error: string | null
  reload: () => void
}

export function useStatsPage(): UseStatsPageResult {
  const [social, setSocial] = useState<SocialStatsResponse | null>(null)
  const [chess, setChess] = useState<ChessStatsResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [socialData, chessData] = await Promise.all([
        fetchSocialStats(),
        fetchChessStats(),
      ])
      setSocial(socialData)
      setChess(chessData)
    } catch (e) {
      if (e instanceof ApiError) {
        setError(e.message)
      } else {
        setError('Impossible de charger les statistiques')
      }
      setSocial(null)
      setChess(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  return { social, chess, loading, error, reload: load }
}
