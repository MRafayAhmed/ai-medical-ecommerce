import React, { useState, useEffect } from 'react';
import AdminNavbar from './adminnavbar';
import api from '../../api/axios';
import '../../styles/adminseller.css';

export default function AdminSeller() {
  const [sellers, setSellers] = useState([]);
  const [filter, setFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: '',
    registration_no: '',
    ntn: '',
    email: '',
    username: '',
    store_address: '',
    phone_no: '',
    password: '',
    branch_id: '',
    role: 'staff',
    bank_acc_title: '',
    iban: '',
    bank_name: ''
  });

  const fetchSellers = async () => {
    try {
      const res = await api.get('/sellers');
      setSellers(res.data);
    } catch (err) {
      console.error('Failed to fetch staff', err);
    }
  };

  useEffect(() => {
    fetchSellers();
  }, []);

  const filteredSellers = sellers.filter(seller =>
    filter === 'all' || (seller.role && seller.role === filter)
  );

  const handleAddChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const openAdd = () => {
    setEditId(null);
    setForm({
      name: '', registration_no: '', ntn: '', email: '', username: '',
      store_address: '', phone_no: '', password: '', branch_id: '',
      role: 'staff', bank_acc_title: '', iban: '', bank_name: ''
    });
    setShowAddModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editId) {
        await api.put(`/sellers/${editId}`, form);
      } else {
        await api.post('/sellers', form);
      }
      await fetchSellers();
      setShowAddModal(false);
    } catch (err) {
      console.error('Save failed', err);
      alert('Failed to save staff member.');
    } finally {
      setLoading(false);
    }
  };

  const editSeller = (s) => {
    setEditId(s.id);
    setForm({
      name: s.name || '',
      registration_no: s.registration_no || '',
      ntn: s.ntn || '',
      email: s.email || '',
      username: s.username || '',
      store_address: s.store_address || '',
      phone_no: s.phone_no || '',
      password: '', // Leave blank
      branch_id: s.branch_id || '',
      role: s.role || 'staff',
      bank_acc_title: s.bank_acc_title || '',
      iban: s.iban || '',
      bank_name: s.bank_name || ''
    });
    setShowAddModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this staff member?')) return;
    try {
      await api.delete(`/sellers/${id}`);
      fetchSellers();
    } catch (err) {
      console.error('Delete failed', err);
      alert('Failed to delete staff member.');
    }
  };

  const handleView = (seller) => {
    setSelectedSeller(seller);
    setShowViewModal(true);
  };

  return (
    <div className="admin-sellers">
      <AdminNavbar />
      <div className="main-content">
        <div className="page-inner">
          <div className="page-controls">
            <div>
              <h2>Manage Staff</h2>
              <p className="page-sub">Manage and review registered staff members (sellers) and their details.</p>
            </div>
            <div className="filters">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="control-select"
              >
                <option value="all">All Roles</option>
                <option value="staff">Staff</option>
                <option value="admin">Admin</option>
                <option value="seller">Seller</option>
              </select>
              <button
                type="button"
                className="control-btn"
                onClick={openAdd}
              >
                <i className="bi bi-person-plus-fill"></i> Add Staff
              </button>
            </div>
          </div>

          <div className="sellers-container">
            <div className="sellers-table">
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Role</th>
                    <th>Store/Branch</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSellers.map((seller, index) => (
                    <tr key={seller.id}>
                      <td>{index + 1}</td>
                      <td>{seller.name}</td>
                      <td>{seller.email}</td>
                      <td>{seller.phone_no || 'N/A'}</td>
                      <td>
                        <span className={`status-badge status-verified`}>
                          {seller.role ? (seller.role.charAt(0).toUpperCase() + seller.role.slice(1)) : 'Staff'}
                        </span>
                      </td>
                      <td>{seller.store_address || 'N/A'}</td>
                      <td>
                        <button className="action-btn action-view" onClick={() => handleView(seller)}>View</button>
                        <button className="action-btn action-edit" style={{ background: 'rgba(255,193,7,0.1)', color: '#ffb300', fontWeight: 700, marginLeft: 4, border: 'none', padding: '8px 12px', borderRadius: 10 }} onClick={() => editSeller(seller)}>Edit</button>
                        <button className="action-btn action-delete" onClick={() => handleDelete(seller.id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                  {filteredSellers.length === 0 && (
                    <tr>
                      <td colSpan="7" style={{ textAlign: 'center', padding: '20px' }}>No staff members found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="modal active" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" style={{ width: '600px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editId ? 'Edit Staff' : 'Add Staff'}</h3>
              <span className="close-btn" onClick={() => setShowAddModal(false)}>&times;</span>
            </div>
            <form onSubmit={handleSave} className="add-form" style={{ padding: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <input name="name" placeholder="Full Name" value={form.name} onChange={handleAddChange} required />
                <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleAddChange} required />
                <input name="username" placeholder="Username" value={form.username} onChange={handleAddChange} />
                <input name="phone_no" placeholder="Phone Number" value={form.phone_no} onChange={handleAddChange} />
                <input name="registration_no" placeholder="Registration No" value={form.registration_no} onChange={handleAddChange} />
                <input name="ntn" placeholder="NTN" value={form.ntn} onChange={handleAddChange} />
                <input name="store_address" placeholder="Store Address" value={form.store_address} onChange={handleAddChange} />
                <select name="role" value={form.role} onChange={handleAddChange}>
                  <option value="staff">Staff</option>
                  <option value="seller">Seller</option>
                  <option value="admin">Admin</option>
                </select>
                <input name="password" type="password" placeholder={editId ? "Password (leave blank if unchanged)" : "Password"} value={form.password} onChange={handleAddChange} required={!editId} />
                <input name="branch_id" placeholder="Branch ID" value={form.branch_id} onChange={handleAddChange} />
              </div>

              <div style={{ marginTop: '15px', borderTop: '1px solid #ddd', paddingTop: '10px' }}>
                <h4>Bank Information</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '5px' }}>
                  <input name="bank_name" placeholder="Bank Name" value={form.bank_name} onChange={handleAddChange} />
                  <input name="bank_acc_title" placeholder="Account Title" value={form.bank_acc_title} onChange={handleAddChange} />
                  <input name="iban" placeholder="IBAN" value={form.iban} onChange={handleAddChange} style={{ gridColumn: 'span 2' }} />
                </div>
              </div>

              <div className="form-actions" style={{ marginTop: '20px' }}>
                <button type="button" className="action-btn" onClick={() => setShowAddModal(false)}>Cancel</button>
                <button type="submit" className="add-btn" disabled={loading}>{loading ? 'Saving...' : 'Save'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Modal */}
      {showViewModal && selectedSeller && (
        <div className="modal active" onClick={() => setShowViewModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Staff Details</h3>
              <span className="close-btn" onClick={() => setShowViewModal(false)}>&times;</span>
            </div>
            <div className="supplier-info">
              <p><strong>Name:</strong> {selectedSeller.name}</p>
              <p><strong>Email:</strong> {selectedSeller.email}</p>
              <p><strong>Username:</strong> {selectedSeller.username || 'N/A'}</p>
              <p><strong>Phone:</strong> {selectedSeller.phone_no || 'N/A'}</p>
              <p><strong>Role:</strong> {selectedSeller.role}</p>
              <p><strong>Registration No:</strong> {selectedSeller.registration_no || 'N/A'}</p>
              <p><strong>NTN:</strong> {selectedSeller.ntn || 'N/A'}</p>
              <p><strong>Store Address:</strong> {selectedSeller.store_address || 'N/A'}</p>
              <p><strong>Bank Name:</strong> {selectedSeller.bank_name || 'N/A'}</p>
              <p><strong>IBAN:</strong> {selectedSeller.iban || 'N/A'}</p>
              <p><strong>Created At:</strong> {new Date(selectedSeller.created_at).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
