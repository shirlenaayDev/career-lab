import { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import CreateEntityModal from '../common/CreateEntityModal';
import NewSkillModal from '../skills/NewSkillModal';

export const verificationOptions = ['Unverified', 'Verified'];

function NewCertificateModal({ onClose, onCreated }) {
  const [skills, setSkills] = useState([]);
  const [loadingSkills, setLoadingSkills] = useState(true);
  const [selectedSkillIds, setSelectedSkillIds] = useState([]);
  const [showNewSkillModal, setShowNewSkillModal] = useState(false);
  const [form, setForm] = useState({
    name: '',
    provider: '',
    issue_date: '',
    expiry_date: '',
    credential_url: '',
    credential_id: '',
    verification_status: 'Unverified',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchSkills() {
      const { data } = await supabase.from('skills').select('skill_id, name').order('name');
      if (data) setSkills(data);
      setLoadingSkills(false);
    }
    fetchSkills();
  }, []);

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

    const { data: certificate, error: insertError } = await supabase
      .from('certificates')
      .insert({
        user_id: user.id,
        name: form.name.trim(),
        provider: form.provider.trim() || null,
        issue_date: form.issue_date || null,
        expiry_date: form.expiry_date || null,
        credential_url: form.credential_url.trim() || null,
        credential_id: form.credential_id.trim() || null,
        verification_status: form.verification_status,
      })
      .select()
      .single();

    if (insertError) {
      setIsSubmitting(false);
      setError('Gagal menyimpan sertifikat. Coba lagi.');
      return;
    }

    if (selectedSkillIds.length > 0) {
      const rows = selectedSkillIds.map((skillId) => ({
        certificate_id: certificate.certificate_id,
        skill_id: skillId,
        user_id: user.id,
      }));
      const { error: skillsError } = await supabase.from('certificate_skills').insert(rows);
      if (skillsError) {
        setIsSubmitting(false);
        setError('Sertifikat tersimpan, tapi gagal nyimpen skill. Bisa ditambahin lagi dari detail.');
        onCreated(certificate);
        onClose();
        return;
      }
    }

    setIsSubmitting(false);
    onCreated(certificate);
    onClose();
  }

  return (
    <>
      <CreateEntityModal
        title="Buat Sertifikat Baru"
        onClose={onClose}
        onSubmit={handleSubmit}
        submitLabel="Buat Sertifikat"
        isSubmitting={isSubmitting}
        error={error}
      >
        <div className="entity-form-field">
          <label className="entity-form-label">Nama Sertifikat</label>
          <input
            type="text"
            name="name"
            className="entity-form-input"
            placeholder="Contoh: SQL Fundamentals"
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
            placeholder="Contoh: Coursera, Dicoding"
            value={form.provider}
            onChange={handleChange}
          />
        </div>

        <div className="entity-form-field-row">
          <div className="entity-form-field">
            <label className="entity-form-label">Tanggal Terbit</label>
            <input
              type="date"
              name="issue_date"
              className="entity-form-input"
              value={form.issue_date}
              onChange={handleChange}
            />
          </div>
          <div className="entity-form-field">
            <label className="entity-form-label">Tanggal Kadaluarsa</label>
            <input
              type="date"
              name="expiry_date"
              className="entity-form-input"
              value={form.expiry_date}
              onChange={handleChange}
            />
            <p className="entity-form-hint">Kosongkan kalau nggak ada masa berlaku.</p>
          </div>
        </div>

        <div className="entity-form-field">
          <label className="entity-form-label">URL Verifikasi</label>
          <input
            type="text"
            name="credential_url"
            className="entity-form-input"
            placeholder="https://..."
            value={form.credential_url}
            onChange={handleChange}
          />
        </div>

        <div className="entity-form-field-row">
          <div className="entity-form-field">
            <label className="entity-form-label">Credential ID</label>
            <input
              type="text"
              name="credential_id"
              className="entity-form-input"
              value={form.credential_id}
              onChange={handleChange}
            />
          </div>
          <div className="entity-form-field">
            <label className="entity-form-label">Status Verifikasi</label>
            <select
              name="verification_status"
              className="entity-form-select"
              value={form.verification_status}
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
            {loadingSkills ? (
              <p className="entity-form-hint">Memuat skills...</p>
            ) : (
              skills.map((s) => (
                <button
                  type="button"
                  key={s.skill_id}
                  className={`skill-chip ${selectedSkillIds.includes(s.skill_id) ? 'active' : ''}`}
                  onClick={() => toggleSkill(s.skill_id)}
                >
                  {s.name}
                </button>
              ))
            )}
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

export default NewCertificateModal;