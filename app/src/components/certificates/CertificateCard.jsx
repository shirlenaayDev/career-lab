import { useState } from 'react';
import { MoreVertical, ExternalLink, ShieldCheck } from 'lucide-react';
import './CertificateCard.css';

function formatDate(date) {
  if (!date) return null;
  return new Date(date).toLocaleDateString('id-ID', { month: 'short', year: 'numeric' });
}

function isExpired(expiryDate) {
  if (!expiryDate) return false;
  return new Date(expiryDate) < new Date();
}

function CertificateCard({ id, name, provider, issueDate, expiryDate, credentialUrl, credentialId, verificationStatus, skillNames = [], onViewDetail, onDelete, onDuplicate, ...rest }) {
  const [showMenu, setShowMenu] = useState(false);
  const expired = isExpired(expiryDate);

  const fullData = { id, name, provider, issueDate, expiryDate, credentialUrl, credentialId, verificationStatus, skillNames, ...rest };

  return (
    <div className="certificate-card">
      <div className="card-menu-wrap">
        <button className="card-menu-btn" onClick={() => setShowMenu((v) => !v)}>
          <MoreVertical size={16} />
        </button>
        {showMenu && (
          <div className="card-menu" onMouseLeave={() => setShowMenu(false)}>
            <button onClick={() => { setShowMenu(false); onViewDetail(fullData); }}>Edit</button>
            <button onClick={() => { setShowMenu(false); onDuplicate(id); }}>Duplikat</button>
            <button className="card-menu-danger" onClick={() => { setShowMenu(false); onDelete(id); }}>Hapus</button>
          </div>
        )}
      </div>

      <div className="certificate-card-top">
        <span className={`certificate-verify-badge ${verificationStatus === 'Verified' ? 'verified' : ''}`}>
          {verificationStatus === 'Verified' && <ShieldCheck size={12} />}
          {verificationStatus}
        </span>
        {expired && <span className="certificate-expired-badge">Expired</span>}
      </div>

      <h3 className="certificate-card-title">{name}</h3>
      {provider && <p className="certificate-card-provider">{provider}</p>}

      {(issueDate || expiryDate) && (
        <p className="certificate-card-date">
          {issueDate && `Terbit ${formatDate(issueDate)}`}
          {expiryDate && ` · Berlaku s/d ${formatDate(expiryDate)}`}
        </p>
      )}

      {skillNames.length > 0 && (
        <div className="certificate-card-tags">
          {skillNames.slice(0, 3).map((tag, i) => (
            <span key={i} className="certificate-card-tag">{tag}</span>
          ))}
        </div>
      )}

      <div className="certificate-card-actions">
        {credentialUrl && (
          <a href={credentialUrl} target="_blank" rel="noopener noreferrer" className="certificate-verify-link">
            <ExternalLink size={13} />
            Verifikasi
          </a>
        )}
        <button className="certificate-detail-btn" onClick={() => onViewDetail(fullData)}>
          Lihat Detail
        </button>
      </div>
    </div>
  );
}

export default CertificateCard;