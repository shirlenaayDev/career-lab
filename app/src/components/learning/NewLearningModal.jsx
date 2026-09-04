import { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import CreateEntityModal from '../common/CreateEntityModal';
import NewSkillModal from '../skills/NewSkillModal';

export const typeOptions = ['Course', 'Book', 'Video', 'Article', 'Other'];
export const statusOptions = ['Not Started', 'In Progress', 'Completed'];

function NewLearningModal({ onClose, onCreated }) {
  const [skills, setSkills] = useState([]);
  const [loadingSkills, setLoadingSkills] = useState(true);
  const [selectedSkillIds, setSelectedSkillIds] = useState([]);
  const [showNewSkillModal, setShowNewSkillModal] = useState(false);
  const [form, setForm] = useState({
    title: '',
    learning_type: '',
    platform: '',
    description: '',
    status: 'Not Started',
    progress_percentage: 0,
    estimated_hours: '',
    start_date: '',
    end_date: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchSkills() {
      const { data } = await supabase.from('skills').select('skill_id, name').order('name');
      if (data) setSkills(data);
      setLoadingSkills(false);
    }
    fetchSkills();
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function toggleSkill(skillId) {
    setSelectedSkillIds((prev) =>
      prev.includes(skillId) ? prev.filter((id) => id !== skillId) : [...prev, skillId]
    );
  }

  function handleSkillCreated(newSkill) {
    setSkills((prev) => [...prev, { skill_id: newSkill.skill_id, name: newSkill.name }]);
    setSelectedSkillIds((prev) => [...prev, newSkill.skill_id]);
    setShowNewSkillModal(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    if (!form.title.trim()) {
      setError('Judul learning wajib diisi.');
      return;
    }

    setIsSubmitting(true);

    const { data: { user } } = await supabase.auth.getUser();

    const { data: learning, error: insertError } = await supabase
      .from('learning')
      .insert({
        user_id: user.id,
        title: form.title.trim(),
        learning_type: form.learning_type || null,
        platform: form.platform.trim() || null,
        description: form.description.trim() || null,
        status: form.status,
        progress_percentage: Number(form.progress_percentage) || 0,
        estimated_hours: form.estimated_hours ? Number(form.estimated_hours) : null,
        start_date: form.start_date || null,
        end_date: form.end_date || null,
      })
      .select()
      .single();

    if (insertError) {
      setIsSubmitting(false);
      setError('Gagal menyimpan learning. Coba lagi.');
      return;
    }

    if (selectedSkillIds.length > 0) {
      const rows = selectedSkillIds.map((skillId) => ({
        learning_id: learning.learning_id,
        skill_id: skillId,
        user_id: user.id,
      }));
      const { error: skillsError } = await supabase.from('learning_skills').insert(rows);
      if (skillsError) {
        setIsSubmitting(false);
        setError('Learning tersimpan, tapi gagal nyimpen skill. Bisa ditambahin lagi dari detail.');
        onCreated(learning);
        onClose();
        return;
      }
    }

    setIsSubmitting(false);
    onCreated(learning);
    onClose();
  }

  return (
    <>
      <CreateEntityModal
        title="Buat Learning Baru"
        onClose={onClose}
        onSubmit={handleSubmit}
        submitLabel="Buat Learning"
        isSubmitting={isSubmitting}
        error={error}
      >
        <div className="entity-form-field">
          <label className="entity-form-label">Judul</label>
          <input
            type="text"
            name="title"
            className="entity-form-input"
            placeholder="Contoh: SQL for Data Analysis"
            value={form.title}
            onChange={handleChange}
          />
        </div>

        <div className="entity-form-field-row">
          <div className="entity-form-field">
            <label className="entity-form-label">Tipe</label>
            <select
              name="learning_type"
              className="entity-form-select"
              value={form.learning_type}
              onChange={handleChange}
            >
              <option value="">Pilih tipe</option>
              {typeOptions.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div className="entity-form-field">
            <label className="entity-form-label">Platform</label>
            <input
              type="text"
              name="platform"
              className="entity-form-input"
              placeholder="Contoh: Coursera"
              value={form.platform}
              onChange={handleChange}
            />
          </div>
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
          <div className="entity-form-field">
            <label className="entity-form-label">Estimasi Jam</label>
            <input
              type="number"
              name="estimated_hours"
              className="entity-form-input"
              min="0"
              value={form.estimated_hours}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="entity-form-field">
          <label className="entity-form-label">Progress ({form.progress_percentage}%)</label>
          <input
            type="range"
            name="progress_percentage"
            className="entity-form-range"
            min="0"
            max="100"
            value={form.progress_percentage}
            onChange={handleChange}
          />
        </div>

        <div className="entity-form-field-row">
          <div className="entity-form-field">
            <label className="entity-form-label">Tanggal Mulai</label>
            <input
              type="date"
              name="start_date"
              className="entity-form-input"
              value={form.start_date}
              onChange={handleChange}
            />
          </div>
          <div className="entity-form-field">
            <label className="entity-form-label">Tanggal Selesai</label>
            <input
              type="date"
              name="end_date"
              className="entity-form-input"
              value={form.end_date}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="entity-form-field">
          <label className="entity-form-label">Skills</label>
          <div className="skill-picker">
            {loadingSkills ? (
              <p className="entity-form-hint">Memuat skills...</p>
            ) : (
              skills.map((s) => (
                <button
                  type="button"
                  key={s.skill_id}
                  className={`skill-chip ${selectedSkillIds.includes(s.skill_id) ? 'active' : ''}`}
                  onClick={() => toggleSkill(s.skill_id)}
                >
                  {s.name}
                </button>
              ))
            )}
            <button
              type="button"
              className="skill-chip skill-chip-add"
              onClick={() => setShowNewSkillModal(true)}
            >
              + Tambah skill baru
            </button>
          </div>
        </div>
      </CreateEntityModal>

      {showNewSkillModal && (
        <NewSkillModal
          onClose={() => setShowNewSkillModal(false)}
          onCreated={handleSkillCreated}
        />
      )}
    </>
  );
}

export default NewLearningModal;