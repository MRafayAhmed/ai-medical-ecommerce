import React, { useEffect, useState } from 'react';
import AdminNavbar from './adminnavbar';
import '../../styles/adminnotification.css';

const sampleNotifications = [
  { id: 1, title: 'Order #2025 completed', message: 'Order #2025 has been delivered successfully.', time: '2h ago', read: false },
  { id: 2, title: 'Seller Verified', message: 'Seller "MediMart" has been verified.', time: '8h ago', read: false },
  { id: 3, title: 'Low stock: Paracetamol', message: 'Only 12 units left for Paracetamol.', time: '1d ago', read: false }
];

const AdminNotification = () => {
  const [notifications, setNotifications] = useState(() => {
    const raw = localStorage.getItem('admin_notifications');
    if (raw) try { return JSON.parse(raw); } catch (e) { }
    return sampleNotifications;
  });

  const [filter, setFilter] = useState('all'); // all | unread
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    localStorage.setItem('admin_notifications', JSON.stringify(notifications));
    const unread = notifications.filter(n => !n.read).length;
    localStorage.setItem('admin_unread_count', String(unread));
    window.dispatchEvent(new CustomEvent('notifications:update', { detail: { unread } }));

    // if selected was read, keep it selected but update object
    if (selected) {
      const updated = notifications.find(n => n.id === selected);
      if (updated) setSelected(updated.id);
      else setSelected(null);
    }
  }, [notifications]);

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const markRead = (id) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const selectNotification = (id) => {
    setSelected(id);
    // mark read on open
    const n = notifications.find(x => x.id === id);
    if (n && !n.read) markRead(id);
  };

  const filtered = notifications
    .filter(n => (filter === 'unread' ? !n.read : true))
    .filter(n => n.title.toLowerCase().includes(search.toLowerCase()) || n.message.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="admin-notifications full-screen">
      <AdminNavbar />
      <div className="main-content">
        <div className="page-inner page-wide">
          <div className="welcome-header">
            <div>
              <h2>Notifications</h2>
              <p className="welcome-sub">All recent system and marketplace notifications.</p>
            </div>
            <div className="header-actions">
              <div className="search-inline">
                <input placeholder="Search notifications..." value={search} onChange={e => setSearch(e.target.value)} />
              </div>
              <div className="filter-tabs">
                <button className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>All</button>
                <button className={filter === 'unread' ? 'active' : ''} onClick={() => setFilter('unread')}>Unread</button>
                <button className="btn small" onClick={markAllRead} disabled={notifications.every(n => n.read)}>Mark all as read</button>
              </div>
            </div>
          </div>

          <div className="notifications-grid">
            <div className="notif-list">
              {filtered.length === 0 && <div className="empty">No notifications match your search.</div>}

              {filtered.map(n => (
                <div key={n.id} className={`notif-item ${n.read ? 'read' : 'unread'} ${selected === n.id ? 'selected' : ''}`} onClick={() => selectNotification(n.id)}>
                  <div className="notif-left">
                    <div className="notif-icon"><i className="bi bi-bell-fill" /></div>
                  </div>

                  <div className="notif-body">
                    <div className="notif-title">{n.title}</div>
                    <div className="notif-meta">{n.time}</div>
                    <div className="notif-snippet">{n.message}</div>
                  </div>

                  <div className="notif-actions">
                    {!n.read ? <button className="link-btn" onClick={(e) => { e.stopPropagation(); markRead(n.id); }}>Mark as read</button> : <span className="muted">Read</span> }
                  </div>
                </div>
              ))}
            </div>

            <div className="notif-details">
              {selected ? (
                (() => {
                  const item = notifications.find(n => n.id === selected);
                  if (!item) return <div className="empty">Notification not found</div>;
                  return (
                    <div className="detail-card">
                      <div className="detail-header">
                        <h3>{item.title}</h3>
                        <div className="muted">{item.time}</div>
                      </div>
                      <div className="detail-body">{item.message}</div>
                      <div className="detail-actions">
                        <button className="btn" onClick={() => window.open('#')}>View related</button>
                        <button className="btn" onClick={() => { setNotifications(notifications.filter(n => n.id !== selected)); setSelected(null); }}>Dismiss</button>
                      </div>
                    </div>
                  );
                })()
              ) : (
                <div className="empty">Select a notification to view details.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminNotification;
