import { useState } from 'react';
import { supabase } from '../../supabaseClient';
import CreateEntityModal from '../common/CreateEntityModal';
import { categoryOptions, proficiencyOptions } from './NewSkillModal';

function SkillDetailModal({ skill, onClose, onUpdated }) {
  const [form, setForm] = useState({
    name: skill.name || '',
    category: skill.category || '',
    description: skill.description || '',
    proficiencyLevel: skill.proficiencyLevel || '',
    lastPracticed: skill.lastPracticed || '',
    notes: skill.notes || '',
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
      setError('Nama skill wajib diisi.');
      return;
    }

    setIsSubmitting(true);

    const { data, error: updateError } = await supabase
      .from('skills')
      .update({
        name: form.name.trim(),
        category: form.category || null,
        description: form.description.trim() || null,
        proficiency_level: form.proficiencyLevel || null,
        last_practiced: form.lastPracticed || null,
        notes: form.notes.trim() || null,
      })
      .eq('skill_id', skill.id)
      .select()
      .single();

    setIsSubmitting(false);

    if (updateError) {
      setError('Gagal update skill. Coba lagi.');
      return;
    }

    onUpdated(data);
    onClose();
  }

  return (
    <CreateEntityModal
      title="Detail Skill"
      onClose={onClose}
      onSubmit={handleSubmit}
      submitLabel="Simpan Perubahan"
      isSubmitting={isSubmitting}
      error={error}
    >
      <div className="entity-form-field">
        <label className="entity-form-label">Nama Skill</label>
        <input
          type="text"
          name="name"
          className="entity-form-input"
          value={form.name}
          onChange={handleChange}
        />
      </div>

      <div className="entity-form-field-row">
        <div className="entity-form-field">
          <label className="entity-form-label">Kategori</label>
          <select
            name="category"
            className="entity-form-select"
            value={form.category}
            onChange={handleChange}
          >
            <option value="">Pilih kategori</option>
            {categoryOptions.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div className="entity-form-field">
          <label className="entity-form-label">Proficiency</label>
          <select
            name="proficiencyLevel"
            className="entity-form-select"
            value={form.proficiencyLevel}
            onChange={handleChange}
          >
            <option value="">Belum ditentukan</option>
            {proficiencyOptions.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="entity-form-field">
        <label className="entity-form-label">Deskripsi</label>
        <textarea
          name="description"
          className="entity-form-textarea"
          value={form.description}
          onChange={handleChange}
          rows={2}
        />
      </div>

      <div className="entity-form-field">
        <label className="entity-form-label">Terakhir Dipakai</label>
        <input
          type="date"
          name="lastPracticed"
          className="entity-form-input"
          value={form.lastPracticed || ''}
          onChange={handleChange}
        />
      </div>

      <div className="entity-form-field">
        <label className="entity-form-label">Notes (opsional)</label>
        <textarea
          name="notes"
          className="entity-form-textarea"
          value={form.notes}
          onChange={handleChange}
          rows={2}
        />
      </div>
    </CreateEntityModal>
  );
}

export default SkillDetailModal;