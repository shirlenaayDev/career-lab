import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, ChevronDown, Settings as SettingsIcon, LogOut } from 'lucide-react';
import { supabase } from '../../supabaseClient';
import './Topbar.css';

function Topbar({ userName, userRole = 'Student', actionButton, profileVariant = 'compact' }) {
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState(userName || 'User');
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    async function fetchUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const name = user.user_metadata?.full_name || user.email?.split('@')[0] || 'User';
        setDisplayName(name);
      }
    }
    fetchUser();
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
  }

  return (
    <div className="topbar">
      <div className="topbar-search">
        <Search size={20} className="topbar-search-icon" />
        <input
          type="text"
          placeholder="Search anything..."
          className="topbar-search-input"
        />
      </div>

      {actionButton}

      <button className="topbar-notif-btn">
        <Bell size={20} />
        <span className="topbar-notif-dot" />
      </button>

      <div className="topbar-profile-wrap">
        {profileVariant === 'full' ? (
          <button className="topbar-user-full" onClick={() => setShowMenu((v) => !v)}>
            <div className="topbar-avatar">{displayName.charAt(0).toUpperCase()}</div>
            <div className="topbar-user-text">
              <p className="topbar-user-name">{displayName}</p>
              <p className="topbar-user-role">{userRole}</p>
            </div>
            <ChevronDown size={16} />
          </button>
        ) : (
          <button className="topbar-avatar-btn" onClick={() => setShowMenu((v) => !v)}>
            <span className="topbar-avatar">{displayName.charAt(0).toUpperCase()}</span>
          </button>
        )}

        {showMenu && (
          <div className="topbar-profile-menu" onMouseLeave={() => setShowMenu(false)}>
            <button onClick={() => { setShowMenu(false); navigate('/settings'); }}>
              <SettingsIcon size={15} />
              Settings
            </button>
            <button className="topbar-profile-menu-danger" onClick={() => { setShowMenu(false); handleLogout(); }}>
              <LogOut size={15} />
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Topbar;