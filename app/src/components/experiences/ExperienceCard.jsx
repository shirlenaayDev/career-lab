import { useState } from 'react';
import { MoreVertical } from 'lucide-react';
import './ExperienceCard.css';

const categoryColors = {
  Internship: { color: '#6C7CFB', bg: 'rgba(108, 124, 251, 0.15)' },
  Organization: { color: '#4CD8C4', bg: 'rgba(76, 216, 196, 0.15)' },
  Volunteer: { color: '#F4C066', bg: 'rgba(244, 192, 102, 0.15)' },
  Competition: { color: '#80A1D4', bg: 'rgba(128, 161, 212, 0.15)' },
  Other: { color: '#9E98FB', bg: 'rgba(158, 152, 251, 0.15)' },
};

function formatPeriod(startDate, endDate) {
  if (!startDate) return null;
  const fmt = (d) => new Date(d).toLocaleDateString('id-ID', { month: 'short', year: 'numeric' });
  return endDate ? `${fmt(startDate)} - ${fmt(endDate)}` : `${fmt(startDate)} - Sekarang`;
}

function ExperienceCard({ id, name, category, organization, role, startDate, endDate, skillNames = [], onViewDetail, onDelete, onDuplicate, ...rest }) {
  const accent = categoryColors[category] || categoryColors.Other;
  const period = formatPeriod(startDate, endDate);
  const [showMenu, setShowMenu] = useState(false);

  const fullData = { id, name, category, organization, role, startDate, endDate, skillNames, ...rest };

  return (
    <div className="experience-card">
      <div className="card-menu-wrap">
        <button className="card-menu-btn" onClick={() => setShowMenu((v) => !v)}>
          <MoreVertical size={16} />
        </button>
        {showMenu && (
          <div className="card-menu" onMouseLeave={() => setShowMenu(false)}>
            <button onClick={() => { setShowMenu(false); onViewDetail(fullData); }}>Edit</button>
            <button onClick={() => { setShowMenu(false); onDuplicate(id); }}>Duplikat</button>
            <button className="card-menu-danger" onClick={() => { setShowMenu(false); onDelete(id); }}>Hapus</button>
          </div>
        )}
      </div>

      {category && (
        <span className="experience-type-badge" style={{ background: accent.bg, color: accent.color }}>
          {category}
        </span>
      )}

      <h3 className="experience-card-title">{name}</h3>
      {(organization || role) && (
        <p className="experience-card-org">{[role, organization].filter(Boolean).join(' · ')}</p>
      )}
      {period && <p className="experience-card-period">{period}</p>}

      {skillNames.length > 0 && (
        <div className="experience-card-tags">
          {skillNames.slice(0, 3).map((tag, i) => (
            <span key={i} className="experience-card-tag">{tag}</span>
          ))}
        </div>
      )}

      <button className="experience-detail-btn" onClick={() => onViewDetail(fullData)}>
        Lihat Detail
      </button>
    </div>
  );
}

export default ExperienceCard;