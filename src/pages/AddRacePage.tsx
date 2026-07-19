import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ApiError } from '../api/client'
import { createRace } from '../api/races'
import type { RaceType } from '../types/race'
import { toISODateString } from '../utils/date'

const RACE_TYPES: {
  key: RaceType
  label: string
  emoji: string
  bg: string
  border: string
  text: string
}[] = [
  {
    key: 'course',
    label: 'Course',
    emoji: '🏃',
    bg: 'bg-amber-500/15',
    border: 'border-amber-500/40',
    text: 'text-amber-300',
  },
  {
    key: 'trail',
    label: 'Trail',
    emoji: '⛰️',
    bg: 'bg-lime-500/15',
    border: 'border-lime-500/40',
    text: 'text-lime-300',
  },
]

const inputClass =
  'mt-2 w-full rounded-lg border border-white/10 bg-[#0c0f14] px-3 py-2.5 text-white placeholder:text-zinc-600 outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/30'

function parseOptionalNumber(value: string): number | undefined {
  const trimmed = value.trim().replace(',', '.')
  if (!trimmed) return undefined
  const n = Number.parseFloat(trimmed)
  return Number.isFinite(n) ? n : undefined
}

export function AddRacePage() {
  const navigate = useNavigate()
  const [type, setType] = useState<RaceType>('course')
  const [name, setName] = useState('')
  const [date, setDate] = useState(toISODateString())
  const [hours, setHours] = useState('0')
  const [minutes, setMinutes] = useState('0')
  const [seconds, setSeconds] = useState('0')
  const [distanceKm, setDistanceKm] = useState('')
  const [elevationM, setElevationM] = useState('')
  const [position, setPosition] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    setSuccess(false)

    const h = Number.parseInt(hours, 10) || 0
    const m = Number.parseInt(minutes, 10) || 0
    const s = Number.parseInt(seconds, 10) || 0
    const durationSeconds = h * 3600 + m * 60 + s
    const km = parseOptionalNumber(distanceKm)
    const elev = parseOptionalNumber(elevationM)

    if (durationSeconds < 1) {
      setError('Indique un temps valide (au moins 1 seconde)')
      setSubmitting(false)
      return
    }

    if (km == null || km <= 0) {
      setError('Indique une distance en km')
      setSubmitting(false)
      return
    }

    if (elev != null && (elev < 0 || !Number.isInteger(elev))) {
      setError('Le dénivelé doit être un entier positif (mètres)')
      setSubmitting(false)
      return
    }

    try {
      await createRace({
        type,
        name: name.trim(),
        date,
        durationSeconds,
        distanceKm: km,
        elevationM: elev != null ? Math.round(elev) : undefined,
        position: position.trim() || undefined,
      })
      setSuccess(true)
      setTimeout(() => navigate('/courses'), 1200)
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message)
      } else {
        setError('Impossible d’enregistrer la course')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <header className="mb-8 text-left">
        <h1
          className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Ajouter une course
        </h1>
        <p className="mt-2 text-sm text-zinc-400">
          Course sur route ou trail — enregistrement en base.
        </p>
      </header>

      <form
        onSubmit={(e) => void handleSubmit(e)}
        className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:p-8"
      >
        <div className="space-y-6">
          <fieldset className="text-left">
            <legend className="text-sm font-medium text-zinc-300">Type</legend>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {RACE_TYPES.map((cfg) => {
                const selected = type === cfg.key
                return (
                  <label
                    key={cfg.key}
                    className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 transition ${
                      selected
                        ? `${cfg.bg} ${cfg.border} ring-2 ring-indigo-500/40`
                        : 'border-white/10 bg-white/[0.02] hover:border-white/20'
                    }`}
                  >
                    <input
                      type="radio"
                      name="raceType"
                      value={cfg.key}
                      checked={selected}
                      onChange={() => setType(cfg.key)}
                      className="sr-only"
                    />
                    <span className="text-xl" aria-hidden>
                      {cfg.emoji}
                    </span>
                    <span className={`font-medium ${selected ? cfg.text : 'text-zinc-300'}`}>
                      {cfg.label}
                    </span>
                  </label>
                )
              })}
            </div>
          </fieldset>

          <div className="text-left">
            <label htmlFor="race-name" className="block text-sm font-medium text-zinc-300">
              Nom
            </label>
            <input
              id="race-name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="ex. Semi de Lyon"
              maxLength={255}
              className={inputClass}
            />
          </div>

          <div className="text-left">
            <label htmlFor="race-date" className="block text-sm font-medium text-zinc-300">
              Date
            </label>
            <input
              id="race-date"
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={`input-date max-w-xs ${inputClass}`}
            />
          </div>

          <div className="text-left">
            <p className="text-sm font-medium text-zinc-300">Temps</p>
            <div className="mt-2 flex flex-wrap items-end gap-3">
              <div>
                <label htmlFor="hours" className="text-xs text-zinc-500">
                  Heures
                </label>
                <input
                  id="hours"
                  type="number"
                  min={0}
                  max={99}
                  value={hours}
                  onChange={(e) => setHours(e.target.value)}
                  className={`w-20 ${inputClass}`}
                />
              </div>
              <div>
                <label htmlFor="minutes" className="text-xs text-zinc-500">
                  Minutes
                </label>
                <input
                  id="minutes"
                  type="number"
                  min={0}
                  max={59}
                  value={minutes}
                  onChange={(e) => setMinutes(e.target.value)}
                  className={`w-20 ${inputClass}`}
                />
              </div>
              <div>
                <label htmlFor="seconds" className="text-xs text-zinc-500">
                  Secondes
                </label>
                <input
                  id="seconds"
                  type="number"
                  min={0}
                  max={59}
                  value={seconds}
                  onChange={(e) => setSeconds(e.target.value)}
                  className={`w-20 ${inputClass}`}
                />
              </div>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="text-left">
              <label htmlFor="distance" className="block text-sm font-medium text-zinc-300">
                Distance (km)
              </label>
              <input
                id="distance"
                type="text"
                inputMode="decimal"
                required
                value={distanceKm}
                onChange={(e) => setDistanceKm(e.target.value)}
                placeholder="ex. 21,1"
                className={inputClass}
              />
            </div>
            <div className="text-left">
              <label htmlFor="elevation" className="block text-sm font-medium text-zinc-300">
                Dénivelé (m){' '}
                <span className="font-normal text-zinc-500">(optionnel)</span>
              </label>
              <input
                id="elevation"
                type="number"
                min={0}
                step={1}
                value={elevationM}
                onChange={(e) => setElevationM(e.target.value)}
                placeholder="ex. 1250"
                className={inputClass}
              />
            </div>
          </div>

          <div className="text-left">
            <label htmlFor="position" className="block text-sm font-medium text-zinc-300">
              Classement{' '}
              <span className="font-normal text-zinc-500">(optionnel)</span>
            </label>
            <input
              id="position"
              type="text"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              placeholder="ex. 115/200"
              maxLength={32}
              className={`max-w-xs ${inputClass}`}
            />
          </div>
        </div>

        {error && (
          <p className="mt-6 rounded-lg border border-red-500/30 bg-red-950/30 px-4 py-3 text-sm text-red-300">
            {error}
          </p>
        )}

        {success && (
          <p className="mt-6 rounded-lg border border-emerald-500/30 bg-emerald-950/30 px-4 py-3 text-sm text-emerald-300">
            Course enregistrée — retour à la liste…
          </p>
        )}

        <div className="mt-8 flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={submitting || success}
            className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? 'Enregistrement…' : 'Enregistrer'}
          </button>
          <Link
            to="/courses"
            className="rounded-xl border border-white/10 px-5 py-2.5 text-sm font-medium text-zinc-300 transition hover:bg-white/5"
          >
            Annuler
          </Link>
        </div>
      </form>
    </>
  )
}
