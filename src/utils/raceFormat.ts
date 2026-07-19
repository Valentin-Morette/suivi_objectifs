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
