import { useCallback, useEffect, useState } from 'react'
import { ApiError } from '../api/client'
import { fetchRaces } from '../api/races'
import type { Race } from '../types/race'

interface UseRacesResult {
  races: Race[]
  loading: boolean
  error: string | null
  reload: () => void
}

export function useRaces(): UseRacesResult {
  const [races, setRaces] = useState<Race[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchRaces()
      setRaces(data)
    } catch (e) {
      if (e instanceof ApiError) {
        setError(e.message)
      } else {
        setError('Impossible de charger les courses')
      }
      setRaces([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  return { races, loading, error, reload: load }
}
