export type ActivityType = 'badminton' | 'muscu' | 'course' | 'velo'

export interface Session {
  id: number
  date: string
  activity: ActivityType
  note?: string
}

export interface Goal {
  id: string
  label: string
  description?: string
  targetPerWeek: number
  unit: string
  sessions: Session[]
}

export interface WeekSummary {
  weekKey: string
  weekStart: Date
  weekEnd: Date
  label: string
  isCurrent: boolean
  sessions: Session[]
  completed: number
  target: number
}
