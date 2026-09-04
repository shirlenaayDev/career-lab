import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { supabase } from './supabaseClient'
import Login from './Login'
import Dashboard from './pages/Dashboard'
import CareerPaths from './pages/CareerPaths'
import CareerExperiments from './pages/CareerExperiments'
import WeeklyReflection from './pages/WeeklyReflection'
import Projects from './pages/Projects'
import ProjectDetail from './pages/ProjectDetail'
import Skills from './pages/Skills'
import Experiences from './pages/Experiences'
import Learning from './pages/Learning'
import Certificates from './pages/Certificates'
import './App.css'

function App() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  async function handleLogout() {
    await supabase.auth.signOut()
  }

  if (loading) return <p>Loading...</p>
  if (!session) return <Login />

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard session={session} handleLogout={handleLogout} />} />
        <Route path="/career-paths" element={<CareerPaths />} />
        <Route path="/career-experiments" element={<CareerExperiments />} />
        <Route path="/weekly-reflection" element={<WeeklyReflection />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/:id" element={<ProjectDetail />} />
        <Route path="/skills" element={<Skills />} />
        <Route path="/experiences" element={<Experiences />} />
        <Route path="/learning" element={<Learning />} />
        <Route path="/certificates" element={<Certificates />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App