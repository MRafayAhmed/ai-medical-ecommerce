import React, { useEffect, useState } from 'react';
import AdminNavbar from './adminnavbar';
import api from '../../api/axios';
import '../../styles/adminorder.css';

export default function AdminOrder() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [showView, setShowView] = useState(false);
  const [selected, setSelected] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await api.get('/orders');
      // Laravel pagination: data is in res.data.data
      setOrders(res.data.data || []);
    } catch (err) {
      console.error('Failed to fetch orders', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filtered = orders.filter(o => filter === 'all' || o.status === filter);

  const handleUpdateStatus = async (id, newStatus) => {
    if (!confirm(`Change order status to ${newStatus}?`)) return;
    try {
      await api.put(`/orders/${id}`, { status: newStatus });
      fetchOrders();
    } catch (err) {
      console.error('Failed to update status', err);
      alert('Error updating status');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this order permanently?')) return;
    try {
      await api.delete(`/orders/${id}`);
      fetchOrders();
    } catch (err) {
      console.error('Failed to delete order', err);
      alert('Error deleting order');
    }
  };

  const handleView = (o) => { setSelected(o); setShowView(true); };

  const handleExport = () => {
    window.print();
  };

  return (
    <div className="admin-orders">
      <AdminNavbar />
      <div className="main-content">
        <div className="page-inner">
          <div className="page-controls">
            <div>
              <h2>Order Management</h2>
              <p className="page-sub">Track and manage customer pharmacy orders.</p>
            </div>
            <div className="filters">
              <select value={filter} onChange={(e) => setFilter(e.target.value)} className="control-select">
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <button className="control-btn" onClick={handleExport}><i className="bi bi-file-earmark-pdf" /> Export/Print</button>
            </div>
          </div>

          <div className="orders-container">
            {loading ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>Loading orders...</div>
            ) : (
              <div className="orders-table">
                <table>
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Order Date</th>
                      <th>Total (Rs.)</th>
                      <th>Payment</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((o) => (
                      <tr key={o.id} data-status={o.status}>
                        <td>#ORD-{o.id}</td>
                        <td>{o.customer?.name || 'Unknown User'}</td>
                        <td>{new Date(o.order_date).toLocaleString()}</td>
                        <td>{parseFloat(o.total_amount).toFixed(2)}</td>
                        <td>{o.payment_preference}</td>
                        <td><span className={`status ${o.status}`}>{o.status}</span></td>
                        <td>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button className="action-btn action-view" onClick={() => handleView(o)}>View</button>
                            {o.status === 'pending' && (
                              <>
                                <button className="action-btn" style={{ background: '#10b981', color: 'white' }} onClick={() => handleUpdateStatus(o.id, 'completed')}>Approve</button>
                                <button className="action-btn" style={{ background: '#f43f5e', color: 'white' }} onClick={() => handleUpdateStatus(o.id, 'cancelled')}>Cancel</button>
                              </>
                            )}
                            <button className="action-btn action-delete" onClick={() => handleDelete(o.id)}>Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filtered.length === 0 && <p style={{ textAlign: 'center', padding: '20px' }}>No orders found.</p>}
              </div>
            )}
          </div>
        </div>
      </div>

      {showView && selected && (
        <div className="modal" onClick={() => setShowView(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Order Details #ORD-{selected.id}</h3>
              <span className="close-btn" onClick={() => setShowView(false)}>&times;</span>
            </div>
            <div className="product-detail">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div>
                  <h4>Customer Information</h4>
                  <p><strong>Name:</strong> {selected.customer?.name}</p>
                  <p><strong>Email:</strong> {selected.customer?.email}</p>
                  <p><strong>Phone:</strong> {selected.customer?.phone_number}</p>
                  <p><strong>Address:</strong> {selected.address}</p>
                </div>
                <div>
                  <h4>Payment Information</h4>
                  <p><strong>Method:</strong> {selected.payment_preference}</p>
                  <p><strong>Total:</strong> Rs. {parseFloat(selected.total_amount).toFixed(2)}</p>
                  <p><strong>Date:</strong> {new Date(selected.order_date).toLocaleString()}</p>
                  <p><strong>Status:</strong> <span className={`status ${selected.status}`}>{selected.status}</span></p>
                </div>
              </div>

              <h4>Order Items</h4>
              <table style={{ width: '100%', marginTop: '10px' }}>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Qty</th>
                    <th>Price</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {selected.items?.map(item => (
                    <tr key={item.id}>
                      <td>{item.inventory?.product_name || 'Item Removed'}</td>
                      <td>{item.qty}</td>
                      <td>{parseFloat(item.price).toFixed(2)}</td>
                      <td>{parseFloat(item.total_price).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
