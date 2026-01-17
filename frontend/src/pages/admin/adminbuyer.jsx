import React, { useEffect, useState } from 'react';
import AdminNavbar from './adminnavbar';
import api from '../../api/axios';
import '../../styles/adminbuyer.css';

const AdminBuyer = () => {
  const [buyers, setBuyers] = useState([]);
  const [filter, setFilter] = useState('all');
  const [showAdd, setShowAdd] = useState(false); // Used for both Add and Edit
  const [showView, setShowView] = useState(false);
  const [selected, setSelected] = useState(null);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: '', email: '', phone_number: '', status: 'verified',
    gender: '', date_of_birth: '', cnic: '', address: '', city: '', password: ''
  });

  const fetchBuyers = async () => {
    try {
      const res = await api.get('/customers');
      setBuyers(res.data);
    } catch (err) {
      console.error('Failed to fetch buyers', err);
    }
  };

  useEffect(() => {
    fetchBuyers();
  }, []);

  const filtered = buyers.filter(b => filter === 'all' || (b.status && b.status === filter));

  const openAdd = () => {
    setEditId(null);
    setForm({ name: '', email: '', phone_number: '', status: 'verified', gender: '', date_of_birth: '', cnic: '', address: '', city: '', password: '' });
    setShowAdd(true);
  };

  const closeAdd = () => { setShowAdd(false); setEditId(null); };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editId) {
        await api.put(`/customers/${editId}`, form);
      } else {
        await api.post('/customers', form);
      }
      await fetchBuyers();
      closeAdd();
    } catch (err) {
      console.error('Save failed', err);
      alert('Failed to save customer.');
    } finally {
      setLoading(false);
    }
  };

  const viewBuyer = (b) => { setSelected(b); setShowView(true); };
  const closeView = () => { setShowView(false); setSelected(null); };

  const editBuyer = (b) => {
    setEditId(b.id);
    setForm({
      name: b.name || '',
      email: b.email || '',
      phone_number: b.phone_number || '',
      status: b.status || 'verified',
      gender: b.gender || '',
      date_of_birth: b.date_of_birth || '',
      cnic: b.cnic || '',
      address: b.address || '',
      city: b.city || '',
      password: '' // Don't fill password
    });
    setShowAdd(true);
  };

  const removeBuyer = async (id) => {
    if (!confirm('Delete this buyer?')) return;
    try {
      await api.delete(`/customers/${id}`);
      fetchBuyers();
    } catch (err) {
      console.error('Delete failed', err);
      alert('Failed to delete customer.');
    }
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
      setTimeout(function () { try { win.print(); } catch (e) { console.error(e); } try { win.close(); } catch (e) { } }, 500);
    } catch (err) {
      console.error('Export failed', err);
      try { win.close(); } catch (e) { }
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
              <h2>Manage Customers</h2>
              <p className="page-sub">Manage and review registered customers, their status, and recent activity.</p>
            </div>
            <div className="filters">
              <select className="control-select" value={filter} onChange={e => setFilter(e.target.value)}>
                <option value="all">All</option>
                <option value="verified">Verified</option>
                <option value="pending">Pending</option>
              </select>

              <button className="control-btn primary-btn" onClick={openAdd}><i className="bi bi-person-plus-fill" aria-hidden="true"></i> Add Customer</button>
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
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((b, idx) => (
                    <tr key={b.id} data-status={b.status} className={selected && selected.id === b.id ? 'selected' : ''}>
                      <td>{idx + 1}</td>
                      <td>{b.name}</td>
                      <td>{b.email}</td>
                      <td>{b.phone_number}</td>
                      <td>
                        <span className={`status-badge ${b.status === 'verified' ? 'status-verified' : 'status-pending'}`}>
                          {b.status || 'Verified'}
                        </span>
                      </td>
                      <td>
                        <button className="action-btn action-view" onClick={() => viewBuyer(b)}><i className="bi bi-eye"></i> View</button>
                        <button className="action-btn action-edit" onClick={() => editBuyer(b)}><i className="bi bi-pencil-square"></i> Edit</button>
                        <button className="action-btn action-delete" onClick={() => removeBuyer(b.id)}><i className="bi bi-trash"></i> Delete</button>
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
              <h3>Customer Details</h3>
              <span className="close-btn" onClick={closeView}>&times;</span>
            </div>
            <div className="buyer-info">
              <p><strong>Name:</strong> {selected.name}</p>
              <p><strong>Email:</strong> {selected.email}</p>
              <p><strong>Phone:</strong> {selected.phone_number}</p>
              <p><strong>CNIC:</strong> {selected.cnic}</p>
              <p><strong>City:</strong> {selected.city}</p>
              <p><strong>Address:</strong> {selected.address}</p>
              <p><strong>Gender:</strong> {selected.gender}</p>
              <p><strong>Status:</strong> {selected.status || 'Verified'}</p>
              <p><strong>Created At:</strong> {new Date(selected.created_at).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showAdd && (
        <div className="modal active" onClick={closeAdd}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editId ? 'Edit Customer' : 'Add Customer'}</h3>
              <span className="close-btn" onClick={closeAdd}>&times;</span>
            </div>
            <form onSubmit={handleSave} className="add-form" style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '16px' }}>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input placeholder="Full Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required style={{ flex: 1, padding: '8px' }} />
                <input placeholder="Email" value={form.email} type="email" onChange={e => setForm({ ...form, email: e.target.value })} required style={{ flex: 1, padding: '8px' }} />
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input placeholder="Phone Number" value={form.phone_number} onChange={e => setForm({ ...form, phone_number: e.target.value })} style={{ flex: 1, padding: '8px' }} />
                <input placeholder="CNIC" value={form.cnic} onChange={e => setForm({ ...form, cnic: e.target.value })} style={{ flex: 1, padding: '8px' }} />
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input placeholder="Gender" value={form.gender} onChange={e => setForm({ ...form, gender: e.target.value })} style={{ flex: 1, padding: '8px' }} />
                <input placeholder="Date of Birth" type="date" value={form.date_of_birth} onChange={e => setForm({ ...form, date_of_birth: e.target.value })} style={{ flex: 1, padding: '8px' }} />
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input placeholder="Address" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} style={{ flex: 1, padding: '8px' }} />
                <input placeholder="City" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} style={{ flex: 1, padding: '8px' }} />
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input placeholder="Password (leave blank if unchanged)" type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} style={{ flex: 1, padding: '8px' }} />
              </div>

              <div className="form-actions">
                <button type="button" className="action-btn" onClick={closeAdd}>Cancel</button>
                <button type="submit" className="add-btn" disabled={loading}>{loading ? 'Saving...' : 'Save'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminBuyer;
