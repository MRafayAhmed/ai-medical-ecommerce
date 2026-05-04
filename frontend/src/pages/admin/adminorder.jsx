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
  const [viewLoading, setViewLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    total: 0
  });

  const fetchOrders = async (page = 1) => {
    setLoading(true);
    try {
      const res = await api.get(`/orders?page=${page}`);
      // Laravel pagination: data is in res.data.data
      setOrders(res.data.data || []);
      setPagination({
        current_page: res.data.current_page,
        last_page: res.data.last_page,
        total: res.data.total
      });
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

  const handleView = async (o) => { 
    if (!o) return;
    setSelected(o);
    setShowView(true);
    setViewLoading(true);
    try {
      const res = await api.get(`/orders/${o.id}`);
      if (res.data) {
        setSelected(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch order details', err);
      // Fallback to the 'o' we already have from the list
    } finally {
      setViewLoading(false);
    }
  };

  const handleExport = () => {
    window.print();
  };

  return (
    <>
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
                          <td>Rs. {parseFloat(o.total_amount).toFixed(2)}</td>
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

            {/* Pagination Controls */}
            {!loading && pagination.last_page > 1 && (
              <div className="bm-pagination" style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                gap: '20px', 
                padding: '24px 0',
                marginTop: '20px',
                borderTop: '1px solid #eee'
              }}>
                <button 
                  onClick={() => fetchOrders(pagination.current_page - 1)}
                  disabled={pagination.current_page === 1}
                  className="control-btn"
                  style={{
                    background: pagination.current_page === 1 ? '#f5f5f5' : 'white',
                    cursor: pagination.current_page === 1 ? 'not-allowed' : 'pointer'
                  }}
                >
                  Previous
                </button>
                
                <span style={{ fontWeight: '600' }}>
                  Page {pagination.current_page} of {pagination.last_page} ({pagination.total} Total Orders)
                </span>
                
                <button 
                  onClick={() => fetchOrders(pagination.current_page + 1)}
                  disabled={pagination.current_page === pagination.last_page}
                  className="control-btn"
                  style={{
                    background: pagination.current_page === pagination.last_page ? '#f5f5f5' : 'white',
                    cursor: pagination.current_page === pagination.last_page ? 'not-allowed' : 'pointer'
                  }}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {showView && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 999999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }} onClick={() => setShowView(false)}>
          <div style={{ background: 'white', borderRadius: '16px', maxWidth: '700px', width: '100%', maxHeight: '90vh', overflow: 'auto', position: 'relative', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', borderBottom: '1px solid #eee' }}>
              <h3 style={{ margin: 0 }}>Order Details {selected ? `#ORD-${selected.id}` : ''}</h3>
              <span style={{ fontSize: '24px', cursor: 'pointer' }} onClick={() => setShowView(false)}>&times;</span>
            </div>
            
            <div style={{ padding: '20px' }}>
              {!selected ? (
                <div style={{ textAlign: 'center', padding: '40px' }}>No order selected</div>
              ) : (
                <>
                  {viewLoading && !selected.items ? (
                    <div style={{ textAlign: 'center', padding: '40px' }}>Loading full details...</div>
                  ) : (
                    <div className="product-detail">
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '20px' }}>
                        <div>
                          <h4>Customer Info</h4>
                          <p><strong>Name:</strong> {selected.customer?.name || 'N/A'}</p>
                          <p><strong>Email:</strong> {selected.customer?.email || 'N/A'}</p>
                          <p><strong>Phone:</strong> {selected.customer?.phone_number || 'N/A'}</p>
                          <p><strong>Address:</strong> {selected.address || 'N/A'}</p>
                        </div>
                        <div>
                          <h4>Order Info</h4>
                          <p><strong>Status:</strong> <span className={`status ${selected.status}`}>{selected.status}</span></p>
                          <p><strong>Payment:</strong> {selected.payment_preference}</p>
                          <p><strong>Total:</strong> Rs. {parseFloat(selected.total_amount || 0).toFixed(2)}</p>
                          <p><strong>Date:</strong> {new Date(selected.order_date).toLocaleString()}</p>
                        </div>
                      </div>

                      <h4>Items</h4>
                      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                          <tr style={{ background: '#f8f9fa' }}>
                            <th style={{ padding: '12px', textAlign: 'left' }}>Product</th>
                            <th style={{ padding: '12px', textAlign: 'center' }}>Qty</th>
                            <th style={{ padding: '12px', textAlign: 'right' }}>Price</th>
                            <th style={{ padding: '12px', textAlign: 'right' }}>Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selected.items?.map(item => (
                            <tr key={item.id} style={{ borderBottom: '1px solid #eee' }}>
                              <td style={{ padding: '12px' }}>{item.inventory?.product_name || 'Item Removed'}</td>
                              <td style={{ padding: '12px', textAlign: 'center' }}>{item.qty}</td>
                              <td style={{ padding: '12px', textAlign: 'right' }}>Rs. {parseFloat(item.price_at_order || 0).toFixed(2)}</td>
                              <td style={{ padding: '12px', textAlign: 'right' }}>Rs. {parseFloat(item.sub_total || 0).toFixed(2)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
