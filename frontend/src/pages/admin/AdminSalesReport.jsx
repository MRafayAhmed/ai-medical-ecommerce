import React, { useState } from 'react';
import AdminNavbar from './adminnavbar';
import api from '../../api/axios';
import { Download, Calendar, Loader2, Table as TableIcon } from 'lucide-react';
import '../../styles/adminreport.css'; // Reusing existing report styles

export default function AdminSalesReport() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);

  const fetchReport = async () => {
    if (!startDate || !endDate) {
      alert('Please select both start and end dates.');
      return;
    }
    setLoading(true);
    try {
      const res = await api.get(`/reports/sales?start_date=${startDate}&end_date=${endDate}`);
      setData(res.data);
    } catch (err) {
      console.error('Failed to fetch report', err);
      alert('Error fetching report data');
    } finally {
      setLoading(false);
    }
  };

  const downloadExcel = async () => {
    if (!startDate || !endDate) {
      alert('Please select both start and end dates.');
      return;
    }
    setExporting(true);
    try {
      // Use axios to fetch the file as a blob, which keeps our auth headers
      const res = await api.get(`/reports/sales?export=excel&start_date=${startDate}&end_date=${endDate}`, {
        responseType: 'blob'
      });
      
      // Create a local URL for the blob and trigger download
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `sales_report_${startDate}_to_${endDate}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download failed', err);
      alert('Failed to download report');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="admin-reports">
      <AdminNavbar />
      <div className="main-content">
        <div className="page-inner">
          <div className="page-controls">
            <div>
              <h2>Detailed Sales Report</h2>
              <p className="page-sub">Select a date range to generate and download your pharmacy sales report.</p>
            </div>
          </div>

          <div className="report-card" style={{ marginBottom: '24px', padding: '24px' }}>
            <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
              <div className="form-group" style={{ flex: 1, minWidth: '200px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Start Date</label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type="date" 
                    className="control-select" 
                    style={{ width: '100%', paddingLeft: '35px' }} 
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                  <Calendar size={18} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                </div>
              </div>

              <div className="form-group" style={{ flex: 1, minWidth: '200px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>End Date</label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type="date" 
                    className="control-select" 
                    style={{ width: '100%', paddingLeft: '35px' }} 
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                  <Calendar size={18} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button 
                  className="control-btn" 
                  onClick={fetchReport} 
                  disabled={loading}
                  style={{ background: 'var(--primary)', color: 'white' }}
                >
                  {loading ? <Loader2 className="animate-spin" size={18} /> : <TableIcon size={18} />}
                  <span>Generate Preview</span>
                </button>

                <button 
                  className="control-btn positive" 
                  onClick={downloadExcel}
                  disabled={exporting}
                >
                  {exporting ? <Loader2 className="animate-spin" size={18} /> : <Download size={18} />}
                  <span>Download Excel</span>
                </button>
              </div>
            </div>
          </div>

          {data.length > 0 && (
            <div className="report-card">
              <div className="report-title">Preview: {data.length} Sales Records</div>
              <div className="table-wrap">
                <table style={{ width: '100%' }}>
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Date</th>
                      <th>Customer</th>
                      <th>Medicine</th>
                      <th>Qty</th>
                      <th>Price</th>
                      <th>Total</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((row, idx) => (
                      <tr key={idx}>
                        <td>#{row['Order ID']}</td>
                        <td>{new Date(row['Order Date']).toLocaleDateString()}</td>
                        <td>{row['User']}</td>
                        <td>{row['Items']}</td>
                        <td>{row['Quantity']}</td>
                        <td>Rs. {parseFloat(row['Price']).toFixed(2)}</td>
                        <td>Rs. {parseFloat(row['Total']).toFixed(2)}</td>
                        <td><span className={`status ${row['Order Status']}`}>{row['Order Status']}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {!loading && data.length === 0 && startDate && endDate && (
            <div style={{ textAlign: 'center', padding: '40px', background: 'white', borderRadius: '12px', border: '1px solid #eee' }}>
              <p style={{ color: '#64748b' }}>No records found for the selected period.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
