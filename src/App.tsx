import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from './components/AppLayout'
import { AddRacePage } from './pages/AddRacePage'
import { AddSessionPage } from './pages/AddSessionPage'
import { DashboardPage } from './pages/DashboardPage'
import { RacesPage } from './pages/RacesPage'
import { StatsPage } from './pages/StatsPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="courses" element={<RacesPage />} />
          <Route path="courses/ajouter" element={<AddRacePage />} />
          <Route path="statistiques" element={<StatsPage />} />
          <Route path="ajouter" element={<AddSessionPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
