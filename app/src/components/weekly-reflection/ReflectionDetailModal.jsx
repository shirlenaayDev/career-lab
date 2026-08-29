import { useState } from 'react';
import { supabase } from '../../supabaseClient';
import CreateEntityModal from '../common/CreateEntityModal';
import { moodMeta } from './ReflectionCard';

const moodOptions = Object.keys(moodMeta);

function ReflectionDetailModal({ reflection, onClose, onUpdated }) {
  const [form, setForm] = useState({
    week: reflection.week || '',
    weekStartDate: reflection.weekStartDate || '',
    mood: reflection.mood || '',
    score: reflection.score || 5,
    reflection: reflection.reflection || '',
    challenge: reflection.challenge || '',
    nextAction: reflection.nextAction || '',
    improvement: reflection.improvement || '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    if (!form.week.trim()) {
      setError('Label minggu wajib diisi.');
      return;
    }

    setIsSubmitting(true);

    const { data, error: updateError } = await supabase
      .from('weekly_reflections')
      .update({
        week: form.week.trim(),
        week_start_date: form.weekStartDate || null,
        mood: form.mood || null,
        score: Number(form.score) || null,
        reflection: form.reflection.trim() || null,
        challenge: form.challenge.trim() || null,
        next_action: form.nextAction.trim() || null,
        improvement: form.improvement.trim() || null,
      })
      .eq('reflection_id', reflection.id)
      .select()
      .single();

    setIsSubmitting(false);

    if (updateError) {
      setError('Gagal update reflection. Coba lagi.');
      return;
    }

    onUpdated(data);
    onClose();
  }

  return (
    <CreateEntityModal
      title={`Detail ${form.week || 'Reflection'}`}
      onClose={onClose}
      onSubmit={handleSubmit}
      submitLabel="Simpan Perubahan"
      isSubmitting={isSubmitting}
      error={error}
    >
      {reflection.experimentTitle && (
        <p className="entity-form-hint">Experiment: {reflection.experimentTitle}</p>
      )}

      <div className="entity-form-field">
        <label className="entity-form-label">Minggu Ke-</label>
        <input
          type="text"
          name="week"
          className="entity-form-input"
          value={form.week}
          onChange={handleChange}
        />
      </div>

      <div className="entity-form-field">
        <label className="entity-form-label">Tanggal Mulai Minggu</label>
        <input
          type="date"
          name="weekStartDate"
          className="entity-form-input"
          value={form.weekStartDate || ''}
          onChange={handleChange}
        />
      </div>

      <div className="entity-form-field">
        <label className="entity-form-label">Mood Minggu Ini</label>
        <div className="mood-picker">
          {moodOptions.map((m) => (
            <button
              type="button"
              key={m}
              className={`mood-picker-btn ${form.mood === m ? 'active' : ''}`}
              onClick={() => setForm((prev) => ({ ...prev, mood: m }))}
            >
              {moodMeta[m].emoji}
              <span>{m}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="entity-form-field">
        <label className="entity-form-label">Overall Score</label>
        <input
          type="range"
          name="score"
          className="entity-form-range"
          min="1"
          max="10"
          value={form.score}
          onChange={handleChange}
        />
        <p className="entity-form-range-value">{form.score}/10</p>
      </div>

      <div className="entity-form-field">
        <label className="entity-form-label">Reflection</label>
        <textarea
          name="reflection"
          className="entity-form-textarea"
          value={form.reflection}
          onChange={handleChange}
          rows={3}
        />
      </div>

      <div className="entity-form-field">
        <label className="entity-form-label">Biggest Challenge</label>
        <textarea
          name="challenge"
          className="entity-form-textarea"
          value={form.challenge}
          onChange={handleChange}
          rows={2}
        />
      </div>

      <div className="entity-form-field">
        <label className="entity-form-label">Next Action</label>
        <textarea
          name="nextAction"
          className="entity-form-textarea"
          value={form.nextAction}
          onChange={handleChange}
          rows={2}
        />
      </div>

      <div className="entity-form-field">
        <label className="entity-form-label">Notes (opsional)</label>
        <textarea
          name="improvement"
          className="entity-form-textarea"
          value={form.improvement}
          onChange={handleChange}
          rows={2}
        />
      </div>
    </CreateEntityModal>
  );
}

export default ReflectionDetailModal;