import { useNavigate } from 'react-router-dom';
import { Goal, TrendingUp } from 'lucide-react';
import './DashboardHeader.css';

function DashboardHeader({ userName, careerFocus, successRate, nextLearningTitle, nextLearningProgress }) {
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
            <p className="stat-value focus-value">{careerFocus || 'Belum ada'}</p>
          </div>
        </div>

        <div className="divider" />

        <div className="stat-block center">
          <p className="stat-label">Experiment Success Rate</p>
          <p className="stat-value confidence-value">
            {successRate != null ? `${successRate}%` : '-'}
          </p>
          {successRate != null && (
            <div className="progress-bar-track">
              <div className="progress-bar-fill confidence-fill" style={{ width: `${successRate}%` }} />
            </div>
          )}
          <p className="stat-caption confidence-caption">
            <TrendingUp size={10} strokeWidth={3} />
            experiment diputuskan lanjut
          </p>
        </div>

        <div className="divider" />

        <div className="stat-block center">
          <p className="stat-label">Next Learning</p>
          <p className="stat-value chapter-value">{nextLearningTitle || 'Belum ada'}</p>
          {nextLearningTitle && (
            <div className="progress-bar-track">
              <div className="progress-bar-fill learning-fill" style={{ width: `${nextLearningProgress || 0}%` }} />
            </div>
          )}
          <p className="stat-caption">{nextLearningTitle ? `Progress ${nextLearningProgress || 0}%` : ''}</p>
        </div>
      </div>
    </div>
  );
}

export default DashboardHeader;