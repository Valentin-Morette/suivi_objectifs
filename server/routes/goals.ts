import { Router } from 'express'
import {
  createSession,
  deleteSession,
  findGoalById,
  findSessionsByGoalId,
} from '../db/goalsRepository.js'
import { toGoalDto } from '../mappers/goalMapper.js'

const ACTIVITIES = ['badminton', 'muscu', 'course', 'velo', 'renforcement', 'natation'] as const

export const goalsRouter = Router()

goalsRouter.get('/:goalId', async (req, res, next) => {
  try {
    const { goalId } = req.params
    const goal = await findGoalById(goalId)

    if (!goal) {
      res.status(404).json({ error: 'Objectif introuvable' })
      return
    }

    const sessions = await findSessionsByGoalId(goalId)
    res.json(toGoalDto(goal, sessions))
  } catch (error) {
    next(error)
  }
})

goalsRouter.post('/:goalId/sessions', async (req, res, next) => {
  try {
    const { goalId } = req.params
    const goal = await findGoalById(goalId)

    if (!goal) {
      res.status(404).json({ error: 'Objectif introuvable' })
      return
    }

    const { date, activity, note } = req.body as {
      date?: string
      activity?: string
      note?: string
    }

    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      res.status(400).json({ error: 'date invalide (format YYYY-MM-DD attendu)' })
      return
    }

    if (!activity || !ACTIVITIES.includes(activity as (typeof ACTIVITIES)[number])) {
      res.status(400).json({ error: 'activity invalide' })
      return
    }

    const id = await createSession({
      goalId,
      date,
      activity,
      note: note ?? null,
    })

    res.status(201).json({ id, goalId, date, activity, note })
  } catch (error) {
    next(error)
  }
})

goalsRouter.delete('/:goalId/sessions/:sessionId', async (req, res, next) => {
  try {
    const { goalId, sessionId } = req.params
    const id = Number.parseInt(sessionId, 10)

    if (!Number.isInteger(id) || id < 1) {
      res.status(400).json({ error: 'id de séance invalide' })
      return
    }

    const deleted = await deleteSession(id, goalId)

    if (!deleted) {
      res.status(404).json({ error: 'Séance introuvable' })
      return
    }

    res.status(204).send()
  } catch (error) {
    next(error)
  }
})
