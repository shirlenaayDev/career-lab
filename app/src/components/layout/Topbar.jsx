import { Search, Bell, ChevronDown } from 'lucide-react';
import './Topbar.css';

function Topbar({ userName = 'User1', userRole = 'Student' }) {
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

      <button className="topbar-notif-btn">
        <Bell size={20} />
        <span className="topbar-notif-dot" />
      </button>

      <button className="topbar-user">
        <div className="topbar-avatar">{userName.charAt(0)}</div>
        <div className="topbar-user-text">
          <p className="topbar-user-name">{userName}</p>
          <p className="topbar-user-role">{userRole}</p>
        </div>
        <ChevronDown size={16} />
      </button>
    </div>
  );
}

export default Topbar;