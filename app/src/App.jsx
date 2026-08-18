import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'
import Login from './Login'
import './App.css'

function App() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [projects, setProjects] = useState([])

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

  useEffect(() => {
    if (session) {
      supabase.from('projects').select('*').then(({ data, error }) => {
        if (!error) setProjects(data)
      })
    }
  }, [session])

  async function handleLogout() {
    await supabase.auth.signOut()
  }

  if (loading) return <p>Loading...</p>
  if (!session) return <Login />

  return (
    <div>
      <h1>Career Lab — Dashboard</h1>
      <p>Logged in as: {session.user.email}</p>
      <button onClick={handleLogout}>Logout</button>

      <h2>My Projects</h2>
      {projects.length === 0 ? (
        <p>No projects yet.</p>
      ) : (
        <ul>
          {projects.map((p) => (
            <li key={p.project_id}>{p.name}</li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default App