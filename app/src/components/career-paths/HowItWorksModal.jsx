import { X, Compass, TrendingUp, Archive } from 'lucide-react';
import './HowItWorksModal.css';

const steps = [
  {
    icon: Compass,
    title: 'Mulai dengan Eksplorasi',
    description: 'Buat career path baru untuk role yang menarik minatmu. Tidak perlu yakin 100% — anggap ini sebagai eksperimen.',
  },
  {
    icon: TrendingUp,
    title: 'Kumpulkan Evidence',
    description: 'Kerjakan project, catat pengalaman, dan pelajari skill terkait. Confidence score naik seiring evidence yang terkumpul.',
  },
  {
    icon: Archive,
    title: 'Evaluasi & Putuskan',
    description: 'Path yang cocok bisa jadi Active/fokus utama. Yang kurang cocok bisa di-arsipkan — bukan kegagalan, tapi hasil eksperimen yang valid.',
  },
];

function HowItWorksModal({ onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>
          <X size={20} />
        </button>

        <h2 className="modal-title">Bagaimana Cara Kerja Career Paths?</h2>
        <p className="modal-subtitle">
          Setiap path adalah eksperimen yang bisa dievaluasi, bukan komitmen permanen.
        </p>

        <div className="modal-steps">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <div className="modal-step" key={i}>
                <div className="modal-step-icon-wrap">
                  <Icon size={20} color="#9E98FB" />
                </div>
                <div>
                  <p className="modal-step-title">{step.title}</p>
                  <p className="modal-step-description">{step.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        <button className="modal-got-it-btn" onClick={onClose}>Mengerti</button>
      </div>
    </div>
  );
}

export default HowItWorksModal;