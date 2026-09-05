import { useState } from 'react';
import { MoreVertical, Calendar } from 'lucide-react';
import './ApplicationCard.css';

function formatDate(date) {
  if (!date) return null;
  return new Date(date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
}

function ApplicationCard({ id, company, position, careerPathName, applicationStatus, dateApplied, interviewDate, onViewDetail, onDelete, onDuplicate, ...rest }) {
  const [showMenu, setShowMenu] = useState(false);
  const fullData = { id, company, position, careerPathName, applicationStatus, dateApplied, interviewDate, ...rest };

  return (
    <div className={`application-card status-${applicationStatus?.toLowerCase()}`}>
      <div className="card-menu-wrap">
        <button className="card-menu-btn" onClick={() => setShowMenu((v) => !v)}>
          <MoreVertical size={12} />
        </button>
        {showMenu && (
          <div className="card-menu" onMouseLeave={() => setShowMenu(false)}>
            <button onClick={() => { setShowMenu(false); onViewDetail(fullData); }}>Edit</button>
            <button onClick={() => { setShowMenu(false); onDuplicate(id); }}>Duplikat</button>
            <button className="card-menu-danger" onClick={() => { setShowMenu(false); onDelete(id); }}>Hapus</button>
          </div>
        )}
      </div>

      <h4 className="application-card-company">{company}</h4>
      <p className="application-card-position">{position}</p>
      {careerPathName && <p className="application-card-path">{careerPathName}</p>}

      {(interviewDate || dateApplied) && (
        <p className="application-card-date">
          <Calendar size={11} />
          {formatDate(interviewDate || dateApplied)}
        </p>
      )}

      <button className="application-detail-btn" onClick={() => onViewDetail(fullData)}>
        Lihat Detail
      </button>
    </div>
  );
}

export default ApplicationCard;