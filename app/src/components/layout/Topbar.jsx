import { Search, Bell } from 'lucide-react';
import './Topbar.css';

function Topbar({ userName = 'User1', actionButton }) {
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

      <button className="topbar-avatar-btn">
        <span className="topbar-avatar">{userName.charAt(0)}</span>
      </button>
    </div>
  );
}

export default Topbar;