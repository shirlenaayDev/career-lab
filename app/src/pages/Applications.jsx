import { useEffect, useState } from 'react';
import { Plus, HelpCircle, Send, Calendar, Award } from 'lucide-react';
import { supabase } from '../supabaseClient';
import Sidebar from '../components/layout/Sidebar';
import Topbar from '../components/layout/Topbar';
import ApplicationCard from '../components/applications/ApplicationCard';
import NewApplicationModal from '../components/applications/NewApplicationModal';
import ApplicationDetailModal from '../components/applications/ApplicationDetailModal';
import HowItWorksModal from '../components/career-paths/HowItWorksModal';
import { statusOptions } from '../components/applications/ApplicationDetailModal';
import './Applications.css';

const applicationSteps = [
  {
    icon: Send,
    title: 'Catat Tiap Lamaran',
    description: 'Perusahaan, posisi, dan career path yang relevan — biar semua lamaran kelacak di satu tempat.',
  },
  {
    icon: Calendar,
    title: 'Pantau Progressnya',
    description: 'Geser status dari Applied ke Interview, Offer, atau Rejected seiring prosesnya jalan.',
  },
  {
    icon: Award,
    title: 'Belajar dari Tiap Proses',
    description: 'Baik diterima atau ditolak, tiap proses interview adalah bahan buat Interview Stories kamu nanti.',
  },
];

function mapApplication(row, pathNameById) {
  return {
    id: row.application_id,
    company: row.company,
    position: row.position,
    careerPathId: row.career_path_id,
    careerPathName: pathNameById[row.career_path_id] || null,
    applicationStatus: row.application_status,
    dateApplied: row.date_applied,
    interviewDate: row.interview_date,
    notes: row.notes,
  };
}

function Applications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [showNewModal, setShowNewModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);

  async function fetchApplications() {
    setLoading(true);
    setLoadError(null);

    const { data: pathRows } = await supabase.from('career_paths').select('career_path_id, name');
    const pathNameById = {};
    (pathRows || []).forEach((p) => { pathNameById[p.career_path_id] = p.name; });

    const { data, error } = await supabase
      .from('applications')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      setLoadError('Gagal memuat data aplikasi.');
      setLoading(false);
      return;
    }

    setApplications(data.map((row) => mapApplication(row, pathNameById)));
    setLoading(false);
  }

  useEffect(() => {
    fetchApplications();
  }, []);

  function handleCreated(newRow) {
    fetchApplications();
  }

  function handleUpdated() {
    fetchApplications();
  }

  async function handleDelete(id) {
    if (!window.confirm('Hapus aplikasi ini? Tindakan ini nggak bisa dibatalkan.')) return;
    const { error } = await supabase.from('applications').delete().eq('application_id', id);
    if (!error) setApplications((prev) => prev.filter((a) => a.id !== id));
  }

  async function handleDuplicate(id) {
    const original = applications.find((a) => a.id === id);
    if (!original) return;

    const { data: { user } } = await supabase.auth.getUser();

    const { error } = await supabase.from('applications').insert({
      user_id: user.id,
      company: `${original.company} (copy)`,
      position: original.position,
      career_path_id: original.careerPathId,
      application_status: 'Applied',
      date_applied: original.dateApplied,
      interview_date: null,
      notes: original.notes,
    });

    if (!error) fetchApplications();
  }

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <Topbar
          userName="User1"
          actionButton={
            <button className="topbar-new-path-btn" onClick={() => setShowNewModal(true)}>
              <Plus size={16} />
              New Applications
            </button>
          }
        />

        <div className="applications-header">
          <div>
            <h1 className="applications-title">Applications</h1>
            <p className="applications-subtitle">Lacak status lamaran dan magang kerja kamu.</p>
          </div>
          <button className="career-experiments-help-btn" onClick={() => setShowHelpModal(true)}>
            <HelpCircle size={14} />
            Bagaimana cara kerja?
          </button>
        </div>

        {loading ? (
          <p className="applications-empty">Memuat aplikasi...</p>
        ) : loadError ? (
          <p className="applications-empty">{loadError}</p>
        ) : (
          <div className="applications-board">
            {statusOptions.map((status) => {
              const columnApps = applications.filter((a) => a.applicationStatus === status);
              return (
                <div className={`applications-column status-${status.toLowerCase()}`} key={status}>
                  <div className="applications-column-header">
                    <h3 className="applications-column-title">{status}</h3>
                    <span className="applications-column-count">{columnApps.length}</span>
                  </div>

                  <div className="applications-column-list">
                    {columnApps.length === 0 ? (
                      <p className="applications-column-empty">
                        {status === 'Offer' ? 'Belum ada offer.' : `Belum ada di ${status}.`}
                      </p>
                    ) : (
                      columnApps.map((app) => (
                        <ApplicationCard
                          key={app.id}
                          {...app}
                          onViewDetail={setSelectedApplication}
                          onDelete={handleDelete}
                          onDuplicate={handleDuplicate}
                        />
                      ))
                    )}
                  </div>

                  <button className="applications-add-btn" onClick={() => setShowNewModal(true)}>
                    <Plus size={14} />
                    Tambah Aplikasi
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {showNewModal && (
          <NewApplicationModal
            onClose={() => setShowNewModal(false)}
            onCreated={handleCreated}
          />
        )}

        {selectedApplication && (
          <ApplicationDetailModal
            application={selectedApplication}
            onClose={() => setSelectedApplication(null)}
            onUpdated={handleUpdated}
          />
        )}

        {showHelpModal && (
          <HowItWorksModal
            onClose={() => setShowHelpModal(false)}
            title="Bagaimana Cara Kerja Applications?"
            subtitle="Kanban board ini bantu kamu pantau semua lamaran dari apply sampai keputusan akhir."
            steps={applicationSteps}
          />
        )}
      </main>
    </div>
  );
}

export default Applications;