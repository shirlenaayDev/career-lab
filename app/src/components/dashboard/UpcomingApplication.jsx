import './UpcomingApplication.css';

const applications = [
  {
    position: 'Data Analyst',
    company: 'Company X',
    status: 'Interview',
    statusColor: '#C3A5FA',
  },
  {
    position: 'Business Analyst',
    company: 'Company Y',
    status: 'Intern',
    statusColor: '#88CEFB',
  },
];

function UpcomingApplication() {
  return (
    <div className="upcoming-app-card">
      <div className="upcoming-app-header">
        <h2 className="upcoming-app-title">Upcoming Application</h2>
        <button className="upcoming-app-viewall">Lihat Semua</button>
      </div>

      <div className="upcoming-app-list">
        {applications.map((app, index) => (
          <div className="upcoming-app-item" key={index}>
            <div className="upcoming-app-top">
              <div className="upcoming-app-logo">LOGO</div>
              <div className="upcoming-app-text">
                <p className="upcoming-app-position">{app.position}</p>
                <p className="upcoming-app-company">{app.company}</p>
              </div>
            </div>
            <span
              className="upcoming-app-status"
              style={{ background: app.statusColor }}
            >
              {app.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default UpcomingApplication;