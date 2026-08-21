import { Compass, FolderKanban, Sparkles, FlaskConical, Briefcase } from 'lucide-react';
import './StatCards.css';

const statsData = [
  { value: 3, label: 'Career Path Aktif', caption: '1 dari bulan lalu', color: '#9E98FB', bg: 'rgba(69, 49, 179, 0.30)', Icon: Compass },
  { value: 12, label: 'Proyek', caption: '2 selesai minggu ini', color: '#78C2FB', bg: 'rgba(48, 63, 158, 0.30)', Icon: FolderKanban },
  { value: 18, label: 'Skill Dikuasai', caption: '3 skill baru', color: '#4CD8C4', bg: 'rgba(28, 76, 85, 0.30)', Icon: Sparkles },
  { value: 7, label: 'Eksperimen Karier', caption: '1 eksperimen baru', color: '#F4C066', bg: 'rgba(89, 66, 64, 0.30)', Icon: FlaskConical },
  { value: 5, label: 'Aplikasi Magang', caption: '2 dalam proses', color: '#5EC3D6', bg: 'rgba(22, 82, 122, 0.30)', Icon: Briefcase },
];

function StatCards() {
  return (
    <div className="stat-cards-row">
      {statsData.map((stat, index) => {
        const IconComponent = stat.Icon;
        return (
          <div className="stat-card" key={index}>
            <div className="stat-icon-wrap" style={{ background: stat.bg }}>
              <IconComponent size={26} color={stat.color} />
            </div>
            <div className="stat-card-text">
              <p className="stat-card-value" style={{ color: stat.color }}>{stat.value}</p>
              <p className="stat-card-label">{stat.label}</p>
              <p className="stat-card-caption" style={{ color: stat.color }}>{stat.caption}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default StatCards;