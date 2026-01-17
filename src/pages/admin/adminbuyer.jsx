import React, { useEffect, useState } from 'react';
import AdminNavbar from './adminnavbar';
import '../../styles/adminbuyer.css';

const sample = [
  { id: 1, name: 'John Doe', email: 'john@example.com', phone: '+1 234 567 890', status: 'verified', joined: '2025-09-15' },
  { id: 2, name: 'Mary Smith', email: 'mary@healthmail.com', phone: '+44 7856 123456', status: 'pending', joined: '2025-10-10' }
];

const AdminBuyer = () => {
  const [buyers, setBuyers] = useState(() => {
    const raw = localStorage.getItem('admin_buyers');
    if (raw) try { return JSON.parse(raw); } catch (e) {}
    return sample;
  });

  const [filter, setFilter] = useState('all');
  const [showAdd, setShowAdd] = useState(false);
  const [showView, setShowView] = useState(false);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '', status: 'verified' });

  useEffect(() => {
    localStorage.setItem('admin_buyers', JSON.stringify(buyers));
  }, [buyers]);

  const filtered = buyers.filter(b => filter === 'all' || b.status === filter);

  const openAdd = () => { setForm({ name: '', email: '', phone: '', status: 'verified' }); setShowAdd(true); };
  const closeAdd = () => setShowAdd(false);

  const addBuyer = (e) => {
    e.preventDefault();
    if (!form.name || !form.email) return alert('Name and email are required.');
    const id = buyers.length ? Math.max(...buyers.map(b => b.id)) + 1 : 1;
    const newBuyer = { ...form, id, joined: new Date().toISOString().slice(0,10) };
    setBuyers(prev => [...prev, newBuyer]);
    closeAdd();
  };

  const viewBuyer = (b) => { setSelected(b); setShowView(true); };
  const closeView = () => { setShowView(false); setSelected(null); };

  const removeBuyer = (id) => {
    if (!confirm('Delete this buyer?')) return;
    setBuyers(prev => prev.filter(b => b.id !== id));
  };

  const exportPdf = () => {
    const content = document.querySelector('.buyers-container');
    if (!content) return alert('Nothing to export.');
    const styles = `body{font-family:Inter, Arial, sans-serif; color:#2c3e50; margin:20px} h2{color:#2c3e50} table{width:100%; border-collapse:collapse; margin-top:12px} th,td{padding:10px; border:1px solid #e6eef8; text-align:left} th{background:#0056b3; color:white}`;
    const win = window.open('', '_blank');
    try {
      win.document.open();
      win.document.write('<!doctype html><html><head><title>Buyers Export</title>');
      win.document.write('<meta charset="utf-8">');
      win.document.write('<style>' + styles + '</style>');
      win.document.write('</head><body>');
      win.document.write('<h2>Buyers — Export</h2>');
      const table = content.querySelector('table');
      if (table) win.document.write(table.outerHTML); else win.document.write(content.innerHTML);
      win.document.write('</body></html>');
      win.document.close();
      win.focus();
      setTimeout(function(){ try { win.print(); } catch(e) { console.error(e); } try { win.close(); } catch(e) {} }, 500);
    } catch (err) {
      console.error('Export failed', err);
      try { win.close(); } catch(e) {}
      alert('Export failed in this browser.');
    }
  };

  return (
    <div className="admin-buyers">
      <AdminNavbar />
      <div className="main-content">
        <div className="page-inner">
          <div className="page-controls">
            <div>
              <h2>Manage Buyers</h2>
              <p className="page-sub">Manage and review registered buyers, their status, and recent activity.</p>
            </div>
            <div className="filters">
              <select className="control-select" value={filter} onChange={e => setFilter(e.target.value)}>
                <option value="all">All</option>
                <option value="verified">Verified</option>
                <option value="pending">Pending</option>
              </select>

              <button className="control-btn primary-btn" onClick={openAdd}><i className="bi bi-person-plus-fill" aria-hidden="true"></i> Add Buyer</button>
              <button className="control-btn primary-btn" onClick={exportPdf} title="Export PDF"><i className="bi bi-file-earmark-pdf" aria-hidden="true"></i> Export PDF</button>
            </div>
          </div>

          <div className="buyers-container centered-card">
            <div className="buyers-table">
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Full Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Status</th>
                    <th>Joined</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((b, idx) => (
                    <tr key={b.id} data-status={b.status} className={selected && selected.id === b.id ? 'selected' : ''}>
                      <td>{b.id}</td>
                      <td>{b.name}</td>
                      <td>{b.email}</td>
                      <td>{b.phone}</td>
                      <td><span className={`status-badge ${b.status === 'verified' ? 'status-verified' : 'status-pending'}`}>{b.status.charAt(0).toUpperCase() + b.status.slice(1)}</span></td>
                      <td>{b.joined}</td>
                      <td>
                        <button className="action-btn action-view" onClick={() => viewBuyer(b)}>View</button>
                        <button className="action-btn action-delete" onClick={() => removeBuyer(b.id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="page-footer">© 2026 Medi-Ecom Admin Portal</div>
        </div>
      </div>

      {/* View Modal */}
      {showView && selected && (
        <div className="modal active" onClick={closeView}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Buyer Details</h3>
              <span className="close-btn" onClick={closeView}>&times;</span>
            </div>
            <div className="buyer-info">
              <p><strong>Name:</strong> {selected.name}</p>
              <p><strong>Email:</strong> {selected.email}</p>
              <p><strong>Phone:</strong> {selected.phone}</p>
              <p><strong>Status:</strong> {selected.status}</p>
              <p><strong>Joined:</strong> {selected.joined}</p>
            </div>
          </div>
        </div>
      )}

      {/* Add Modal */}
      {showAdd && (
        <div className="modal active" onClick={closeAdd}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add Buyer</h3>
              <span className="close-btn" onClick={closeAdd}>&times;</span>
            </div>
            <form onSubmit={addBuyer} className="add-form">
              <input placeholder="Full name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
              <input placeholder="Email" value={form.email} type="email" onChange={e => setForm({ ...form, email: e.target.value })} required />
              <input placeholder="Phone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
              <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                <option value="verified">Verified</option>
                <option value="pending">Pending</option>
              </select>

              <div className="form-actions">
                <button type="button" className="action-btn" onClick={closeAdd}>Cancel</button>
                <button type="submit" className="add-btn">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminBuyer;
