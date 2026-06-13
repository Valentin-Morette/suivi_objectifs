interface ProgressRingProps {
  completed: number
  target: number
  size?: number
}

export function ProgressRing({ completed, target, size = 120 }: ProgressRingProps) {
  const stroke = 8
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const ratio = Math.min(completed / target, 1)
  const offset = circumference * (1 - ratio)
  const done = completed >= target

  return (
    <div className="relative inline-flex" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={stroke}
          className="text-white/8"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={`transition-all duration-700 ${
            done ? 'text-emerald-400' : 'text-indigo-400'
          }`}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-3xl font-bold tabular-nums text-white">
          {completed}
        </span>
        <span className="text-xs text-zinc-500">/ {target}</span>
      </div>
    </div>
  )
}
