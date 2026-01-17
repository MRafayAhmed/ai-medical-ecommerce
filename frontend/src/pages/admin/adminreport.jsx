import React, { useEffect } from 'react';
import AdminNavbar from './adminnavbar';
import '../../styles/adminreport.css';
import { Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Title, Tooltip, Legend, Filler);

export default function AdminReport() {
  const [themeVersion, setThemeVersion] = React.useState(0);

  useEffect(() => {
    const onTheme = () => {
      // bump version to force chart re-render so colors update
      setThemeVersion(v => v + 1);
    };
    window.addEventListener('themechange', onTheme);
    return () => window.removeEventListener('themechange', onTheme);
  }, []);

  // Sample KPI values
  const kpis = {
    revenue: '$120,540',
    orders: 1245,
    buyers: 320,
    sellers: 58
  };

  // Chart data (sample)
  const salesData = {
    labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct'],
    datasets: [{
      label: 'Sales ($)',
      data: [9000,12000,8000,15000,18000,16000,19000,21000,25000,28000],
      borderColor: getComputedStyle(document.documentElement).getPropertyValue('--primary').trim() || '#0b5fb8',
      backgroundColor: 'rgba(11,95,184,0.08)',
      tension: 0.3,
      fill: true
    }]
  };

  const orderData = {
    labels: ['Completed','Pending','Cancelled'],
    datasets: [{ data: [65,25,10], backgroundColor: ['#28a745','#ffc107','#dc3545'] }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } }
  };

  // CSV export for first table (Top Selling Products)
  const exportExcel = () => {
    const firstTable = document.querySelector('.report-card table');
    if (!firstTable) return alert('No table available to export.');
    const rows = Array.from(firstTable.querySelectorAll('tr'));
    const csv = rows.map(r => Array.from(r.querySelectorAll('th,td')).map(c => '"' + c.innerText.replace(/"/g,'""') + '"').join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'top-products.csv'; document.body.appendChild(a); a.click(); URL.revokeObjectURL(url); a.remove();
  };

  const exportFullReport = async () => {
    try {
      const html2canvas = (await import('html2canvas')).default;
      const { jsPDF } = await import('jspdf');
      const report = document.getElementById('reportContent');
      if (!report) return alert('Nothing to export.');
      const pdf = new jsPDF('p','mm','a4');
      const canvas = await html2canvas(report, { scale: 1.5 });
      const imgData = canvas.toDataURL('image/png');
      const imgWidth = 210; const pageHeight = 295; const imgHeight = (canvas.height * imgWidth) / canvas.width; let heightLeft = imgHeight; let position = 0;
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight); heightLeft -= pageHeight;
      while (heightLeft > 0) { position = heightLeft - imgHeight; pdf.addPage(); pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight); heightLeft -= pageHeight; }
      pdf.save('MediEcom_Report.pdf');
    } catch (err) {
      console.error('Export failed', err); alert('Export failed (html2canvas/jsPDF missing or blocked).');
    }
  };

  return (
    <div className="admin-reports">
      <AdminNavbar />
      <div className="main-content">
        <div className="page-inner">
          <div id="reportContent">
            <div className="page-controls">
              <div>
                <h2>Reports & Analytics</h2>
                <p className="page-sub">View KPIs, sales trends, and exportable reports.</p>
              </div>
              <div className="filters">
                <select className="control-select">
                  <option value="monthly">Monthly</option>
                  <option value="weekly">Weekly</option>
                  <option value="yearly">Yearly</option>
                </select>
                <input type="date" />
                <button className="control-btn positive" onClick={exportExcel}><i className="bi bi-file-earmark-excel" /> Export Excel</button>
                <button className="control-btn accent" onClick={exportFullReport}><i className="bi bi-book" /> Full Report PDF</button>
              </div>
            </div>

            <div className="report-grid">
              <div className="kpi-box"><h3>{kpis.revenue}</h3><p>Total Revenue</p></div>
              <div className="kpi-box"><h3>{kpis.orders}</h3><p>Orders Completed</p></div>
              <div className="kpi-box"><h3>{kpis.buyers}</h3><p>Active Buyers</p></div>
              <div className="kpi-box"><h3>{kpis.sellers}</h3><p>Active Sellers</p></div>
            </div>

            <div className="report-card">
              <div className="report-title">Sales Trend</div>
              <div className="chart-inner"><Line key={themeVersion} options={chartOptions} data={salesData} /></div>
            </div>

            <div className="report-card">
              <div className="report-title">Order Status Overview</div>
              <div className="chart-inner"><Doughnut key={themeVersion} data={orderData} options={{ maintainAspectRatio:false }} /></div>
            </div>

            <div className="report-card">
              <div className="report-title">🏷️ Top Selling Products</div>
              <div className="table-wrap">
                <table>
                  <thead><tr><th>Product</th><th>Category</th><th>Seller</th><th>Units Sold</th><th>Revenue</th></tr></thead>
                  <tbody>
                    <tr><td>Paracetamol</td><td>Medicine</td><td>HealthPlus</td><td>320</td><td>$3,200</td></tr>
                    <tr><td>Vitamin C</td><td>Supplements</td><td>CareMeds</td><td>280</td><td>$2,500</td></tr>
                    <tr><td>BP Monitor</td><td>Device</td><td>MediZone</td><td>150</td><td>$7,800</td></tr>
                    <tr><td>Face Mask</td><td>Protection</td><td>SafeLife</td><td>500</td><td>$1,200</td></tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="report-card">
              <div className="report-title">👥 Buyer Activity Report</div>
              <div className="table-wrap">
                <table>
                  <thead><tr><th>Buyer Name</th><th>Email</th><th>Orders</th><th>Total Spent</th><th>Last Login</th><th>Status</th></tr></thead>
                  <tbody>
                    <tr><td>John Doe</td><td>john@example.com</td><td>25</td><td>$2,800</td><td>2025-10-22</td><td style={{color:'green'}}>Active</td></tr>
                    <tr><td>Mary Smith</td><td>mary@medmail.com</td><td>15</td><td>$1,600</td><td>2025-10-20</td><td style={{color:'orange'}}>Pending</td></tr>
                    <tr><td>Ali Khan</td><td>ali@health.pk</td><td>12</td><td>$950</td><td>2025-10-19</td><td style={{color:'green'}}>Active</td></tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="report-card">
              <div className="report-title">🏪 Seller Performance Report</div>
              <div className="table-wrap">
                <table>
                  <thead><tr><th>Store Name</th><th>Owner</th><th>Products Listed</th><th>Total Orders</th><th>Revenue</th><th>Status</th></tr></thead>
                  <tbody>
                    <tr><td>HealthPlus</td><td>Dr. Ahmed</td><td>45</td><td>230</td><td>$12,000</td><td style={{color:'green'}}>Active</td></tr>
                    <tr><td>MediZone</td><td>Sarah Lee</td><td>38</td><td>190</td><td>$10,400</td><td style={{color:'green'}}>Active</td></tr>
                    <tr><td>CareMeds</td><td>Ali Raza</td><td>25</td><td>85</td><td>$4,800</td><td style={{color:'orange'}}>Pending</td></tr>
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
