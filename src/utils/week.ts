import type { Goal, Session, WeekSummary } from '../types/goal'

const DAY_MS = 24 * 60 * 60 * 1000

export function startOfWeek(date: Date): Date {
  const d = new Date(date)
  const day = d.getDay()
  const diff = day === 0 ? -6 : 1 - day
  d.setDate(d.getDate() + diff)
  d.setHours(0, 0, 0, 0)
  return d
}

export function endOfWeek(weekStart: Date): Date {
  const d = new Date(weekStart)
  d.setDate(d.getDate() + 6)
  d.setHours(23, 59, 59, 999)
  return d
}

export function weekKey(date: Date): string {
  const start = startOfWeek(date)
  return start.toISOString().slice(0, 10)
}

export function formatWeekLabel(weekStart: Date, weekEnd: Date): string {
  const opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' }
  const start = weekStart.toLocaleDateString('fr-FR', opts)
  const end = weekEnd.toLocaleDateString('fr-FR', {
    ...opts,
    year: weekStart.getFullYear() !== weekEnd.getFullYear() ? 'numeric' : undefined,
  })
  return `${start} – ${end}`
}

export function parseDate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function isSameWeek(a: Date, b: Date): boolean {
  return weekKey(a) === weekKey(b)
}

export function groupSessionsByWeek(
  sessions: Session[],
  target: number,
  referenceDate: Date = new Date(),
): WeekSummary[] {
  const currentKey = weekKey(referenceDate)
  const map = new Map<string, Session[]>()

  for (const session of sessions) {
    const key = weekKey(parseDate(session.date))
    const list = map.get(key) ?? []
    list.push(session)
    map.set(key, list)
  }

  const summaries: WeekSummary[] = []

  for (const [key, weekSessions] of map) {
    const weekStart = parseDate(key)
    const weekEnd = endOfWeek(weekStart)
    weekSessions.sort(
      (a, b) => parseDate(a.date).getTime() - parseDate(b.date).getTime(),
    )

    summaries.push({
      weekKey: key,
      weekStart,
      weekEnd,
      label: formatWeekLabel(weekStart, weekEnd),
      isCurrent: key === currentKey,
      sessions: weekSessions,
      completed: weekSessions.length,
      target,
    })
  }

  summaries.sort((a, b) => b.weekStart.getTime() - a.weekStart.getTime())
  return summaries
}

export function buildWeekSummariesForGoal(
  goal: Goal,
  referenceDate: Date = new Date(),
): WeekSummary[] {
  return groupSessionsByWeek(goal.sessions, goal.targetPerWeek, referenceDate)
}

export function daysLeftInWeek(referenceDate: Date = new Date()): number {
  const end = endOfWeek(startOfWeek(referenceDate))
  return Math.max(0, Math.ceil((end.getTime() - referenceDate.getTime()) / DAY_MS))
}
