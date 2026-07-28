import { config } from '../config.js'

export interface PlatformStat {
  platform: 'youtube' | 'tiktok'
  handle: string
  followers: number | null
  profileUrl: string
  error?: string
}

export async function fetchYouTubeStats(): Promise<PlatformStat> {
  const handle = config.social.youtubeHandle.replace(/^@/, '')
  const profileUrl = `https://www.youtube.com/@${handle}`

  if (!config.social.youtubeApiKey) {
    return {
      platform: 'youtube',
      handle,
      followers: null,
      profileUrl,
      error: 'YOUTUBE_API_KEY manquante dans .env',
    }
  }

  const url = new URL('https://www.googleapis.com/youtube/v3/channels')
  url.searchParams.set('part', 'statistics')
  url.searchParams.set('forHandle', handle)
  url.searchParams.set('key', config.social.youtubeApiKey)

  const res = await fetch(url)
  if (!res.ok) {
    const body = await res.text()
    return {
      platform: 'youtube',
      handle,
      followers: null,
      profileUrl,
      error: `YouTube API ${res.status}: ${body.slice(0, 200)}`,
    }
  }

  const data = (await res.json()) as {
    items?: Array<{ statistics?: { subscriberCount?: string; hiddenSubscriberCount?: boolean } }>
  }
  const item = data.items?.[0]
  if (!item) {
    return {
      platform: 'youtube',
      handle,
      followers: null,
      profileUrl,
      error: `Chaîne @${handle} introuvable`,
    }
  }

  if (item.statistics?.hiddenSubscriberCount) {
    return {
      platform: 'youtube',
      handle,
      followers: null,
      profileUrl,
      error: 'Nombre d’abonnés masqué sur la chaîne',
    }
  }

  const count = Number.parseInt(item.statistics?.subscriberCount ?? '', 10)
  return {
    platform: 'youtube',
    handle,
    followers: Number.isFinite(count) ? count : null,
    profileUrl,
    error: Number.isFinite(count) ? undefined : 'Impossible de lire subscriberCount',
  }
}

export async function fetchTikTokStats(): Promise<PlatformStat> {
  const handle = config.social.tiktokHandle.replace(/^@/, '')
  const profileUrl = `https://www.tiktok.com/@${handle}`

  try {
    const res = await fetch(profileUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml',
      },
    })

    if (!res.ok) {
      return {
        platform: 'tiktok',
        handle,
        followers: null,
        profileUrl,
        error: `TikTok HTTP ${res.status}`,
      }
    }

    const html = await res.text()
    const match =
      html.match(/"followerCount"\s*:\s*"?(\d+)"?/) ??
      html.match(/followerCount\\?":\s*\\?"?(\d+)/)

    if (!match) {
      return {
        platform: 'tiktok',
        handle,
        followers: null,
        profileUrl,
        error: 'Impossible d’extraire le nombre d’abonnés (page TikTok changée ?)',
      }
    }

    return {
      platform: 'tiktok',
      handle,
      followers: Number.parseInt(match[1], 10),
      profileUrl,
    }
  } catch (err) {
    return {
      platform: 'tiktok',
      handle,
      followers: null,
      profileUrl,
      error: err instanceof Error ? err.message : 'Erreur TikTok',
    }
  }
}

export async function fetchSocialStats(): Promise<PlatformStat[]> {
  const [youtube, tiktok] = await Promise.all([
    fetchYouTubeStats(),
    fetchTikTokStats(),
  ])
  return [youtube, tiktok]
}
