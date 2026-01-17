import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
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
    avgOrderValue: 0
  });

  // Animate counter numbers on mount
  useEffect(() => {
    const targets = {
      buyers: 1245,
      sellers: 312,
      ordersToday: 78,
      revenue: 24560,
      verifications: 9,
      newSignups: 34,
      returns: 2,
      deliveryDays: 3,
      supportTickets: 16,
      avgOrderValue: 58
    };

    const duration = 80;
    let frame = 0;

    const interval = setInterval(() => {
      frame++;
      const progress = Math.min(frame / duration, 1);

      const newCounts = {};
      Object.keys(targets).forEach(key => {
        newCounts[key] = Math.ceil(targets[key] * progress);
      });

      setCounts(newCounts);

      if (progress === 1) clearInterval(interval);
    }, 20);

    return () => clearInterval(interval);
  }, []);

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
        label: 'Revenue ($)',
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
                <p>${counts.revenue.toLocaleString()}</p>
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
                <p>${counts.avgOrderValue}</p>
              </div>
            </div>
          </div>

          {/* Charts Section */}
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
                  <Bar data={revenueData()} options={chartOptions} key={themeKey+1} />
                </div>
              </div>
            </div>

            <div className="chart-row row-2">
              <div className="chart-box">
                <h4>Category Distribution</h4>
                <div className="chart-inner">
                  <Doughnut data={categoryData()} options={chartOptions} key={themeKey+2} />
                </div>
              </div>

              <div className="chart-box">
                <h4>User Growth</h4>
                <div className="chart-inner">
                  <Line data={userGrowthData()} options={chartOptions} key={themeKey+3} />
                </div>
              </div>

              <div className="chart-box">
                <h4>Top Products</h4>
                <div className="chart-inner">
                  <Bar data={topProductsData()} options={{ ...chartOptions, indexAxis: 'y' }} key={themeKey+4} />
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="recent-activity">
            <h4>Recent Activity</h4>
            <ul>
              <li>New buyer "John Doe" registered.</li>
              <li>Order #2025 completed successfully.</li>
              <li>Seller "MediMart" verified.</li>
              <li>New product "Smart Stethoscope" added.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
