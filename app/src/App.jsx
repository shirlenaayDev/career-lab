import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'
import './App.css'

function App() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchProjects() {
      const { data, error } = await supabase.from('projects').select('*')
      if (error) {
        setError(error.message)
      } else {
        setProjects(data)
      }
      setLoading(false)
    }
    fetchProjects()
  }, [])

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {error}</p>

  return (
    <div>
      <h1>Career Lab — Connection Test</h1>
      {projects.length === 0 ? (
        <p>No projects found (this is expected if RLS is blocking anon access).</p>
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