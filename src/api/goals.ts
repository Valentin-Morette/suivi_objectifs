import type { ActivityType, Goal, Session } from '../types/goal'
import { apiDelete, apiGet, apiPost } from './client'

const SPORT_GOAL_ID = 'sport'

export function fetchSportGoal(): Promise<Goal> {
  return apiGet<Goal>(`/api/goals/${SPORT_GOAL_ID}`)
}

export interface CreateSessionPayload {
  date: string
  activity: ActivityType
  note?: string
}

export function createSportSession(payload: CreateSessionPayload): Promise<Session> {
  return apiPost<Session>(`/api/goals/${SPORT_GOAL_ID}/sessions`, payload)
}

export function deleteSportSession(sessionId: number): Promise<void> {
  return apiDelete(`/api/goals/${SPORT_GOAL_ID}/sessions/${sessionId}`)
}
