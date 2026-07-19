import { Router } from 'express'
import { createRace, findAllRaces } from '../db/racesRepository.js'
import { toRaceDto } from '../mappers/raceMapper.js'

const RACE_TYPES = ['course', 'trail'] as const

export const racesRouter = Router()

racesRouter.get('/', async (_req, res, next) => {
  try {
    const races = await findAllRaces()
    res.json(races.map(toRaceDto))
  } catch (error) {
    next(error)
  }
})

racesRouter.post('/', async (req, res, next) => {
  try {
    const {
      type,
      name,
      date,
      durationSeconds,
      distanceKm,
      elevationM,
      position,
    } = req.body as {
      type?: string
      name?: string
      date?: string
      durationSeconds?: number
      distanceKm?: number
      elevationM?: number | null
      position?: string | null
    }

    if (!type || !RACE_TYPES.includes(type as (typeof RACE_TYPES)[number])) {
      res.status(400).json({ error: 'type invalide (course ou trail)' })
      return
    }

    if (!name || !name.trim()) {
      res.status(400).json({ error: 'nom requis' })
      return
    }

    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      res.status(400).json({ error: 'date invalide (format YYYY-MM-DD attendu)' })
      return
    }

    if (
      typeof durationSeconds !== 'number' ||
      !Number.isInteger(durationSeconds) ||
      durationSeconds < 1
    ) {
      res.status(400).json({ error: 'durée invalide' })
      return
    }

    if (typeof distanceKm !== 'number' || !(distanceKm > 0)) {
      res.status(400).json({ error: 'distance invalide' })
      return
    }

    if (
      elevationM != null &&
      (typeof elevationM !== 'number' || !Number.isInteger(elevationM) || elevationM < 0)
    ) {
      res.status(400).json({ error: 'dénivelé invalide' })
      return
    }

    const id = await createRace({
      type: type as 'course' | 'trail',
      name: name.trim(),
      date,
      durationSeconds,
      distanceKm,
      elevationM: elevationM ?? null,
      position: position?.trim() || null,
    })

    res.status(201).json({
      id,
      type,
      name: name.trim(),
      date,
      durationSeconds,
      distanceKm,
      elevationM: elevationM ?? undefined,
      position: position?.trim() || undefined,
    })
  } catch (error) {
    next(error)
  }
})
