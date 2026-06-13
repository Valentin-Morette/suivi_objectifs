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
