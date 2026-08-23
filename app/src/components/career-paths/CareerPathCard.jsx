import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ArrowUp } from 'lucide-react';
import './CareerPathCard.css';

function CareerPathCard({ icon: Icon, title, description, status, confidenceScore, confidenceChange, projects, experience, skills, tags, ringColor, iconColor, iconBg }) {
  const ringData = [
    { value: confidenceScore },
    { value: 100 - confidenceScore },
  ];

  return (
    <div className="career-path-card">
      <div className="career-path-card-top">
        <div className="career-path-icon-wrap" style={{ background: iconBg }}>
          <Icon size={32} color={iconColor} />
        </div>
        <span className={`career-path-status status-${status.toLowerCase().replace(' ', '-')}`}>{status}</span>
      </div>

      <h3 className="career-path-title">{title}</h3>
      <p className="career-path-description">{description}</p>

      <div className="career-path-confidence">
        <div className="career-path-ring-wrap">
          <ResponsiveContainer width={72} height={72}>
            <PieChart>
              <Pie
                data={ringData}
                dataKey="value"
                innerRadius={24}
                outerRadius={34}
                startAngle={90}
                endAngle={-270}
                stroke="none"
              >
                <Cell fill={ringColor} />
                <Cell fill="rgba(255,255,255,0.08)" />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <span className="career-path-ring-label">{confidenceScore}%</span>
        </div>

        <div className="career-path-confidence-text">
          <p className="career-path-confidence-label">Confidence score</p>
          <p className="career-path-confidence-change">
            <ArrowUp size={11} strokeWidth={3} />
            {confidenceChange}% dari bulan lalu
          </p>
        </div>
      </div>

      <div className="career-path-stats">
        <div className="career-path-stat">
          <p className="career-path-stat-value">{projects}</p>
          <p className="career-path-stat-label">Projects</p>
        </div>
        <div className="career-path-stat">
          <p className="career-path-stat-value">{experience}</p>
          <p className="career-path-stat-label">Experience</p>
        </div>
        <div className="career-path-stat">
          <p className="career-path-stat-value">{skills}</p>
          <p className="career-path-stat-label">Skills</p>
        </div>
      </div>

      <div className="career-path-tags">
        {tags.slice(0, 3).map((tag, i) => (
          <span key={i} className="career-path-tag">{tag}</span>
        ))}
        {tags.length > 3 && <span className="career-path-tag-more">+{tags.length - 3}</span>}
      </div>

      <button className="career-path-explore-btn">Explore Path</button>
    </div>
  );
}

export default CareerPathCard;