import { useNavigate } from 'react-router-dom';
import { Goal, ArrowUp } from 'lucide-react';
import './DashboardHeader.css';

function DashboardHeader({ userName, careerFocus, confidenceScore, confidenceChange, nextLearning, chapter, progress }) {
  const navigate = useNavigate();

  return (
    <div className="dashboard-header">
      <button className="view-path-btn" onClick={() => navigate('/career-paths')}>View Career Path</button>

      <div className="header-left">
        <p className="greeting">Good evening,</p>
        <h1 className="greeting-name">{userName}</h1>
        <p className="greeting-sub">Lanjutkan langkah kecilmu hari ini menuju karier impian.</p>
      </div>

      <div className="header-stats-card">
        <div className="stat-block focus-block">
          <div className="focus-icon-wrap">
            <Goal size={26} color="#9E98FB" />
          </div>
          <div className="focus-text">
            <p className="stat-label">Current Career Fokus</p>
            <p className="stat-value focus-value">{careerFocus}</p>
          </div>
        </div>

        <div className="divider" />

        <div className="stat-block center">
          <p className="stat-label">Confidence Score</p>
          <p className="stat-value confidence-value">{confidenceScore}%</p>
          <div className="progress-bar-track">
            <div className="progress-bar-fill confidence-fill" style={{ width: `${confidenceScore}%` }} />
          </div>
          <p className="stat-caption confidence-caption">
            <ArrowUp size={10} strokeWidth={3} />
            {confidenceChange}% from last month
          </p>
        </div>

        <div className="divider" />

        <div className="stat-block center">
          <p className="stat-label">Next Learning</p>
          <p className="stat-value chapter-value">{chapter}</p>
          <div className="progress-bar-track">
            <div className="progress-bar-fill learning-fill" style={{ width: `${progress}%` }} />
          </div>
          <p className="stat-caption">Progress {progress}%</p>
        </div>
      </div>
    </div>
  );
}

export default DashboardHeader;