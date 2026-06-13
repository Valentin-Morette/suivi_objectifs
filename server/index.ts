import cors from 'cors'
import express from 'express'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { config } from './config.js'
import { getDbErrorMessage } from './db/dbErrors.js'
import { pingDatabase } from './db/pool.js'
import { goalsRouter } from './routes/goals.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const distPath = path.resolve(__dirname, '../dist')
const distIndex = path.join(distPath, 'index.html')
const serveFrontend = fs.existsSync(distIndex)

const app = express()

app.use(cors())
app.use(express.json())

app.get('/api/health', async (_req, res) => {
  try {
    await pingDatabase()
    res.json({ ok: true, db: 'connected' })
  } catch (err) {
    const hint = getDbErrorMessage(err)
    res.status(503).json({
      ok: false,
      db: 'error',
      error: hint ?? 'Base de données inaccessible',
    })
  }
})

app.use('/api/goals', goalsRouter)

if (serveFrontend) {
  app.use(express.static(distPath))
  app.get(/^(?!\/api).*/, (_req, res) => {
    res.sendFile(distIndex)
  })
} else {
  console.warn('Dossier dist/ absent — lancez npm run build pour servir le site')
}

app.use(
  (
    err: unknown,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction,
  ) => {
    console.error(err)
    const hint = getDbErrorMessage(err)
    res.status(hint ? 503 : 500).json({
      error: hint ?? 'Erreur serveur',
    })
  },
)

async function start() {
  const { host, port, database } = config.db
  console.log(`MySQL → ${host}:${port}/${database}`)

  try {
    await pingDatabase()
    console.log('MySQL connecté')
  } catch (err) {
    const hint = getDbErrorMessage(err)
    console.error(hint ?? err)
    console.error('L’API démarre quand même ; corrigez .env puis relancez')
  }

  const listenHost = '0.0.0.0'
  app.listen(config.port, listenHost, () => {
    console.log(
      serveFrontend
        ? `App → http://<IP_DU_VPS>:${config.port}`
        : `API seule → http://<IP_DU_VPS>:${config.port} (npm run build manquant)`,
    )
  })
}

void start()
