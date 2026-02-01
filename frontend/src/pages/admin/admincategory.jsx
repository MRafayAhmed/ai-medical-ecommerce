import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import AdminNavbar from './adminnavbar';
import '../../styles/admincategory.css';
import '../../styles/admindashboard.css';

export default function AdminCategory() {
    const [categories, setCategories] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [editId, setEditId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({ name: '', image: null });

    const fetchCategories = async () => {
        try {
            const res = await api.get('/categories');
            if (res.data && res.data.data) setCategories(res.data.data);
            else setCategories(res.data || []);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'image') {
            setForm(prev => ({ ...prev, image: files[0] }));
        } else {
            setForm(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('name', form.name);
            if (form.image) {
                formData.append('image', form.image);
            }

            if (editId) {
                formData.append('_method', 'PUT');
                await api.post(`/categories/${editId}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else {
                await api.post('/categories', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }

            setShowAddModal(false);
            resetForm();
            fetchCategories();
        } catch (error) {
            console.error('Failed to save category:', error);
            alert('Error saving category.');
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setForm({ name: '', image: null });
        setEditId(null);
    };

    const handleEdit = (cat) => {
        setEditId(cat.id);
        setForm({ name: cat.name, image: null });
        setShowAddModal(true);
    };

    const handleDelete = async (id) => {
        if (confirm('Delete this category?')) {
            try {
                await api.delete(`/categories/${id}`);
                fetchCategories();
            } catch (error) {
                console.error('Failed to delete category:', error);
                alert('Error deleting category.');
            }
        }
    };

    return (
        <div className="admin-categories">
            <AdminNavbar />
            <div className="main-content">
                <div className="page-inner">
                    <div className="page-controls">
                        <div>
                            <h2>Manage Categories</h2>
                            <p className="page-sub">Create and organize medical categories.</p>
                        </div>
                        <button className="control-btn" onClick={() => setShowAddModal(true)}>
                            <i className="bi bi-plus-lg" /> Add Category
                        </button>
                    </div>

                    <div className="categories-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Image</th>
                                    <th>Category Name</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {categories.map((cat, idx) => (
                                    <tr key={cat.id}>
                                        <td>{idx + 1}</td>
                                        <td>
                                            <img
                                                src={cat.image ? `/storage/${cat.image}` : `https://via.placeholder.com/50?text=${cat.name}`}
                                                alt={cat.name}
                                                className="cat-img-mini"
                                            />
                                        </td>
                                        <td>{cat.name}</td>
                                        <td>
                                            <button className="action-btn action-edit" onClick={() => handleEdit(cat)}>
                                                <i className="bi bi-pencil-square" /> Edit
                                            </button>
                                            <button className="action-btn action-delete" onClick={() => handleDelete(cat.id)}>
                                                <i className="bi bi-trash" /> Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {showAddModal && (
                <div className="modal" onClick={() => { setShowAddModal(false); resetForm(); }}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>{editId ? 'Edit Category' : 'Add Category'}</h3>
                            <span className="close-btn" onClick={() => { setShowAddModal(false); resetForm(); }}>&times;</span>
                        </div>
                        <form onSubmit={handleSubmit} className="modal-form">
                            <div className="input-group">
                                <label>Category Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    placeholder="E.g. Antibiotics"
                                    required
                                />
                            </div>
                            <div className="input-group">
                                <label>Category Image</label>
                                <input
                                    type="file"
                                    name="image"
                                    onChange={handleChange}
                                    accept="image/*"
                                />
                                {editId && <small>Leave empty to keep current image</small>}
                            </div>
                            <div className="form-actions">
                                <button type="button" className="btn-cancel" onClick={() => { setShowAddModal(false); resetForm(); }}>Cancel</button>
                                <button type="submit" className="btn-submit" disabled={loading}>
                                    {loading ? 'Saving...' : 'Save'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
