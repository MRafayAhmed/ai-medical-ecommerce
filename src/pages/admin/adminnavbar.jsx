import React, { useEffect, useState, useRef } from 'react';
import '../../styles/adminnavbar.css';
import { Link, NavLink, useNavigate } from 'react-router-dom';

const AdminNavbar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // New: dropdown state
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  // Unread notifications count (replace with API-driven value later)
  const [unreadCount, setUnreadCount] = useState(3);

  const notifRef = useRef(null);
  const profileRef = useRef(null);

  const navigate = useNavigate();

  // initialize unread count from localStorage and listen for updates from other pages
  useEffect(() => {
    const saved = parseInt(localStorage.getItem('admin_unread_count') ?? '3', 10);
    setUnreadCount(isNaN(saved) ? 3 : saved);

    const onUpdate = (e) => {
      const newCount = (e && e.detail && typeof e.detail.unread === 'number') ? e.detail.unread : parseInt(localStorage.getItem('admin_unread_count') ?? '0', 10);
      setUnreadCount(isNaN(newCount) ? 0 : newCount);
    };

    window.addEventListener('notifications:update', onUpdate);
    return () => window.removeEventListener('notifications:update', onUpdate);
  }, []);

  useEffect(() => {
    // Toggle collapsed class on body so other components (main-content) can react
    if (collapsed) document.body.classList.add('sidebar-collapsed');
    else document.body.classList.remove('sidebar-collapsed');
  }, [collapsed]);

  // mark all notifications as read
  const markAllRead = () => {
    setUnreadCount(0);
    localStorage.setItem('admin_unread_count', '0');
    window.dispatchEvent(new CustomEvent('notifications:update', { detail: { unread: 0 } }));
    // keep the dropdown open so user sees the 'no new notifications' state
    setShowNotifications(true);
    // TODO: call backend to mark notifications read
  };

  useEffect(() => {
    if (mobileOpen) document.body.classList.add('sidebar-open');
    else document.body.classList.remove('sidebar-open');
  }, [mobileOpen]);

  // Initialize theme and compact from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('admin_theme');
    if (savedTheme === 'dark') { 
      document.body.classList.add('dark-mode'); 
      document.body.style.setProperty('--theme-overlay-color', '#071120');
      setDarkMode(true); 
    } else {
      document.body.style.setProperty('--theme-overlay-color', '#ffffff');
    }
  }, []);

  const toggleTheme = () => {
    const next = !darkMode;
    setDarkMode(next);

    // set overlay color for transition (dark -> light or light -> dark)
    const overlayColor = next ? '#071120' : '#ffffff';
    document.body.style.setProperty('--theme-overlay-color', overlayColor);

    // add a short transition class that triggers the overlay animation
    document.body.classList.add('theme-transitioning');
    setTimeout(() => document.body.classList.remove('theme-transitioning'), 1200);

    if (next) {
      document.body.classList.add('dark-mode');
      localStorage.setItem('admin_theme', 'dark');
    } else {
      document.body.classList.remove('dark-mode');
      localStorage.setItem('admin_theme', 'light');
    }
    // Notify other parts (charts) to update colors
    window.dispatchEvent(new Event('themechange'));
  };

  // Toggle notification dropdown
  const toggleNotifications = () => {
    setShowNotifications(s => !s);
    // ensure profile menu closes
    setShowProfile(false);
  };

  // Toggle profile dropdown
  const toggleProfile = () => {
    setShowProfile(s => !s);
    setShowNotifications(false);
  };

  // Close dropdowns when clicking outside or pressing Esc
  useEffect(() => {
    const onDocClick = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifications(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setShowProfile(false);
    };
    const onKey = (e) => { if (e.key === 'Escape') { setShowNotifications(false); setShowProfile(false); } };

    document.addEventListener('click', onDocClick);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('click', onDocClick); document.removeEventListener('keydown', onKey); };
  }, []);

  const handleLogout = () => {
    // Clear basic auth/session keys if any, then navigate to login
    localStorage.removeItem('admin_token');
    // other cleanup
    localStorage.removeItem('admin_theme');
    navigate('/admin/login');
  };


  return (
    <>
      <aside className={`sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'open' : ''}`}>
        <div className="logo">
          <div className="logo-text">Medi-Ecom<br/><small>Admin</small></div>
        </div>

        <nav className="nav-links">
          <NavLink to="/admin/dashboard" className={({isActive}) => isActive ? 'active' : ''} end><i className="bi bi-house-fill" /> <span>Dashboard</span></NavLink>
          <NavLink to="/admin/buyers" className={({isActive}) => isActive ? 'active' : ''}><i className="bi bi-people-fill" /> <span>Buyers</span></NavLink>
          <NavLink to="/admin/sellers" className={({isActive}) => isActive ? 'active' : ''}><i className="bi bi-shop" /> <span>Sellers</span></NavLink>
          <NavLink to="/admin/products" className={({isActive}) => isActive ? 'active' : ''}><i className="bi bi-box-seam" /> <span>Products</span></NavLink>
          <NavLink to="/admin/orders" className={({isActive}) => isActive ? 'active' : ''}><i className="bi bi-cart-check" /> <span>Orders</span></NavLink>
          <NavLink to="/admin/reports" className={({isActive}) => isActive ? 'active' : ''}><i className="bi bi-bar-chart-line" /> <span>Reports</span></NavLink>
        </nav>

        <div className="sidebar-bottom">
          <div className="sidebar-footer">
            <NavLink to="/admin/settings" className={({isActive}) => isActive ? 'active' : ''}><i className="bi bi-gear-fill" /> <span>Settings</span></NavLink>
          </div>

          <div className="sidebar-logout">
            <button className="logout-btn" onClick={handleLogout}><i className="bi bi-box-arrow-right" /> <span>Logout</span></button>
          </div>
        </div>
      </aside>

      <header className={`topbar ${collapsed ? 'collapsed' : ''}`}>
        <div className="topbar-left">
          <button className="mobile-toggle icon-btn" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Open sidebar">
            <i className="bi bi-list" />
          </button>
          <div className="brand topbar-brand">Medi-Ecom</div>
        </div>

        <div className="topbar-center">
          <div className="search-bar">
            <input type="search" placeholder="Search buyers, sellers, products..." aria-label="Search" />
            <button aria-label="Search"><i className="bi bi-search" /></button>
          </div>
        </div>

        <div className="topbar-right">
          <div className="notif-wrapper" ref={notifRef}>
            <button className={`icon-btn notif-btn large ${unreadCount > 0 ? 'filled' : ''}`} title="Notifications" aria-haspopup="true" aria-expanded={showNotifications} onClick={toggleNotifications} aria-controls="notif-list">
              <i className={unreadCount > 0 ? 'bi bi-bell-fill' : 'bi bi-bell'} />
              {unreadCount > 0 && <span className={`notif-badge ${unreadCount > 0 ? 'pulse' : ''}`} role="status" aria-live="polite" aria-atomic="true">{unreadCount > 99 ? '99+' : unreadCount}</span>}
            </button>

            {showNotifications && (
              <div className="dropdown notifications" id="notif-list" role="menu">
                <div className="dropdown-header">Notifications</div>

                {unreadCount === 0 ? (
                  <div className="no-notifs">You're all caught up — no new notifications.</div>
                ) : (
                  <ul>
                    <li><strong>Order #2025</strong> completed.</li>
                    <li>New seller <em>MediMart</em> verified.</li>
                    <li>Low stock on <em>Paracetamol</em>.</li>
                  </ul>
                )}

                <div className="dropdown-footer">
                  <button onClick={() => { setShowNotifications(false); navigate('/admin/notifications'); }}>View all</button>
                  {unreadCount > 0 && <button onClick={markAllRead} style={{ marginLeft: 8 }}>Mark all as read</button>}
                </div>
              </div>
            )}
          </div>

          {/* Theme toggle */}
          <button
            className={`icon-btn ${darkMode ? 'active' : ''}`}
            title="Toggle theme"
            onClick={toggleTheme}
            aria-pressed={darkMode}
          >
            <i className={darkMode ? 'bi bi-sun' : 'bi bi-moon'} />
          </button>

          <div className="account-avatar" ref={profileRef}>
            <button className="avatar-btn" aria-expanded={showProfile} onClick={toggleProfile} aria-controls="profile-menu">
              <div className="avatar-circle">A</div>
            </button>

            {showProfile && (
              <div className="dropdown profile" id="profile-menu" role="menu">
                <div className="dropdown-header">Admin</div>
                <ul>
                  <li><button onClick={() => { setShowProfile(false); navigate('/admin/profile'); }}>View Profile</button></li>
                  <li><button onClick={() => { setShowProfile(false); navigate('/admin/settings'); }}>Settings</button></li>
                  <li><button onClick={handleLogout}>Logout</button></li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </header>
      {/* optional backdrop for mobile */}
      <div className={`sidebar-backdrop ${mobileOpen ? 'active' : ''}`} onClick={() => setMobileOpen(false)}></div>
    </>
  );
};

export default AdminNavbar;
