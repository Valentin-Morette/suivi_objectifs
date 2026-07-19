export interface GoalRow {
  id: string
  label: string
  description: string | null
  target_per_week: number
  unit: string
}

export interface SessionRow {
  id: number
  goal_id: string
  date: string
  activity: string
  note: string | null
}

export interface RaceRow {
  id: number
  type: 'course' | 'trail'
  name: string
  date: string
  duration_seconds: number
  distance_km: number | string
  elevation_m: number | null
  position: string | null
}
