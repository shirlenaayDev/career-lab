import { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import CreateEntityModal from '../common/CreateEntityModal';
import NewPathModal from '../career-experiments/NewPathModal';

function NewApplicationModal({ onClose, onCreated }) {
  const [careerPaths, setCareerPaths] = useState([]);
  const [loadingPaths, setLoadingPaths] = useState(true);
  const [showNewPathModal, setShowNewPathModal] = useState(false);
  const [form, setForm] = useState({
    company: '',
    position: '',
    career_path_id: '',
    date_applied: '',
    interview_date: '',
    notes: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  async function fetchPaths() {
    const { data } = await supabase.from('career_paths').select('career_path_id, name').order('name');
    if (data) setCareerPaths(data);
    setLoadingPaths(false);
  }

  useEffect(() => {
    fetchPaths();
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    if (name === 'career_path_id' && value === '__new__') {
      setShowNewPathModal(true);
      return;
    }
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handlePathCreated(newPath) {
    setCareerPaths((prev) => [...prev, newPath]);
    setForm((prev) => ({ ...prev, career_path_id: newPath.career_path_id }));
    setShowNewPathModal(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    if (!form.company.trim() || !form.position.trim()) {
      setError('Perusahaan dan posisi wajib diisi.');
      return;
    }
    if (!form.career_path_id) {
      setError('Career path wajib dipilih.');
      return;
    }

    setIsSubmitting(true);

    const { data: { user } } = await supabase.auth.getUser();

    const { data, error: insertError } = await supabase
      .from('applications')
      .insert({
        user_id: user.id,
        company: form.company.trim(),
        position: form.position.trim(),
        career_path_id: form.career_path_id,
        application_status: 'Applied',
        date_applied: form.date_applied || null,
        interview_date: form.interview_date || null,
        notes: form.notes.trim() || null,
      })
      .select()
      .single();

    setIsSubmitting(false);

    if (insertError) {
      setError('Gagal menyimpan aplikasi. Coba lagi.');
      return;
    }

    onCreated(data);
    onClose();
  }

  return (
    <>
      <CreateEntityModal
        title="Buat Aplikasi Baru"
        onClose={onClose}
        onSubmit={handleSubmit}
        submitLabel="Buat Aplikasi"
        isSubmitting={isSubmitting}
        error={error}
      >
        <div className="entity-form-field-row">
          <div className="entity-form-field">
            <label className="entity-form-label">Perusahaan</label>
            <input
              type="text"
              name="company"
              className="entity-form-input"
              placeholder="Contoh: Traveloka"
              value={form.company}
              onChange={handleChange}
            />
          </div>
          <div className="entity-form-field">
            <label className="entity-form-label">Posisi</label>
            <input
              type="text"
              name="position"
              className="entity-form-input"
              placeholder="Contoh: Business Analyst Intern"
              value={form.position}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="entity-form-field">
          <label className="entity-form-label">Career Path Terkait</label>
          <select
            name="career_path_id"
            className="entity-form-select"
            value={form.career_path_id}
            onChange={handleChange}
            disabled={loadingPaths}
          >
            <option value="">{loadingPaths ? 'Memuat...' : 'Pilih career path'}</option>
            {careerPaths.map((p) => (
              <option key={p.career_path_id} value={p.career_path_id}>{p.name}</option>
            ))}
            <option value="__new__">+ Buat career path baru</option>
          </select>
        </div>

        <div className="entity-form-field-row">
          <div className="entity-form-field">
            <label className="entity-form-label">Tanggal Apply</label>
            <input
              type="date"
              name="date_applied"
              className="entity-form-input"
              value={form.date_applied}
              onChange={handleChange}
            />
          </div>
          <div className="entity-form-field">
            <label className="entity-form-label">Tanggal Interview</label>
            <input
              type="date"
              name="interview_date"
              className="entity-form-input"
              value={form.interview_date}
              onChange={handleChange}
            />
            <p className="entity-form-hint">Kosongkan kalau belum ada jadwal.</p>
          </div>
        </div>

        <div className="entity-form-field">
          <label className="entity-form-label">Notes (opsional)</label>
          <textarea
            name="notes"
            className="entity-form-textarea"
            placeholder="Catatan proses, next step, dsb..."
            value={form.notes}
            onChange={handleChange}
            rows={3}
          />
        </div>
      </CreateEntityModal>

      {showNewPathModal && (
        <NewPathModal
          onClose={() => setShowNewPathModal(false)}
          onCreated={handlePathCreated}
        />
      )}
    </>
  );
}

export default NewApplicationModal;