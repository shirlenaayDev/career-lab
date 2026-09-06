import { Smile } from 'lucide-react';
import './WeeklyReflectionSummary.css';

function WeeklyReflectionSummary({ moodAverage, weeklyCount, insightCount }) {
  return (
    <div className="reflection-summary-card">
      <h2 className="reflection-summary-title">Weekly Reflection Summary</h2>

      <div className="reflection-summary-row">
        <div className="reflection-summary-block">
          <div className="reflection-icon-wrap">
            <Smile size={20} color="#82E38F" />
          </div>
          <div className="reflection-content">
            <p className="reflection-label">Mood rata-rata</p>
            <p className="reflection-value" style={{ color: '#82E38F' }}>
              {moodAverage != null ? `${moodAverage}/5` : '-'}
            </p>
            <p className="reflection-caption">30 hari terakhir</p>
          </div>
        </div>

        <div className="reflection-divider" />

        <div className="reflection-summary-block center">
          <div className="reflection-content">
            <p className="reflection-label">Refleksi minggu ini</p>
            <p className="reflection-value" style={{ color: '#5EC3D6' }}>{weeklyCount}</p>
            <p className="reflection-caption">Selesai</p>
          </div>
        </div>

        <div className="reflection-divider" />

        <div className="reflection-summary-block center">
          <div className="reflection-content">
            <p className="reflection-label">Insight Baru</p>
            <p className="reflection-value" style={{ color: '#82E38F' }}>{insightCount}</p>
            <p className="reflection-caption">Minggu Ini</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WeeklyReflectionSummary;