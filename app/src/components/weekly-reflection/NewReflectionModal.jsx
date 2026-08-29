import { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import CreateEntityModal from '../common/CreateEntityModal';
import NewExperimentModal from '../career-experiments/NewExperimentModal';
import { moodMeta } from './ReflectionCard';

const moodOptions = Object.keys(moodMeta);

function NewReflectionModal({ onClose, onCreated }) {
  const [experiments, setExperiments] = useState([]);
  const [loadingExperiments, setLoadingExperiments] = useState(true);
  const [showNewExperimentModal, setShowNewExperimentModal] = useState(false);
  const [form, setForm] = useState({
    career_experiment_id: '',
    week: '',
    week_start_date: '',
    mood: '',
    score: 5,
    reflection: '',
    challenge: '',
    next_action: '',
    improvement: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  async function fetchExperiments() {
    const { data, error: fetchError } = await supabase
      .from('career_experiments')
      .select('career_experiment_id, experiment_title')
      .order('experiment_title');

    if (!fetchError && data) setExperiments(data);
    setLoadingExperiments(false);
  }

  useEffect(() => {
    fetchExperiments();
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    if (name === 'career_experiment_id' && value === '__new__') {
      setShowNewExperimentModal(true);
      return;
    }
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleExperimentCreated(newExp) {
    setExperiments((prev) => [...prev, { career_experiment_id: newExp.career_experiment_id, experiment_title: newExp.experiment_title }]);
    setForm((prev) => ({ ...prev, career_experiment_id: newExp.career_experiment_id }));
    setShowNewExperimentModal(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    if (!form.career_experiment_id) {
      setError('Career experiment wajib dipilih.');
      return;
    }
    if (!form.week.trim()) {
      setError('Label minggu wajib diisi.');
      return;
    }
    if (!form.week_start_date) {
      setError('Tanggal mulai minggu wajib diisi.');
      return;
    }

    setIsSubmitting(true);

    const { data: { user } } = await supabase.auth.getUser();

    const { data, error: insertError } = await supabase
      .from('weekly_reflections')
      .insert({
        user_id: user.id,
        career_experiment_id: form.career_experiment_id,
        week: form.week.trim(),
        week_start_date: form.week_start_date,
        mood: form.mood || null,
        score: Number(form.score) || null,
        reflection: form.reflection.trim() || null,
        challenge: form.challenge.trim() || null,
        next_action: form.next_action.trim() || null,
        improvement: form.improvement.trim() || null,
      })
      .select()
      .single();

    setIsSubmitting(false);

    if (insertError) {
      setError('Gagal menyimpan reflection. Coba lagi.');
      return;
    }

    onCreated(data);
    onClose();
  }

  return (
    <>
      <CreateEntityModal
        title="Buat Weekly Reflection"
        onClose={onClose}
        onSubmit={handleSubmit}
        submitLabel="Simpan Reflection"
        isSubmitting={isSubmitting}
        error={error}
      >
      <div className="entity-form-field">
        <label className="entity-form-label">Career Experiment</label>
        <select
          name="career_experiment_id"
          className="entity-form-select"
          value={form.career_experiment_id}
          onChange={handleChange}
          disabled={loadingExperiments}
        >
          <option value="">{loadingExperiments ? 'Memuat...' : 'Pilih experiment'}</option>
          {experiments.map((exp) => (
            <option key={exp.career_experiment_id} value={exp.career_experiment_id}>
              {exp.experiment_title}
            </option>
          ))}
          <option value="__new__">+ Buat experiment baru</option>
        </select>
      </div>

      <div className="entity-form-field">
        <label className="entity-form-label">Minggu Ke-</label>
        <input
          type="text"
          name="week"
          className="entity-form-input"
          placeholder="Contoh: Minggu 4"
          value={form.week}
          onChange={handleChange}
        />
      </div>

      <div className="entity-form-field">
        <label className="entity-form-label">Tanggal Mulai Minggu</label>
        <input
          type="date"
          name="week_start_date"
          className="entity-form-input"
          value={form.week_start_date}
          onChange={handleChange}
        />
        <p className="entity-form-hint">Tanggal range di card otomatis dihitung 7 hari dari tanggal ini.</p>
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
          placeholder="Apa yang kamu kerjakan/pelajari minggu ini..."
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
          placeholder="Tantangan terbesar minggu ini..."
          value={form.challenge}
          onChange={handleChange}
          rows={2}
        />
      </div>

      <div className="entity-form-field">
        <label className="entity-form-label">Next Action</label>
        <textarea
          name="next_action"
          className="entity-form-textarea"
          placeholder="Rencana minggu depan..."
          value={form.next_action}
          onChange={handleChange}
          rows={2}
        />
      </div>

      <div className="entity-form-field">
        <label className="entity-form-label">Notes (opsional)</label>
        <textarea
          name="improvement"
          className="entity-form-textarea"
          placeholder="Area yang mau diperbaiki..."
          value={form.improvement}
          onChange={handleChange}
          rows={2}
        />
      </div>
      </CreateEntityModal>

      {showNewExperimentModal && (
        <NewExperimentModal
          onClose={() => setShowNewExperimentModal(false)}
          onCreated={handleExperimentCreated}
        />
      )}
    </>
  );
}

export default NewReflectionModal;