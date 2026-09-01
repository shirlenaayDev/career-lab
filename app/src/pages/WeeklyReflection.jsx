import { useEffect, useMemo, useState } from 'react';
import { Plus, Flame, TrendingUp, NotebookPen, Target, HelpCircle } from 'lucide-react';
import { supabase } from '../supabaseClient';
import Sidebar from '../components/layout/Sidebar';
import Topbar from '../components/layout/Topbar';
import ReflectionCard from '../components/weekly-reflection/ReflectionCard';
import NewReflectionModal from '../components/weekly-reflection/NewReflectionModal';
import ReflectionDetailModal from '../components/weekly-reflection/ReflectionDetailModal';
import HowItWorksModal from '../components/career-paths/HowItWorksModal';
import '../pages/CareerPaths.css';
import './WeeklyReflection.css';

const reflectionSteps = [
  {
    icon: NotebookPen,
    title: 'Refleksi Tiap Minggu',
    description: 'Sisihkan waktu di akhir minggu buat nulis apa yang kamu kerjakan, tantangan, dan langkah selanjutnya.',
  },
  {
    icon: Flame,
    title: 'Jaga Konsistensi',
    description: 'Streak dihitung dari seberapa rutin kamu reflection tiap minggu — makin konsisten, makin kelihatan polanya.',
  },
  {
    icon: Target,
    title: 'Pantau Progress',
    description: 'Score & mood dari waktu ke waktu bantu kamu liat gimana perjalanan di career experiment yang lagi dijalanin.',
  },
];

const filterTabs = ['Semua', 'Minggu ini', 'Bulan ini'];

const sortOptions = [
  { value: 'terbaru', label: 'Terbaru' },
  { value: 'score-tinggi', label: 'Score Tertinggi' },
  { value: 'score-rendah', label: 'Score Terendah' },
];

function mapReflection(row, experimentTitleById) {
  return {
    id: row.reflection_id,
    careerExperimentId: row.career_experiment_id,
    experimentTitle: experimentTitleById[row.career_experiment_id] || null,
    week: row.week,
    weekStartDate: row.week_start_date,
    reflection: row.reflection,
    challenge: row.challenge,
    improvement: row.improvement,
    nextAction: row.next_action,
    mood: row.mood,
    score: row.score,
    createdAt: row.created_at,
  };
}

function computeStreak(reflectionsAsc) {
  if (reflectionsAsc.length === 0) return 0;
  let streak = 1;
  for (let i = reflectionsAsc.length - 1; i > 0; i--) {
    const diffDays = (new Date(reflectionsAsc[i].createdAt) - new Date(reflectionsAsc[i - 1].createdAt)) / 86400000;
    if (diffDays <= 8) streak++;
    else break;
  }
  return streak;
}

function isWithinDays(dateStr, days) {
  const diff = (Date.now() - new Date(dateStr).getTime()) / 86400000;
  return diff <= days;
}

function WeeklyReflection() {
  const [reflections, setReflections] = useState([]);
  const [currentFocusPath, setCurrentFocusPath] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('Semua');
  const [sortBy, setSortBy] = useState('terbaru');
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [showNewModal, setShowNewModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [selectedReflection, setSelectedReflection] = useState(null);

  const currentSortLabel = sortOptions.find((o) => o.value === sortBy)?.label || 'Terbaru';

  async function fetchAll() {
    setLoading(true);
    setLoadError(null);

    const [{ data: expData, error: expError }, { data: pathData, error: pathError }] = await Promise.all([
      supabase.from('career_experiments').select('career_experiment_id, experiment_title'),
      supabase.from('career_paths').select('name, status').eq('status', 'Focus').limit(1),
    ]);

    if (expError) {
      setLoadError('Gagal memuat data.');
      setLoading(false);
      return;
    }

    const experimentTitleById = {};
    (expData || []).forEach((e) => { experimentTitleById[e.career_experiment_id] = e.experiment_title; });

    setCurrentFocusPath(pathError || !pathData?.length ? null : pathData[0].name);

    const { data, error } = await supabase
      .from('weekly_reflections')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      setLoadError('Gagal memuat data reflection.');
      setLoading(false);
      return;
    }

    setReflections(data.map((row) => mapReflection(row, experimentTitleById)));
    setLoading(false);
  }

  useEffect(() => {
    fetchAll();
  }, []);

  function handleCreated() {
    fetchAll();
  }

  function handleUpdated() {
    fetchAll();
  }

  async function handleDelete(id) {
    if (!window.confirm('Hapus reflection ini? Tindakan ini nggak bisa dibatalkan.')) return;
    const { error } = await supabase.from('weekly_reflections').delete().eq('reflection_id', id);
    if (!error) fetchAll();
  }

  async function handleDuplicate(r) {
    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await supabase.from('weekly_reflections').insert({
      user_id: user.id,
      career_experiment_id: r.careerExperimentId,
      week: `${r.week} (copy)`,
      week_start_date: r.weekStartDate || null,
      mood: r.mood,
      score: r.score,
      reflection: '',
      challenge: r.challenge,
      next_action: r.nextAction,
      improvement: r.improvement,
    });
    if (!error) fetchAll();
  }

  const displayedReflections = useMemo(() => {
    let result = [...reflections];

    if (activeFilter === 'Minggu ini') {
      result = result.filter((r) => isWithinDays(r.createdAt, 7));
    } else if (activeFilter === 'Bulan ini') {
      result = result.filter((r) => isWithinDays(r.createdAt, 30));
    }

    if (sortBy === 'score-tinggi') {
      result.sort((a, b) => (b.score || 0) - (a.score || 0));
    } else if (sortBy === 'score-rendah') {
      result.sort((a, b) => (a.score || 0) - (b.score || 0));
    }

    return result;
  }, [reflections, activeFilter, sortBy]);

  const stats = useMemo(() => {
    const ascending = [...reflections].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    const scored = reflections.filter((r) => r.score != null);
    const avgScore = scored.length
      ? (scored.reduce((sum, r) => sum + r.score, 0) / scored.length).toFixed(1)
      : null;

    return {
      streak: computeStreak(ascending),
      avgScore,
      total: reflections.length,
    };
  }, [reflections]);

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <Topbar
          userName="User1"
          actionButton={
            <button className="topbar-new-path-btn" onClick={() => setShowNewModal(true)}>
              <Plus size={16} />
              New Reflections
            </button>
          }
        />

        <div className="weekly-reflection-header">
          <div className="weekly-reflection-header-top">
            <h1 className="weekly-reflection-title">Weekly Reflection</h1>
            <button className="career-experiments-help-btn" onClick={() => setShowHelpModal(true)}>
              <HelpCircle size={14} />
              Bagaimana cara kerja?
            </button>
          </div>
          <p className="weekly-reflection-subtitle">
            Luangkan waktu sejenak untuk mereflekasi, belajar, dan bertumbuh setiap minggu.
          </p>
        </div>

        <div className="wr-stats-grid">
          <div className="wr-stat-card">
            <div className="wr-stat-icon" style={{ background: 'rgba(248, 113, 113, 0.15)' }}>
              <Flame size={22} color="#F87171" />
            </div>
            <p className="wr-stat-label">Streak</p>
            <p className="wr-stat-value">{stats.streak}</p>
            <p className="wr-stat-sub">minggu berturut-turut</p>
          </div>

          <div className="wr-stat-card">
            <div className="wr-stat-icon" style={{ background: 'rgba(76, 216, 196, 0.15)' }}>
              <TrendingUp size={22} color="#4CD8C4" />
            </div>
            <p className="wr-stat-label">Average Score</p>
            <p className="wr-stat-value">{stats.avgScore ?? '-'}<span className="wr-stat-unit">/10</span></p>
          </div>

          <div className="wr-stat-card">
            <div className="wr-stat-icon" style={{ background: 'rgba(108, 124, 251, 0.15)' }}>
              <NotebookPen size={22} color="#6C7CFB" />
            </div>
            <p className="wr-stat-label">Total Reflection</p>
            <p className="wr-stat-value">{stats.total}</p>
          </div>

          <div className="wr-stat-card">
            <div className="wr-stat-icon" style={{ background: 'rgba(244, 192, 102, 0.15)' }}>
              <Target size={22} color="#F4C066" />
            </div>
            <p className="wr-stat-label">Current Focus</p>
            <p className="wr-stat-value wr-stat-value-text">{currentFocusPath || 'Belum ada'}</p>
            <p className="wr-stat-sub">Focus Path</p>
          </div>
        </div>

        <div className="weekly-reflection-toolbar">
          <div className="weekly-reflection-filters">
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

          <div className="wr-sort-wrap">
            <button className="wr-sort-trigger" onClick={() => setShowSortMenu(!showSortMenu)}>
              Urutkan: {currentSortLabel}
            </button>
            {showSortMenu && (
              <div className="sort-menu">
                {sortOptions.map((option) => (
                  <button
                    key={option.value}
                    className={`sort-menu-item ${sortBy === option.value ? 'active' : ''}`}
                    onClick={() => { setSortBy(option.value); setShowSortMenu(false); }}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {loading ? (
          <p className="weekly-reflection-empty">Memuat reflection...</p>
        ) : loadError ? (
          <p className="weekly-reflection-empty">{loadError}</p>
        ) : displayedReflections.length === 0 ? (
          <p className="weekly-reflection-empty">Belum ada reflection di kategori ini.</p>
        ) : (
          <div className="weekly-reflection-list">
            {displayedReflections.map((r) => (
              <ReflectionCard
                key={r.id}
                {...r}
                onEdit={setSelectedReflection}
                onDelete={handleDelete}
                onDuplicate={handleDuplicate}
              />
            ))}
          </div>
        )}

        {showNewModal && (
          <NewReflectionModal
            onClose={() => setShowNewModal(false)}
            onCreated={handleCreated}
          />
        )}

        {selectedReflection && (
          <ReflectionDetailModal
            reflection={selectedReflection}
            onClose={() => setSelectedReflection(null)}
            onUpdated={handleUpdated}
          />
        )}

        {showHelpModal && (
          <HowItWorksModal
            onClose={() => setShowHelpModal(false)}
            title="Bagaimana Cara Kerja Weekly Reflection?"
            subtitle="Refleksi mingguan bantu kamu belajar dari pengalaman, bukan cuma jalanin experiment tanpa evaluasi."
            steps={reflectionSteps}
          />
        )}
      </main>
    </div>
  );
}

export default WeeklyReflection;