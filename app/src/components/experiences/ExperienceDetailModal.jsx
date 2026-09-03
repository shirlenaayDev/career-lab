import { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import CreateEntityModal from '../common/CreateEntityModal';
import NewSkillModal from '../skills/NewSkillModal';
import { categoryOptions } from './NewExperienceModal';

function ExperienceDetailModal({ experience, onClose, onUpdated }) {
  const [skills, setSkills] = useState([]);
  const [selectedSkillIds, setSelectedSkillIds] = useState([]);
  const [showNewSkillModal, setShowNewSkillModal] = useState(false);
  const [form, setForm] = useState({
    name: experience.name || '',
    category: experience.category || '',
    organization: experience.organization || '',
    role: experience.role || '',
    startDate: experience.startDate || '',
    endDate: experience.endDate || '',
    description: experience.description || '',
    achievement: experience.achievement || '',
    notes: experience.notes || '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchSkillData() {
      const [{ data: allSkills }, { data: expSkillRows }] = await Promise.all([
        supabase.from('skills').select('skill_id, name').order('name'),
        supabase.from('experience_skills').select('skill_id').eq('experience_id', experience.id),
      ]);
      setSkills(allSkills || []);
      setSelectedSkillIds((expSkillRows || []).map((r) => r.skill_id));
    }
    fetchSkillData();
  }, [experience.id]);

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

    const { data, error: updateError } = await supabase
      .from('experiences')
      .update({
        name: form.name.trim(),
        category: form.category || null,
        organization: form.organization.trim() || null,
        role: form.role.trim() || null,
        start_date: form.startDate || null,
        end_date: form.endDate || null,
        description: form.description.trim() || null,
        achievement: form.achievement.trim() || null,
        notes: form.notes.trim() || null,
      })
      .eq('experience_id', experience.id)
      .select()
      .single();

    if (updateError) {
      setIsSubmitting(false);
      setError('Gagal update experience. Coba lagi.');
      return;
    }

    await supabase.from('experience_skills').delete().eq('experience_id', experience.id);
    if (selectedSkillIds.length > 0) {
      const { error: skillsError } = await supabase.from('experience_skills').insert(
        selectedSkillIds.map((skillId) => ({ experience_id: experience.id, skill_id: skillId, user_id: user.id }))
      );
      if (skillsError) {
        setIsSubmitting(false);
        setError('Experience tersimpan, tapi gagal update skill. Coba simpan lagi.');
        return;
      }
    }

    setIsSubmitting(false);
    onUpdated(data);
    onClose();
  }

  return (
    <>
      <CreateEntityModal
        title="Detail Experience"
        onClose={onClose}
        onSubmit={handleSubmit}
        submitLabel="Simpan Perubahan"
        isSubmitting={isSubmitting}
        error={error}
      >
        <div className="entity-form-field">
          <label className="entity-form-label">Nama Experience</label>
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
            <label className="entity-form-label">Role</label>
            <input
              type="text"
              name="role"
              className="entity-form-input"
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
            value={form.organization}
            onChange={handleChange}
          />
        </div>

        <div className="entity-form-field-row">
          <div className="entity-form-field">
            <label className="entity-form-label">Tanggal Mulai</label>
            <input
              type="date"
              name="startDate"
              className="entity-form-input"
              value={form.startDate || ''}
              onChange={handleChange}
            />
          </div>
          <div className="entity-form-field">
            <label className="entity-form-label">Tanggal Selesai</label>
            <input
              type="date"
              name="endDate"
              className="entity-form-input"
              value={form.endDate || ''}
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

        <div className="entity-form-field">
          <label className="entity-form-label">Achievement (opsional)</label>
          <textarea
            name="achievement"
            className="entity-form-textarea"
            value={form.achievement}
            onChange={handleChange}
            rows={2}
          />
        </div>

        <div className="entity-form-field">
          <label className="entity-form-label">Skills</label>
          <div className="skill-picker">
            {skills.map((s) => (
              <button
                type="button"
                key={s.skill_id}
                className={`skill-chip ${selectedSkillIds.includes(s.skill_id) ? 'active' : ''}`}
                onClick={() => toggleSkill(s.skill_id)}
              >
                {s.name}
              </button>
            ))}
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

export default ExperienceDetailModal;