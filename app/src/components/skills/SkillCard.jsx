import { useState } from 'react';
import { MoreVertical } from 'lucide-react';
import './SkillCard.css';

const categoryColors = {
  Technical: { color: '#6C7CFB', bg: 'rgba(108, 124, 251, 0.15)' },
  'Soft Skill': { color: '#4CD8C4', bg: 'rgba(76, 216, 196, 0.15)' },
  Tool: { color: '#F4C066', bg: 'rgba(244, 192, 102, 0.15)' },
  Language: { color: '#80A1D4', bg: 'rgba(128, 161, 212, 0.15)' },
  Other: { color: '#9E98FB', bg: 'rgba(158, 152, 251, 0.15)' },
};

const proficiencyLevels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

function formatLastPracticed(date) {
  if (!date) return null;
  return new Date(date).toLocaleDateString('id-ID', { month: 'short', year: 'numeric' });
}

function SkillCard({ name, category, proficiencyLevel, lastPracticed, onViewDetail, onDelete, onDuplicate, ...rest }) {
  const accent = categoryColors[category] || categoryColors.Other;
  const levelIndex = proficiencyLevels.indexOf(proficiencyLevel);
  const [showMenu, setShowMenu] = useState(false);

  const fullData = { name, category, proficiencyLevel, lastPracticed, ...rest };

  return (
    <div className="skill-card">
      <div className="card-menu-wrap">
        <button className="card-menu-btn" onClick={() => setShowMenu((v) => !v)}>
          <MoreVertical size={16} />
        </button>
        {showMenu && (
          <div className="card-menu" onMouseLeave={() => setShowMenu(false)}>
            <button onClick={() => { setShowMenu(false); onViewDetail(fullData); }}>Edit</button>
            <button onClick={() => { setShowMenu(false); onDuplicate(rest.id); }}>Duplikat</button>
            <button className="card-menu-danger" onClick={() => { setShowMenu(false); onDelete(rest.id); }}>Hapus</button>
          </div>
        )}
      </div>

      {category && (
        <span className="skill-type-badge" style={{ background: accent.bg, color: accent.color }}>
          {category}
        </span>
      )}

      <h3 className="skill-card-title">{name}</h3>

      {levelIndex >= 0 ? (
        <div className="skill-level-row">
          <div className="skill-level-segments">
            {[0, 1, 2, 3].map((i) => (
              <span key={i} className={`skill-level-segment ${i <= levelIndex ? 'filled' : ''}`} />
            ))}
          </div>
          <span className="skill-level-label">{proficiencyLevel}</span>
        </div>
      ) : (
        <p className="skill-level-empty">Belum ada level</p>
      )}

      {lastPracticed && (
        <p className="skill-last-practiced">Terakhir dipakai: {formatLastPracticed(lastPracticed)}</p>
      )}

      <button className="skill-detail-btn" onClick={() => onViewDetail(fullData)}>
        Lihat Detail
      </button>
    </div>
  );
}

export default SkillCard;