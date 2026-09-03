import { useEffect, useMemo, useState } from 'react';
import { Plus, Search, HelpCircle, Briefcase, Award, Sparkles } from 'lucide-react';
import { supabase } from '../supabaseClient';
import Sidebar from '../components/layout/Sidebar';
import Topbar from '../components/layout/Topbar';
import ExperienceCard from '../components/experiences/ExperienceCard';
import NewExperienceModal from '../components/experiences/NewExperienceModal';
import ExperienceDetailModal from '../components/experiences/ExperienceDetailModal';
import HowItWorksModal from '../components/career-paths/HowItWorksModal';
import '../pages/CareerPaths.css';
import './Experiences.css';

const filterTabs = ['Semua', 'Internship', 'Organization', 'Volunteer', 'Competition', 'Other'];

const experienceSteps = [
  {
    icon: Briefcase,
    title: 'Catat Pengalamanmu',
    description: 'Internship, organisasi, volunteer, kompetisi — semua pengalaman nyata yang bentuk skill kamu.',
  },
  {
    icon: Sparkles,
    title: 'Kaitkan ke Skill',
    description: 'Tandai skill apa aja yang kamu asah lewat experience ini, biar keliatan koneksinya.',
  },
  {
    icon: Award,
    title: 'Highlight Achievement',
    description: 'Catat pencapaian spesifik — ini yang bakal jadi bukti kuat pas apply kerja nanti.',
  },
];

function mapExperience(row, skillsByExperience) {
  return {
    id: row.experience_id,
    name: row.name,
    category: row.category,
    organization: row.organization,
    role: row.role,
    startDate: row.start_date,
    endDate: row.end_date,
    description: row.description,
    achievement: row.achievement,
    notes: row.notes,
    skillNames: skillsByExperience[row.experience_id] || [],
  };
}

function Experiences() {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('Semua');
  const [showNewModal, setShowNewModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [selectedExperience, setSelectedExperience] = useState(null);

  async function fetchExperiences() {
    setLoading(true);
    setLoadError(null);

    const { data: expSkillRows } = await supabase
      .from('experience_skills')
      .select('experience_id, skills(name)');

    const skillsByExperience = {};
    (expSkillRows || []).forEach((row) => {
      if (!skillsByExperience[row.experience_id]) skillsByExperience[row.experience_id] = [];
      if (row.skills?.name) skillsByExperience[row.experience_id].push(row.skills.name);
    });

    const { data, error } = await supabase
      .from('experiences')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      setLoadError('Gagal memuat data experience.');
      setLoading(false);
      return;
    }

    setExperiences(data.map((row) => mapExperience(row, skillsByExperience)));
    setLoading(false);
  }

  useEffect(() => {
    fetchExperiences();
  }, []);

  function handleCreated() {
    fetchExperiences();
  }

  function handleUpdated() {
    fetchExperiences();
  }

  const displayedExperiences = useMemo(() => {
    let result = [...experiences];

    if (activeFilter !== 'Semua') {
      result = result.filter((e) => e.category === activeFilter);
    }

    if (searchTerm.trim()) {
      const term = searchTerm.trim().toLowerCase();
      result = result.filter((e) =>
        e.name?.toLowerCase().includes(term) ||
        e.organization?.toLowerCase().includes(term) ||
        e.role?.toLowerCase().includes(term)
      );
    }

    return result;
  }, [experiences, activeFilter, searchTerm]);

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <Topbar
          userName="User1"
          actionButton={
            <button className="topbar-new-path-btn" onClick={() => setShowNewModal(true)}>
              <Plus size={16} />
              New Experiences
            </button>
          }
        />

        <div className="experiences-header">
          <div>
            <h1 className="experiences-title">Experiences</h1>
            <p className="experiences-subtitle">Semua pengalaman yang membentuk perjalanan karirmu.</p>
          </div>
          <button className="career-experiments-help-btn" onClick={() => setShowHelpModal(true)}>
            <HelpCircle size={14} />
            Bagaimana cara kerja?
          </button>
        </div>

        <div className="experiences-toolbar">
          <div className="experiences-search">
            <Search size={18} className="experiences-search-icon" />
            <input
              type="text"
              placeholder="Search Experiences..."
              className="experiences-search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="experiences-filters">
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
          <p className="experiences-empty">Memuat experience...</p>
        ) : loadError ? (
          <p className="experiences-empty">{loadError}</p>
        ) : displayedExperiences.length === 0 ? (
          <p className="experiences-empty">Belum ada experience di kategori ini.</p>
        ) : (
          <div className="experiences-grid">
            {displayedExperiences.map((e) => (
              <ExperienceCard key={e.id} {...e} onViewDetail={setSelectedExperience} />
            ))}
          </div>
        )}

        {showNewModal && (
          <NewExperienceModal
            onClose={() => setShowNewModal(false)}
            onCreated={handleCreated}
          />
        )}

        {selectedExperience && (
          <ExperienceDetailModal
            experience={selectedExperience}
            onClose={() => setSelectedExperience(null)}
            onUpdated={handleUpdated}
          />
        )}

        {showHelpModal && (
          <HowItWorksModal
            onClose={() => setShowHelpModal(false)}
            title="Bagaimana Cara Kerja Experiences?"
            subtitle="Experience adalah rekam jejak nyata dari internship, organisasi, volunteer, sampai kompetisi yang kamu ikuti."
            steps={experienceSteps}
          />
        )}
      </main>
    </div>
  );
}

export default Experiences;