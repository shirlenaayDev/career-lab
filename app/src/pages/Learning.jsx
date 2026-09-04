import { useEffect, useMemo, useState } from 'react';
import { Plus, Search, HelpCircle, BookOpen, Target, Sparkles } from 'lucide-react';
import { supabase } from '../supabaseClient';
import Sidebar from '../components/layout/Sidebar';
import Topbar from '../components/layout/Topbar';
import LearningCard from '../components/learning/LearningCard';
import NewLearningModal from '../components/learning/NewLearningModal';
import LearningDetailModal from '../components/learning/LearningDetailModal';
import HowItWorksModal from '../components/career-paths/HowItWorksModal';
import '../pages/CareerPaths.css';
import './Learning.css';

const filterTabs = ['Semua', 'Not Started', 'In Progress', 'Completed'];

const learningSteps = [
  {
    icon: BookOpen,
    title: 'Catat yang Kamu Pelajari',
    description: 'Course, buku, video, artikel — apa aja yang lagi kamu pelajari buat ningkatin skill.',
  },
  {
    icon: Target,
    title: 'Update Progress',
    description: 'Geser progress bar seiring kamu maju, biar keliatan seberapa jauh udah jalan.',
  },
  {
    icon: Sparkles,
    title: 'Kaitkan ke Skill',
    description: 'Tandai skill yang kamu bangun dari learning ini, biar nyambung ke keseluruhan perjalanan kamu.',
  },
];

function mapLearning(row, skillsByLearning) {
  return {
    id: row.learning_id,
    title: row.title,
    learningType: row.learning_type,
    platform: row.platform,
    description: row.description,
    status: row.status,
    progressPercentage: row.progress_percentage,
    estimatedHours: row.estimated_hours,
    startDate: row.start_date,
    endDate: row.end_date,
    skillNames: skillsByLearning[row.learning_id] || [],
  };
}

function Learning() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('Semua');
  const [showNewModal, setShowNewModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  async function fetchLearning() {
    setLoading(true);
    setLoadError(null);

    const { data: learningSkillRows } = await supabase
      .from('learning_skills')
      .select('learning_id, skills(name)');

    const skillsByLearning = {};
    (learningSkillRows || []).forEach((row) => {
      if (!skillsByLearning[row.learning_id]) skillsByLearning[row.learning_id] = [];
      if (row.skills?.name) skillsByLearning[row.learning_id].push(row.skills.name);
    });

    const { data, error } = await supabase
      .from('learning')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      setLoadError('Gagal memuat data learning.');
      setLoading(false);
      return;
    }

    setItems(data.map((row) => mapLearning(row, skillsByLearning)));
    setLoading(false);
  }

  useEffect(() => {
    fetchLearning();
  }, []);

  function handleCreated() {
    fetchLearning();
  }

  function handleUpdated() {
    fetchLearning();
  }

  async function handleDelete(id) {
    if (!window.confirm('Hapus learning ini? Tindakan ini nggak bisa dibatalkan.')) return;
    await supabase.from('learning_skills').delete().eq('learning_id', id);
    const { error } = await supabase.from('learning').delete().eq('learning_id', id);
    if (!error) setItems((prev) => prev.filter((i) => i.id !== id));
  }

  async function handleDuplicate(id) {
    const original = items.find((i) => i.id === id);
    if (!original) return;

    const { data: { user } } = await supabase.auth.getUser();

    const { data: newItem, error } = await supabase
      .from('learning')
      .insert({
        user_id: user.id,
        title: `${original.title} (copy)`,
        learning_type: original.learningType,
        platform: original.platform,
        description: original.description,
        status: 'Not Started',
        progress_percentage: 0,
        estimated_hours: original.estimatedHours,
        start_date: original.startDate,
        end_date: original.endDate,
      })
      .select()
      .single();

    if (error) return;

    const { data: skillRows } = await supabase
      .from('learning_skills')
      .select('skill_id')
      .eq('learning_id', id);

    if (skillRows?.length) {
      await supabase.from('learning_skills').insert(
        skillRows.map((r) => ({ learning_id: newItem.learning_id, skill_id: r.skill_id, user_id: user.id }))
      );
    }

    fetchLearning();
  }

  const displayedItems = useMemo(() => {
    let result = [...items];

    if (activeFilter !== 'Semua') {
      result = result.filter((i) => i.status === activeFilter);
    }

    if (searchTerm.trim()) {
      const term = searchTerm.trim().toLowerCase();
      result = result.filter((i) =>
        i.title?.toLowerCase().includes(term) || i.platform?.toLowerCase().includes(term)
      );
    }

    return result;
  }, [items, activeFilter, searchTerm]);

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <Topbar
          userName="User1"
          actionButton={
            <button className="topbar-new-path-btn" onClick={() => setShowNewModal(true)}>
              <Plus size={16} />
              New Learning
            </button>
          }
        />

        <div className="learning-header">
          <div>
            <h1 className="learning-title">Learning</h1>
            <p className="learning-subtitle">Semua course, buku, dan materi yang lagi atau udah kamu pelajari.</p>
          </div>
          <button className="career-experiments-help-btn" onClick={() => setShowHelpModal(true)}>
            <HelpCircle size={14} />
            Bagaimana cara kerja?
          </button>
        </div>

        <div className="learning-toolbar">
          <div className="learning-search">
            <Search size={18} className="learning-search-icon" />
            <input
              type="text"
              placeholder="Search Learning..."
              className="learning-search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="learning-filters">
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
          <p className="learning-empty">Memuat learning...</p>
        ) : loadError ? (
          <p className="learning-empty">{loadError}</p>
        ) : displayedItems.length === 0 ? (
          <p className="learning-empty">Belum ada learning di kategori ini.</p>
        ) : (
          <div className="learning-grid">
            {displayedItems.map((item) => (
              <LearningCard
                key={item.id}
                {...item}
                onViewDetail={setSelectedItem}
                onDelete={handleDelete}
                onDuplicate={handleDuplicate}
              />
            ))}
          </div>
        )}

        {showNewModal && (
          <NewLearningModal
            onClose={() => setShowNewModal(false)}
            onCreated={handleCreated}
          />
        )}

        {selectedItem && (
          <LearningDetailModal
            learning={selectedItem}
            onClose={() => setSelectedItem(null)}
            onUpdated={handleUpdated}
          />
        )}

        {showHelpModal && (
          <HowItWorksModal
            onClose={() => setShowHelpModal(false)}
            title="Bagaimana Cara Kerja Learning?"
            subtitle="Learning adalah bahan bakar buat skill kamu — catat dan pantau progressnya di sini."
            steps={learningSteps}
          />
        )}
      </main>
    </div>
  );
}

export default Learning;