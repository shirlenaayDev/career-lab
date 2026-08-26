import { useState, useMemo, useRef } from 'react';
import { HelpCircle, Plus, Compass, BarChart3, Boxes, Palette, ChevronLeft, ChevronRight } from 'lucide-react';
import Sidebar from '../components/layout/Sidebar';
import Topbar from '../components/layout/Topbar';
import CareerPathCard from '../components/career-paths/CareerPathCard';
import HowItWorksModal from '../components/career-paths/HowItWorksModal';
import './CareerPaths.css';

const filterTabs = ['Semua', 'Active', 'Exploring', 'On Hold', 'Archived'];

const sortOptions = [
  { value: 'terbaru', label: 'Terbaru' },
  { value: 'nama-az', label: 'Nama A-Z' },
  { value: 'confidence-tinggi', label: 'Confidence Tertinggi' },
  { value: 'confidence-rendah', label: 'Confidence Terendah' },
];

const paths = [
  {
    icon: Compass,
    title: 'Business Analyst',
    description: 'Mengubah data menjadi insight untuk keputusan bisnis.',
    status: 'Active',
    confidenceScore: 72,
    confidenceChange: 8,
    projects: 6,
    experience: 2,
    skills: 12,
    tags: ['Data', 'Excel', 'SQL', 'Requirements', 'Stakeholder Mgmt', 'Documentation'],
    ringColor: '#6C7CFB',
    iconColor: '#6C7CFB',
    iconBg: 'rgba(108, 124, 251, 0.15)',
  },
  {
    icon: BarChart3,
    title: 'Data Analyst',
    description: 'Menganalisis data untuk menemukan pola dan insight.',
    status: 'Exploring',
    confidenceScore: 48,
    confidenceChange: 4,
    projects: 4,
    experience: 1,
    skills: 8,
    tags: ['Tableau', 'SQL', 'Data Visualisation', 'Python', 'Statistics', 'Excel'],
    ringColor: '#F4C066',
    iconColor: '#F4C066',
    iconBg: 'rgba(244, 192, 102, 0.15)',
  },
  {
    icon: Boxes,
    title: 'Product Manager',
    description: 'Menghubungkan user, bisnis, dan teknologi.',
    status: 'Exploring',
    confidenceScore: 36,
    confidenceChange: 0,
    projects: 3,
    experience: 1,
    skills: 7,
    tags: ['Product', 'Roadmap', 'User Story', 'Agile', 'Prioritization'],
    ringColor: '#4CD8C4',
    iconColor: '#4CD8C4',
    iconBg: 'rgba(76, 216, 196, 0.15)',
  },
  {
    icon: Palette,
    title: 'UI/UX Designer',
    description: 'Merancang pengalaman digital yang bermakna dan intuitif.',
    status: 'On Hold',
    confidenceScore: 0,
    confidenceChange: 0,
    projects: 2,
    experience: 0,
    skills: 5,
    tags: ['Figma', 'UI Design', 'User Research', 'Wireframing'],
    ringColor: '#5EC3D6',
    iconColor: '#5EC3D6',
    iconBg: 'rgba(94, 195, 214, 0.15)',
  },
];

function CareerPaths() {
  const [activeFilter, setActiveFilter] = useState('Semua');
  const [sortBy, setSortBy] = useState('terbaru');
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const scrollRef = useRef(null);

  const currentSortLabel = sortOptions.find((o) => o.value === sortBy)?.label || 'Terbaru';

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
      result.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === 'confidence-tinggi') {
      result.sort((a, b) => b.confidenceScore - a.confidenceScore);
    } else if (sortBy === 'confidence-rendah') {
      result.sort((a, b) => a.confidenceScore - b.confidenceScore);
    }

    return result;
  }, [activeFilter, sortBy]);

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <Topbar
          userName="User1"
          actionButton={
            <button className="topbar-new-path-btn">
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

        {displayedPaths.length === 0 ? (
          <p className="career-paths-empty">Belum ada path di kategori ini.</p>
        ) : (
          <div className="career-paths-scroll-wrap" ref={scrollRef}>
            {displayedPaths.map((path, i) => (
              <CareerPathCard key={i} {...path} />
            ))}
          </div>
        )}

        {showHelpModal && <HowItWorksModal onClose={() => setShowHelpModal(false)} />}
      </main>
    </div>
  );
}

export default CareerPaths;