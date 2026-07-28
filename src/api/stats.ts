import type { ChessStatsResponse, SocialStatsResponse } from '../types/stats'
import { apiGet } from './client'

export function fetchSocialStats(): Promise<SocialStatsResponse> {
  return apiGet<SocialStatsResponse>('/api/stats/social')
}

export function fetchChessStats(): Promise<ChessStatsResponse> {
  return apiGet<ChessStatsResponse>('/api/stats/chess')
}
