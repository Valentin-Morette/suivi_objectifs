import { ACTIVITY_CONFIG, KM_ACTIVITIES } from '../data/activityConfig'
import type { ActivityType, Session } from '../types/goal'
import { parseDate } from './week'

/** Extrait les km d'une note : "5,5km", "5.5 km", "3,94km"… */
export function parseKmFromNote(note?: string): number | null {
  if (!note) return null
  const match = note.match(/(\d+(?:[.,]\d+)?)\s*km/i)
  if (!match) return null
  const value = Number.parseFloat(match[1].replace(',', '.'))
  return Number.isFinite(value) ? value : null
}

export function formatKm(value: number): string {
  const rounded = Math.round(value * 100) / 100
  return `${rounded.toLocaleString('fr-FR', { maximumFractionDigits: 2 })} km`
}

export interface ActivityKmStats {
  total: number
  fromNotes: number
}

export interface GlobalStats {
  totalSessions: number
  statsSince: string | null
  statsSinceLabel: string | null
  byActivity: Record<ActivityType, number>
  kmByActivity: Partial<Record<ActivityType, ActivityKmStats>>
}

export function buildGlobalStats(sessions: Session[]): GlobalStats {
  const byActivity = Object.fromEntries(
    (Object.keys(ACTIVITY_CONFIG) as ActivityType[]).map((k) => [k, 0]),
  ) as Record<ActivityType, number>

  const kmByActivity: Partial<Record<ActivityType, ActivityKmStats>> = {}
  for (const key of KM_ACTIVITIES) {
    kmByActivity[key] = { total: 0, fromNotes: 0 }
  }

  for (const session of sessions) {
    byActivity[session.activity]++
    if (KM_ACTIVITIES.includes(session.activity)) {
      const km = parseKmFromNote(session.note)
      if (km !== null) {
        const bucket = kmByActivity[session.activity]!
        bucket.total += km
        bucket.fromNotes++
      }
    }
  }

  const sorted = [...sessions].sort((a, b) => a.date.localeCompare(b.date))
  const statsSince = sorted[0]?.date ?? null
  const statsSinceLabel = statsSince
    ? parseDate(statsSince).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : null

  return {
    totalSessions: sessions.length,
    statsSince,
    statsSinceLabel,
    byActivity,
    kmByActivity,
  }
}
