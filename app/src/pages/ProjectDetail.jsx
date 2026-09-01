import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, X, ExternalLink } from 'lucide-react';
import { supabase } from '../supabaseClient';
import Sidebar from '../components/layout/Sidebar';
import Topbar from '../components/layout/Topbar';
import NewSkillModal from '../components/projects/NewSkillModal';
import '../components/common/CreateEntityModal.css';
import '../components/career-paths/HowItWorksModal.css';
import './ProjectDetail.css';

const statusOptions = ['Planned', 'In Progress', 'Completed'];

function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  const [form, setForm] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);

  const [skills, setSkills] = useState([]);
  const [selectedSkillIds, setSelectedSkillIds] = useState([]);
  const [showNewSkillModal, setShowNewSkillModal] = useState(false);

  const [links, setLinks] = useState([]);
  const [newLink, setNewLink] = useState({ platform: '', url: '' });
  const [linkError, setLinkError] = useState(null);

  async function fetchAll() {
    setLoading(true);
    setLoadError(null);

    const [{ data: project, error: projectError }, { data: allSkills }, { data: projectSkillRows }, { data: linkRows }] = await Promise.all([
      supabase.from('projects').select('*').eq('project_id', id).single(),
      supabase.from('skills').select('skill_id, name').order('name'),
      supabase.from('project_skills').select('skill_id').eq('project_id', id),
      supabase.from('project_links').select('*').eq('project_id', id).order('created_at', { ascending: true }),
    ]);

    if (projectError) {
      setLoadError('Project nggak ditemukan.');
      setLoading(false);
      return;
    }

    setForm({
      name: project.name || '',
      description: project.description || '',
      project_type: project.project_type || '',
      role: project.role || '',
      semester: project.semester || '',
      status: project.status || 'In Progress',
      start_date: project.start_date || '',
      end_date: project.end_date || '',
      notes: project.notes || '',
    });

    setSkills(allSkills || []);
    setSelectedSkillIds((projectSkillRows || []).map((r) => r.skill_id));
    setLinks(linkRows || []);
    setLoading(false);
  }

  useEffect(() => {
    fetchAll();
  }, [id]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function toggleSkill(skillId) {
    setSelectedSkillIds((prev) =>
      prev.includes(skillId) ? prev.filter((s) => s !== skillId) : [...prev, skillId]
    );
  }

  function handleSkillCreated(newSkill) {
    setSkills((prev) => [...prev, { skill_id: newSkill.skill_id, name: newSkill.name }]);
    setSelectedSkillIds((prev) => [...prev, newSkill.skill_id]);
    setShowNewSkillModal(false);
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaveError(null);

    if (!form.name.trim()) {
      setSaveError('Nama project wajib diisi.');
      return;
    }

    setIsSaving(true);

    const { error: updateError } = await supabase
      .from('projects')
      .update({
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
      .eq('project_id', id);

    if (updateError) {
      setIsSaving(false);
      setSaveError('Gagal menyimpan perubahan. Coba lagi.');
      return;
    }

    // Sinkronkan project_skills: hapus semua, insert ulang sesuai pilihan saat ini.
    // Simpel & aman buat ukuran data kecil, meski bukan yang paling efisien.
    await supabase.from('project_skills').delete().eq('project_id', id);
    if (selectedSkillIds.length > 0) {
      await supabase.from('project_skills').insert(
        selectedSkillIds.map((skillId) => ({ project_id: id, skill_id: skillId }))
      );
    }

    setIsSaving(false);
  }

  async function handleAddLink(e) {
    e.preventDefault();
    setLinkError(null);

    if (!newLink.url.trim()) {
      setLinkError('URL wajib diisi.');
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();

    const { data, error } = await supabase
      .from('project_links')
      .insert({
        user_id: user.id,
        project_id: id,
        platform: newLink.platform.trim() || 'Link',
        url: newLink.url.trim(),
      })
      .select()
      .single();

    if (error) {
      setLinkError('Gagal menambahkan link.');
      return;
    }

    setLinks((prev) => [...prev, data]);
    setNewLink({ platform: '', url: '' });
  }

  async function handleDeleteLink(linkId) {
    const { error } = await supabase.from('project_links').delete().eq('project_link_id', linkId);
    if (!error) setLinks((prev) => prev.filter((l) => l.project_link_id !== linkId));
  }

  if (loading) {
    return (
      <div className="app-layout">
        <Sidebar />
        <main className="main-content">
          <p className="project-detail-empty">Memuat project...</p>
        </main>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="app-layout">
        <Sidebar />
        <main className="main-content">
          <p className="project-detail-empty">{loadError}</p>
        </main>
      </div>
    );
  }

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <Topbar userName="User1" />

        <button className="project-back-btn" onClick={() => navigate('/projects')}>
          <ArrowLeft size={16} />
          Back
        </button>

        <h1 className="project-detail-title">{form.name}</h1>
        {form.description && <p className="project-detail-description">{form.description}</p>}

        <div className="project-detail-tabs">
          <button
            className={`project-tab ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            className={`project-tab ${activeTab === 'links' ? 'active' : ''}`}
            onClick={() => setActiveTab('links')}
          >
            Files & Links
          </button>
        </div>

        {activeTab === 'overview' && (
          <form className="project-overview-form" onSubmit={handleSave}>
            <div className="entity-form-field">
              <label className="entity-form-label">Nama Project</label>
              <input
                type="text"
                name="name"
                className="entity-form-input"
                value={form.name}
                onChange={handleChange}
              />
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
                <label className="entity-form-label">Tipe Project</label>
                <input
                  type="text"
                  name="project_type"
                  className="entity-form-input"
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
                  value={form.start_date || ''}
                  onChange={handleChange}
                />
              </div>
              <div className="entity-form-field">
                <label className="entity-form-label">Tanggal Selesai</label>
                <input
                  type="date"
                  name="end_date"
                  className="entity-form-input"
                  value={form.end_date || ''}
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

            {saveError && <p className="entity-form-error">{saveError}</p>}

            <button type="submit" className="modal-got-it-btn project-save-btn" disabled={isSaving}>
              {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
          </form>
        )}

        {activeTab === 'links' && (
          <div className="project-links-panel">
            {links.length === 0 ? (
              <p className="project-detail-empty">Belum ada file/link yang ditambahkan.</p>
            ) : (
              <div className="project-links-list">
                {links.map((link) => (
                  <div className="project-link-item" key={link.project_link_id}>
                    <div>
                      <p className="project-link-platform">{link.platform}</p>
                      <a href={link.url} target="_blank" rel="noopener noreferrer" className="project-link-url">
                        {link.url}
                        <ExternalLink size={12} />
                      </a>
                    </div>
                    <button className="project-link-delete" onClick={() => handleDeleteLink(link.project_link_id)}>
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <form className="project-link-form" onSubmit={handleAddLink}>
              <input
                type="text"
                placeholder="Label (contoh: GitHub, ERD, Live Demo)"
                className="entity-form-input"
                value={newLink.platform}
                onChange={(e) => setNewLink((prev) => ({ ...prev, platform: e.target.value }))}
              />
              <input
                type="text"
                placeholder="https://..."
                className="entity-form-input"
                value={newLink.url}
                onChange={(e) => setNewLink((prev) => ({ ...prev, url: e.target.value }))}
              />
              <button type="submit" className="project-link-add-btn">
                <Plus size={16} />
              </button>
            </form>
            {linkError && <p className="entity-form-error">{linkError}</p>}
          </div>
        )}

        {showNewSkillModal && (
          <NewSkillModal
            onClose={() => setShowNewSkillModal(false)}
            onCreated={handleSkillCreated}
          />
        )}
      </main>
    </div>
  );
}

export default ProjectDetail;