import { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import CreateEntityModal from '../common/CreateEntityModal';
import NewSkillModal from '../skills/NewSkillModal';

export const categoryOptions = ['Internship', 'Organization', 'Volunteer', 'Competition', 'Other'];

function NewExperienceModal({ onClose, onCreated }) {
  const [skills, setSkills] = useState([]);
  const [loadingSkills, setLoadingSkills] = useState(true);
  const [selectedSkillIds, setSelectedSkillIds] = useState([]);
  const [showNewSkillModal, setShowNewSkillModal] = useState(false);
  const [form, setForm] = useState({
    name: '',
    category: '',
    organization: '',
    role: '',
    start_date: '',
    end_date: '',
    description: '',
    achievement: '',
    notes: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  async function fetchSkills() {
    const { data, error: fetchError } = await supabase
      .from('skills')
      .select('skill_id, name')
      .order('name');
    if (!fetchError && data) setSkills(data);
    setLoadingSkills(false);
  }

  useEffect(() => {
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

    if (!form.name.trim()) {
      setError('Nama experience wajib diisi.');
      return;
    }

    setIsSubmitting(true);

    const { data: { user } } = await supabase.auth.getUser();

    const { data: experience, error: insertError } = await supabase
      .from('experiences')
      .insert({
        user_id: user.id,
        name: form.name.trim(),
        category: form.category || null,
        organization: form.organization.trim() || null,
        role: form.role.trim() || null,
        start_date: form.start_date || null,
        end_date: form.end_date || null,
        description: form.description.trim() || null,
        achievement: form.achievement.trim() || null,
        notes: form.notes.trim() || null,
      })
      .select()
      .single();

    if (insertError) {
      setIsSubmitting(false);
      setError('Gagal menyimpan experience. Coba lagi.');
      return;
    }

    if (selectedSkillIds.length > 0) {
      const rows = selectedSkillIds.map((skillId) => ({
        experience_id: experience.experience_id,
        skill_id: skillId,
        user_id: user.id,
      }));
      const { error: skillsError } = await supabase.from('experience_skills').insert(rows);
      if (skillsError) {
        setIsSubmitting(false);
        setError('Experience tersimpan, tapi gagal nyimpen skill. Bisa ditambahin lagi dari detail.');
        onCreated(experience);
        onClose();
        return;
      }
    }

    setIsSubmitting(false);
    onCreated(experience);
    onClose();
  }

  return (
    <>
      <CreateEntityModal
        title="Buat Experience Baru"
        onClose={onClose}
        onSubmit={handleSubmit}
        submitLabel="Buat Experience"
        isSubmitting={isSubmitting}
        error={error}
      >
        <div className="entity-form-field">
          <label className="entity-form-label">Nama Experience</label>
          <input
            type="text"
            name="name"
            className="entity-form-input"
            placeholder="Contoh: Data Analyst Intern"
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
            <label className="entity-form-label">Role</label>
            <input
              type="text"
              name="role"
              className="entity-form-input"
              placeholder="Contoh: Data Analyst"
              value={form.role}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="entity-form-field">
          <label className="entity-form-label">Organisasi/Perusahaan</label>
          <input
            type="text"
            name="organization"
            className="entity-form-input"
            placeholder="Contoh: PT Contoh Indonesia"
            value={form.organization}
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
            <p className="entity-form-hint">Kosongkan kalau masih berjalan.</p>
          </div>
        </div>

        <div className="entity-form-field">
          <label className="entity-form-label">Deskripsi</label>
          <textarea
            name="description"
            className="entity-form-textarea"
            placeholder="Apa yang kamu kerjakan di sini..."
            value={form.description}
            onChange={handleChange}
            rows={3}
          />
        </div>

        <div className="entity-form-field">
          <label className="entity-form-label">Achievement (opsional)</label>
          <textarea
            name="achievement"
            className="entity-form-textarea"
            placeholder="Pencapaian yang paling kamu banggain..."
            value={form.achievement}
            onChange={handleChange}
            rows={2}
          />
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

      {showNewSkillModal && (
        <NewSkillModal
          onClose={() => setShowNewSkillModal(false)}
          onCreated={handleSkillCreated}
        />
      )}
    </>
  );
}

export default NewExperienceModal;