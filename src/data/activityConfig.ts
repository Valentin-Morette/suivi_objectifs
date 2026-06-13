import type { ActivityType } from '../types/goal'

export const ACTIVITY_CONFIG: Record<
  ActivityType,
  { label: string; emoji: string; bg: string; border: string; text: string }
> = {
  badminton: {
    label: 'Badminton',
    emoji: '🏸',
    bg: 'bg-teal-500/15',
    border: 'border-teal-500/40',
    text: 'text-teal-300',
  },
  muscu: {
    label: 'Musculation',
    emoji: '💪',
    bg: 'bg-violet-500/15',
    border: 'border-violet-500/40',
    text: 'text-violet-300',
  },
  course: {
    label: 'Course',
    emoji: '🏃',
    bg: 'bg-amber-500/15',
    border: 'border-amber-500/40',
    text: 'text-amber-300',
  },
  velo: {
    label: 'Vélo',
    emoji: '🚴',
    bg: 'bg-cyan-500/15',
    border: 'border-cyan-500/40',
    text: 'text-cyan-300',
  },
}
