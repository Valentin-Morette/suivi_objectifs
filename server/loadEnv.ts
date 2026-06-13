import { config as loadDotenv } from 'dotenv'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const serverDir = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.resolve(serverDir, '..')

loadDotenv({ path: path.join(projectRoot, '.env') })
