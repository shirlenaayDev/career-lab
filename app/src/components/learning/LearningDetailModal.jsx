import { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import CreateEntityModal from '../common/CreateEntityModal';
import NewSkillModal from '../skills/NewSkillModal';
import { typeOptions, statusOptions } from './NewLearningModal';

function LearningDetailModal({ learning, onClose, onUpdated }) {
  const [skills, setSkills] = useState([]);
  const [selectedSkillIds, setSelectedSkillIds] = useState([]);
  const [showNewSkillModal, setShowNewSkillModal] = useState(false);
  const [form, setForm] = useState({
    title: learning.title || '',
    learningType: learning.learningType || '',
    platform: learning.platform || '',
    description: learning.description || '',
    status: learning.status || 'Not Started',
    progressPercentage: learning.progressPercentage ?? 0,
    estimatedHours: learning.estimatedHours || '',
    startDate: learning.startDate || '',
    endDate: learning.endDate || '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchSkillData() {
      const [{ data: allSkills }, { data: learningSkillRows }] = await Promise.all([
        supabase.from('skills').select('skill_id, name').order('name'),
        supabase.from('learning_skills').select('skill_id').eq('learning_id', learning.id),
      ]);
      setSkills(allSkills || []);
      setSelectedSkillIds((learningSkillRows || []).map((r) => r.skill_id));
    }
    fetchSkillData();
  }, [learning.id]);

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

    const { data, error: updateError } = await supabase
      .from('learning')
      .update({
        title: form.title.trim(),
        learning_type: form.learningType || null,
        platform: form.platform.trim() || null,
        description: form.description.trim() || null,
        status: form.status,
        progress_percentage: Number(form.progressPercentage) || 0,
        estimated_hours: form.estimatedHours ? Number(form.estimatedHours) : null,
        start_date: form.startDate || null,
        end_date: form.endDate || null,
      })
      .eq('learning_id', learning.id)
      .select()
      .single();

    if (updateError) {
      setIsSubmitting(false);
      setError('Gagal update learning. Coba lagi.');
      return;
    }

    await supabase.from('learning_skills').delete().eq('learning_id', learning.id);
    if (selectedSkillIds.length > 0) {
      const { error: skillsError } = await supabase.from('learning_skills').insert(
        selectedSkillIds.map((skillId) => ({ learning_id: learning.id, skill_id: skillId, user_id: user.id }))
      );
      if (skillsError) {
        setIsSubmitting(false);
        setError('Learning tersimpan, tapi gagal update skill. Coba simpan lagi.');
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
        title="Detail Learning"
        onClose={onClose}
        onSubmit={handleSubmit}
        submitLabel="Simpan Perubahan"
        isSubmitting={isSubmitting}
        error={error}
      >
        <div className="entity-form-field">
          <label className="entity-form-label">Judul</label>
          <input
            type="text"
            name="title"
            className="entity-form-input"
            value={form.title}
            onChange={handleChange}
          />
        </div>

        <div className="entity-form-field-row">
          <div className="entity-form-field">
            <label className="entity-form-label">Tipe</label>
            <select
              name="learningType"
              className="entity-form-select"
              value={form.learningType}
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
              name="estimatedHours"
              className="entity-form-input"
              min="0"
              value={form.estimatedHours}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="entity-form-field">
          <label className="entity-form-label">Progress ({form.progressPercentage}%)</label>
          <input
            type="range"
            name="progressPercentage"
            className="entity-form-range"
            min="0"
            max="100"
            value={form.progressPercentage}
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

export default LearningDetailModal;