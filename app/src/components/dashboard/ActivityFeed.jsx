import { NotebookPen, CheckCircle2, FlaskConical, Sparkles } from 'lucide-react';
import './ActivityFeed.css';

const activities = [
  {
    icon: NotebookPen,
    iconColor: '#5EC3D6',
    title: 'Menambahkan refleksi mingguan',
    subtitle: 'Bagaimana minggu ini berjalan?',
    tag: 'Reflection',
    tagColor: '#5EC3D6',
    time: '2 jam lalu',
  },
  {
    icon: CheckCircle2,
    iconColor: '#88CEFB',
    title: 'Menyelesaikan project Spotify Database',
    subtitle: 'Status diubah menjadi Completed',
    tag: 'Project',
    tagColor: '#88CEFB',
    time: 'Kemarin',
  },
  {
    icon: FlaskConical,
    iconColor: '#F4C066',
    title: 'Memulai eksperimen karier baru',
    subtitle: 'Data Analyst - Dashboard Challenge',
    tag: 'Experiment',
    tagColor: '#F4C066',
    time: '2 hari lalu',
  },
  {
    icon: Sparkles,
    iconColor: '#4CD8C4',
    title: 'Menambah skill baru: PostgreSQL',
    subtitle: 'Data Analyst - Dashboard Challenge',
    tag: 'Skill',
    tagColor: '#4CD8C4',
    time: '4 hari lalu',
  },
];

function ActivityFeed() {
  return (
    <div className="activity-feed-card">
      <h2 className="activity-feed-title">Aktivitas Terbaru</h2>

      <div className="activity-list">
        {activities.map((item, index) => {
          const Icon = item.icon;
          return (
            <div className="activity-row" key={index}>
              <div className="activity-icon-wrap">
                <Icon size={16} color={item.iconColor} />
              </div>

              <div className="activity-text">
                <p className="activity-title">{item.title}</p>
                <p className="activity-subtitle">{item.subtitle}</p>
              </div>

              <span
                className="activity-tag"
                style={{ borderColor: item.tagColor, color: item.tagColor }}
              >
                {item.tag}
              </span>

              <span className="activity-time">{item.time}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ActivityFeed;