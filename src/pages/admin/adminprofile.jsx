import React, { useState, useRef, useEffect } from 'react';
import AdminNavbar from './adminnavbar';
import '../../styles/adminprofile.css';

const AdminProfile = () => {
  const [profile, setProfile] = useState(() => {
    const raw = localStorage.getItem('admin_profile');
    if (raw) try { return JSON.parse(raw); } catch (e) {}
    return { name: 'Admin User', email: 'admin@medi-ecom.test', role: 'Administrator', phone: '+1 555 231 882' };
  });

  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [errors, setErrors] = useState({});

  const [originalProfile, setOriginalProfile] = useState(profile);
  const nameRef = useRef(null);

  // activity persisted in localStorage
  const [activity, setActivity] = useState(() => {
    const raw = localStorage.getItem('admin_activity');
    if (raw) try { return JSON.parse(raw); } catch (e) {}
    return [
      { id: 1, text: 'Logged in from IP 192.168.0.12', time: '2 days ago' },
      { id: 2, text: 'Updated product metadata', time: '3 days ago' },
      { id: 3, text: 'Responded to ticket #102', time: '6 days ago' }
    ];
  });

  useEffect(() => { localStorage.setItem('admin_activity', JSON.stringify(activity)); }, [activity]);

  const handleChange = (e) => setProfile({ ...profile, [e.target.name]: e.target.value });

  useEffect(() => {
    if (editing) {
      // focus the name field when editing starts
      setTimeout(() => nameRef.current && nameRef.current.focus(), 80);
    }
  }, [editing]);

  const validate = () => {
    const errs = {};
    if (!profile.name || profile.name.trim().length < 2) errs.name = 'Please enter your name';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email)) errs.email = 'Enter a valid email';
    if (!/^([0-9+()\-\s]){7,}$/.test(profile.phone)) errs.phone = 'Enter a valid phone number';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const save = () => {
    if (!validate()) return;
    setEditing(false);
    setOriginalProfile(profile);
    localStorage.setItem('admin_profile', JSON.stringify(profile));
    setSaved(true);
    setActivity([{ id: Date.now(), text: 'Updated profile', time: 'just now' }, ...activity]);
    setTimeout(() => setSaved(false), 1800);
  };

  const cancelEdit = () => {
    setProfile(originalProfile);
    setEditing(false);
    setErrors({});
  };


  return (
    <div className="admin-profile">
      <AdminNavbar />
      <div className="main-content">
        <div className="page-inner">
          <div className="welcome-header">
            <div>
              <h2>Profile</h2>
              <p className="welcome-sub">Your account details and activity overview.</p>
            </div>
            <div className="header-actions">
              <button className="btn small" onClick={() => { if (editing) cancelEdit(); else { setOriginalProfile(profile); setEditing(true); } }}>{editing ? 'Cancel' : 'Edit Profile'}</button>
            </div>
          </div>

          <div className="profile-grid enhanced">
            <div className="profile-card">
              <div className="avatar-large">A</div>
              <h3 className="name">{profile.name}</h3>
              <p className="role">{profile.role}</p>
              <div className="stats">
                <div><strong>12</strong><div className="muted">Logins (30d)</div></div>
                <div><strong>3</strong><div className="muted">Pending Verifs</div></div>
                <div><strong>4</strong><div className="muted">Open Tickets</div></div>
              </div>

              <div className="account-security card">
                <h4>Account security</h4>
                <div className="sec-row"><div>Two-factor authentication</div><div><button className="btn small">Enable</button></div></div>
                <div className="sec-row"><div>Last password change</div><div className="muted">3 months ago</div></div>
              </div>
            </div>

            <div className="profile-edit">
              <div className="card">
                <h4>Account details</h4>
                <div className="form-row">
                  <label htmlFor="p-name">Name</label>
                  <input id="p-name" name="name" ref={nameRef} value={profile.name} onChange={handleChange} disabled={!editing} />
                  {errors.name && <div className="field-error">{errors.name}</div>}
                </div>

                <div className="form-row">
                  <label htmlFor="p-email">Email</label>
                  <input id="p-email" type="email" name="email" value={profile.email} onChange={handleChange} disabled={!editing} />
                  {errors.email && <div className="field-error">{errors.email}</div>}
                </div>

                <div className="form-row">
                  <label htmlFor="p-phone">Phone</label>
                  <input id="p-phone" type="tel" name="phone" value={profile.phone} onChange={handleChange} disabled={!editing} />
                  {errors.phone && <div className="field-error">{errors.phone}</div>}
                </div>

                <div className="form-actions">
                  {editing ? (
                    <>
                      <button className="btn primary" onClick={save}>Save</button>
                      <button className="btn" onClick={() => setEditing(false)}>Cancel</button>
                    </>
                  ) : (
                    <div className="muted">Last login: 2 days ago</div>
                  )}
                </div>

                {saved && <div className="saved">Saved ✓</div>}

              </div>

              <div className="card activity">
                <h4>Recent activity</h4>
                <ul>
                  <li>Logged in from IP 192.168.0.12 <span className="muted">2 days ago</span></li>
                  <li>Updated product metadata <span className="muted">3 days ago</span></li>
                  <li>Responded to ticket #102 <span className="muted">6 days ago</span></li>
                </ul>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
export default AdminProfile;
