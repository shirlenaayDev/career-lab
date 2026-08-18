import { useState } from 'react'
import { supabase } from './supabaseClient'

export default function ReflectionForm({ session, onSuccess }) {
  const [week, setWeek] = useState('')
  const [reflection, setReflection] = useState('')
  const [challenge, setChallenge] = useState('')
  const [improvement, setImprovement] = useState('')
  const [nextAction, setNextAction] = useState('')
  const [mood, setMood] = useState('')
  const [score, setScore] = useState('')
  const [careerExperimentId, setCareerExperimentId] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitting(true)
    setErrorMsg(null)

    const { error } = await supabase.from('weekly_reflections').insert({
      career_experiment_id: careerExperimentId,
      week,
      reflection,
      challenge,
      improvement: improvement || null,
      next_action: nextAction,
      mood,
      score: parseInt(score),
      user_id: session.user.id,
    })

    setSubmitting(false)

    if (error) {
      setErrorMsg(error.message)
    } else {
      setWeek('')
      setReflection('')
      setChallenge('')
      setImprovement('')
      setNextAction('')
      setMood('')
      setScore('')
      setCareerExperimentId('')
      if (onSuccess) onSuccess()
    }
  }

  return (
    <div>
      <h3>Add Weekly Reflection</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Career Experiment ID"
          value={careerExperimentId}
          onChange={(e) => setCareerExperimentId(e.target.value)}
          required
        />
        <br />
        <input
          type="text"
          placeholder="Week (e.g. Minggu 7 (16-22 Ags))"
          value={week}
          onChange={(e) => setWeek(e.target.value)}
          required
        />
        <br />
        <textarea
          placeholder="Reflection"
          value={reflection}
          onChange={(e) => setReflection(e.target.value)}
          required
        />
        <br />
        <textarea
          placeholder="Challenge"
          value={challenge}
          onChange={(e) => setChallenge(e.target.value)}
        />
        <br />
        <textarea
          placeholder="Improvement (optional)"
          value={improvement}
          onChange={(e) => setImprovement(e.target.value)}
        />
        <br />
        <input
          type="text"
          placeholder="Next Action"
          value={nextAction}
          onChange={(e) => setNextAction(e.target.value)}
        />
        <br />
        <input
          type="text"
          placeholder="Mood"
          value={mood}
          onChange={(e) => setMood(e.target.value)}
        />
        <br />
        <input
          type="number"
          placeholder="Score (1-10)"
          min="1"
          max="10"
          value={score}
          onChange={(e) => setScore(e.target.value)}
        />
        <br />
        <button type="submit" disabled={submitting}>
          {submitting ? 'Saving...' : 'Save Reflection'}
        </button>
      </form>
      {errorMsg && <p style={{ color: 'red' }}>{errorMsg}</p>}
    </div>
  )
}