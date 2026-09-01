import { useState } from 'react';
import { supabase } from '../../supabaseClient';
import CreateEntityModal from '../common/CreateEntityModal';

const proficiencyOptions = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

function NewSkillModal({ onClose, onCreated }) {
  const [form, setForm] = useState({
    name: '',
    category: '',
    proficiency_level: '',
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

    const { data: { user } } = await supabase.auth.getUser();

    const { data, error: insertError } = await supabase
      .from('skills')
      .insert({
        user_id: user.id,
        name: form.name.trim(),
        category: form.category.trim() || null,
        proficiency_level: form.proficiency_level || null,
      })
      .select()
      .single();

    setIsSubmitting(false);

    if (insertError) {
      setError('Gagal menyimpan skill. Coba lagi.');
      return;
    }

    onCreated(data);
    onClose();
  }

  return (
    <CreateEntityModal
      title="Buat Skill Baru"
      onClose={onClose}
      onSubmit={handleSubmit}
      submitLabel="Buat Skill"
      isSubmitting={isSubmitting}
      error={error}
    >
      <div className="entity-form-field">
        <label className="entity-form-label">Nama Skill</label>
        <input
          type="text"
          name="name"
          className="entity-form-input"
          placeholder="Contoh: PostgreSQL"
          value={form.name}
          onChange={handleChange}
        />
      </div>

      <div className="entity-form-field">
        <label className="entity-form-label">Kategori (opsional)</label>
        <input
          type="text"
          name="category"
          className="entity-form-input"
          placeholder="Contoh: Technical / Soft Skill"
          value={form.category}
          onChange={handleChange}
        />
      </div>

      <div className="entity-form-field">
        <label className="entity-form-label">Proficiency (opsional)</label>
        <select
          name="proficiency_level"
          className="entity-form-select"
          value={form.proficiency_level}
          onChange={handleChange}
        >
          <option value="">Belum ditentukan</option>
          {proficiencyOptions.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </div>
    </CreateEntityModal>
  );
}

export default NewSkillModal;