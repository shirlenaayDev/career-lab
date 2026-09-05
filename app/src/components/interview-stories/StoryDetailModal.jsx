import { useEffect, useState } from 'react';
import { X, Plus } from 'lucide-react';
import { supabase } from '../../supabaseClient';
import CreateEntityModal from '../common/CreateEntityModal';

function StoryDetailModal({ story, onClose, onUpdated }) {
  const [projects, setProjects] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [selectedProjectIds, setSelectedProjectIds] = useState([]);
  const [selectedExperienceIds, setSelectedExperienceIds] = useState([]);
  const [evidenceList, setEvidenceList] = useState([]);
  const [newEvidence, setNewEvidence] = useState({ file_name: '', url: '' });
  const [form, setForm] = useState({
    title: story.title || '',
    situation: story.situation || '',
    task: story.task || '',
    action: story.action || '',
    result: story.result || '',
    lessonLearned: story.lessonLearned || '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchLinkedData() {
      const [
        { data: allProjects },
        { data: allExperiences },
        { data: linkedProjects },
        { data: linkedExperiences },
        { data: linkedEvidence },
      ] = await Promise.all([
        supabase.from('projects').select('project_id, name').order('name'),
        supabase.from('experiences').select('experience_id, name').order('name'),
        supabase.from('interview_project').select('project_id').eq('story_id', story.id),
        supabase.from('interview_experience').select('experience_id').eq('story_id', story.id),
        supabase.from('interview_evidence').select('evidence_id, evidence(evidence_id, file_name, url)').eq('story_id', story.id),
      ]);

      setProjects(allProjects || []);
      setExperiences(allExperiences || []);
      setSelectedProjectIds((linkedProjects || []).map((r) => r.project_id));
      setSelectedExperienceIds((linkedExperiences || []).map((r) => r.experience_id));
      setEvidenceList((linkedEvidence || []).map((r) => ({ interviewEvidenceId: r.evidence_id, ...r.evidence })));
    }
    fetchLinkedData();
  }, [story.id]);

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

  async function handleAddEvidence() {
    if (!newEvidence.file_name.trim()) return;

    const { data: { user } } = await supabase.auth.getUser();

    const { data: newEv, error: evError } = await supabase
      .from('evidence')
      .insert({
        user_id: user.id,
        file_name: newEvidence.file_name.trim(),
        url: newEvidence.url.trim() || null,
      })
      .select()
      .single();

    if (evError) return;

    const { data: link } = await supabase
      .from('interview_evidence')
      .insert({ story_id: story.id, evidence_id: newEv.evidence_id, user_id: user.id })
      .select()
      .single();

    setEvidenceList((prev) => [...prev, { interviewEvidenceId: link.evidence_id, ...newEv }]);
    setNewEvidence({ file_name: '', url: '' });
  }

  async function handleDeleteEvidence(evidenceId) {
    await supabase.from('interview_evidence').delete().eq('story_id', story.id).eq('evidence_id', evidenceId);
    await supabase.from('evidence').delete().eq('evidence_id', evidenceId);
    setEvidenceList((prev) => prev.filter((e) => e.evidence_id !== evidenceId));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    if (!form.title.trim()) {
      setError('Judul story wajib diisi.');
      return;
    }

    setIsSubmitting(true);

    const { data: { user } } = await supabase.auth.getUser();

    const { data, error: updateError } = await supabase
      .from('interview_story')
      .update({
        title: form.title.trim(),
        situation: form.situation.trim() || null,
        task: form.task.trim() || null,
        action: form.action.trim() || null,
        result: form.result.trim() || null,
        lesson_learned: form.lessonLearned.trim() || null,
      })
      .eq('story_id', story.id)
      .select()
      .single();

    if (updateError) {
      setIsSubmitting(false);
      setError('Gagal update story. Coba lagi.');
      return;
    }

    await supabase.from('interview_project').delete().eq('story_id', story.id);
    if (selectedProjectIds.length > 0) {
      await supabase.from('interview_project').insert(
        selectedProjectIds.map((projectId) => ({ story_id: story.id, project_id: projectId, user_id: user.id }))
      );
    }

    await supabase.from('interview_experience').delete().eq('story_id', story.id);
    if (selectedExperienceIds.length > 0) {
      await supabase.from('interview_experience').insert(
        selectedExperienceIds.map((experienceId) => ({ story_id: story.id, experience_id: experienceId, user_id: user.id }))
      );
    }

    setIsSubmitting(false);
    onUpdated(data);
    onClose();
  }

  return (
    <CreateEntityModal
      title="Detail Interview Story"
      onClose={onClose}
      onSubmit={handleSubmit}
      submitLabel="Simpan Perubahan"
      isSubmitting={isSubmitting}
      error={error}
    >
      <div className="entity-form-field">
        <label className="entity-form-label">Judul Story</label>
        <input
          type="text"
          name="title"
          className="entity-form-input"
          value={form.title}
          onChange={handleChange}
        />
      </div>

      <div className="entity-form-field">
        <label className="entity-form-label">Situation</label>
        <textarea name="situation" className="entity-form-textarea" value={form.situation} onChange={handleChange} rows={2} />
      </div>

      <div className="entity-form-field">
        <label className="entity-form-label">Task</label>
        <textarea name="task" className="entity-form-textarea" value={form.task} onChange={handleChange} rows={2} />
      </div>

      <div className="entity-form-field">
        <label className="entity-form-label">Action</label>
        <textarea name="action" className="entity-form-textarea" value={form.action} onChange={handleChange} rows={2} />
      </div>

      <div className="entity-form-field">
        <label className="entity-form-label">Result</label>
        <textarea name="result" className="entity-form-textarea" value={form.result} onChange={handleChange} rows={2} />
      </div>

      <div className="entity-form-field">
        <label className="entity-form-label">Pelajaran yang Bisa Diambil</label>
        <textarea name="lessonLearned" className="entity-form-textarea" value={form.lessonLearned} onChange={handleChange} rows={2} />
      </div>

      <div className="entity-form-field">
        <label className="entity-form-label">Kaitkan ke Project</label>
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
        <label className="entity-form-label">Kaitkan ke Experience</label>
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
      </div>

      <div className="entity-form-field">
        <label className="entity-form-label">Evidence</label>
        {evidenceList.length > 0 && (
          <div className="story-evidence-list">
            {evidenceList.map((ev) => (
              <div className="story-evidence-item" key={ev.evidence_id}>
                <span>{ev.file_name}</span>
                <button type="button" onClick={() => handleDeleteEvidence(ev.evidence_id)}>
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
        <div className="story-evidence-add-row">
          <input
            type="text"
            placeholder="Nama file/bukti"
            className="entity-form-input"
            value={newEvidence.file_name}
            onChange={(e) => setNewEvidence((prev) => ({ ...prev, file_name: e.target.value }))}
          />
          <input
            type="text"
            placeholder="URL (opsional)"
            className="entity-form-input"
            value={newEvidence.url}
            onChange={(e) => setNewEvidence((prev) => ({ ...prev, url: e.target.value }))}
          />
          <button type="button" className="story-evidence-add-btn" onClick={handleAddEvidence}>
            <Plus size={16} />
          </button>
        </div>
      </div>
    </CreateEntityModal>
  );
}

export default StoryDetailModal;