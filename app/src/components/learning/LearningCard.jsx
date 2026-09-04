import { useState } from 'react';
import { MoreVertical } from 'lucide-react';
import './LearningCard.css';

const statusColors = {
  'Not Started': { color: 'rgba(255,255,255,0.6)', bg: 'rgba(255,255,255,0.08)' },
  'In Progress': { color: '#F4C066', bg: 'rgba(244, 192, 102, 0.15)' },
  Completed: { color: '#4CD8C4', bg: 'rgba(76, 216, 196, 0.15)' },
};

function LearningCard({ id, title, learningType, platform, status, progressPercentage, estimatedHours, skillNames = [], onViewDetail, onDelete, onDuplicate, ...rest }) {
  const accent = statusColors[status] || statusColors['Not Started'];
  const [showMenu, setShowMenu] = useState(false);

  const fullData = { id, title, learningType, platform, status, progressPercentage, estimatedHours, skillNames, ...rest };

  return (
    <div className="learning-card">
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

      <div className="learning-card-top">
        {learningType && <span className="learning-type-badge">{learningType}</span>}
        <span className="learning-status-badge" style={{ background: accent.bg, color: accent.color }}>
          {status}
        </span>
      </div>

      <h3 className="learning-card-title">{title}</h3>
      {platform && <p className="learning-card-platform">{platform}</p>}

      <div className="learning-progress-row">
        <div className="learning-progress-track">
          <div className="learning-progress-fill" style={{ width: `${progressPercentage || 0}%` }} />
        </div>
        <span className="learning-progress-label">{progressPercentage || 0}%</span>
      </div>

      {estimatedHours && <p className="learning-card-hours">Estimasi {estimatedHours} jam</p>}

      {skillNames.length > 0 && (
        <div className="learning-card-tags">
          {skillNames.slice(0, 3).map((tag, i) => (
            <span key={i} className="learning-card-tag">{tag}</span>
          ))}
        </div>
      )}

      <button className="learning-detail-btn" onClick={() => onViewDetail(fullData)}>
        Lihat Detail
      </button>
    </div>
  );
}

export default LearningCard;