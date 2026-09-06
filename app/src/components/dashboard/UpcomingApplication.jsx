import { useNavigate } from 'react-router-dom';
import { Building2 } from 'lucide-react';
import './UpcomingApplication.css';

const statusColors = {
  Applied: '#6C7CFB',
  Interview: '#C3A5FA',
};

function UpcomingApplication({ applications }) {
  const navigate = useNavigate();

  return (
    <div className="upcoming-app-card">
      <div className="upcoming-app-header">
        <h2 className="upcoming-app-title">Upcoming Application</h2>
        <button className="upcoming-app-viewall" onClick={() => navigate('/applications')}>
          Lihat Semua
        </button>
      </div>

      <div className="upcoming-app-list">
        {applications.length === 0 ? (
          <p className="upcoming-app-empty">Belum ada aplikasi yang lagi berjalan.</p>
        ) : (
          applications.map((app, index) => (
            <div className="upcoming-app-item" key={index}>
              <div className="upcoming-app-top">
                <div className="upcoming-app-logo">
                  <Building2 size={18} color="rgba(255,255,255,0.5)" />
                </div>
                <div className="upcoming-app-text">
                  <p className="upcoming-app-position">{app.position}</p>
                  <p className="upcoming-app-company">{app.company}</p>
                </div>
              </div>
              <span
                className="upcoming-app-status"
                style={{ background: statusColors[app.status] || '#88CEFB' }}
              >
                {app.status}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default UpcomingApplication;