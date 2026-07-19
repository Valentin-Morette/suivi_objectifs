import type { Race } from '../types/race'
import { apiGet, apiPost } from './client'

export function fetchRaces(): Promise<Race[]> {
  return apiGet<Race[]>('/api/races')
}

export interface CreateRacePayload {
  type: 'course' | 'trail'
  name: string
  date: string
  durationSeconds: number
  distanceKm: number
  elevationM?: number
  position?: string
}

export function createRace(payload: CreateRacePayload): Promise<Race> {
  return apiPost<Race>('/api/races', payload)
}
