import { useEffect, useMemo, useState } from 'react';
import { Plus, Search, HelpCircle, Sparkles, TrendingUp, Clock } from 'lucide-react';
import { supabase } from '../supabaseClient';
import Sidebar from '../components/layout/Sidebar';
import Topbar from '../components/layout/Topbar';
import SkillCard from '../components/skills/SkillCard';
import NewSkillModal from '../components/skills/NewSkillModal';
import SkillDetailModal from '../components/skills/SkillDetailModal';
import HowItWorksModal from '../components/career-paths/HowItWorksModal';
import '../pages/CareerPaths.css';
import './Skills.css';

const filterTabs = ['Semua', 'Technical', 'Soft Skill', 'Tool', 'Language', 'Other'];

const skillSteps = [
  {
    icon: Sparkles,
    title: 'Catat Skill Kamu',
    description: 'Tambahin skill yang lagi kamu pelajari atau udah kamu kuasai — teknis maupun soft skill.',
  },
  {
    icon: TrendingUp,
    title: 'Update Proficiency',
    description: 'Naikin level (Beginner → Expert) seiring kamu makin sering pakai skill itu di project atau experience.',
  },
  {
    icon: Clock,
    title: 'Pantau yang Jarang Dipakai',
    description: 'Tanggal "terakhir dipakai" bantu kamu liat skill mana yang mulai jarang disentuh, biar bisa di-refresh lagi.',
  },
];

function mapSkill(row) {
  return {
    id: row.skill_id,
    name: row.name,
    category: row.category,
    description: row.description,
    proficiencyLevel: row.proficiency_level,
    lastPracticed: row.last_practiced,
    notes: row.notes,
  };
}

function Skills() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('Semua');
  const [showNewModal, setShowNewModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState(null);

  async function fetchSkills() {
    setLoading(true);
    setLoadError(null);

    const { data, error } = await supabase
      .from('skills')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      setLoadError('Gagal memuat data skill.');
      setLoading(false);
      return;
    }

    setSkills(data.map(mapSkill));
    setLoading(false);
  }

  useEffect(() => {
    fetchSkills();
  }, []);

  function handleCreated(newRow) {
    setSkills((prev) => [mapSkill(newRow), ...prev]);
  }

  function handleUpdated(updatedRow) {
    const mapped = mapSkill(updatedRow);
    setSkills((prev) => prev.map((s) => (s.id === mapped.id ? mapped : s)));
  }

  const displayedSkills = useMemo(() => {
    let result = [...skills];

    if (activeFilter !== 'Semua') {
      result = result.filter((s) => s.category === activeFilter);
    }

    if (searchTerm.trim()) {
      const term = searchTerm.trim().toLowerCase();
      result = result.filter((s) => s.name?.toLowerCase().includes(term));
    }

    return result;
  }, [skills, activeFilter, searchTerm]);

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <Topbar
          userName="User1"
          actionButton={
            <button className="topbar-new-path-btn" onClick={() => setShowNewModal(true)}>
              <Plus size={16} />
              New Skills
            </button>
          }
        />

        <div className="skills-header">
          <div>
            <h1 className="skills-title">Skills</h1>
            <p className="skills-subtitle">Semua skill yang kamu latih dan kembangkan lewat project & experience.</p>
          </div>
          <button className="career-experiments-help-btn" onClick={() => setShowHelpModal(true)}>
            <HelpCircle size={14} />
            Bagaimana cara kerja?
          </button>
        </div>

        <div className="skills-toolbar">
          <div className="skills-search">
            <Search size={18} className="skills-search-icon" />
            <input
              type="text"
              placeholder="Search Skills..."
              className="skills-search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="skills-filters">
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
          <p className="skills-empty">Memuat skill...</p>
        ) : loadError ? (
          <p className="skills-empty">{loadError}</p>
        ) : displayedSkills.length === 0 ? (
          <p className="skills-empty">Belum ada skill di kategori ini.</p>
        ) : (
          <div className="skills-grid">
            {displayedSkills.map((s) => (
              <SkillCard key={s.id} {...s} onViewDetail={setSelectedSkill} />
            ))}
          </div>
        )}

        {showNewModal && (
          <NewSkillModal
            onClose={() => setShowNewModal(false)}
            onCreated={handleCreated}
          />
        )}

        {selectedSkill && (
          <SkillDetailModal
            skill={selectedSkill}
            onClose={() => setSelectedSkill(null)}
            onUpdated={handleUpdated}
          />
        )}

        {showHelpModal && (
          <HowItWorksModal
            onClose={() => setShowHelpModal(false)}
            title="Bagaimana Cara Kerja Skills?"
            subtitle="Skill kamu berkembang lewat pemakaian nyata di project & experience, bukan cuma daftar di CV."
            steps={skillSteps}
          />
        )}
      </main>
    </div>
  );
}

export default Skills;