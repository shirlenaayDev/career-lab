import { useRef } from 'react';
import { HelpCircle, Plus, Compass, BarChart3, Boxes, Palette, ChevronLeft, ChevronRight } from 'lucide-react';
import Sidebar from '../components/layout/Sidebar';
import Topbar from '../components/layout/Topbar';
import CareerPathCard from '../components/career-paths/CareerPathCard';
import './CareerPaths.css';

const filterTabs = [
  { label: 'Semua', count: null },
  { label: 'Active', count: 1 },
  { label: 'Exploring', count: 2 },
  { label: 'On Hold', count: 1 },
  { label: 'Archived', count: 0 },
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
  const scrollRef = useRef(null);

  function scroll(direction) {
    if (scrollRef.current) {
      const amount = 320;
      scrollRef.current.scrollBy({ left: direction === 'left' ? -amount : amount, behavior: 'smooth' });
    }
  }

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
          <button className="career-paths-help-btn">
            <HelpCircle size={14} />
            Bagaimana cara kerja?
          </button>
        </div>

        <div className="career-paths-toolbar">
          <div className="career-paths-filters">
            {filterTabs.map((tab, i) => (
              <button key={i} className={`filter-tab ${i === 0 ? 'active' : ''}`}>
                {tab.label}{tab.count !== null ? ` (${tab.count})` : ''}
              </button>
            ))}
          </div>

          <div className="career-paths-actions">
            <select className="career-paths-sort">
              <option>Urutkan: Terbaru</option>
            </select>
            <button className="career-paths-scroll-btn" onClick={() => scroll('left')}>
              <ChevronLeft size={18} />
            </button>
            <button className="career-paths-scroll-btn" onClick={() => scroll('right')}>
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        <div className="career-paths-scroll-wrap" ref={scrollRef}>
          {paths.map((path, i) => (
            <CareerPathCard key={i} {...path} />
          ))}
        </div>
      </main>
    </div>
  );
}

export default CareerPaths;