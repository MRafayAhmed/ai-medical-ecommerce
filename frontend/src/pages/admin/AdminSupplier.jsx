import React, { useEffect, useState } from 'react';
import AdminNavbar from './adminnavbar';
import api from '../../api/axios';
import '../../styles/adminsupplier.css';

const AdminSupplier = () => {
    const [suppliers, setSuppliers] = useState([]);
    const [showAdd, setShowAdd] = useState(false);
    const [showView, setShowView] = useState(false);
    const [selected, setSelected] = useState(null);
    const [editId, setEditId] = useState(null);
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        name: '', email: '', phone_number: ''
    });

    const fetchSuppliers = async () => {
        try {
            const res = await api.get('/suppliers');
            setSuppliers(res.data);
        } catch (err) {
            console.error('Failed to fetch suppliers', err);
        }
    };

    useEffect(() => {
        fetchSuppliers();
    }, []);

    const openAdd = () => {
        setEditId(null);
        setForm({ name: '', email: '', phone_number: '' });
        setShowAdd(true);
    };

    const closeAdd = () => { setShowAdd(false); setEditId(null); };

    const handleSave = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (editId) {
                await api.put(`/suppliers/${editId}`, form);
            } else {
                await api.post('/suppliers', form);
            }
            await fetchSuppliers();
            closeAdd();
        } catch (err) {
            console.error('Save failed', err);
            alert('Failed to save supplier.');
        } finally {
            setLoading(false);
        }
    };

    const viewSupplier = (s) => { setSelected(s); setShowView(true); };
    const closeView = () => { setShowView(false); setSelected(null); };

    const editSupplier = (s) => {
        setEditId(s.id);
        setForm({
            name: s.name || '',
            email: s.email || '',
            phone_number: s.phone_number || ''
        });
        setShowAdd(true);
    };

    const removeSupplier = async (id) => {
        if (!confirm('Delete this supplier?')) return;
        try {
            await api.delete(`/suppliers/${id}`);
            fetchSuppliers();
        } catch (err) {
            console.error('Delete failed', err);
            alert('Failed to delete supplier.');
        }
    };

    return (
        <div className="admin-suppliers">
            <AdminNavbar />
            <div className="main-content">
                <div className="page-inner">
                    <div className="page-controls">
                        <div>
                            <h2>Manage Suppliers</h2>
                            <p className="page-sub">Store and manage supplier contact information.</p>
                        </div>
                        <div className="filters">
                            <button className="control-btn primary-btn" onClick={openAdd}>
                                <i className="bi bi-person-plus-fill" aria-hidden="true"></i> Add Supplier
                            </button>
                        </div>
                    </div>

                    <div className="suppliers-container centered-card">
                        <div className="suppliers-table">
                            <table>
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Supplier Name</th>
                                        <th>Email</th>
                                        <th>Phone</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {suppliers.map((s, idx) => (
                                        <tr key={s.id} className={selected && selected.id === s.id ? 'selected' : ''}>
                                            <td>{idx + 1}</td>
                                            <td>{s.name}</td>
                                            <td>{s.email}</td>
                                            <td>{s.phone_number || 'N/A'}</td>
                                            <td>
                                                <button className="action-btn action-view" onClick={() => viewSupplier(s)}><i className="bi bi-eye"></i> View</button>
                                                <button className="action-btn action-edit" onClick={() => editSupplier(s)}><i className="bi bi-pencil-square"></i> Edit</button>
                                                <button className="action-btn action-delete" onClick={() => removeSupplier(s.id)}><i className="bi bi-trash"></i> Delete</button>
                                            </td>
                                        </tr>
                                    ))}
                                    {suppliers.length === 0 && (
                                        <tr>
                                            <td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>No suppliers found.</td>
                                        </tr>
                                    )}
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
                            <h3>Supplier Details</h3>
                            <span className="close-btn" onClick={closeView}>&times;</span>
                        </div>
                        <div className="supplier-info">
                            <p><strong>Name:</strong> {selected.name}</p>
                            <p><strong>Email:</strong> {selected.email}</p>
                            <p><strong>Phone:</strong> {selected.phone_number || 'N/A'}</p>
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
                            <h3>{editId ? 'Edit Supplier' : 'Add Supplier'}</h3>
                            <span className="close-btn" onClick={closeAdd}>&times;</span>
                        </div>
                        <form onSubmit={handleSave} className="add-form" style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '16px' }}>
                            <input
                                placeholder="Supplier Name"
                                value={form.name}
                                onChange={e => setForm({ ...form, name: e.target.value })}
                                required
                                style={{ padding: '8px' }}
                            />
                            <input
                                placeholder="Email Address"
                                value={form.email}
                                type="email"
                                onChange={e => setForm({ ...form, email: e.target.value })}
                                required
                                style={{ padding: '8px' }}
                            />
                            <input
                                placeholder="Phone Number"
                                value={form.phone_number}
                                onChange={e => setForm({ ...form, phone_number: e.target.value })}
                                style={{ padding: '8px' }}
                            />

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

export default AdminSupplier;
