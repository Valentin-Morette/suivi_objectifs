import type { ResultSetHeader, RowDataPacket } from 'mysql2'
import { pool } from './pool.js'
import type { GoalRow, SessionRow } from './types.js'

export async function findGoalById(goalId: string): Promise<GoalRow | null> {
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT id, label, description, target_per_week, unit
     FROM goals
     WHERE id = ?`,
    [goalId],
  )
  return (rows[0] as GoalRow | undefined) ?? null
}

export async function findSessionsByGoalId(goalId: string): Promise<SessionRow[]> {
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT id, goal_id, \`date\`, activity, note
     FROM sessions
     WHERE goal_id = ?
     ORDER BY \`date\` DESC`,
    [goalId],
  )
  return rows as SessionRow[]
}

export interface CreateSessionInput {
  goalId: string
  date: string
  activity: string
  note?: string | null
}

export async function createSession(input: CreateSessionInput): Promise<number> {
  const [result] = await pool.query<ResultSetHeader>(
    `INSERT INTO sessions (goal_id, \`date\`, activity, note)
     VALUES (?, ?, ?, ?)`,
    [input.goalId, input.date, input.activity, input.note ?? null],
  )
  return result.insertId
}

export async function deleteSession(sessionId: number, goalId: string): Promise<boolean> {
  const [result] = await pool.query<ResultSetHeader>(
    `DELETE FROM sessions WHERE id = ? AND goal_id = ?`,
    [sessionId, goalId],
  )
  return result.affectedRows > 0
}
