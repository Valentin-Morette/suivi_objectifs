import { useCallback, useEffect, useState } from 'react'
import { fetchSportGoal } from '../api/goals'
import { ApiError } from '../api/client'
import type { Goal } from '../types/goal'

interface UseSportGoalResult {
  goal: Goal | null
  loading: boolean
  error: string | null
  reload: () => void
}

export function useSportGoal(): UseSportGoalResult {
  const [goal, setGoal] = useState<Goal | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchSportGoal()
      setGoal(data)
    } catch (e) {
      if (e instanceof ApiError) {
        setError(
          e.status === 503
            ? `${e.message} — MySQL est-il démarré (MAMP) ? Vérifiez DB_HOST et DB_PORT dans .env.`
            : e.message,
        )
      } else {
        setError('Impossible de charger les données (API ou réseau)')
      }
      setGoal(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  return { goal, loading, error, reload: load }
}
