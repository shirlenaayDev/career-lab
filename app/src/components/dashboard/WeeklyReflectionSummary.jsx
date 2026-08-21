import { Smile } from 'lucide-react';
import './WeeklyReflectionSummary.css';

function WeeklyReflectionSummary() {
  return (
    <div className="reflection-summary-card">
      <h2 className="reflection-summary-title">Weekly Reflection Summary</h2>

      <div className="reflection-summary-row">
        <div className="reflection-summary-block">
          <div className="reflection-icon-wrap">
            <Smile size={22} color="#82E38F" />
          </div>
          <p className="reflection-value" style={{ color: '#82E38F' }}>4.3/5</p>
          <p className="reflection-label">Mood rata-rata</p>
          <p className="reflection-caption">Good progress!</p>
        </div>

        <div className="reflection-divider" />

        <div className="reflection-summary-block center">
          <p className="reflection-value" style={{ color: '#5EC3D6' }}>3</p>
          <p className="reflection-label">Refleksi minggu ini</p>
          <p className="reflection-caption">Selesai</p>
        </div>

        <div className="reflection-divider" />

        <div className="reflection-summary-block center">
          <p className="reflection-value" style={{ color: '#82E38F' }}>2</p>
          <p className="reflection-label">Insight baru</p>
          <p className="reflection-caption">Hal Penting</p>
        </div>
      </div>
    </div>
  );
}

export default WeeklyReflectionSummary;