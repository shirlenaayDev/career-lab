import { useState } from 'react';
import { supabase } from '../../supabaseClient';
import CreateEntityModal from '../common/CreateEntityModal';

const statusOptions = ['Exploring', 'Focus', 'Achieved'];

function PathDetailModal({ path, onClose, onUpdated }) {
  const [form, setForm] = useState({
    name: path.name || '',
    description: path.description || '',
    why: path.why || '',
    priority: path.priority ?? 1,
    targetTimeline: path.targetTimeline || '',
    status: path.status || 'Exploring',
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

    if (!form.name.trim()) {
      setError('Nama career path wajib diisi.');
      return;
    }

    setIsSubmitting(true);

    const { data, error: updateError } = await supabase
      .from('career_paths')
      .update({
        name: form.name.trim(),
        description: form.description.trim() || null,
        why: form.why.trim() || null,
        priority: Number(form.priority) || 1,
        target_timeline: form.targetTimeline.trim() || null,
        status: form.status,
      })
      .eq('career_path_id', path.id)
      .select()
      .single();

    setIsSubmitting(false);

    if (updateError) {
      setError('Gagal update career path. Coba lagi.');
      return;
    }

    onUpdated(data);
    onClose();
  }

  return (
    <CreateEntityModal
      title="Detail Career Path"
      onClose={onClose}
      onSubmit={handleSubmit}
      submitLabel="Simpan Perubahan"
      isSubmitting={isSubmitting}
      error={error}
    >
      <div className="entity-form-field">
        <label className="entity-form-label">Nama Career Path</label>
        <input
          type="text"
          name="name"
          className="entity-form-input"
          value={form.name}
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

      <div className="entity-form-field">
        <label className="entity-form-label">Kenapa Path Ini?</label>
        <textarea
          name="why"
          className="entity-form-textarea"
          value={form.why}
          onChange={handleChange}
          rows={2}
        />
      </div>

      <div className="entity-form-field-row">
        <div className="entity-form-field">
          <label className="entity-form-label">Priority</label>
          <input
            type="number"
            name="priority"
            className="entity-form-input"
            min="1"
            value={form.priority}
            onChange={handleChange}
          />
        </div>
        <div className="entity-form-field">
          <label className="entity-form-label">Target Timeline</label>
          <input
            type="text"
            name="targetTimeline"
            className="entity-form-input"
            placeholder="Contoh: 6 bulan"
            value={form.targetTimeline}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="entity-form-field">
        <label className="entity-form-label">Status</label>
        <select
          name="status"
          className="entity-form-select"
          value={form.status}
          onChange={handleChange}
        >
          {statusOptions.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>
    </CreateEntityModal>
  );
}

export default PathDetailModal;