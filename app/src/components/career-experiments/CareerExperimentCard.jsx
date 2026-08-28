import { Star } from 'lucide-react';
import './CareerExperimentCard.css';

// Status di-derive dari period_start/period_end (bukan kolom di DB):
// - Planned    : period_start belum diisi
// - Active     : period_start terisi, period_end belum
// - Completed  : period_start & period_end terisi
function getStatus(periodStart, periodEnd) {
  if (!periodStart) return 'Planned';
  if (periodStart && !periodEnd) return 'Active';
  return 'Completed';
}

function formatPeriod(periodStart, periodEnd) {
  if (!periodStart) return 'Belum dimulai';
  const start = new Date(periodStart).toLocaleDateString('id-ID', { month: 'short', year: 'numeric' });
  if (!periodEnd) return `Berjalan sejak ${start}`;
  const end = new Date(periodEnd).toLocaleDateString('id-ID', { month: 'short', year: 'numeric' });
  return `${start} - ${end}`;
}

function CareerExperimentCard({ id, experimentTitle, description, periodStart, periodEnd, enjoymentScore, difficulty, continueDecision, conclusion, onViewDetail }) {
  const status = getStatus(periodStart, periodEnd);
  const hasData = enjoymentScore !== null && enjoymentScore !== undefined;

  return (
    <div className="experiment-card">
      <div className="experiment-card-main">
        <p className="experiment-card-label-name">Experiment</p>
        <div className="experiment-card-top">
          <h3 className="experiment-card-title">{experimentTitle}</h3>
          <span className={`experiment-status status-${status.toLowerCase()}`}>{status}</span>
        </div>
        <p className="experiment-card-description">{description}</p>
        <p className="experiment-card-period">{formatPeriod(periodStart, periodEnd)}</p>
      </div>

      <div className="experiment-card-difficulty">
        <p className="experiment-card-label">Difficulty</p>
        {hasData ? (
          <>
            <div className="experiment-difficulty-segments">
              {[1, 2, 3, 4, 5].map((i) => (
                <span key={i} className={`difficulty-segment ${i <= difficulty ? 'filled' : ''}`} />
              ))}
            </div>
            <p className="experiment-card-value">{difficulty}/5</p>
          </>
        ) : (
          <p className="experiment-card-value-muted">Belum ada data</p>
        )}
      </div>

      <div className="experiment-card-enjoyment">
        <p className="experiment-card-label">Enjoyment</p>
        <div className="experiment-stars">
          {[1, 2, 3, 4, 5].map((i) => (
            <Star
              key={i}
              size={22}
              className={hasData && i <= enjoymentScore ? 'star-filled' : 'star-empty'}
            />
          ))}
        </div>
        <button
          className="experiment-detail-btn"
          onClick={() => onViewDetail({ id, experimentTitle, description, periodStart, periodEnd, enjoymentScore, difficulty, continueDecision, conclusion })}
        >
          Lihat Detail
        </button>
      </div>
    </div>
  );
}

export default CareerExperimentCard;