import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MoreVertical } from 'lucide-react';
import './ProjectCard.css';

const typeColors = {
  Personal: { color: '#6C7CFB', bg: 'rgba(108, 124, 251, 0.15)' },
  Academic: { color: '#F4C066', bg: 'rgba(244, 192, 102, 0.15)' },
  Organization: { color: '#4CD8C4', bg: 'rgba(76, 216, 196, 0.15)' },
  Freelance: { color: '#80A1D4', bg: 'rgba(128, 161, 212, 0.15)' },
};

function ProjectCard({ id, name, role, projectType, skillNames = [], onDelete, onDuplicate }) {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const accent = typeColors[projectType] || { color: '#9E98FB', bg: 'rgba(158, 152, 251, 0.15)' };

  return (
    <div className="project-card">
      <div className="card-menu-wrap">
        <button className="card-menu-btn" onClick={() => setShowMenu((v) => !v)}>
          <MoreVertical size={16} />
        </button>
        {showMenu && (
          <div className="card-menu" onMouseLeave={() => setShowMenu(false)}>
            <button onClick={() => { setShowMenu(false); navigate(`/projects/${id}`); }}>Edit</button>
            <button onClick={() => { setShowMenu(false); onDuplicate(id); }}>Duplikat</button>
            <button className="card-menu-danger" onClick={() => { setShowMenu(false); onDelete(id); }}>Hapus</button>
          </div>
        )}
      </div>

      {projectType && (
        <span className="project-type-badge" style={{ background: accent.bg, color: accent.color }}>
          {projectType}
        </span>
      )}

      <h3 className="project-card-title">{name}</h3>
      {role && <p className="project-card-role">{role}</p>}

      {skillNames.length > 0 && (
        <div className="project-card-tags">
          {skillNames.slice(0, 3).map((tag, i) => (
            <span key={i} className="project-card-tag">{tag}</span>
          ))}
        </div>
      )}

      <button className="project-view-btn" onClick={() => navigate(`/projects/${id}`)}>
        View Project
      </button>
    </div>
  );
}

export default ProjectCard;