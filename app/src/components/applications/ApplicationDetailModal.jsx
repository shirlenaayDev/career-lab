import { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import CreateEntityModal from '../common/CreateEntityModal';
import NewPathModal from '../career-experiments/NewPathModal';

export const statusOptions = ['Applied', 'Interview', 'Offer', 'Rejected'];

function ApplicationDetailModal({ application, onClose, onUpdated }) {
  const [careerPaths, setCareerPaths] = useState([]);
  const [showNewPathModal, setShowNewPathModal] = useState(false);
  const [form, setForm] = useState({
    company: application.company || '',
    position: application.position || '',
    careerPathId: application.careerPathId || '',
    applicationStatus: application.applicationStatus || 'Applied',
    dateApplied: application.dateApplied || '',
    interviewDate: application.interviewDate || '',
    notes: application.notes || '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchPaths() {
      const { data } = await supabase.from('career_paths').select('career_path_id, name').order('name');
      if (data) setCareerPaths(data);
    }
    fetchPaths();
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    if (name === 'careerPathId' && value === '__new__') {
      setShowNewPathModal(true);
      return;
    }
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handlePathCreated(newPath) {
    setCareerPaths((prev) => [...prev, newPath]);
    setForm((prev) => ({ ...prev, careerPathId: newPath.career_path_id }));
    setShowNewPathModal(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    if (!form.company.trim() || !form.position.trim()) {
      setError('Perusahaan dan posisi wajib diisi.');
      return;
    }

    setIsSubmitting(true);

    const { data, error: updateError } = await supabase
      .from('applications')
      .update({
        company: form.company.trim(),
        position: form.position.trim(),
        career_path_id: form.careerPathId,
        application_status: form.applicationStatus,
        date_applied: form.dateApplied || null,
        interview_date: form.interviewDate || null,
        notes: form.notes.trim() || null,
      })
      .eq('application_id', application.id)
      .select()
      .single();

    setIsSubmitting(false);

    if (updateError) {
      setError('Gagal update aplikasi. Coba lagi.');
      return;
    }

    onUpdated(data);
    onClose();
  }

  return (
    <>
      <CreateEntityModal
        title="Detail Aplikasi"
        onClose={onClose}
        onSubmit={handleSubmit}
        submitLabel="Simpan Perubahan"
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
              value={form.position}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="entity-form-field-row">
          <div className="entity-form-field">
            <label className="entity-form-label">Career Path</label>
            <select
              name="careerPathId"
              className="entity-form-select"
              value={form.careerPathId}
              onChange={handleChange}
            >
              <option value="">Pilih career path</option>
              {careerPaths.map((p) => (
                <option key={p.career_path_id} value={p.career_path_id}>{p.name}</option>
              ))}
              <option value="__new__">+ Buat career path baru</option>
            </select>
          </div>
          <div className="entity-form-field">
            <label className="entity-form-label">Status</label>
            <select
              name="applicationStatus"
              className="entity-form-select"
              value={form.applicationStatus}
              onChange={handleChange}
            >
              {statusOptions.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="entity-form-field-row">
          <div className="entity-form-field">
            <label className="entity-form-label">Tanggal Apply</label>
            <input
              type="date"
              name="dateApplied"
              className="entity-form-input"
              value={form.dateApplied || ''}
              onChange={handleChange}
            />
          </div>
          <div className="entity-form-field">
            <label className="entity-form-label">Tanggal Interview</label>
            <input
              type="date"
              name="interviewDate"
              className="entity-form-input"
              value={form.interviewDate || ''}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="entity-form-field">
          <label className="entity-form-label">Notes (opsional)</label>
          <textarea
            name="notes"
            className="entity-form-textarea"
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

export default ApplicationDetailModal;