import { useEffect, useMemo, useState } from 'react';
import { Plus, Search, HelpCircle, FolderKanban, Link2, Sparkles } from 'lucide-react';
import { supabase } from '../supabaseClient';
import Sidebar from '../components/layout/Sidebar';
import Topbar from '../components/layout/Topbar';
import ProjectCard from '../components/projects/ProjectCard';
import NewProjectModal from '../components/projects/NewProjectModal';
import HowItWorksModal from '../components/career-paths/HowItWorksModal';
import '../pages/CareerPaths.css';
import './Projects.css';

const projectSteps = [
  {
    icon: FolderKanban,
    title: 'Dokumentasikan Project',
    description: 'Catat setiap project yang kamu kerjakan — nama, role, skill yang dipakai, dan periode pengerjaannya.',
  },
  {
    icon: Sparkles,
    title: 'Kaitkan ke Skill',
    description: 'Tandai skill yang kamu latih di project ini, biar kelihatan progress skill kamu dari waktu ke waktu.',
  },
  {
    icon: Link2,
    title: 'Simpan Evidence',
    description: 'Tambahkan link pendukung (GitHub, Figma, live demo, dokumentasi) di tab Files & Links sebagai bukti nyata.',
  },
];

function mapProject(row, skillsByProject) {
  return {
    id: row.project_id,
    name: row.name,
    description: row.description,
    projectType: row.project_type,
    role: row.role,
    semester: row.semester,
    status: row.status,
    startDate: row.start_date,
    endDate: row.end_date,
    notes: row.notes,
    skillNames: skillsByProject[row.project_id] || [],
  };
}

function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('Semua');
  const [showNewModal, setShowNewModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);

  async function fetchProjects() {
    setLoading(true);
    setLoadError(null);

    const { data: projectSkillRows } = await supabase
      .from('project_skills')
      .select('project_id, skills(name)');

    const skillsByProject = {};
    (projectSkillRows || []).forEach((row) => {
      if (!skillsByProject[row.project_id]) skillsByProject[row.project_id] = [];
      if (row.skills?.name) skillsByProject[row.project_id].push(row.skills.name);
    });

    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      setLoadError('Gagal memuat data project.');
      setLoading(false);
      return;
    }

    setProjects(data.map((row) => mapProject(row, skillsByProject)));
    setLoading(false);
  }

  useEffect(() => {
    fetchProjects();
  }, []);

  function handleCreated(newRow) {
    setProjects((prev) => [mapProject(newRow, {}), ...prev]);
  }

  const filterTabs = useMemo(() => {
    const types = [...new Set(projects.map((p) => p.projectType).filter(Boolean))];
    return ['Semua', ...types];
  }, [projects]);

  const displayedProjects = useMemo(() => {
    let result = [...projects];

    if (activeFilter !== 'Semua') {
      result = result.filter((p) => p.projectType === activeFilter);
    }

    if (searchTerm.trim()) {
      const term = searchTerm.trim().toLowerCase();
      result = result.filter((p) =>
        p.name?.toLowerCase().includes(term) ||
        p.description?.toLowerCase().includes(term) ||
        p.role?.toLowerCase().includes(term)
      );
    }

    return result;
  }, [projects, activeFilter, searchTerm]);

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <Topbar
          userName="User1"
          actionButton={
            <button className="topbar-new-path-btn" onClick={() => setShowNewModal(true)}>
              <Plus size={16} />
              New Projects
            </button>
          }
        />

        <div className="projects-header">
          <div>
            <h1 className="projects-title">Projects</h1>
            <p className="projects-subtitle">Semua project yang kamu kerjakan dan dokumentasikan sebagai evidence.</p>
          </div>
          <button className="career-experiments-help-btn" onClick={() => setShowHelpModal(true)}>
            <HelpCircle size={14} />
            Bagaimana cara kerja?
          </button>
        </div>

        <div className="projects-toolbar">
          <div className="projects-search">
            <Search size={18} className="projects-search-icon" />
            <input
              type="text"
              placeholder="Search Projects..."
              className="projects-search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="projects-filters">
            {filterTabs.map((tab) => (
              <button
                key={tab}
                className={`filter-tab ${activeFilter === tab ? 'active' : ''}`}
                onClick={() => setActiveFilter(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <p className="projects-empty">Memuat project...</p>
        ) : loadError ? (
          <p className="projects-empty">{loadError}</p>
        ) : displayedProjects.length === 0 ? (
          <p className="projects-empty">Belum ada project di kategori ini.</p>
        ) : (
          <div className="projects-grid">
            {displayedProjects.map((p) => (
              <ProjectCard key={p.id} {...p} />
            ))}
          </div>
        )}

        {showNewModal && (
          <NewProjectModal
            onClose={() => setShowNewModal(false)}
            onCreated={handleCreated}
          />
        )}

        {showHelpModal && (
          <HowItWorksModal
            onClose={() => setShowHelpModal(false)}
            title="Bagaimana Cara Kerja Projects?"
            subtitle="Project adalah bukti nyata dari skill dan pengalaman yang kamu kembangkan."
            steps={projectSteps}
          />
        )}
      </main>
    </div>
  );
}

export default Projects;