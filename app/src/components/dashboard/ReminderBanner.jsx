import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { NotebookPen, X } from 'lucide-react';
import './ReminderBanner.css';

function ReminderBanner({ daysSince }) {
  const navigate = useNavigate();
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="reminder-banner">
      <div className="reminder-banner-icon">
        <NotebookPen size={18} color="#F4C066" />
      </div>
      <div className="reminder-banner-text">
        <p className="reminder-banner-title">
          {daysSince === null
            ? 'Belum ada Weekly Reflection nih'
            : `Udah ${daysSince} hari belum reflection`}
        </p>
        <p className="reminder-banner-subtitle">Yuk luangkan waktu sejenak buat refleksi minggu ini.</p>
      </div>
      <button className="reminder-banner-cta" onClick={() => navigate('/weekly-reflection')}>
        Isi Reflection
      </button>
      <button className="reminder-banner-close" onClick={() => setDismissed(true)}>
        <X size={16} />
      </button>
    </div>
  );
}

export default ReminderBanner;