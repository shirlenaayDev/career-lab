import { useState } from 'react';
import { Star } from 'lucide-react';
import { supabase } from '../../supabaseClient';
import CreateEntityModal from '../common/CreateEntityModal';

// NOTE soal continue_decision: di Data Dictionary tipenya BOOLEAN tapi deskripsinya
// "Continue/Stop/Pivot" (3 konsep). Boolean cuma bisa nampung 2 state, jadi di sini
// aku treat sebagai Lanjutkan (true) / Berhenti (false) — "Pivot" nggak punya slot
// sendiri kecuali kolomnya diubah ke VARCHAR/enum nanti (reopen schema, bukan sekarang).
function ExperimentDetailModal({ experiment, onClose, onUpdated }) {
  const [form, setForm] = useState({
    experimentTitle: experiment.experimentTitle || '',
    description: experiment.description || '',
    periodStart: experiment.periodStart || '',
    periodEnd: experiment.periodEnd || '',
    enjoymentScore: experiment.enjoymentScore || 0,
    difficulty: experiment.difficulty || 0,
    continueDecision: experiment.continueDecision ?? null,
    conclusion: experiment.conclusion || '',
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

    if (!form.experimentTitle.trim()) {
      setError('Judul experiment wajib diisi.');
      return;
    }

    setIsSubmitting(true);

    const { data, error: updateError } = await supabase
      .from('career_experiments')
      .update({
        experiment_title: form.experimentTitle.trim(),
        description: form.description.trim() || null,
        period_start: form.periodStart || null,
        period_end: form.periodEnd || null,
        enjoyment_score: form.enjoymentScore || null,
        difficulty: form.difficulty || null,
        continue_decision: form.continueDecision,
        conclusion: form.conclusion.trim() || null,
      })
      .eq('career_experiment_id', experiment.id)
      .select()
      .single();

    setIsSubmitting(false);

    if (updateError) {
      setError('Gagal update experiment. Coba lagi.');
      return;
    }

    onUpdated(data);
    onClose();
  }

  return (
    <CreateEntityModal
      title="Detail Career Experiment"
      onClose={onClose}
      onSubmit={handleSubmit}
      submitLabel="Simpan Perubahan"
      isSubmitting={isSubmitting}
      error={error}
    >
      <div className="entity-form-field">
        <label className="entity-form-label">Judul Experiment</label>
        <input
          type="text"
          name="experimentTitle"
          className="entity-form-input"
          value={form.experimentTitle}
          onChange={handleChange}
        />
      </div>

      <div className="entity-form-field">
        <label className="entity-form-label">Deskripsi</label>
        <textarea
          name="description"
          className="entity-form-textarea"
          value={form.description}
          onChange={handleChange}
          rows={3}
        />
      </div>

      <div className="entity-form-field-row">
        <div className="entity-form-field">
          <label className="entity-form-label">Tanggal Mulai</label>
          <input
            type="date"
            name="periodStart"
            className="entity-form-input"
            value={form.periodStart || ''}
            onChange={handleChange}
          />
        </div>
        <div className="entity-form-field">
          <label className="entity-form-label">Tanggal Selesai</label>
          <input
            type="date"
            name="periodEnd"
            className="entity-form-input"
            value={form.periodEnd || ''}
            onChange={handleChange}
          />
          <p className="entity-form-hint">Isi kalau experiment udah selesai.</p>
        </div>
      </div>

      <div className="entity-form-field">
        <label className="entity-form-label">Enjoyment (1-5)</label>
        <div className="rating-picker">
          {[1, 2, 3, 4, 5].map((i) => (
            <button
              type="button"
              key={i}
              onClick={() => setForm((prev) => ({ ...prev, enjoymentScore: i }))}
              className="rating-picker-btn"
            >
              <Star size={24} className={i <= form.enjoymentScore ? 'star-filled' : 'star-empty'} />
            </button>
          ))}
        </div>
      </div>

      <div className="entity-form-field">
        <label className="entity-form-label">Difficulty (1-5)</label>
        <div className="rating-picker">
          {[1, 2, 3, 4, 5].map((i) => (
            <button
              type="button"
              key={i}
              onClick={() => setForm((prev) => ({ ...prev, difficulty: i }))}
              className={`difficulty-picker-segment ${i <= form.difficulty ? 'filled' : ''}`}
            />
          ))}
        </div>
      </div>

      <div className="entity-form-field">
        <label className="entity-form-label">Keputusan</label>
        <div className="decision-toggle">
          <button
            type="button"
            className={`decision-btn ${form.continueDecision === true ? 'active' : ''}`}
            onClick={() => setForm((prev) => ({ ...prev, continueDecision: true }))}
          >
            Lanjutkan
          </button>
          <button
            type="button"
            className={`decision-btn ${form.continueDecision === false ? 'active' : ''}`}
            onClick={() => setForm((prev) => ({ ...prev, continueDecision: false }))}
          >
            Berhenti
          </button>
        </div>
      </div>

      <div className="entity-form-field">
        <label className="entity-form-label">Kesimpulan</label>
        <textarea
          name="conclusion"
          className="entity-form-textarea"
          placeholder="Apa yang kamu pelajari dari experiment ini?"
          value={form.conclusion}
          onChange={handleChange}
          rows={3}
        />
      </div>
    </CreateEntityModal>
  );
}

export default ExperimentDetailModal;