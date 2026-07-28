import type { ResultSetHeader } from 'mysql2'
import { pool } from './pool.js'

export type SocialPlatform = 'youtube' | 'tiktok'

export interface InsertSocialStatInput {
  platform: SocialPlatform
  handle: string
  followers: number
  recordedOn: string // YYYY-MM-DD
}

/** Insert une ligne du jour. Ignore si (platform, recorded_on) existe déjà. */
export async function insertSocialStatIfAbsent(
  input: InsertSocialStatInput,
): Promise<'inserted' | 'already_exists'> {
  const [result] = await pool.query<ResultSetHeader>(
    `INSERT IGNORE INTO social_stats (platform, handle, followers, recorded_on)
     VALUES (?, ?, ?, ?)`,
    [input.platform, input.handle, input.followers, input.recordedOn],
  )
  return result.affectedRows > 0 ? 'inserted' : 'already_exists'
}
