import { Router } from 'express'
import { fetchChessStats } from '../services/chessStats.js'
import { fetchSocialStats } from '../services/socialStats.js'

export const statsRouter = Router()

statsRouter.get('/social', async (_req, res, next) => {
  try {
    const platforms = await fetchSocialStats()
    res.json({ platforms, fetchedAt: new Date().toISOString() })
  } catch (error) {
    next(error)
  }
})

statsRouter.get('/chess', async (_req, res, next) => {
  try {
    const chess = await fetchChessStats()
    res.json({ ...chess, fetchedAt: new Date().toISOString() })
  } catch (error) {
    next(error)
  }
})
