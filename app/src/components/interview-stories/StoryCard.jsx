import { useState } from 'react';
import { MoreVertical } from 'lucide-react';
import './StoryCard.css';

function StoryCard({ id, title, companyPosition, isDraft, situation, lessonLearned, skillNames = [], onViewDetail, onDelete, onDuplicate, ...rest }) {
  const [showMenu, setShowMenu] = useState(false);
  const fullData = { id, title, companyPosition, isDraft, situation, lessonLearned, skillNames, ...rest };

  return (
    <div className="story-card">
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

      <span className={`story-status-badge ${isDraft ? 'draft' : 'complete'}`}>
        {isDraft ? 'Draft' : 'Complete'}
      </span>

      <h3 className="story-card-title">{title}</h3>
      {companyPosition && <p className="story-card-company">{companyPosition}</p>}

      <p className="story-card-snippet">{situation || lessonLearned || 'Belum ada catatan.'}</p>

      {skillNames.length > 0 && (
        <div className="story-card-tags">
          {skillNames.slice(0, 3).map((tag, i) => (
            <span key={i} className="story-card-tag">{tag}</span>
          ))}
        </div>
      )}

      <button className="story-detail-btn" onClick={() => onViewDetail(fullData)}>
        Lihat Detail
      </button>
    </div>
  );
}

export default StoryCard;