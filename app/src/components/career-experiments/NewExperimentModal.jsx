import { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import CreateEntityModal from '../common/CreateEntityModal';
import NewPathModal from './NewPathModal';

// NOTE: nama kolom di sini pakai lowercase snake_case (career_path_id, career_experiment_id)
// sesuai konvensi default Postgres. Kalau di Supabase kamu ternyata beda casing, tinggal
// disesuain di sini aja (satu file ini, nggak nyebar ke tempat lain).
function NewExperimentModal({ onClose, onCreated }) {
  const [careerPaths, setCareerPaths] = useState([]);
  const [loadingPaths, setLoadingPaths] = useState(true);
  const [form, setForm] = useState({
    experiment_title: '',
    description: '',
    career_path_id: '',
    period_start: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [showNewPathModal, setShowNewPathModal] = useState(false);

  useEffect(() => {
    async function fetchCareerPaths() {
      const { data, error: fetchError } = await supabase
        .from('career_paths')
        .select('career_path_id, name')
        .order('name');

      if (!fetchError && data) setCareerPaths(data);
      setLoadingPaths(false);
    }
    fetchCareerPaths();
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

    if (!form.experiment_title.trim()) {
      setError('Judul experiment wajib diisi.');
      return;
    }
    if (!form.career_path_id) {
      setError('Career path wajib dipilih.');
      return;
    }

    setIsSubmitting(true);

    const { data: { user } } = await supabase.auth.getUser();

    const { data, error: insertError } = await supabase
      .from('career_experiments')
      .insert({
        user_id: user.id,
        experiment_title: form.experiment_title.trim(),
        description: form.description.trim() || null,
        career_path_id: form.career_path_id,
        period_start: form.period_start || null,
      })
      .select()
      .single();

    setIsSubmitting(false);

    if (insertError) {
      setError('Gagal menyimpan experiment. Coba lagi.');
      return;
    }

    onCreated(data);
    onClose();
  }

  return (
    <>
      <CreateEntityModal
        title="Buat Career Experiment Baru"
        onClose={onClose}
        onSubmit={handleSubmit}
        submitLabel="Buat Experiment"
        isSubmitting={isSubmitting}
        error={error}
      >
      <div className="entity-form-field">
        <label className="entity-form-label">Judul Experiment</label>
        <input
          type="text"
          name="experiment_title"
          className="entity-form-input"
          placeholder="Contoh: Business Analyst"
          value={form.experiment_title}
          onChange={handleChange}
        />
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
          {careerPaths.map((path) => (
            <option key={path.career_path_id} value={path.career_path_id}>
              {path.name}
            </option>
          ))}
          <option value="__new__">+ Buat career path baru</option>
        </select>
        {!loadingPaths && careerPaths.length === 0 && (
          <p className="entity-form-hint">Belum ada career path — bikin dulu di halaman Career Paths.</p>
        )}
      </div>

      <div className="entity-form-field">
        <label className="entity-form-label">Deskripsi</label>
        <textarea
          name="description"
          className="entity-form-textarea"
          placeholder="Ceritakan singkat experiment ini tentang apa..."
          value={form.description}
          onChange={handleChange}
          rows={3}
        />
      </div>

      <div className="entity-form-field">
        <label className="entity-form-label">Tanggal Mulai (opsional)</label>
        <input
          type="date"
          name="period_start"
          className="entity-form-input"
          value={form.period_start}
          onChange={handleChange}
        />
        <p className="entity-form-hint">Kosongkan kalau belum mulai — status otomatis jadi "Planned".</p>
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

export default NewExperimentModal;