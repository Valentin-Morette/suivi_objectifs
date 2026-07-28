export interface PlatformStat {
  platform: 'youtube' | 'tiktok'
  handle: string
  followers: number | null
  profileUrl: string
  error?: string
}

export interface SocialStatsResponse {
  platforms: PlatformStat[]
  fetchedAt: string
}

export type ChessTimeClass = 'rapid' | 'blitz' | 'bullet'

export interface ChessRating {
  timeClass: ChessTimeClass
  label: string
  rating: number | null
  best: number | null
}

export interface ChessStatsResponse {
  username: string
  profileUrl: string
  ratings: ChessRating[]
  fetchedAt: string
  error?: string
}
