import { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import CreateEntityModal from '../common/CreateEntityModal';
import NewSkillModal from '../skills/NewSkillModal';
import { verificationOptions } from './NewCertificateModal';

function CertificateDetailModal({ certificate, onClose, onUpdated }) {
  const [skills, setSkills] = useState([]);
  const [selectedSkillIds, setSelectedSkillIds] = useState([]);
  const [showNewSkillModal, setShowNewSkillModal] = useState(false);
  const [form, setForm] = useState({
    name: certificate.name || '',
    provider: certificate.provider || '',
    issueDate: certificate.issueDate || '',
    expiryDate: certificate.expiryDate || '',
    credentialUrl: certificate.credentialUrl || '',
    credentialId: certificate.credentialId || '',
    verificationStatus: certificate.verificationStatus || 'Unverified',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchSkillData() {
      const [{ data: allSkills }, { data: certSkillRows }] = await Promise.all([
        supabase.from('skills').select('skill_id, name').order('name'),
        supabase.from('certificate_skills').select('skill_id').eq('certificate_id', certificate.id),
      ]);
      setSkills(allSkills || []);
      setSelectedSkillIds((certSkillRows || []).map((r) => r.skill_id));
    }
    fetchSkillData();
  }, [certificate.id]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function toggleSkill(skillId) {
    setSelectedSkillIds((prev) =>
      prev.includes(skillId) ? prev.filter((id) => id !== skillId) : [...prev, skillId]
    );
  }

  function handleSkillCreated(newSkill) {
    setSkills((prev) => [...prev, { skill_id: newSkill.skill_id, name: newSkill.name }]);
    setSelectedSkillIds((prev) => [...prev, newSkill.skill_id]);
    setShowNewSkillModal(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    if (!form.name.trim()) {
      setError('Nama sertifikat wajib diisi.');
      return;
    }

    setIsSubmitting(true);

    const { data: { user } } = await supabase.auth.getUser();

    const { data, error: updateError } = await supabase
      .from('certificates')
      .update({
        name: form.name.trim(),
        provider: form.provider.trim() || null,
        issue_date: form.issueDate || null,
        expiry_date: form.expiryDate || null,
        credential_url: form.credentialUrl.trim() || null,
        credential_id: form.credentialId.trim() || null,
        verification_status: form.verificationStatus,
      })
      .eq('certificate_id', certificate.id)
      .select()
      .single();

    if (updateError) {
      setIsSubmitting(false);
      setError('Gagal update sertifikat. Coba lagi.');
      return;
    }

    await supabase.from('certificate_skills').delete().eq('certificate_id', certificate.id);
    if (selectedSkillIds.length > 0) {
      const { error: skillsError } = await supabase.from('certificate_skills').insert(
        selectedSkillIds.map((skillId) => ({ certificate_id: certificate.id, skill_id: skillId, user_id: user.id }))
      );
      if (skillsError) {
        setIsSubmitting(false);
        setError('Sertifikat tersimpan, tapi gagal update skill. Coba simpan lagi.');
        return;
      }
    }

    setIsSubmitting(false);
    onUpdated(data);
    onClose();
  }

  return (
    <>
      <CreateEntityModal
        title="Detail Sertifikat"
        onClose={onClose}
        onSubmit={handleSubmit}
        submitLabel="Simpan Perubahan"
        isSubmitting={isSubmitting}
        error={error}
      >
        <div className="entity-form-field">
          <label className="entity-form-label">Nama Sertifikat</label>
          <input
            type="text"
            name="name"
            className="entity-form-input"
            value={form.name}
            onChange={handleChange}
          />
        </div>

        <div className="entity-form-field">
          <label className="entity-form-label">Provider</label>
          <input
            type="text"
            name="provider"
            className="entity-form-input"
            value={form.provider}
            onChange={handleChange}
          />
        </div>

        <div className="entity-form-field-row">
          <div className="entity-form-field">
            <label className="entity-form-label">Tanggal Terbit</label>
            <input
              type="date"
              name="issueDate"
              className="entity-form-input"
              value={form.issueDate || ''}
              onChange={handleChange}
            />
          </div>
          <div className="entity-form-field">
            <label className="entity-form-label">Tanggal Kadaluarsa</label>
            <input
              type="date"
              name="expiryDate"
              className="entity-form-input"
              value={form.expiryDate || ''}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="entity-form-field">
          <label className="entity-form-label">URL Verifikasi</label>
          <input
            type="text"
            name="credentialUrl"
            className="entity-form-input"
            value={form.credentialUrl}
            onChange={handleChange}
          />
        </div>

        <div className="entity-form-field-row">
          <div className="entity-form-field">
            <label className="entity-form-label">Credential ID</label>
            <input
              type="text"
              name="credentialId"
              className="entity-form-input"
              value={form.credentialId}
              onChange={handleChange}
            />
          </div>
          <div className="entity-form-field">
            <label className="entity-form-label">Status Verifikasi</label>
            <select
              name="verificationStatus"
              className="entity-form-select"
              value={form.verificationStatus}
              onChange={handleChange}
            >
              {verificationOptions.map((v) => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="entity-form-field">
          <label className="entity-form-label">Skills</label>
          <div className="skill-picker">
            {skills.map((s) => (
              <button
                type="button"
                key={s.skill_id}
                className={`skill-chip ${selectedSkillIds.includes(s.skill_id) ? 'active' : ''}`}
                onClick={() => toggleSkill(s.skill_id)}
              >
                {s.name}
              </button>
            ))}
            <button
              type="button"
              className="skill-chip skill-chip-add"
              onClick={() => setShowNewSkillModal(true)}
            >
              + Tambah skill baru
            </button>
          </div>
        </div>
      </CreateEntityModal>

      {showNewSkillModal && (
        <NewSkillModal
          onClose={() => setShowNewSkillModal(false)}
          onCreated={handleSkillCreated}
        />
      )}
    </>
  );
}

export default CertificateDetailModal;