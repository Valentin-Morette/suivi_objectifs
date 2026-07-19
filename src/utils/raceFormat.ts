/** Formate des secondes en "1h 32min 05s" ou "45min 12s" */
export function formatDuration(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600)
  const m = Math.floor((totalSeconds % 3600) / 60)
  const s = totalSeconds % 60

  const parts: string[] = []
  if (h > 0) parts.push(`${h}h`)
  parts.push(`${m.toString().padStart(h > 0 ? 2 : 1, '0')}min`)
  parts.push(`${s.toString().padStart(2, '0')}s`)
  return parts.join(' ')
}

export function formatDistanceKm(km: number): string {
  return `${km.toLocaleString('fr-FR', { maximumFractionDigits: 2 })} km`
}

export function formatElevation(meters: number): string {
  return `+${meters.toLocaleString('fr-FR')} m`
}

/** Parse "58/100" → 58 (percentile). Retourne null si format invalide. */
export function parseTopPercent(position?: string): number | null {
  if (!position) return null
  const match = position.trim().match(/^(\d+)\s*\/\s*(\d+)$/)
  if (!match) return null
  const rank = Number.parseInt(match[1], 10)
  const total = Number.parseInt(match[2], 10)
  if (total < 1 || rank < 1) return null
  return Math.min(100, Math.round((rank / total) * 100))
}

export function topPercentColorClass(percent: number): string {
  if (percent <= 25) return 'text-sky-400'
  if (percent <= 50) return 'text-emerald-400'
  if (percent <= 75) return 'text-orange-400'
  return 'text-red-400'
}
