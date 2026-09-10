import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { supabase } from '../supabaseClient';
import Sidebar from '../components/layout/Sidebar';
import Topbar from '../components/layout/Topbar';
import '../components/common/CreateEntityModal.css';
import './Settings.css';

function Settings() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('Student');
  const [reminderEnabled, setReminderEnabled] = useState(true);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMessage, setProfileMessage] = useState(null);
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState(null);
  const [passwordError, setPasswordError] = useState(null);

  useEffect(() => {
    async function fetchUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setEmail(user.email || '');
        setFullName(user.user_metadata?.full_name || '');
        setRole(user.user_metadata?.role || 'Student');
        setReminderEnabled(user.user_metadata?.reminder_enabled ?? true);
      }
      setLoading(false);
    }
    fetchUser();
  }, []);

  async function handleSaveProfile(e) {
    e.preventDefault();
    setProfileMessage(null);
    setSavingProfile(true);

    const { error } = await supabase.auth.updateUser({
      data: { full_name: fullName.trim(), role: role.trim() || 'Student', reminder_enabled: reminderEnabled },
    });

    setSavingProfile(false);

    if (error) {
      setProfileMessage({ type: 'error', text: 'Gagal menyimpan profile. Coba lagi.' });
      return;
    }
    setProfileMessage({ type: 'success', text: 'Profile berhasil disimpan.' });
  }

  async function handleChangePassword(e) {
    e.preventDefault();
    setPasswordError(null);
    setPasswordMessage(null);

    if (newPassword.length < 6) {
      setPasswordError('Password minimal 6 karakter.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('Konfirmasi password nggak cocok.');
      return;
    }

    setSavingPassword(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setSavingPassword(false);

    if (error) {
      setPasswordError('Gagal ganti password. Coba lagi.');
      return;
    }

    setPasswordMessage('Password berhasil diganti.');
    setNewPassword('');
    setConfirmPassword('');
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    navigate('/');
  }

  if (loading) {
    return (
      <div className="app-layout">
        <Sidebar />
        <main className="main-content">
          <p className="settings-empty">Memuat settings...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <Topbar userName={fullName || email.split('@')[0]} userRole={role} profileVariant="full" />

        <div className="settings-header">
          <h1 className="settings-title">Settings</h1>
          <p className="settings-subtitle">Kelola profile dan akun kamu.</p>
        </div>

        <div className="settings-section">
          <h2 className="settings-section-title">Profile</h2>
          <form className="settings-form" onSubmit={handleSaveProfile}>
            <div className="entity-form-field">
              <label className="entity-form-label">Nama Lengkap</label>
              <input
                type="text"
                className="entity-form-input"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Nama kamu"
              />
            </div>

            <div className="entity-form-field">
              <label className="entity-form-label">Role</label>
              <input
                type="text"
                className="entity-form-input"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="Contoh: Student"
              />
            </div>

            <div className="entity-form-field">
              <label className="entity-form-label">Email</label>
              <input
                type="text"
                className="entity-form-input"
                value={email}
                disabled
              />
              <p className="entity-form-hint">Email nggak bisa diubah dari sini.</p>
            </div>

            {profileMessage && (
              <p className={profileMessage.type === 'error' ? 'entity-form-error' : 'settings-success'}>
                {profileMessage.text}
              </p>
            )}

            <button type="submit" className="settings-save-btn" disabled={savingProfile}>
              {savingProfile ? 'Menyimpan...' : 'Simpan Profile'}
            </button>
          </form>
        </div>

        <div className="settings-section">
          <h2 className="settings-section-title">Preferensi</h2>
          <div className="settings-toggle-row">
            <div>
              <p className="settings-toggle-label">Reminder Reflection Mingguan</p>
              <p className="settings-toggle-desc">Munculin pengingat di Dashboard kalau udah lama nggak isi Weekly Reflection.</p>
            </div>
            <button
              type="button"
              className={`settings-toggle ${reminderEnabled ? 'active' : ''}`}
              onClick={async () => {
                const next = !reminderEnabled;
                setReminderEnabled(next);
                await supabase.auth.updateUser({ data: { reminder_enabled: next } });
              }}
            >
              <span className="settings-toggle-knob" />
            </button>
          </div>
        </div>

        <div className="settings-section">
          <h2 className="settings-section-title">Ganti Password</h2>
          <form className="settings-form" onSubmit={handleChangePassword}>
            <div className="entity-form-field-row">
              <div className="entity-form-field">
                <label className="entity-form-label">Password Baru</label>
                <input
                  type="password"
                  className="entity-form-input"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Minimal 6 karakter"
                />
              </div>
              <div className="entity-form-field">
                <label className="entity-form-label">Konfirmasi Password</label>
                <input
                  type="password"
                  className="entity-form-input"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>

            {passwordError && <p className="entity-form-error">{passwordError}</p>}
            {passwordMessage && <p className="settings-success">{passwordMessage}</p>}

            <button type="submit" className="settings-save-btn" disabled={savingPassword}>
              {savingPassword ? 'Menyimpan...' : 'Ganti Password'}
            </button>
          </form>
        </div>

        <div className="settings-section">
          <h2 className="settings-section-title">Akun</h2>
          <button className="settings-logout-btn" onClick={handleLogout}>
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </main>
    </div>
  );
}

export default Settings;