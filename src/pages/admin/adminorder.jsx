import React, { useEffect, useState } from 'react';
import AdminNavbar from './adminnavbar';
import '../../styles/adminorder.css';

export default function AdminOrder() {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('all');
  const [showAdd, setShowAdd] = useState(false);
  const [showView, setShowView] = useState(false);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({
    orderId: '',
    buyer: '',
    seller: '',
    datetime: '',
    total: '',
    payment: '',
    status: 'pending'
  });

  const initializeSample = () => {
    const sample = [
      { id: 1, orderId: '#ORD1023', buyer: 'John Doe', seller: 'HealthPlus Store', datetime: '2025-10-22 14:35', total: '$250.00', payment: 'Credit Card', status: 'completed' },
      { id: 2, orderId: '#ORD1024', buyer: 'Mary Smith', seller: 'MediZone', datetime: '2025-10-23 09:12', total: '$89.99', payment: 'Cash on Delivery', status: 'pending' },
      { id: 3, orderId: '#ORD1025', buyer: 'Ali Khan', seller: 'CareMeds', datetime: '2025-10-23 11:50', total: '$120.00', payment: 'PayPal', status: 'cancelled' }
    ];
    setOrders(sample);
    localStorage.setItem('admin_orders', JSON.stringify(sample));
  };

  useEffect(() => {
    const saved = localStorage.getItem('admin_orders');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) setOrders(parsed);
        else initializeSample();
      } catch (e) { console.error('Error parsing orders', e); initializeSample(); }
    } else initializeSample();
  }, []);

  useEffect(() => { if (orders.length > 0) localStorage.setItem('admin_orders', JSON.stringify(orders)); }, [orders]);

  const filtered = orders.filter(o => filter === 'all' || o.status === filter);

  const handleChange = (e) => { const { name, value } = e.target; setForm(prev => ({ ...prev, [name]: value })); };

  const handleAdd = (e) => {
    e.preventDefault();
    if (!form.orderId.trim() || !form.buyer.trim()) { alert('Order ID and buyer are required'); return; }
    const id = orders.length ? Math.max(...orders.map(o => o.id)) + 1 : 1;
    const newOrder = { ...form, id };
    setOrders(prev => [...prev, newOrder]);
    setForm({ orderId: '', buyer: '', seller: '', datetime: '', total: '', payment: '', status: 'pending' });
    setShowAdd(false);
  };

  const handleDelete = (id) => { if (confirm('Delete this order?')) setOrders(prev => prev.filter(o => o.id !== id)); };

  const handleView = (o) => { setSelected(o); setShowView(true); };

  const handleExport = () => {
    const content = document.querySelector('.orders-container');
    if (!content) return alert('Nothing to export.');
    const styles = `body{font-family:Inter, Arial, sans-serif; color:#2c3e50; margin:20px} h2{color:#2c3e50} table{width:100%; border-collapse:collapse; margin-top:12px} th,td{padding:10px; border:1px solid #e6eef8; text-align:left} th{background:#0056b3; color:white}`;
    const win = window.open('', '_blank');
    try {
      win.document.open(); win.document.write('<!doctype html><html><head><title>Orders Export</title>'); win.document.write('<meta charset="utf-8">'); win.document.write('<style>' + styles + '</style>'); win.document.write('</head><body>'); win.document.write('<h2>Orders — Export</h2>'); const table = content.querySelector('table'); if (table) win.document.write(table.outerHTML); else win.document.write(content.innerHTML); win.document.write('</body></html>'); win.document.close(); win.focus(); setTimeout(() => { try { win.print(); } catch (e) { console.error(e); } try { win.close(); } catch (e) {} }, 500);
    } catch (err) { console.error('Export failed', err); try { win.close(); } catch (e) {} alert('Export failed in this browser.'); }
  };

  return (
    <div className="admin-orders">
      <AdminNavbar />
      <div className="main-content">
        <div className="page-inner">
          <div className="page-controls">
            <div>
              <h2>Manage Orders</h2>
              <p className="page-sub">Manage and review orders, statuses, and payments.</p>
            </div>
            <div className="filters">
              <select value={filter} onChange={(e) => setFilter(e.target.value)} className="control-select">
                <option value="all">All</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <button className="control-btn" onClick={() => setShowAdd(true)}><i className="bi bi-plus-lg" /> Add New Order</button>
              <button className="control-btn" onClick={handleExport}><i className="bi bi-file-earmark-pdf" /> Export PDF</button>
            </div>
          </div>

          <div className="orders-container">
            <div className="orders-table">
              <table>
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Buyer Name</th>
                    <th>Seller Name</th>
                    <th>Order Date & Time</th>
                    <th>Total Amount</th>
                    <th>Payment Method</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((o, idx) => (
                    <tr key={o.id} data-status={o.status}>
                      <td>{o.orderId}</td>
                      <td>{o.buyer}</td>
                      <td>{o.seller}</td>
                      <td>{o.datetime}</td>
                      <td>{o.total}</td>
                      <td>{o.payment}</td>
                      <td><span className={`status ${o.status}`}>{o.status.charAt(0).toUpperCase() + o.status.slice(1)}</span></td>
                      <td>
                        <button className="action-btn action-view" onClick={() => handleView(o)}>View</button>
                        <button className="action-btn action-delete" onClick={() => handleDelete(o.id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {showAdd && (
        <div className="modal" onClick={() => setShowAdd(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add New Order</h3>
              <span className="close-btn" onClick={() => setShowAdd(false)}>&times;</span>
            </div>
            <form onSubmit={handleAdd} className="modal-form">
              <input name="orderId" placeholder="Order ID" value={form.orderId} onChange={handleChange} required />
              <input name="buyer" placeholder="Buyer name" value={form.buyer} onChange={handleChange} required />
              <input name="seller" placeholder="Seller name" value={form.seller} onChange={handleChange} />
              <input name="datetime" placeholder="YYYY-MM-DD hh:mm" value={form.datetime} onChange={handleChange} />
              <input name="total" placeholder="Total amount" value={form.total} onChange={handleChange} />
              <input name="payment" placeholder="Payment method" value={form.payment} onChange={handleChange} />
              <select name="status" value={form.status} onChange={handleChange}>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <div className="form-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowAdd(false)}>Cancel</button>
                <button type="submit" className="btn-submit">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showView && selected && (
        <div className="modal" onClick={() => setShowView(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Order Details</h3>
              <span className="close-btn" onClick={() => setShowView(false)}>&times;</span>
            </div>
            <div className="product-detail">
              <h4>{selected.orderId}</h4>
              <p><strong>Buyer:</strong> {selected.buyer}</p>
              <p><strong>Seller:</strong> {selected.seller}</p>
              <p><strong>Date/Time:</strong> {selected.datetime}</p>
              <p><strong>Total:</strong> {selected.total}</p>
              <p><strong>Payment:</strong> {selected.payment}</p>
              <p><strong>Status:</strong> {selected.status}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
