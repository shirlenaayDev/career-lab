import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'
import Login from './Login'
import ReflectionForm from './ReflectionForm'
import ApplicationForm from './ApplicationForm'
import SkillForm from './SkillForm'
import './App.css'

function App() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [projects, setProjects] = useState([])
  const [experiments, setExperiments] = useState([])
  const [reflections, setReflections] = useState([])
  const [applications, setApplications] = useState([])
  const [skills, setSkills] = useState([])

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

  function refreshReflections() {
    supabase.from('weekly_reflections').select('*').order('created_at', { ascending: false }).then(({ data, error }) => {
      if (!error) setReflections(data)
    })
  }

  function refreshApplications() {
    supabase.from('applications').select('*').order('date_applied', { ascending: false }).then(({ data, error }) => {
      if (!error) setApplications(data)
    })
  }

  function refreshSkills() {
  supabase.from('skills').select('*').then(({ data, error }) => {
    if (!error) setSkills(data)
  })
  }

  useEffect(() => {
    if (session) {
      supabase.from('projects').select('*').then(({ data, error }) => {
        if (!error) setProjects(data)
      })
      supabase.from('career_experiments').select('*').then(({ data, error }) => {
        if (!error) setExperiments(data)
      })
      refreshReflections()
      refreshApplications()
      refreshSkills()
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
            <li key={p.project_id}>{p.name} — {p.status}</li>
          ))}
        </ul>
      )}

      <h2>Career Experiments</h2>
      {experiments.length === 0 ? (
        <p>No experiments yet.</p>
      ) : (
        <ul>
          {experiments.map((e) => (
            <li key={e.career_experiment_id}>
              {e.experiment_title} — Enjoyment: {e.enjoyment_score}/5, Difficulty: {e.difficulty}/5
            </li>
          ))}
        </ul>
      )}

      <h2>Weekly Reflections</h2>
      {reflections.length === 0 ? (
        <p>No reflections yet.</p>
      ) : (
        <ul>
          {reflections.map((r) => (
            <li key={r.reflection_id}>
              <strong>{r.week}</strong> — Mood: {r.mood}, Score: {r.score}/10
              <br />
              {r.reflection}
            </li>
          ))}
        </ul>
      )}

      <ReflectionForm session={session} onSuccess={refreshReflections} />

      <h2>Applications</h2>
      {applications.length === 0 ? (
        <p>No applications yet.</p>
      ) : (
        <ul>
          {applications.map((a) => (
            <li key={a.application_id}>
              {a.company} — {a.position} ({a.application_status})
            </li>
          ))}
        </ul>
      )}

      <ApplicationForm session={session} onSuccess={refreshApplications} />
      <h2>Skills</h2>
      {skills.length === 0 ? (
        <p>No skills yet.</p>
      ) : (
        <ul>
          {skills.map((s) => (
            <li key={s.skill_id}>
              {s.name} ({s.category}) — {s.proficiency_level}
            </li>
          ))}
        </ul>
      )}
      <SkillForm session={session} onSuccess={refreshSkills} />
    </div>
  )
}

export default App