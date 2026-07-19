import { NavLink, Outlet } from 'react-router-dom'

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
    isActive
      ? 'bg-indigo-500/20 text-indigo-300 ring-1 ring-indigo-500/40'
      : 'text-zinc-400 hover:bg-white/5 hover:text-zinc-200'
  }`

export function AppLayout() {
  return (
    <div className="min-h-svh bg-[#0c0f14]">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-32 top-0 h-96 w-96 rounded-full bg-indigo-600/10 blur-3xl" />
        <div className="absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-violet-600/8 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-8">
        <nav className="mb-8 flex flex-wrap items-center gap-2 border-b border-white/8 pb-4">
          <NavLink to="/" end className={linkClass}>
            Séances
          </NavLink>
          <NavLink to="/courses" className={linkClass}>
            Courses
          </NavLink>
        </nav>

        <Outlet />
      </div>
    </div>
  )
}
