import { useEffect, useMemo, useState } from 'react';
import { Plus, Search, HelpCircle, Award, ShieldCheck, Sparkles } from 'lucide-react';
import { supabase } from '../supabaseClient';
import Sidebar from '../components/layout/Sidebar';
import Topbar from '../components/layout/Topbar';
import CertificateCard from '../components/certificates/CertificateCard';
import NewCertificateModal from '../components/certificates/NewCertificateModal';
import CertificateDetailModal from '../components/certificates/CertificateDetailModal';
import HowItWorksModal from '../components/career-paths/HowItWorksModal';
import '../pages/CareerPaths.css';
import './Certificates.css';

const filterTabs = ['Semua', 'Verified', 'Unverified'];

const certificateSteps = [
  {
    icon: Award,
    title: 'Catat Sertifikat Kamu',
    description: 'Semua sertifikat yang udah kamu dapetin dari course, pelatihan, atau kompetisi.',
  },
  {
    icon: ShieldCheck,
    title: 'Verifikasi Kalau Bisa',
    description: 'Kalau ada URL credential yang bisa diverifikasi publik, tandai sebagai Verified biar lebih kredibel.',
  },
  {
    icon: Sparkles,
    title: 'Kaitkan ke Skill',
    description: 'Hubungkan sertifikat ke skill yang dibuktikannya, biar jadi evidence yang jelas.',
  },
];

function mapCertificate(row, skillsByCertificate) {
  return {
    id: row.certificate_id,
    name: row.name,
    provider: row.provider,
    issueDate: row.issue_date,
    expiryDate: row.expiry_date,
    credentialUrl: row.credential_url,
    credentialId: row.credential_id,
    verificationStatus: row.verification_status,
    skillNames: skillsByCertificate[row.certificate_id] || [],
  };
}

function Certificates() {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('Semua');
  const [showNewModal, setShowNewModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState(null);

  async function fetchCertificates() {
    setLoading(true);
    setLoadError(null);

    const { data: certSkillRows } = await supabase
      .from('certificate_skills')
      .select('certificate_id, skills(name)');

    const skillsByCertificate = {};
    (certSkillRows || []).forEach((row) => {
      if (!skillsByCertificate[row.certificate_id]) skillsByCertificate[row.certificate_id] = [];
      if (row.skills?.name) skillsByCertificate[row.certificate_id].push(row.skills.name);
    });

    const { data, error } = await supabase
      .from('certificates')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      setLoadError('Gagal memuat data sertifikat.');
      setLoading(false);
      return;
    }

    setCertificates(data.map((row) => mapCertificate(row, skillsByCertificate)));
    setLoading(false);
  }

  useEffect(() => {
    fetchCertificates();
  }, []);

  function handleCreated() {
    fetchCertificates();
  }

  function handleUpdated() {
    fetchCertificates();
  }

  async function handleDelete(id) {
    if (!window.confirm('Hapus sertifikat ini? Tindakan ini nggak bisa dibatalkan.')) return;
    await supabase.from('certificate_skills').delete().eq('certificate_id', id);
    const { error } = await supabase.from('certificates').delete().eq('certificate_id', id);
    if (!error) setCertificates((prev) => prev.filter((c) => c.id !== id));
  }

  async function handleDuplicate(id) {
    const original = certificates.find((c) => c.id === id);
    if (!original) return;

    const { data: { user } } = await supabase.auth.getUser();

    const { data: newCert, error } = await supabase
      .from('certificates')
      .insert({
        user_id: user.id,
        name: `${original.name} (copy)`,
        provider: original.provider,
        issue_date: original.issueDate,
        expiry_date: original.expiryDate,
        credential_url: original.credentialUrl,
        credential_id: original.credentialId,
        verification_status: 'Unverified',
      })
      .select()
      .single();

    if (error) return;

    const { data: skillRows } = await supabase
      .from('certificate_skills')
      .select('skill_id')
      .eq('certificate_id', id);

    if (skillRows?.length) {
      await supabase.from('certificate_skills').insert(
        skillRows.map((r) => ({ certificate_id: newCert.certificate_id, skill_id: r.skill_id, user_id: user.id }))
      );
    }

    fetchCertificates();
  }

  const displayedCertificates = useMemo(() => {
    let result = [...certificates];

    if (activeFilter !== 'Semua') {
      result = result.filter((c) => c.verificationStatus === activeFilter);
    }

    if (searchTerm.trim()) {
      const term = searchTerm.trim().toLowerCase();
      result = result.filter((c) =>
        c.name?.toLowerCase().includes(term) || c.provider?.toLowerCase().includes(term)
      );
    }

    return result;
  }, [certificates, activeFilter, searchTerm]);

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <Topbar
          userName="User1"
          actionButton={
            <button className="topbar-new-path-btn" onClick={() => setShowNewModal(true)}>
              <Plus size={16} />
              New Certificates
            </button>
          }
        />

        <div className="certificates-header">
          <div>
            <h1 className="certificates-title">Certificates</h1>
            <p className="certificates-subtitle">Semua sertifikat yang membuktikan kompetensi kamu.</p>
          </div>
          <button className="career-experiments-help-btn" onClick={() => setShowHelpModal(true)}>
            <HelpCircle size={14} />
            Bagaimana cara kerja?
          </button>
        </div>

        <div className="certificates-toolbar">
          <div className="certificates-search">
            <Search size={18} className="certificates-search-icon" />
            <input
              type="text"
              placeholder="Search Certificates..."
              className="certificates-search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="certificates-filters">
            {filterTabs.map((tab) => (
              <button
                key={tab}
                className={`filter-tab ${activeFilter === tab ? 'active' : ''}`}
                onClick={() => setActiveFilter(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <p className="certificates-empty">Memuat sertifikat...</p>
        ) : loadError ? (
          <p className="certificates-empty">{loadError}</p>
        ) : displayedCertificates.length === 0 ? (
          <p className="certificates-empty">Belum ada sertifikat di kategori ini.</p>
        ) : (
          <div className="certificates-grid">
            {displayedCertificates.map((c) => (
              <CertificateCard
                key={c.id}
                {...c}
                onViewDetail={setSelectedCertificate}
                onDelete={handleDelete}
                onDuplicate={handleDuplicate}
              />
            ))}
          </div>
        )}

        {showNewModal && (
          <NewCertificateModal
            onClose={() => setShowNewModal(false)}
            onCreated={handleCreated}
          />
        )}

        {selectedCertificate && (
          <CertificateDetailModal
            certificate={selectedCertificate}
            onClose={() => setSelectedCertificate(null)}
            onUpdated={handleUpdated}
          />
        )}

        {showHelpModal && (
          <HowItWorksModal
            onClose={() => setShowHelpModal(false)}
            title="Bagaimana Cara Kerja Certificates?"
            subtitle="Sertifikat adalah bukti formal dari kompetensi yang udah kamu bangun."
            steps={certificateSteps}
          />
        )}
      </main>
    </div>
  );
}

export default Certificates;