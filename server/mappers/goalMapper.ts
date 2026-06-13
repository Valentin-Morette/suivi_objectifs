import type { GoalRow, SessionRow } from '../db/types.js'

export interface GoalDto {
  id: string
  label: string
  description?: string
  targetPerWeek: number
  unit: string
  sessions: SessionDto[]
}

export interface SessionDto {
  id: number
  date: string
  activity: string
  note?: string
}

export function toGoalDto(goal: GoalRow, sessions: SessionRow[]): GoalDto {
  return {
    id: goal.id,
    label: goal.label,
    description: goal.description ?? undefined,
    targetPerWeek: goal.target_per_week,
    unit: goal.unit,
    sessions: sessions.map(toSessionDto),
  }
}

export function toSessionDto(row: SessionRow): SessionDto {
  return {
    id: row.id,
    date: row.date,
    activity: row.activity,
    note: row.note ?? undefined,
  }
}
