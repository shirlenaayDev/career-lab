import { useEffect, useState } from 'react';
import { Plus, HelpCircle, FlaskConical, NotebookPen, GitBranch } from 'lucide-react';
import { supabase } from '../supabaseClient';
import Sidebar from '../components/layout/Sidebar';
import Topbar from '../components/layout/Topbar';
import CareerExperimentCard from '../components/career-experiments/CareerExperimentCard';
import HowItWorksModal from '../components/career-paths/HowItWorksModal';
import NewExperimentModal from '../components/career-experiments/NewExperimentModal';
import ExperimentDetailModal from '../components/career-experiments/ExperimentDetailModal';
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

// Map kolom snake_case dari Supabase ke props yang dipakai CareerExperimentCard
function mapExperiment(row) {
  return {
    id: row.career_experiment_id,
    experimentTitle: row.experiment_title,
    description: row.description,
    periodStart: row.period_start,
    periodEnd: row.period_end,
    enjoymentScore: row.enjoyment_score,
    difficulty: row.difficulty,
    continueDecision: row.continue_decision,
    conclusion: row.conclusion,
  };
}

function CareerExperiments() {
  const [experiments, setExperiments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showNewExperimentModal, setShowNewExperimentModal] = useState(false);
  const [selectedExperiment, setSelectedExperiment] = useState(null);

  async function fetchExperiments() {
    setLoading(true);
    setLoadError(null);

    const { data, error } = await supabase
      .from('career_experiments')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      setLoadError('Gagal memuat data experiment.');
      setLoading(false);
      return;
    }

    setExperiments(data.map(mapExperiment));
    setLoading(false);
  }

  useEffect(() => {
    fetchExperiments();
  }, []);

  function handleCreated(newRow) {
    setExperiments((prev) => [mapExperiment(newRow), ...prev]);
  }

  function handleUpdated(updatedRow) {
    const mapped = mapExperiment(updatedRow);
    setExperiments((prev) => prev.map((exp) => (exp.id === mapped.id ? mapped : exp)));
  }

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <Topbar
          userName="User1"
          actionButton={
            <button className="topbar-new-path-btn" onClick={() => setShowNewExperimentModal(true)}>
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

          {loading ? (
            <p className="career-experiments-empty">Memuat experiment...</p>
          ) : loadError ? (
            <p className="career-experiments-empty">{loadError}</p>
          ) : experiments.length === 0 ? (
            <p className="career-experiments-empty">Belum ada experiment yang dijalankan.</p>
          ) : (
            <div className="career-experiments-list">
              {experiments.map((exp) => (
                <CareerExperimentCard key={exp.id} {...exp} onViewDetail={setSelectedExperiment} />
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

        {showNewExperimentModal && (
          <NewExperimentModal
            onClose={() => setShowNewExperimentModal(false)}
            onCreated={handleCreated}
          />
        )}

        {selectedExperiment && (
          <ExperimentDetailModal
            experiment={selectedExperiment}
            onClose={() => setSelectedExperiment(null)}
            onUpdated={handleUpdated}
          />
        )}
      </main>
    </div>
  );
}

export default CareerExperiments;