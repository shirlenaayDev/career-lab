import { useState } from 'react'
import { supabase } from './supabaseClient'

export default function ApplicationForm({ session, onSuccess }) {
  const [careerPathId, setCareerPathId] = useState('')
  const [company, setCompany] = useState('')
  const [position, setPosition] = useState('')
  const [status, setStatus] = useState('')
  const [dateApplied, setDateApplied] = useState('')
  const [interviewDate, setInterviewDate] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitting(true)
    setErrorMsg(null)

    const { error } = await supabase.from('applications').insert({
      career_path_id: careerPathId,
      company,
      position,
      application_status: status,
      date_applied: dateApplied,
      interview_date: interviewDate || null,
      user_id: session.user.id,
    })

    setSubmitting(false)

    if (error) {
      setErrorMsg(error.message)
    } else {
      setCareerPathId('')
      setCompany('')
      setPosition('')
      setStatus('')
      setDateApplied('')
      setInterviewDate('')
      if (onSuccess) onSuccess()
    }
  }

  return (
    <div>
      <h3>Add Application</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Career Path ID"
          value={careerPathId}
          onChange={(e) => setCareerPathId(e.target.value)}
          required
        />
        <br />
        <input
          type="text"
          placeholder="Company"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          required
        />
        <br />
        <input
          type="text"
          placeholder="Position"
          value={position}
          onChange={(e) => setPosition(e.target.value)}
          required
        />
        <br />
        <input
          type="text"
          placeholder="Status (e.g. Applied, Interview, Rejected)"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          required
        />
        <br />
        <label>Date Applied: </label>
        <input
          type="date"
          value={dateApplied}
          onChange={(e) => setDateApplied(e.target.value)}
          required
        />
        <br />
        <label>Interview Date (optional): </label>
        <input
          type="date"
          value={interviewDate}
          onChange={(e) => setInterviewDate(e.target.value)}
        />
        <br />
        <button type="submit" disabled={submitting}>
          {submitting ? 'Saving...' : 'Save Application'}
        </button>
      </form>
      {errorMsg && <p style={{ color: 'red' }}>{errorMsg}</p>}
    </div>
  )
}