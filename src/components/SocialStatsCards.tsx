import type { PlatformStat } from '../types/stats'
import logoTiktok from '../assets/logo-tiktok-white.png'
import logoYoutube from '../assets/logo-youtube.png'

const PLATFORM_UI: Record<
  PlatformStat['platform'],
  { label: string; logo: string; accent: string }
> = {
  youtube: {
    label: 'YouTube',
    logo: logoYoutube,
    accent: 'text-red-400',
  },
  tiktok: {
    label: 'TikTok',
    logo: logoTiktok,
    accent: 'text-cyan-300',
  },
}

function formatCount(n: number): string {
  return n.toLocaleString('fr-FR')
}

interface SocialStatsCardsProps {
  platforms: PlatformStat[]
}

export function SocialStatsCards({ platforms }: SocialStatsCardsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {platforms.map((p) => {
        const ui = PLATFORM_UI[p.platform]
        return (
          <a
            key={p.platform}
            href={p.profileUrl}
            target="_blank"
            rel="noreferrer"
            className="rounded-xl border border-white/8 bg-white/[0.02] px-5 py-5 text-left transition hover:bg-white/[0.04]"
          >
            <div className="flex items-center gap-2">
              <img
                src={ui.logo}
                alt=""
                aria-hidden
                className="h-5 w-5 object-contain"
              />
              <span className={`text-sm font-medium ${ui.accent}`}>{ui.label}</span>
            </div>
            <p className="mt-1 text-xs text-zinc-500">@{p.handle}</p>

            {p.followers != null ? (
              <>
                <p className="mt-4 font-display text-4xl font-bold tabular-nums text-white">
                  {formatCount(p.followers)}
                </p>
                <p className="mt-1 text-sm text-zinc-500">abonnés</p>
              </>
            ) : (
              <p className="mt-4 text-sm text-amber-300/90">
                {p.error ?? 'Donnée indisponible'}
              </p>
            )}
          </a>
        )
      })}
    </div>
  )
}
