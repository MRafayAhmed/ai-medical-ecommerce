import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import '../../styles/admindashboard.css';
import AdminNavbar from './adminnavbar';
import '../../styles/adminnavbar.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

/** Set true when charts are backed by real admin APIs (currently sample data). */
const SHOW_DASHBOARD_CHARTS = false;

const AdminDashboard = () => {
  const [counts, setCounts] = useState({
    buyers: 0,
    sellers: 0,
    ordersToday: 0,
    revenue: 0,
    verifications: 0,
    newSignups: 0,
    returns: 0,
    deliveryDays: 0,
    supportTickets: 0,
    avgOrderValue: 0,
    recentActivity: []
  });

  const [pendingOrders, setPendingOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  const fetchPendingOrders = async () => {
    try {
      setLoadingOrders(true);
      const response = await api.get('/orders');
      // Filter for 'pending' orders only
      const all = response.data.data || response.data || [];
      setPendingOrders(all.filter(o => o.status === 'pending'));
    } catch (err) {
      console.error('Error fetching pending orders:', err);
    } finally {
      setLoadingOrders(false);
    }
  };

  // Fetch real data from API
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/admin/stats');
        setCounts(response.data);
      } catch (err) {
        console.error('Error fetching stats:', err);
      }
    };
    fetchStats();
    fetchPendingOrders();
  }, []);

  const handleUpdateStatus = async (orderId, newStatus) => {
    if (!window.confirm(`Are you sure you want to mark this order as ${newStatus}?`)) return;
    try {
      await api.put(`/orders/${orderId}`, { status: newStatus });
      fetchPendingOrders();
    } catch (err) {
      alert('Failed to update order status');
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm('Permanently delete this order?')) return;
    try {
      await api.delete(`/orders/${orderId}`);
      fetchPendingOrders();
    } catch (err) {
      alert('Failed to delete order');
    }
  };

  const handleViewOrder = (order) => {
    // For now, alert basic info or navigate. 
    // Usually, you'd open a modal.
    alert(`Order #${order.id}\nCustomer: ${order.customer?.name || 'Unknown'}\nTotal: Rs ${order.total_amount}\nAddress: ${order.address}`);
  };

  const getPrimary = () => getComputedStyle(document.documentElement).getPropertyValue('--primary').trim() || '#0b5fb8';

  const orderTrendData = () => ({
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Orders',
        data: [45, 60, 75, 50, 90, 110, 95],
        borderColor: getPrimary(),
        backgroundColor: 'rgba(11,95,184,0.08)',
        fill: true,
        tension: 0.3
      }
    ]
  });

  const revenueData = () => ({
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Revenue (Rs)',
        data: [12000, 15000, 14000, 18000, 20000, 24000],
        backgroundColor: getPrimary(),
        borderRadius: 6
      }
    ]
  });

  const categoryData = () => ({
    labels: ['Prescription Medicines', 'OTC Medicines', 'Wellness & Supplements', 'Medical Devices'],
    datasets: [
      {
        label: 'Category Share',
        data: [45, 28, 18, 9],
        backgroundColor: [getPrimary(), '#28a745', '#f6c23e', '#6c5ce7'],
        hoverOffset: 6
      }
    ]
  });

  const userGrowthData = () => ({
    labels: ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'],
    datasets: [
      {
        label: 'New Users',
        data: [120, 180, 230, 300, 360, 420, 480],
        borderColor: '#28a745',
        backgroundColor: 'rgba(40,167,69,0.08)',
        tension: 0.3,
        fill: true,
        pointRadius: 3
      }
    ]
  });

  const topProductsData = () => ({
    labels: ['Paracetamol', 'Cough Syrup', 'Vitamin C', 'Bandages', 'Insulin'],
    datasets: [
      {
        label: 'Units Sold',
        data: [420, 310, 280, 210, 160],
        backgroundColor: [getPrimary(), '#3399ff', '#28a745', '#ffa726', '#8e44ad']
      }
    ]
  });
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: { color: '#1f2933' }
      }
    },
    scales: {
      x: { ticks: { color: '#6b7280' }, grid: { color: 'rgba(16,24,40,0.04)' } },
      y: { ticks: { color: '#6b7280' }, grid: { color: 'rgba(16,24,40,0.04)' } }
    }
  };

  const [themeKey, setThemeKey] = useState(0);

  useEffect(() => {
    const onTheme = () => setThemeKey(k => k + 1);
    window.addEventListener('themechange', onTheme);
    return () => { window.removeEventListener('themechange', onTheme); };
  }, []);

  return (
    <div className="admin-dashboard">
      <AdminNavbar />
      <div className="main-content">
        <div className="page-inner">
          {/* Welcome Header */}
          <div className="welcome-header">
            <div>
              <h2>Welcome back, Admin</h2>
              <p className="welcome-sub">Good to see you — here's a quick overview.</p>
              <p className="platform-note">This is a medical e‑commerce platform — marketplace for medicines and healthcare products.</p>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="kpi-cards">
            <Link to="/admin/buyers" className="kpi-card kpi-link">
              <div className="kpi-icon"><i className="bi bi-people-fill" /></div>
              <div className="kpi-info">
                <h3>Total Buyers</h3>
                <p>{counts.buyers.toLocaleString()}</p>
              </div>
            </Link>

            <Link to="/admin/sellers" className="kpi-card kpi-link">
              <div className="kpi-icon"><i className="bi bi-shop" /></div>
              <div className="kpi-info">
                <h3>Total Sellers</h3>
                <p>{counts.sellers.toLocaleString()}</p>
              </div>
            </Link>

            <div className="kpi-card">
              <div className="kpi-icon"><i className="bi bi-cart-check" /></div>
              <div className="kpi-info">
                <h3>Orders Today</h3>
                <p>{counts.ordersToday.toLocaleString()}</p>
              </div>
            </div>

            <div className="kpi-card">
              <div className="kpi-icon"><i className="bi bi-cash-stack" /></div>
              <div className="kpi-info">
                <h3>Revenue</h3>
                <p>Rs {counts.revenue ? counts.revenue.toLocaleString() : 0}</p>
              </div>
            </div>

            <div className="kpi-card">
              <div className="kpi-icon"><i className="bi bi-person-badge" /></div>
              <div className="kpi-info">
                <h3>Pending Verifications</h3>
                <p>{counts.verifications}</p>
              </div>
            </div>

            <div className="kpi-card">
              <div className="kpi-icon"><i className="bi bi-person-plus-fill" /></div>
              <div className="kpi-info">
                <h3>New Signups</h3>
                <p>{counts.newSignups}</p>
              </div>
            </div>

            <div className="kpi-card">
              <div className="kpi-icon"><i className="bi bi-arrow-counterclockwise" /></div>
              <div className="kpi-info">
                <h3>Returns Today</h3>
                <p>{counts.returns}</p>
              </div>
            </div>

            <div className="kpi-card">
              <div className="kpi-icon"><i className="bi bi-truck" /></div>
              <div className="kpi-info">
                <h3>Avg Delivery (days)</h3>
                <p>{counts.deliveryDays}</p>
              </div>
            </div>

            <div className="kpi-card">
              <div className="kpi-icon"><i className="bi bi-chat-dots-fill" /></div>
              <div className="kpi-info">
                <h3>Open Support Tickets</h3>
                <p>{counts.supportTickets}</p>
              </div>
            </div>

            <div className="kpi-card">
              <div className="kpi-icon"><i className="bi bi-currency-dollar" /></div>
              <div className="kpi-info">
                <h3>Avg Order Value</h3>
                <p>Rs {counts.avgOrderValue ? Math.round(counts.avgOrderValue).toLocaleString() : 0}</p>
              </div>
            </div>
          </div>

          {SHOW_DASHBOARD_CHARTS && (
            <div className="chart-section">
              <div className="chart-row row-1">
                <div className="chart-box">
                  <h4>Order Trends</h4>
                  <div className="chart-inner">
                    <Line data={orderTrendData()} options={chartOptions} key={themeKey} />
                  </div>
                </div>

                <div className="chart-box">
                  <h4>Revenue</h4>
                  <div className="chart-inner">
                    <Bar data={revenueData()} options={chartOptions} key={themeKey + 1} />
                  </div>
                </div>
              </div>

              <div className="chart-row row-2">
                <div className="chart-box">
                  <h4>Category Distribution</h4>
                  <div className="chart-inner">
                    <Doughnut data={categoryData()} options={chartOptions} key={themeKey + 2} />
                  </div>
                </div>

                <div className="chart-box">
                  <h4>User Growth</h4>
                  <div className="chart-inner">
                    <Line data={userGrowthData()} options={chartOptions} key={themeKey + 3} />
                  </div>
                </div>

                <div className="chart-box">
                  <h4>Top Products</h4>
                  <div className="chart-inner">
                    <Bar data={topProductsData()} options={{ ...chartOptions, indexAxis: 'y' }} key={themeKey + 4} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Pending Orders Widget */}
          <div className="pending-orders-widget" style={{ marginBottom: '30px', background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '700', color: '#1a202c' }}>
                <i className="bi bi-clock-history" style={{ marginRight: '8px', color: '#f6ad55' }}></i>
                Pending Orders ({pendingOrders.length})
              </h4>
              <button className="control-btn" onClick={fetchPendingOrders} style={{ padding: '4px 12px', fontSize: '0.8rem' }}>
                <i className="bi bi-arrow-clockwise"></i> Refresh
              </button>
            </div>
            
            <div className="pending-list" style={{ maxHeight: '400px', overflowY: 'auto', borderRadius: '8px', border: '1px solid #edf2f7' }}>
              {loadingOrders ? (
                <div style={{ padding: '20px', textAlign: 'center', color: '#718096' }}>Loading orders...</div>
              ) : pendingOrders.length > 0 ? (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead style={{ position: 'sticky', top: 0, background: '#f8fafc', zIndex: 1 }}>
                    <tr style={{ textAlign: 'left', borderBottom: '1px solid #edf2f7' }}>
                      <th style={{ padding: '12px' }}>Order ID</th>
                      <th style={{ padding: '12px' }}>Customer</th>
                      <th style={{ padding: '12px' }}>Amount</th>
                      <th style={{ padding: '12px' }}>Date</th>
                      <th style={{ padding: '12px', textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingOrders.map((order) => (
                      <tr key={order.id} style={{ borderBottom: '1px solid #f7fafc', transition: 'background 0.2s' }} className="hover-row">
                        <td style={{ padding: '12px', fontWeight: '600' }}>#{order.id}</td>
                        <td style={{ padding: '12px' }}>{order.customer?.name || 'Guest'}</td>
                        <td style={{ padding: '12px', color: '#2d3748', fontWeight: '500' }}>Rs {order.total_amount}</td>
                        <td style={{ padding: '12px', fontSize: '0.85rem', color: '#718096' }}>
                          {new Date(order.order_date || order.created_at).toLocaleDateString()}
                        </td>
                        <td style={{ padding: '12px', textAlign: 'right' }}>
                          <div style={{ display: 'flex', gap: '5px', justifyContent: 'flex-end' }}>
                            <button onClick={() => handleViewOrder(order)} title="View" style={{ border: 'none', background: '#edf2f7', color: '#4a5568', padding: '5px 8px', borderRadius: '4px', cursor: 'pointer' }}>
                              <i className="bi bi-eye"></i>
                            </button>
                            <button onClick={() => handleUpdateStatus(order.id, 'completed')} title="Approve" style={{ border: 'none', background: '#c6f6d5', color: '#22543d', padding: '5px 8px', borderRadius: '4px', cursor: 'pointer' }}>
                              <i className="bi bi-check-lg"></i>
                            </button>
                            <button onClick={() => handleUpdateStatus(order.id, 'cancelled')} title="Cancel" style={{ border: 'none', background: '#fed7d7', color: '#822727', padding: '5px 8px', borderRadius: '4px', cursor: 'pointer' }}>
                              <i className="bi bi-x-lg"></i>
                            </button>
                            <button onClick={() => handleDeleteOrder(order.id)} title="Delete" style={{ border: 'none', background: '#fff5f5', color: '#c53030', padding: '5px 8px', borderRadius: '4px', cursor: 'pointer' }}>
                              <i className="bi bi-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div style={{ padding: '40px', textAlign: 'center', color: '#a0aec0' }}>
                  <i className="bi bi-check2-circle" style={{ fontSize: '2rem', display: 'block', marginBottom: '10px' }}></i>
                  No pending orders to process.
                </div>
              )}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="recent-activity">
            <h4>Recent Activity</h4>
            <ul>
              {counts.recentActivity && counts.recentActivity.length > 0 ? (
                counts.recentActivity.map((act) => (
                  <li key={act.id}>
                    <span>{act.message}</span>
                    <small style={{ float: 'right', opacity: 0.7 }}>{act.time}</small>
                  </li>
                ))
              ) : (
                <li>No recent activity recorded.</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
