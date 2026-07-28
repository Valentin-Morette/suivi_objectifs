/**
 * Snapshot quotidien des abonnés YouTube + TikTok.
 * Usage : npm run stats:snapshot
 * Cron  : 0 4 * * * cd /chemin/suivi_objectifs && npm run stats:snapshot >> logs/social-snapshot.log 2>&1
 */
import { insertSocialStatIfAbsent } from '../server/db/socialStatsRepository.js'
import { pool } from '../server/db/pool.js'
import { fetchSocialStats } from '../server/services/socialStats.js'

function todayISODate(timeZone = process.env.TZ || 'Europe/Paris'): string {
  // en-CA → YYYY-MM-DD
  return new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date())
}

async function main() {
  const recordedOn = todayISODate()
  console.log(`[social-snapshot] ${new Date().toISOString()} — jour ${recordedOn}`)

  const platforms = await fetchSocialStats()
  let inserted = 0
  let skipped = 0
  let failed = 0

  for (const stat of platforms) {
    if (stat.followers == null) {
      console.error(`[social-snapshot] ${stat.platform}: échec — ${stat.error ?? 'followers null'}`)
      failed++
      continue
    }

    try {
      const result = await insertSocialStatIfAbsent({
        platform: stat.platform,
        handle: stat.handle,
        followers: stat.followers,
        recordedOn,
      })

      if (result === 'inserted') {
        console.log(
          `[social-snapshot] ${stat.platform}: ${stat.followers} abonnés → enregistré`,
        )
        inserted++
      } else {
        console.log(
          `[social-snapshot] ${stat.platform}: déjà une ligne pour ${recordedOn} — ignoré`,
        )
        skipped++
      }
    } catch (err) {
      console.error(`[social-snapshot] ${stat.platform}: erreur BDD`, err)
      failed++
    }
  }

  console.log(
    `[social-snapshot] terminé — insertés=${inserted} ignorés=${skipped} échecs=${failed}`,
  )

  await pool.end()
  process.exit(failed > 0 && inserted === 0 ? 1 : 0)
}

main().catch(async (err) => {
  console.error('[social-snapshot] crash', err)
  try {
    await pool.end()
  } catch {
    /* ignore */
  }
  process.exit(1)
})
