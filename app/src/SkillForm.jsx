import { useState } from 'react'
import { supabase } from './supabaseClient'

export default function SkillForm({ session, onSuccess }) {
  const [name, setName] = useState('')
  const [category, setCategory] = useState('')
  const [proficiencyLevel, setProficiencyLevel] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitting(true)
    setErrorMsg(null)

    const { error } = await supabase.from('skills').insert({
      name,
      category,
      proficiency_level: proficiencyLevel,
      user_id: session.user.id,
    })

    setSubmitting(false)

    if (error) {
      setErrorMsg(error.message)
    } else {
      setName('')
      setCategory('')
      setProficiencyLevel('')
      if (onSuccess) onSuccess()
    }
  }

  return (
    <div>
      <h3>Add Skill</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Skill Name (e.g. SQL)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <br />
        <input
          type="text"
          placeholder="Category (e.g. Technical, Soft Skill)"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        />
        <br />
        <input
          type="text"
          placeholder="Proficiency Level (e.g. Beginner, Intermediate)"
          value={proficiencyLevel}
          onChange={(e) => setProficiencyLevel(e.target.value)}
          required
        />
        <br />
        <button type="submit" disabled={submitting}>
          {submitting ? 'Saving...' : 'Save Skill'}
        </button>
      </form>
      {errorMsg && <p style={{ color: 'red' }}>{errorMsg}</p>}
    </div>
  )
}