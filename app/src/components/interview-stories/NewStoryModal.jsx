import { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import CreateEntityModal from '../common/CreateEntityModal';

function NewStoryModal({ onClose, onCreated }) {
  const [applications, setApplications] = useState([]);
  const [loadingApps, setLoadingApps] = useState(true);
  const [projects, setProjects] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [selectedProjectIds, setSelectedProjectIds] = useState([]);
  const [selectedExperienceIds, setSelectedExperienceIds] = useState([]);
  const [form, setForm] = useState({
    application_id: '',
    title: '',
    situation: '',
    task: '',
    action: '',
    result: '',
    lesson_learned: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchOptions() {
      const [{ data: apps }, { data: projs }, { data: exps }] = await Promise.all([
        supabase.from('applications').select('application_id, company, position').order('company'),
        supabase.from('projects').select('project_id, name').order('name'),
        supabase.from('experiences').select('experience_id, name').order('name'),
      ]);
      setApplications(apps || []);
      setProjects(projs || []);
      setExperiences(exps || []);
      setLoadingApps(false);
    }
    fetchOptions();
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function toggleProject(id) {
    setSelectedProjectIds((prev) => (prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]));
  }

  function toggleExperience(id) {
    setSelectedExperienceIds((prev) => (prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id]));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    if (!form.application_id) {
      setError('Aplikasi terkait wajib dipilih.');
      return;
    }
    if (!form.title.trim()) {
      setError('Judul story wajib diisi.');
      return;
    }

    setIsSubmitting(true);

    const { data: { user } } = await supabase.auth.getUser();

    const { data: story, error: insertError } = await supabase
      .from('interview_story')
      .insert({
        user_id: user.id,
        application_id: form.application_id,
        title: form.title.trim(),
        situation: form.situation.trim() || null,
        task: form.task.trim() || null,
        action: form.action.trim() || null,
        result: form.result.trim() || null,
        lesson_learned: form.lesson_learned.trim() || null,
      })
      .select()
      .single();

    if (insertError) {
      setIsSubmitting(false);
      setError('Gagal menyimpan story. Coba lagi.');
      return;
    }

    if (selectedProjectIds.length > 0) {
      await supabase.from('interview_project').insert(
        selectedProjectIds.map((projectId) => ({ story_id: story.story_id, project_id: projectId, user_id: user.id }))
      );
    }
    if (selectedExperienceIds.length > 0) {
      await supabase.from('interview_experience').insert(
        selectedExperienceIds.map((experienceId) => ({ story_id: story.story_id, experience_id: experienceId, user_id: user.id }))
      );
    }

    setIsSubmitting(false);
    onCreated(story);
    onClose();
  }

  return (
    <CreateEntityModal
      title="Buat Interview Story Baru"
      onClose={onClose}
      onSubmit={handleSubmit}
      submitLabel="Buat Story"
      isSubmitting={isSubmitting}
      error={error}
    >
      <div className="entity-form-field">
        <label className="entity-form-label">Aplikasi Terkait</label>
        <select
          name="application_id"
          className="entity-form-select"
          value={form.application_id}
          onChange={handleChange}
          disabled={loadingApps}
        >
          <option value="">{loadingApps ? 'Memuat...' : 'Pilih aplikasi'}</option>
          {applications.map((a) => (
            <option key={a.application_id} value={a.application_id}>
              {a.company} - {a.position}
            </option>
          ))}
        </select>
        {!loadingApps && applications.length === 0 && (
          <p className="entity-form-hint">Belum ada aplikasi — bikin dulu di halaman Applications.</p>
        )}
      </div>

      <div className="entity-form-field">
        <label className="entity-form-label">Judul Story</label>
        <input
          type="text"
          name="title"
          className="entity-form-input"
          placeholder="Contoh: Mengatasi konflik antar tim"
          value={form.title}
          onChange={handleChange}
        />
      </div>

      <div className="entity-form-field">
        <label className="entity-form-label">Situation</label>
        <p className="entity-form-hint">Apa situasi atau konteksnya? Kapan dan dimana?</p>
        <textarea
          name="situation"
          className="entity-form-textarea"
          value={form.situation}
          onChange={handleChange}
          rows={2}
        />
      </div>

      <div className="entity-form-field">
        <label className="entity-form-label">Task</label>
        <p className="entity-form-hint">Apa tugasnya atau tanggung jawabmu?</p>
        <textarea
          name="task"
          className="entity-form-textarea"
          value={form.task}
          onChange={handleChange}
          rows={2}
        />
      </div>

      <div className="entity-form-field">
        <label className="entity-form-label">Action</label>
        <p className="entity-form-hint">Apa tindakan yang kamu lakukan?</p>
        <textarea
          name="action"
          className="entity-form-textarea"
          value={form.action}
          onChange={handleChange}
          rows={2}
        />
      </div>

      <div className="entity-form-field">
        <label className="entity-form-label">Result</label>
        <p className="entity-form-hint">Apa hasil dari tindakanmu?</p>
        <textarea
          name="result"
          className="entity-form-textarea"
          value={form.result}
          onChange={handleChange}
          rows={2}
        />
      </div>

      <div className="entity-form-field">
        <label className="entity-form-label">Pelajaran yang Bisa Diambil</label>
        <textarea
          name="lesson_learned"
          className="entity-form-textarea"
          value={form.lesson_learned}
          onChange={handleChange}
          rows={2}
        />
      </div>

      <div className="entity-form-field">
        <label className="entity-form-label">Kaitkan ke Project (opsional)</label>
        <div className="skill-picker">
          {projects.map((p) => (
            <button
              type="button"
              key={p.project_id}
              className={`skill-chip ${selectedProjectIds.includes(p.project_id) ? 'active' : ''}`}
              onClick={() => toggleProject(p.project_id)}
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      <div className="entity-form-field">
        <label className="entity-form-label">Kaitkan ke Experience (opsional)</label>
        <div className="skill-picker">
          {experiences.map((exp) => (
            <button
              type="button"
              key={exp.experience_id}
              className={`skill-chip ${selectedExperienceIds.includes(exp.experience_id) ? 'active' : ''}`}
              onClick={() => toggleExperience(exp.experience_id)}
            >
              {exp.name}
            </button>
          ))}
        </div>
        <p className="entity-form-hint">Skill tag di card otomatis kebentuk dari skill yang nempel di project/experience yang kamu kaitkan di sini.</p>
      </div>
    </CreateEntityModal>
  );
}

export default NewStoryModal;