import type { WeekSummary } from '../types/goal'

export function isWeekSucceeded(week: WeekSummary): boolean {
  return week.completed >= week.target
}

export function isWeekOver(week: WeekSummary, now: Date = new Date()): boolean {
  return now > week.weekEnd
}

export function isWeekFailed(week: WeekSummary, now: Date = new Date()): boolean {
  if (week.isCurrent) {
    return isWeekOver(week, now) && !isWeekSucceeded(week)
  }
  return !isWeekSucceeded(week)
}
