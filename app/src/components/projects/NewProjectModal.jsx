import { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import CreateEntityModal from '../common/CreateEntityModal';
import NewSkillModal from './NewSkillModal';

const statusOptions = ['Planned', 'In Progress', 'Completed'];

function NewProjectModal({ onClose, onCreated }) {
  const [skills, setSkills] = useState([]);
  const [loadingSkills, setLoadingSkills] = useState(true);
  const [selectedSkillIds, setSelectedSkillIds] = useState([]);
  const [showNewSkillModal, setShowNewSkillModal] = useState(false);
  const [form, setForm] = useState({
    name: '',
    description: '',
    project_type: '',
    role: '',
    semester: '',
    status: 'In Progress',
    start_date: '',
    end_date: '',
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
      setError('Nama project wajib diisi.');
      return;
    }

    setIsSubmitting(true);

    const { data: { user } } = await supabase.auth.getUser();

    const { data: project, error: insertError } = await supabase
      .from('projects')
      .insert({
        user_id: user.id,
        name: form.name.trim(),
        description: form.description.trim() || null,
        project_type: form.project_type.trim() || null,
        role: form.role.trim() || null,
        semester: form.semester.trim() || null,
        status: form.status,
        start_date: form.start_date || null,
        end_date: form.end_date || null,
        notes: form.notes.trim() || null,
      })
      .select()
      .single();

    if (insertError) {
      setIsSubmitting(false);
      setError('Gagal menyimpan project. Coba lagi.');
      return;
    }

    if (selectedSkillIds.length > 0) {
      const rows = selectedSkillIds.map((skillId) => ({
        project_id: project.project_id,
        skill_id: skillId,
      }));
      await supabase.from('project_skills').insert(rows);
    }

    setIsSubmitting(false);
    onCreated(project);
    onClose();
  }

  return (
    <>
      <CreateEntityModal
        title="Buat Project Baru"
        onClose={onClose}
        onSubmit={handleSubmit}
        submitLabel="Buat Project"
        isSubmitting={isSubmitting}
        error={error}
      >
        <div className="entity-form-field">
          <label className="entity-form-label">Nama Project</label>
          <input
            type="text"
            name="name"
            className="entity-form-input"
            placeholder="Contoh: Career Lab"
            value={form.name}
            onChange={handleChange}
          />
        </div>

        <div className="entity-form-field">
          <label className="entity-form-label">Deskripsi</label>
          <textarea
            name="description"
            className="entity-form-textarea"
            placeholder="Project ini tentang apa..."
            value={form.description}
            onChange={handleChange}
            rows={3}
          />
        </div>

        <div className="entity-form-field-row">
          <div className="entity-form-field">
            <label className="entity-form-label">Tipe Project</label>
            <input
              type="text"
              name="project_type"
              className="entity-form-input"
              placeholder="Personal/Academic/dll"
              value={form.project_type}
              onChange={handleChange}
            />
          </div>
          <div className="entity-form-field">
            <label className="entity-form-label">Role</label>
            <input
              type="text"
              name="role"
              className="entity-form-input"
              placeholder="Contoh: Backend Developer"
              value={form.role}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="entity-form-field-row">
          <div className="entity-form-field">
            <label className="entity-form-label">Semester/Periode</label>
            <input
              type="text"
              name="semester"
              className="entity-form-input"
              placeholder="Contoh: Semester 5"
              value={form.semester}
              onChange={handleChange}
            />
          </div>
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

export default NewProjectModal;