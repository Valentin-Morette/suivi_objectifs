import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { createSportSession } from '../api/goals'
import { ApiError } from '../api/client'
import { ACTIVITY_CONFIG } from '../data/activityConfig'
import type { ActivityType } from '../types/goal'
import { toISODateString } from '../utils/date'

const ACTIVITIES = Object.keys(ACTIVITY_CONFIG) as ActivityType[]

export function AddSessionPage() {
  const navigate = useNavigate()
  const [date, setDate] = useState(toISODateString())
  const [activity, setActivity] = useState<ActivityType>('badminton')
  const [note, setNote] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    setSuccess(false)

    try {
      await createSportSession({
        date,
        activity,
        note: note.trim() || undefined,
      })
      setSuccess(true)
      setNote('')
      setTimeout(() => navigate('/'), 1200)
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message)
      } else {
        setError('Impossible d’enregistrer la séance')
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
          Ajouter une séance
        </h1>
        <p className="mt-2 text-sm text-zinc-400">
          Enregistrement direct en base de données.
        </p>
      </header>

      <form
        onSubmit={(e) => void handleSubmit(e)}
        className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:p-8"
      >
        <div className="space-y-6">
          <div className="text-left">
            <label htmlFor="date" className="block text-sm font-medium text-zinc-300">
              Date
            </label>
            <input
              id="date"
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="input-date mt-2 w-full max-w-xs rounded-lg border border-white/10 bg-[#0c0f14] px-3 py-2.5 text-white outline-none ring-indigo-500/0 transition focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/30"
            />
          </div>

          <fieldset className="text-left">
            <legend className="text-sm font-medium text-zinc-300">Activité</legend>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {ACTIVITIES.map((key) => {
                const cfg = ACTIVITY_CONFIG[key]
                const selected = activity === key
                return (
                  <label
                    key={key}
                    className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 transition ${
                      selected
                        ? `${cfg.bg} ${cfg.border} ring-2 ring-indigo-500/40`
                        : 'border-white/10 bg-white/[0.02] hover:border-white/20'
                    }`}
                  >
                    <input
                      type="radio"
                      name="activity"
                      value={key}
                      checked={selected}
                      onChange={() => setActivity(key)}
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
            <label htmlFor="note" className="block text-sm font-medium text-zinc-300">
              Note <span className="font-normal text-zinc-500">(optionnel)</span>
            </label>
            <input
              id="note"
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="ex. 5 km, séance jambes…"
              maxLength={255}
              className="mt-2 w-full rounded-lg border border-white/10 bg-[#0c0f14] px-3 py-2.5 text-white placeholder:text-zinc-600 outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/30"
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
            Séance enregistrée — retour au tableau de bord…
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
            to="/"
            className="rounded-xl border border-white/10 px-5 py-2.5 text-sm font-medium text-zinc-300 transition hover:bg-white/5"
          >
            Annuler
          </Link>
        </div>
      </form>
    </>
  )
}
