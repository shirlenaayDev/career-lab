import { useState } from 'react';
import { Plus, HelpCircle, FlaskConical, NotebookPen, GitBranch } from 'lucide-react';
import Sidebar from '../components/layout/Sidebar';
import Topbar from '../components/layout/Topbar';
import CareerExperimentCard from '../components/career-experiments/CareerExperimentCard';
import HowItWorksModal from '../components/career-paths/HowItWorksModal';
import './CareerExperiments.css';

const experimentSteps = [
  {
    icon: FlaskConical,
    title: 'Jalankan Experiment',
    description: 'Pilih career path yang mau diuji, lalu jalankan lewat project atau pengalaman nyata dalam periode tertentu.',
  },
  {
    icon: NotebookPen,
    title: 'Catat Rating',
    description: 'Isi enjoyment dan difficulty di akhir periode. Ini jadi data mentah buat evaluasi, bukan sekadar catatan.',
  },
  {
    icon: GitBranch,
    title: 'Putuskan Lanjut atau Tidak',
    description: 'Enjoyment tinggi & difficulty masuk akal? Lanjutkan ke path itu. Kalau enggak, itu tetap hasil valid — bukan kegagalan.',
  },
];

// Mock data — struktur mengikuti tabel career_experiments di Data Dictionary.
// status TIDAK disimpan di DB, tapi di-derive dari period_start/period_end di CareerExperimentCard.
const experiments = [
  {
    experimentTitle: 'Business Analyst',
    description: 'Mengubah kebutuhan bisnis menjadi requirement dan dokumentasi yang bisa dieksekusi tim development.',
    periodStart: '2026-01-15',
    periodEnd: null,
    enjoymentScore: 4,
    difficulty: 3,
  },
  {
    experimentTitle: 'Data Analyst',
    description: 'Eksplorasi dataset penjualan untuk menemukan pola dan insight yang bisa mendukung keputusan bisnis.',
    periodStart: '2026-02-01',
    periodEnd: null,
    enjoymentScore: 3,
    difficulty: 4,
  },
  {
    experimentTitle: 'UI/UX Designer',
    description: 'Merancang wireframe dan prototype untuk fitur baru berdasarkan riset pengguna.',
    periodStart: null,
    periodEnd: null,
    enjoymentScore: null,
    difficulty: null,
  },
  {
    experimentTitle: 'Product Manager',
    description: 'Menyusun roadmap dan memprioritaskan backlog bersama tim lintas fungsi.',
    periodStart: null,
    periodEnd: null,
    enjoymentScore: null,
    difficulty: null,
  },
];

function CareerExperiments() {
  const [showHelpModal, setShowHelpModal] = useState(false);

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <Topbar
          userName="User1"
          actionButton={
            <button className="topbar-new-path-btn">
              <Plus size={16} />
              New Experiments
            </button>
          }
        />

        <div className="career-experiments-header">
          <div>
            <h1 className="career-experiments-title">Career Experiments</h1>
            <p className="career-experiments-subtitle">
              Uji berbagai jalur karir melalui project, pengalaman, dan refleksi.
            </p>
          </div>
          <button className="career-experiments-help-btn" onClick={() => setShowHelpModal(true)}>
            <HelpCircle size={14} />
            Bagaimana cara kerja?
          </button>
        </div>

        <div className="career-experiments-panel">
          <h2 className="career-experiments-panel-title">My Career Experiments</h2>

          {experiments.length === 0 ? (
            <p className="career-experiments-empty">Belum ada experiment yang dijalankan.</p>
          ) : (
            <div className="career-experiments-list">
              {experiments.map((exp, i) => (
                <CareerExperimentCard key={i} {...exp} />
              ))}
            </div>
          )}
        </div>

        {showHelpModal && (
          <HowItWorksModal
            onClose={() => setShowHelpModal(false)}
            title="Bagaimana Cara Kerja Career Experiments?"
            subtitle="Setiap experiment adalah cara mengukur cocok tidaknya sebuah career path lewat pengalaman nyata."
            steps={experimentSteps}
          />
        )}
      </main>
    </div>
  );
}

export default CareerExperiments;