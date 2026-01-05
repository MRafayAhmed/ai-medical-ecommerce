import React, { useEffect, useState } from 'react';
import AdminNavbar from './adminnavbar';
import '../../styles/adminsetting.css';

const STORAGE_KEY = 'admin_settings_v1';

export default function AdminSetting() {
  const [form, setForm] = useState({
    fullName: 'Admin User',
    email: 'admin@mediecom.com',
    username: 'admin123',
    phone: '+92 300 1234567',
    twoFA: true,
    emailNotif: true,
    smsNotif: false,
    orderNotif: true,
    reportNotif: false,
    darkModeLocal: false,
    accent: 'Blue (Default)',
    autoBackup: true,
    maintenanceMode: false,
    apiKey: 'API-KEY-1234567890',
    avatarDataUrl: ''
  });

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        setForm(prev => ({ ...prev, ...parsed }));
      } catch (e) { /* ignore parse errors */ }
    }
  }, []);

  useEffect(() => {
    // persist changes
    localStorage.setItem(STORAGE_KEY, JSON.stringify(form));
  }, [form]);

  // Sync with global theme changes (navbar toggle)
  useEffect(() => {
    const sync = () => {
      const isDark = document.body.classList.contains('dark-mode');
      setForm(prev => ({ ...prev, darkModeLocal: isDark }));
    };
    // initialize
    sync();
    window.addEventListener('themechange', sync);
    return () => window.removeEventListener('themechange', sync);
  }, []);

  const update = (key, value) => setForm(prev => ({ ...prev, [key]: value }));

  const onSave = (ev) => {
    ev.preventDefault();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(form));
    // shallow success feedback
    const el = document.getElementById('save-toast');
    if (el) {
      el.classList.add('visible');
      setTimeout(() => el.classList.remove('visible'), 1500);
    }
  };

  const onUploadAvatar = (e) => {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = (ev) => update('avatarDataUrl', ev.target.result);
    reader.readAsDataURL(f);
  };

  return (
    <div className="admin-settings">
      <AdminNavbar />
      <div className="main-content">
        <form className={`settings-container ${form.darkModeLocal ? 'dark' : ''}`} onSubmit={onSave}>

          <div className="settings-section">
            <h4>👤 Profile & Account Information</h4>
            <div className="profile-picture mb-3">
              <img src={form.avatarDataUrl || 'https://via.placeholder.com/80'} alt="Profile" />
              <div className="profile-actions">
                <label className="btn-upload" htmlFor="avatarInput">Change Picture</label>
                <input id="avatarInput" type="file" accept="image/*" onChange={onUploadAvatar} style={{display:'none'}} />
                <button type="button" className="btn-upload" onClick={() => update('avatarDataUrl', '')}>Remove</button>
              </div>
            </div>

            <div className="settings-group">
              <div>
                <label>Full Name</label>
                <input type="text" value={form.fullName} onChange={e => update('fullName', e.target.value)} />
              </div>
              <div>
                <label>Email Address</label>
                <input type="email" value={form.email} onChange={e => update('email', e.target.value)} />
              </div>
              <div>
                <label>Username</label>
                <input type="text" value={form.username} onChange={e => update('username', e.target.value)} />
              </div>
              <div>
                <label>Phone Number</label>
                <input type="text" value={form.phone} onChange={e => update('phone', e.target.value)} />
              </div>
            </div>
          </div>

          <div className="settings-section">
            <h4>🔐 Security Settings</h4>
            <div className="settings-group">
              <div>
                <label>Change Password</label>
                <input type="password" placeholder="Enter new password" onChange={e => {/* no-op local */}} />
              </div>
              <div>
                <label>Confirm Password</label>
                <input type="password" placeholder="Confirm new password" onChange={e => {/* no-op local */}} />
              </div>
              <div className="toggle-switch wide">
                <input id="enable2FA" type="checkbox" checked={form.twoFA} onChange={e => update('twoFA', e.target.checked)} />
                <label htmlFor="enable2FA">Enable Two-Factor Authentication (2FA)</label>
              </div>
            </div>
          </div>

          <div className="settings-section">
            <h4>🔔 Notification Preferences</h4>
            <div className="settings-group">
              <div className="toggle-switch">
                <input id="emailNotif" type="checkbox" checked={form.emailNotif} onChange={e => update('emailNotif', e.target.checked)} />
                <label htmlFor="emailNotif">Email Notifications</label>
              </div>
              <div className="toggle-switch">
                <input id="smsNotif" type="checkbox" checked={form.smsNotif} onChange={e => update('smsNotif', e.target.checked)} />
                <label htmlFor="smsNotif">SMS Notifications</label>
              </div>
              <div className="toggle-switch">
                <input id="orderNotif" type="checkbox" checked={form.orderNotif} onChange={e => update('orderNotif', e.target.checked)} />
                <label htmlFor="orderNotif">Order Updates</label>
              </div>
              <div className="toggle-switch">
                <input id="reportNotif" type="checkbox" checked={form.reportNotif} onChange={e => update('reportNotif', e.target.checked)} />
                <label htmlFor="reportNotif">Monthly Reports</label>
              </div>
            </div>
          </div>

          <div className="settings-section">
            <h4>🎨 Appearance & Theme</h4>
            <div className="settings-group">
              <div className="toggle-switch">
                <input id="darkModeToggleLocal" type="checkbox" checked={form.darkModeLocal} onChange={e => update('darkModeLocal', e.target.checked)} />
                <label htmlFor="darkModeToggleLocal">Enable Dark Mode (page scoped)</label>
              </div>
              <div>
                <label>Dashboard Accent Color</label>
                <select value={form.accent} onChange={e => update('accent', e.target.value)}>
                  <option>Blue (Default)</option>
                  <option>Green</option>
                  <option>Purple</option>
                  <option>Teal</option>
                </select>
              </div>
            </div>
          </div>

          <div className="settings-section">
            <h4>⚙️ System Management</h4>
            <div className="settings-group">
              <div>
                <label>Data Backup</label>
                <button type="button" className="btn-upload" onClick={() => alert('Backup created (mock)')}>Create Backup</button>
              </div>
              <div>
                <label>API Access Key</label>
                <input type="text" readOnly value={form.apiKey} />
              </div>
              <div className="toggle-switch">
                <input id="autoBackup" type="checkbox" checked={form.autoBackup} onChange={e => update('autoBackup', e.target.checked)} />
                <label htmlFor="autoBackup">Enable Automatic Backups</label>
              </div>
              <div className="toggle-switch">
                <input id="maintenanceMode" type="checkbox" checked={form.maintenanceMode} onChange={e => update('maintenanceMode', e.target.checked)} />
                <label htmlFor="maintenanceMode">Activate Maintenance Mode</label>
              </div>
            </div>
          </div>

          <div className="text-end">
            <button className="save-btn" type="submit">💾 Save Changes</button>
          </div>

          <div id="save-toast" className="save-toast">Saved</div>
        </form>
      </div>
    </div>
  );
}
