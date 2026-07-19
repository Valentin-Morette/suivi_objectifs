import type { ResultSetHeader, RowDataPacket } from 'mysql2'
import { pool } from './pool.js'
import type { RaceRow } from './types.js'

export async function findAllRaces(): Promise<RaceRow[]> {
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT id, type, name, \`date\`, duration_seconds, distance_km,
            elevation_m, position
     FROM races
     ORDER BY \`date\` DESC, id DESC`,
  )
  return rows as RaceRow[]
}

export interface CreateRaceInput {
  type: 'course' | 'trail'
  name: string
  date: string
  durationSeconds: number
  distanceKm: number
  elevationM?: number | null
  position?: string | null
}

export async function createRace(input: CreateRaceInput): Promise<number> {
  const [result] = await pool.query<ResultSetHeader>(
    `INSERT INTO races (type, name, \`date\`, duration_seconds, distance_km, elevation_m, position)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      input.type,
      input.name,
      input.date,
      input.durationSeconds,
      input.distanceKm,
      input.elevationM ?? null,
      input.position ?? null,
    ],
  )
  return result.insertId
}
