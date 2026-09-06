import { Compass, FolderKanban, Sparkles, FlaskConical, Briefcase } from 'lucide-react';
import './StatCards.css';

function StatCards({ stats }) {
  const statsData = [
    { value: stats.activeCareerPaths, label: 'Career Path Aktif', caption: stats.careerPathCaption, color: '#9E98FB', bg: 'rgba(69, 49, 179, 0.30)', Icon: Compass },
    { value: stats.totalProjects, label: 'Proyek', caption: stats.projectCaption, color: '#78C2FB', bg: 'rgba(48, 63, 158, 0.30)', Icon: FolderKanban },
    { value: stats.totalSkills, label: 'Skill Dikuasai', caption: stats.skillCaption, color: '#4CD8C4', bg: 'rgba(28, 76, 85, 0.30)', Icon: Sparkles },
    { value: stats.totalExperiments, label: 'Eksperimen Karier', caption: stats.experimentCaption, color: '#F4C066', bg: 'rgba(89, 66, 64, 0.30)', Icon: FlaskConical },
    { value: stats.totalApplications, label: 'Aplikasi Magang', caption: stats.applicationCaption, color: '#5EC3D6', bg: 'rgba(22, 82, 122, 0.30)', Icon: Briefcase },
  ];

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