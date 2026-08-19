import { useState } from 'react'
import { supabase } from './supabaseClient'

export default function LearningForm({ session, onSuccess }) {
  const [title, setTitle] = useState('')
  const [learningType, setLearningType] = useState('')
  const [platform, setPlatform] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState('Not Started')
  const [progressPercentage, setProgressPercentage] = useState('0')
  const [estimatedHours, setEstimatedHours] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitting(true)
    setErrorMsg(null)

    const { error } = await supabase.from('learning').insert({
      title,
      learning_type: learningType || null,
      platform: platform || null,
      description: description || null,
      status,
      progress_percentage: parseInt(progressPercentage) || 0,
      estimated_hours: estimatedHours ? parseInt(estimatedHours) : null,
      start_date: startDate || null,
      end_date: endDate || null,
      user_id: session.user.id,
    })

    setSubmitting(false)

    if (error) {
      setErrorMsg(error.message)
    } else {
      setTitle('')
      setLearningType('')
      setPlatform('')
      setDescription('')
      setStatus('Not Started')
      setProgressPercentage('0')
      setEstimatedHours('')
      setStartDate('')
      setEndDate('')
      if (onSuccess) onSuccess()
    }
  }

  return (
    <div>
      <h3>Add Learning</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title (e.g. React Fundamentals)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <br />
        <input
          type="text"
          placeholder="Learning Type (e.g. Course, Bootcamp)"
          value={learningType}
          onChange={(e) => setLearningType(e.target.value)}
        />
        <br />
        <input
          type="text"
          placeholder="Platform (e.g. Coursera, GreatNusa)"
          value={platform}
          onChange={(e) => setPlatform(e.target.value)}
        />
        <br />
        <textarea
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <br />
        <label>Status: </label>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="Not Started">Not Started</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
        <br />
        <label>Progress (%): </label>
        <input
          type="number"
          min="0"
          max="100"
          value={progressPercentage}
          onChange={(e) => setProgressPercentage(e.target.value)}
        />
        <br />
        <label>Estimated Hours (optional): </label>
        <input
          type="number"
          min="0"
          value={estimatedHours}
          onChange={(e) => setEstimatedHours(e.target.value)}
        />
        <br />
        <label>Start Date (optional): </label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <br />
        <label>End Date (optional): </label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
        <br />
        <button type="submit" disabled={submitting}>
          {submitting ? 'Saving...' : 'Save Learning'}
        </button>
      </form>
      {errorMsg && <p style={{ color: 'red' }}>{errorMsg}</p>}
    </div>
  )
}