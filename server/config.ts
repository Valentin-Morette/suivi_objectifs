import './loadEnv.js'

function required(name: string): string {
  const value = process.env[name]
  if (!value) {
    throw new Error(`Variable d'environnement manquante : ${name}`)
  }
  return value
}

export const config = {
  port: Number(process.env.PORT ?? 3001),
  db: {
    host: process.env.DB_HOST ?? '127.0.0.1',
    port: Number(process.env.DB_PORT ?? 3306),
    user: required('DB_USER'),
    password: process.env.DB_PASSWORD ?? '',
    database: required('DB_NAME'),
    connectTimeoutMs: Number(process.env.DB_CONNECT_TIMEOUT_MS ?? 5000),
  },
  social: {
    youtubeApiKey: (process.env.YOUTUBE_API_KEY ?? '').trim(),
    youtubeHandle: (process.env.YOUTUBE_HANDLE ?? 'birious_3D').trim().replace(/^@/, ''),
    tiktokHandle: (process.env.TIKTOK_HANDLE ?? 'birious_3D').trim().replace(/^@/, ''),
  },
  chess: {
    username: (process.env.CHESS_USERNAME ?? 'birious').trim().replace(/^@/, ''),
  },
}
