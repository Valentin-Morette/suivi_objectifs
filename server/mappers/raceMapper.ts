import type { RaceRow } from '../db/types.js'

export interface RaceDto {
  id: number
  type: 'course' | 'trail'
  name: string
  date: string
  durationSeconds: number
  distanceKm: number
  elevationM?: number
  position?: string
}

export function toRaceDto(row: RaceRow): RaceDto {
  return {
    id: row.id,
    type: row.type,
    name: row.name,
    date: row.date,
    durationSeconds: row.duration_seconds,
    distanceKm: Number(row.distance_km),
    elevationM: row.elevation_m ?? undefined,
    position: row.position ?? undefined,
  }
}
