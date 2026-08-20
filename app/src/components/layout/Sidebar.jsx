import { Compass, FlaskConical, NotebookPen, FolderKanban, Briefcase as ExperienceIcon, Sparkles, GraduationCap, Award, Send, MessageSquareQuote, Settings, LayoutDashboard } from 'lucide-react';
import logo from '../../assets/images/logo.png';
import motivationCard from '../../assets/images/motivation-cards.png';
import './Sidebar.css';

const navGroups = [
  {
    label: null,
    items: [{ name: 'Dashboard', icon: LayoutDashboard }],
  },
  {
    label: 'Career Discovery',
    items: [
      { name: 'Career paths', icon: Compass },
      { name: 'Career experiments', icon: FlaskConical },
      { name: 'Weekly reflection', icon: NotebookPen },
    ],
  },
  {
    label: 'Professional',
    items: [
      { name: 'Projects', icon: FolderKanban },
      { name: 'Experiences', icon: ExperienceIcon },
      { name: 'Skills', icon: Sparkles },
    ],
  },
  {
    label: 'Learning Ecosystem',
    items: [
      { name: 'Learning', icon: GraduationCap },
      { name: 'Certificates', icon: Award },
    ],
  },
  {
    label: 'Career Preparation',
    items: [
      { name: 'Applications', icon: Send },
      { name: 'Interview stories', icon: MessageSquareQuote },
    ],
  },
];

function Sidebar({ activeItem = 'Dashboard', onNavigate }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <img src={logo} alt="Career Lab logo" className="sidebar-logo-img" />
        <span>Career Lab</span>
      </div>

      <nav className="sidebar-nav">
        {navGroups.map((group, i) => (
          <div className="sidebar-group" key={i}>
            {group.label && <p className="sidebar-group-label">{group.label}</p>}
            {group.items.map((item) => {
              const Icon = item.icon;
              const isActive = activeItem === item.name;
              return (
                <button
                  key={item.name}
                  className={`sidebar-item ${isActive ? 'active' : ''}`}
                  onClick={() => onNavigate && onNavigate(item.name)}
                >
                  <Icon size={18} />
                  <span>{item.name}</span>
                </button>
              );
            })}
          </div>
        ))}
      </nav>

        <img src={motivationCard} alt="Motivation" className="sidebar-motivation-card" />
      <button
        className={`sidebar-item sidebar-settings ${activeItem === 'Settings' ? 'active' : ''}`}
        onClick={() => onNavigate && onNavigate('Settings')}
      >
        <Settings size={18} />
        <span>Settings</span>
      </button>
    </aside>
  );
}

export default Sidebar;