import { useEffect, useMemo, useRef, useState } from 'react';
import { HelpCircle, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '../supabaseClient';
import Sidebar from '../components/layout/Sidebar';
import Topbar from '../components/layout/Topbar';
import CareerPathCard from '../components/career-paths/CareerPathCard';
import HowItWorksModal from '../components/career-paths/HowItWorksModal';
import NewPathModal from '../components/career-experiments/NewPathModal';
import PathDetailModal from '../components/career-paths/PathDetailModal';
import './CareerPaths.css';

const filterTabs = ['Semua', 'Exploring', 'Focus', 'Achieved'];

const sortOptions = [
  { value: 'terbaru', label: 'Terbaru' },
  { value: 'nama-az', label: 'Nama A-Z' },
  { value: 'priority-tinggi', label: 'Priority Tertinggi' },
  { value: 'priority-rendah', label: 'Priority Terendah' },
];

function mapPath(row) {
  return {
    id: row.career_path_id,
    name: row.name,
    description: row.description,
    why: row.why,
    priority: row.priority,
    targetTimeline: row.target_timeline,
    status: row.status,
  };
}

function CareerPaths() {
  const [paths, setPaths] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('Semua');
  const [sortBy, setSortBy] = useState('terbaru');
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showNewPathModal, setShowNewPathModal] = useState(false);
  const [selectedPath, setSelectedPath] = useState(null);
  const scrollRef = useRef(null);

  const currentSortLabel = sortOptions.find((o) => o.value === sortBy)?.label || 'Terbaru';

  async function fetchPaths() {
    setLoading(true);
    setLoadError(null);

    const { data, error } = await supabase
      .from('career_paths')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      setLoadError('Gagal memuat data career path.');
      setLoading(false);
      return;
    }

    setPaths(data.map(mapPath));
    setLoading(false);
  }

  useEffect(() => {
    fetchPaths();
  }, []);

  function handleCreated(newRow) {
    setPaths((prev) => [mapPath(newRow), ...prev]);
  }

  function handleUpdated(updatedRow) {
    const mapped = mapPath(updatedRow);
    setPaths((prev) => prev.map((p) => (p.id === mapped.id ? mapped : p)));
  }

  function scroll(direction) {
    if (scrollRef.current) {
      const amount = 320;
      scrollRef.current.scrollBy({ left: direction === 'left' ? -amount : amount, behavior: 'smooth' });
    }
  }

  function getCount(tab) {
    if (tab === 'Semua') return null;
    return paths.filter((p) => p.status === tab).length;
  }

  const displayedPaths = useMemo(() => {
    let result = activeFilter === 'Semua' ? [...paths] : paths.filter((p) => p.status === activeFilter);

    if (sortBy === 'nama-az') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'priority-tinggi') {
      result.sort((a, b) => a.priority - b.priority);
    } else if (sortBy === 'priority-rendah') {
      result.sort((a, b) => b.priority - a.priority);
    }

    return result;
  }, [paths, activeFilter, sortBy]);

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <Topbar
          userName="User1"
          actionButton={
            <button className="topbar-new-path-btn" onClick={() => setShowNewPathModal(true)}>
              <Plus size={16} />
              New Paths
            </button>
          }
        />

        <div className="career-paths-header">
          <div>
            <h1 className="career-paths-title">Career Paths</h1>
            <p className="career-paths-subtitle">
              Setiap path adalah eksperimen yang bisa dievaluasi, bukan komitmen permanen
            </p>
          </div>
          <button className="career-paths-help-btn" onClick={() => setShowHelpModal(true)}>
            <HelpCircle size={14} />
            Bagaimana cara kerja?
          </button>
        </div>

        <div className="career-paths-toolbar">
          <div className="career-paths-filters">
            {filterTabs.map((tab) => {
              const count = getCount(tab);
              return (
                <button
                  key={tab}
                  className={`filter-tab ${activeFilter === tab ? 'active' : ''}`}
                  onClick={() => setActiveFilter(tab)}
                >
                  {tab}{count !== null ? ` (${count})` : ''}
                </button>
              );
            })}
          </div>

          <div className="career-paths-actions">
            <div className="career-paths-sort-wrap">
              <button
                className="career-paths-sort"
                onClick={() => setShowSortMenu(!showSortMenu)}
              >
                Urutkan: {currentSortLabel}
              </button>
              {showSortMenu && (
                <div className="sort-menu">
                  {sortOptions.map((option) => (
                    <button
                      key={option.value}
                      className={`sort-menu-item ${sortBy === option.value ? 'active' : ''}`}
                      onClick={() => {
                        setSortBy(option.value);
                        setShowSortMenu(false);
                      }}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button className="career-paths-scroll-btn" onClick={() => scroll('left')}>
              <ChevronLeft size={18} />
            </button>
            <button className="career-paths-scroll-btn" onClick={() => scroll('right')}>
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {loading ? (
          <p className="career-paths-empty">Memuat career path...</p>
        ) : loadError ? (
          <p className="career-paths-empty">{loadError}</p>
        ) : displayedPaths.length === 0 ? (
          <p className="career-paths-empty">Belum ada path di kategori ini.</p>
        ) : (
          <div className="career-paths-scroll-wrap" ref={scrollRef}>
            {displayedPaths.map((path) => (
              <CareerPathCard key={path.id} {...path} onExplore={setSelectedPath} />
            ))}
          </div>
        )}

        {showHelpModal && <HowItWorksModal onClose={() => setShowHelpModal(false)} />}

        {showNewPathModal && (
          <NewPathModal
            onClose={() => setShowNewPathModal(false)}
            onCreated={handleCreated}
          />
        )}

        {selectedPath && (
          <PathDetailModal
            path={selectedPath}
            onClose={() => setSelectedPath(null)}
            onUpdated={handleUpdated}
          />
        )}
      </main>
    </div>
  );
}

export default CareerPaths;