export type RaceType = 'course' | 'trail'

export interface Race {
  id: number
  type: RaceType
  name: string
  date: string
  durationSeconds: number
  distanceKm: number
  elevationM?: number
  position?: string
}
