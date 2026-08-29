import { useState } from 'react';
import { MoreVertical } from 'lucide-react';
import './ReflectionCard.css';

export const moodMeta = {
  Buruk: { emoji: '😩', color: '#F87171' },
  Kurang: { emoji: '😕', color: '#F4A261' },
  Biasa: { emoji: '😐', color: 'rgba(255,255,255,0.7)' },
  Baik: { emoji: '😊', color: '#F4C066' },
  Semangat: { emoji: '🤩', color: '#4CD8C4' },
};

// Prioritaskan week_start_date (tanggal asli yang diinput user). Fallback ke created_at
// cuma buat reflection lama yang dibuat sebelum kolom ini ada.
function formatDateRange(weekStartDate, createdAt) {
  const base = weekStartDate || createdAt;
  if (!base) return '';
  const start = new Date(base);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  const fmt = (d) => d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
  return `${fmt(start)} - ${fmt(end)}`;
}

function ReflectionCard({ id, week, weekStartDate, mood, score, reflection, createdAt, experimentTitle, careerExperimentId, challenge, nextAction, improvement, onEdit, onDelete, onDuplicate }) {
  const meta = moodMeta[mood] || moodMeta.Biasa;
  const [showMenu, setShowMenu] = useState(false);

  const fullData = { id, week, weekStartDate, mood, score, reflection, createdAt, experimentTitle, careerExperimentId, challenge, nextAction, improvement };

  return (
    <div className="reflection-card">
      <div className="reflection-card-left">
        <h3 className="reflection-card-week">{week}</h3>
        <p className="reflection-card-date">{formatDateRange(weekStartDate, createdAt)}</p>
      </div>

      <div className="reflection-card-mood">
        <span className="reflection-mood-icon" style={{ background: `${meta.color}22` }}>
          {meta.emoji}
        </span>
        <span className="reflection-mood-label" style={{ color: meta.color }}>{mood || '-'}</span>
      </div>

      <div className="reflection-card-score">
        {score ? `${score}/10` : '-'}
      </div>

      <div className="reflection-card-divider" />

      <p className="reflection-card-snippet">{reflection || 'Belum ada catatan reflection.'}</p>

      <div className="reflection-card-actions">
        <button className="reflection-detail-btn" onClick={() => onEdit(fullData)}>
          Lihat detail
        </button>

        <div className="reflection-menu-wrap">
          <button className="reflection-menu-btn" onClick={() => setShowMenu((v) => !v)}>
            <MoreVertical size={18} />
          </button>
          {showMenu && (
            <div className="reflection-menu" onMouseLeave={() => setShowMenu(false)}>
              <button onClick={() => { setShowMenu(false); onEdit(fullData); }}>Edit</button>
              <button onClick={() => { setShowMenu(false); onDuplicate(fullData); }}>Duplikat</button>
              <button className="reflection-menu-danger" onClick={() => { setShowMenu(false); onDelete(id); }}>Hapus</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ReflectionCard;