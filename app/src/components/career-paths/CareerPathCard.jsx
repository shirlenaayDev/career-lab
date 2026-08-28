import { Compass } from 'lucide-react';
import './CareerPathCard.css';

const statusColors = {
  Exploring: { color: '#F4C066', bg: 'rgba(244, 192, 102, 0.15)' },
  Focus: { color: '#6C7CFB', bg: 'rgba(108, 124, 251, 0.15)' },
  Achieved: { color: '#4CD8C4', bg: 'rgba(76, 216, 196, 0.15)' },
};

function CareerPathCard({ name, description, why, status, priority, targetTimeline }) {
  const accent = statusColors[status] || statusColors.Exploring;

  return (
    <div className="career-path-card">
      <div className="career-path-card-top">
        <div className="career-path-icon-wrap" style={{ background: accent.bg }}>
          <Compass size={28} color={accent.color} />
        </div>
        <span className={`career-path-status status-${status.toLowerCase()}`}>{status}</span>
      </div>

      <h3 className="career-path-title">{name}</h3>
      {description && <p className="career-path-description">{description}</p>}
      {why && <p className="career-path-why">"{why}"</p>}

      <div className="career-path-meta">
        <span className="career-path-priority-badge">Priority {priority}</span>
        {targetTimeline && <span className="career-path-timeline">{targetTimeline}</span>}
      </div>

      <button className="career-path-explore-btn">Explore Path</button>
    </div>
  );
}

export default CareerPathCard;