import { NotebookPen, CheckCircle2, FlaskConical, Sparkles } from 'lucide-react';
import './ActivityFeed.css';

const iconMap = {
  Reflection: { icon: NotebookPen, color: '#5EC3D6' },
  Project: { icon: CheckCircle2, color: '#88CEFB' },
  Experiment: { icon: FlaskConical, color: '#F4C066' },
  Skill: { icon: Sparkles, color: '#4CD8C4' },
};

function ActivityFeed({ activities }) {
  return (
    <div className="activity-feed-card">
      <h2 className="activity-feed-title">Aktivitas Terbaru</h2>

      <div className="activity-list">
        {activities.length === 0 ? (
          <p className="activity-empty">Belum ada aktivitas.</p>
        ) : (
          activities.map((item, index) => {
            const meta = iconMap[item.tag] || iconMap.Skill;
            const Icon = meta.icon;
            return (
              <div className="activity-row" key={index}>
                <div className="activity-icon-wrap">
                  <Icon size={16} color={meta.color} />
                </div>

                <div className="activity-text">
                  <p className="activity-title">{item.title}</p>
                  <p className="activity-subtitle">{item.subtitle}</p>
                </div>

                <span
                  className="activity-tag"
                  style={{ borderColor: meta.color, color: meta.color }}
                >
                  {item.tag}
                </span>

                <span className="activity-time">{item.time}</span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default ActivityFeed;