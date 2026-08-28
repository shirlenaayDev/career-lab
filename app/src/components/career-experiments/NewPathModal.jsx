import { useState } from 'react';
import { supabase } from '../../supabaseClient';
import CreateEntityModal from '../common/CreateEntityModal';

// Field priority & status sengaja nggak dimunculin di form — keduanya punya default
// value di DB (priority=1, status='Exploring'), jadi biar DB yang handle, form tetap simpel.
function NewPathModal({ onClose, onCreated }) {
  const [form, setForm] = useState({
    name: '',
    description: '',
    why: '',
    target_timeline: '',
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

    const { data: { user } } = await supabase.auth.getUser();

    const { data, error: insertError } = await supabase
      .from('career_paths')
      .insert({
        user_id: user.id,
        name: form.name.trim(),
        description: form.description.trim() || null,
        why: form.why.trim() || null,
        target_timeline: form.target_timeline.trim() || null,
      })
      .select()
      .single();

    setIsSubmitting(false);

    if (insertError) {
      setError('Gagal menyimpan career path. Coba lagi.');
      return;
    }

    onCreated(data);
    onClose();
  }

  return (
    <CreateEntityModal
      title="Buat Career Path Baru"
      onClose={onClose}
      onSubmit={handleSubmit}
      submitLabel="Buat Path"
      isSubmitting={isSubmitting}
      error={error}
    >
      <div className="entity-form-field">
        <label className="entity-form-label">Nama Career Path</label>
        <input
          type="text"
          name="name"
          className="entity-form-input"
          placeholder="Contoh: UI/UX Designer"
          value={form.name}
          onChange={handleChange}
        />
      </div>

      <div className="entity-form-field">
        <label className="entity-form-label">Deskripsi</label>
        <textarea
          name="description"
          className="entity-form-textarea"
          placeholder="Career path ini tentang apa..."
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
          placeholder="Alasan kamu tertarik sama path ini..."
          value={form.why}
          onChange={handleChange}
          rows={2}
        />
      </div>

      <div className="entity-form-field">
        <label className="entity-form-label">Target Timeline (opsional)</label>
        <input
          type="text"
          name="target_timeline"
          className="entity-form-input"
          placeholder="Contoh: 6 bulan"
          value={form.target_timeline}
          onChange={handleChange}
        />
      </div>
    </CreateEntityModal>
  );
}

export default NewPathModal;