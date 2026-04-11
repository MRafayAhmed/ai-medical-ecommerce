import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import AdminNavbar from './adminnavbar';
import '../../styles/AdminPurchaseInvoice.css';

const AdminPurchaseInvoice = () => {
    const [invoices, setInvoices] = useState([]);
    const [items, setItems] = useState([]); // Products from MedicalInventory
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentInvoiceId, setCurrentInvoiceId] = useState(null);

    // Form State
    const [formData, setFormData] = useState({
        document_date: new Date().toISOString().split('T')[0],
        document_no: '',
        document_identity: 'Auto-generated',
        branch_id: 1,
        total_amount: 0,
        items: []
    });

    useEffect(() => {
        fetchInvoices();
        fetchItems();
    }, []);

    const fetchInvoices = async () => {
        try {
            const response = await api.get('/purchase-invoices');
            setInvoices(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching invoices:", error);
            setLoading(false);
        }
    };

    const fetchItems = async () => {
        try {
            const response = await api.get('/medical-inventory');
            // Laravel pagination returns items in response.data.data
            const itemsData = response.data.data || (Array.isArray(response.data) ? response.data : []);
            setItems(itemsData);
        } catch (error) {
            console.error("Error fetching items:", error);
        }
    };

    const handleOpenModal = (invoice = null) => {
        if (invoice) {
            setEditMode(true);
            setCurrentInvoiceId(invoice.id);
            setFormData({
                document_date: invoice.document_date,
                document_no: invoice.document_no,
                document_identity: invoice.document_identity,
                branch_id: invoice.branch_id || 1,
                total_amount: invoice.total_amount,
                items: invoice.details.map(d => ({
                    id: d.id,
                    item_id: d.item_id,
                    qty: d.qty,
                    rate: d.rate,
                    amount: d.amount
                }))
            });
        } else {
            setEditMode(false);
            setFormData({
                document_date: new Date().toISOString().split('T')[0],
                document_no: '',
                document_identity: 'Auto-generated',
                branch_id: 1,
                total_amount: 0,
                items: [{ item_id: '', qty: 1, rate: 0, amount: 0 }]
            });
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditMode(false);
        setCurrentInvoiceId(null);
    };

    const handleAddItemRow = () => {
        setFormData({
            ...formData,
            items: [...formData.items, { item_id: '', qty: 1, rate: 0, amount: 0 }]
        });
    };

    const handleRemoveItemRow = (index) => {
        const newItems = formData.items.filter((_, i) => i !== index);
        updateTotals(newItems);
    };

    const handleItemChange = (index, field, value) => {
        const newItems = [...formData.items];
        newItems[index][field] = value;

        if (field === 'item_id') {
            const selectedItem = items.find(item => item.id == value);
            if (selectedItem) {
                newItems[index].rate = selectedItem.price || 0;
            }
        }

        if (field === 'qty' || field === 'rate' || field === 'item_id') {
            newItems[index].amount = (newItems[index].qty || 0) * (newItems[index].rate || 0);
        }

        updateTotals(newItems);
    };

    const updateTotals = (newItems) => {
        const total = newItems.reduce((sum, item) => sum + (item.amount || 0), 0);
        setFormData({ ...formData, items: newItems, total_amount: total });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editMode) {
                await api.put(`/purchase-invoices/${currentInvoiceId}`, formData);
            } else {
                await api.post('/purchase-invoices', formData);
            }
            fetchInvoices();
            handleCloseModal();
        } catch (error) {
            console.error("Error saving invoice:", error);
            alert("Failed to save invoice. Please check the data.");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this invoice?")) {
            try {
                await api.delete(`/purchase-invoices/${id}`);
                fetchInvoices();
            } catch (error) {
                console.error("Error deleting invoice:", error);
            }
        }
    };

    const handleMarkAsPost = async (id) => {
        if (window.confirm("Once posted, this invoice cannot be edited or deleted. Proceed?")) {
            try {
                await api.post(`/purchase-invoices/${id}/mark-as-post`);
                fetchInvoices();
            } catch (error) {
                console.error("Error posting invoice:", error);
                alert("Failed to post invoice.");
            }
        }
    };

    return (
        <div className="admin-purchase-invoice">
            <AdminNavbar />
            <div className="main-content">
                <div className="page-header">
                    <h2>Purchase Invoices</h2>
                    <button className="btn-primary" onClick={() => handleOpenModal()}>
                        <i className="bi bi-plus-lg"></i> Create Invoice
                    </button>
                </div>

                <div className="invoice-card">
                    <table className="invoice-table">
                        <thead>
                            <tr>
                                <th>Identity</th>
                                <th>Date</th>
                                <th>Total Amount</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="5" style={{ textAlign: 'center' }}>Loading...</td></tr>
                            ) : invoices.length === 0 ? (
                                <tr><td colSpan="5" style={{ textAlign: 'center' }}>No invoices found.</td></tr>
                            ) : (
                                invoices.map(invoice => (
                                    <tr key={invoice.id}>
                                        <td><strong>{invoice.document_identity}</strong></td>
                                        <td>{invoice.document_date}</td>
                                        <td>Rs {parseFloat(invoice.total_amount).toLocaleString()}</td>
                                        <td>
                                            <span className={`status-badge ${invoice.is_post ? 'status-posted' : 'status-draft'}`}>
                                                {invoice.is_post ? 'Posted' : 'Draft'}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="action-btns">
                                                {!invoice.is_post && (
                                                    <>
                                                        <button className="icon-btn-edit" onClick={() => handleOpenModal(invoice)} title="Edit">
                                                            <i className="bi bi-pencil"></i>
                                                        </button>
                                                        <button className="icon-btn-delete" onClick={() => handleDelete(invoice.id)} title="Delete">
                                                            <i className="bi bi-trash"></i>
                                                        </button>
                                                        <button className="btn-post" onClick={() => handleMarkAsPost(invoice.id)}>
                                                            <i className="bi bi-check-all"></i> Post
                                                        </button>
                                                    </>
                                                )}
                                                {invoice.is_post && (
                                                    <span style={{ fontSize: '12px', color: '#64748b' }}>No actions available</span>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3>{editMode ? 'Edit' : 'Create'} Purchase Invoice</h3>
                            <button className="close-btn" onClick={handleCloseModal}>&times;</button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Document Identity</label>
                                    <input type="text" value={formData.document_identity} readOnly style={{ background: '#f1f5f9' }} />
                                </div>
                                <div className="form-group">
                                    <label>Invoice Date</label>
                                    <input 
                                        type="date" 
                                        value={formData.document_date} 
                                        onChange={(e) => setFormData({...formData, document_date: e.target.value})}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Branch ID</label>
                                    <input 
                                        type="number" 
                                        value={formData.branch_id} 
                                        onChange={(e) => setFormData({...formData, branch_id: e.target.value})}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="details-section">
                                <table className="details-table">
                                    <thead>
                                        <tr>
                                            <th style={{ width: '40%' }}>Item</th>
                                            <th>Qty</th>
                                            <th>Rate</th>
                                            <th>Amount</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {formData.items.map((item, index) => (
                                            <tr key={index}>
                                                <td>
                                                    <select 
                                                        value={item.item_id} 
                                                        onChange={(e) => handleItemChange(index, 'item_id', e.target.value)}
                                                        required
                                                    >
                                                        <option value="">Select Item</option>
                                                        {Array.isArray(items) && items.map(product => (
                                                            <option key={product.id} value={product.id}>{product.product_name}</option>
                                                        ))}
                                                    </select>
                                                </td>
                                                <td>
                                                    <input 
                                                        type="number" 
                                                        value={item.qty} 
                                                        onChange={(e) => handleItemChange(index, 'qty', parseInt(e.target.value))}
                                                        min="1"
                                                        required
                                                    />
                                                </td>
                                                <td>
                                                    <input 
                                                        type="number" 
                                                        value={item.rate} 
                                                        onChange={(e) => handleItemChange(index, 'rate', parseFloat(e.target.value))}
                                                        step="0.01"
                                                        required
                                                    />
                                                </td>
                                                <td><strong>Rs {(item.amount || 0).toLocaleString()}</strong></td>
                                                <td>
                                                    <button type="button" className="remove-btn" onClick={() => handleRemoveItemRow(index)}>
                                                        <i className="bi bi-x-circle-fill"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <button type="button" className="add-row-btn" onClick={handleAddItemRow}>
                                    <i className="bi bi-plus-circle"></i> Add Item
                                </button>
                            </div>

                            <div className="total-summary">
                                <div className="total-box">
                                    <span>Total Amount</span>
                                    <strong>Rs {formData.total_amount.toLocaleString()}</strong>
                                </div>
                            </div>

                            <div className="modal-footer">
                                <button type="button" className="btn-secondary" onClick={handleCloseModal}>Cancel</button>
                                <button type="submit" className="btn-primary">
                                    {editMode ? 'Update Invoice' : 'Save Invoice'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminPurchaseInvoice;
