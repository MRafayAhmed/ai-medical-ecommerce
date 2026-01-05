import React, { useState, useEffect } from 'react';
import AdminNavbar from './adminnavbar';
import '../../styles/adminseller.css';

export default function AdminSeller() {
  const [sellers, setSellers] = useState([]);
  const [filter, setFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [form, setForm] = useState({
    storeName: '',
    owner: '',
    licenseNo: '',
    email: '',
    phone: '',
    status: 'verified'
  });

  const initializeSampleData = () => {
    const sampleSellers = [
      {
        id: 1,
        storeName: 'MedPlus Store',
        owner: 'Dr. Alice Cooper',
        licenseNo: 'LIC-458793',
        status: 'verified',
        joined: '2025-09-12',
        email: 'alice@medplus.com',
        phone: '+1 800 555 1234',
        image: '',
        products: 120,
        revenue: '$45,000'
      },
      {
        id: 2,
        storeName: 'HealthMart',
        owner: 'John Carter',
        licenseNo: 'LIC-985632',
        status: 'pending',
        joined: '2025-10-01',
        email: 'john@healthmart.com',
        phone: '+44 123 987 654',
        image: '',
        products: 58,
        revenue: '$18,000'
      },
      {
        id: 3,
        storeName: 'PharmaCare Plus',
        owner: 'Sarah Mitchell',
        licenseNo: 'LIC-652814',
        status: 'verified',
        joined: '2025-08-15',
        email: 'sarah@pharmacare.com',
        phone: '+1 555 234 5678',
        image: '',
        products: 95,
        revenue: '$52,000'
      },
      {
        id: 4,
        storeName: 'WellnessHub',
        owner: 'Emma Rodriguez',
        licenseNo: 'LIC-741852',
        status: 'verified',
        joined: '2025-07-22',
        email: 'emma@wellnesshub.com',
        phone: '+1 888 777 6543',
        image: '',
        products: 142,
        revenue: '$68,500'
      },
      {
        id: 5,
        storeName: 'MediCare Express',
        owner: 'Michael Chen',
        licenseNo: 'LIC-369258',
        status: 'pending',
        joined: '2025-11-03',
        email: 'michael@medicare.com',
        phone: '+86 10 5829 3847',
        image: '',
        products: 34,
        revenue: '$8,200'
      },
      {
        id: 6,
        storeName: 'HealthFirst Pharmacy',
        owner: 'Dr. James Wilson',
        licenseNo: 'LIC-159357',
        status: 'verified',
        joined: '2025-06-10',
        email: 'james@healthfirst.com',
        phone: '+1 702 555 0147',
        image: '',
        products: 187,
        revenue: '$95,000'
      },
      {
        id: 7,
        storeName: 'Vita Supplements',
        owner: 'Lisa Anderson',
        licenseNo: 'LIC-852963',
        status: 'verified',
        joined: '2025-09-05',
        email: 'lisa@vitasupp.com',
        phone: '+1 619 555 7621',
        image: '',
        products: 76,
        revenue: '$31,450'
      },
      {
        id: 8,
        storeName: 'DoctorBox Online',
        owner: 'Rajesh Kumar',
        licenseNo: 'LIC-741369',
        status: 'pending',
        joined: '2025-11-15',
        email: 'rajesh@doctorbox.com',
        phone: '+91 98765 43210',
        image: '',
        products: 28,
        revenue: '$5,800'
      },
      {
        id: 9,
        storeName: 'Cure Pharmacy',
        owner: 'Dr. Maria Santos',
        licenseNo: 'LIC-258147',
        status: 'verified',
        joined: '2025-05-18',
        email: 'maria@curepharm.com',
        phone: '+55 11 98765 4321',
        image: '',
        products: 163,
        revenue: '$71,200'
      },
      {
        id: 10,
        storeName: 'HealthyLiving Store',
        owner: 'David Thompson',
        licenseNo: 'LIC-456789',
        status: 'suspended',
        joined: '2025-04-20',
        email: 'david@healthyliving.com',
        phone: '+1 215 555 9876',
        image: '',
        products: 89,
        revenue: '$22,100'
      },
      {
        id: 11,
        storeName: 'OTC Medical Supplies',
        owner: 'Patricia Lee',
        licenseNo: 'LIC-654321',
        status: 'verified',
        joined: '2025-07-12',
        email: 'patricia@otcmedical.com',
        phone: '+1 425 555 2468',
        image: '',
        products: 201,
        revenue: '$112,300'
      },
      {
        id: 12,
        storeName: 'Global Meds',
        owner: 'Hassan Ahmed',
        licenseNo: 'LIC-369741',
        status: 'pending',
        joined: '2025-12-01',
        email: 'hassan@globalmeds.com',
        phone: '+971 50 555 4444',
        image: '',
        products: 15,
        revenue: '$2,300'
      }
    ];
    setSellers(sampleSellers);
    localStorage.setItem('admin_sellers', JSON.stringify(sampleSellers));
  };

  // Load sellers from localStorage on mount
  useEffect(() => {
    const savedSellers = localStorage.getItem('admin_sellers');
    if (savedSellers) {
      try {
        const parsed = JSON.parse(savedSellers);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSellers(parsed);
        } else {
          // saved was empty array or invalid; initialize samples
          initializeSampleData();
        }
      } catch (e) {
        console.error('Error parsing sellers:', e);
        initializeSampleData();
      }
    } else {
      initializeSampleData();
    }
  }, []);

  // Save sellers to localStorage whenever they change
  useEffect(() => {
    if (sellers.length > 0) {
      localStorage.setItem('admin_sellers', JSON.stringify(sellers));
    }
  }, [sellers]);

  const filteredSellers = sellers.filter(seller => 
    filter === 'all' || seller.status === filter
  );

  const handleAddChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!form.storeName.trim() || !form.owner.trim()) {
      alert('Store name and owner are required.');
      return;
    }
    const id = sellers.length ? Math.max(...sellers.map(s => s.id)) + 1 : 1;
    const newSeller = {
      ...form,
      id,
      joined: new Date().toISOString().slice(0, 10),
      products: 0,
      revenue: '$0'
    };
    setSellers(prev => [...prev, newSeller]);
    setForm({ storeName: '', owner: '', licenseNo: '', email: '', phone: '', status: 'verified' });
    setShowAddModal(false);
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this seller?')) {
      setSellers(prev => prev.filter(s => s.id !== id));
    }
  };

  const handleView = (seller) => {
    setSelectedSeller(seller);
    setShowViewModal(true);
  };

  const handleExportPDF = () => {
    const content = document.querySelector('.sellers-container');
    if (!content) {
      alert('Nothing to export.');
      return;
    }
    const styles = `body{font-family:Inter, Arial, sans-serif; color:#2c3e50; margin:20px} h2{color:#2c3e50} table{width:100%; border-collapse:collapse; margin-top:12px} th,td{padding:10px; border:1px solid #e6eef8; text-align:left} th{background:#0056b3; color:white}`;
    const win = window.open('', '_blank');
    try {
      win.document.open();
      win.document.write('<!doctype html><html><head><title>Sellers Export</title>');
      win.document.write('<meta charset="utf-8">');
      win.document.write('<style>' + styles + '</style>');
      win.document.write('</head><body>');
      win.document.write('<h2>Sellers — Export</h2>');
      const table = content.querySelector('table');
      if (table) win.document.write(table.outerHTML);
      else win.document.write(content.innerHTML);
      win.document.write('</body></html>');
      win.document.close();
      win.focus();
      setTimeout(() => {
        try { win.print(); }
        catch (e) { console.error(e); }
        try { win.close(); }
        catch (e) { }
      }, 500);
    } catch (err) {
      console.error('Export failed', err);
      try { win.close(); }
      catch (e) { }
      alert('Export failed in this browser.');
    }
  };

  return (
    <div className="admin-sellers">
      <AdminNavbar />
      <div className="main-content">
        <div className="page-inner">
          <div className="page-controls">
            <div>
              <h2>Manage Sellers</h2>
              <p className="page-sub">Manage and review registered sellers, their licenses, and performance.</p>
            </div>
            <div className="filters">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="control-select"
              >
                <option value="all">All</option>
                <option value="verified">Verified</option>
                <option value="pending">Pending</option>
                <option value="suspended">Suspended</option>
              </select>
              <button
                type="button"
                className="control-btn"
                onClick={() => setShowAddModal(true)}
              >
                <i className="bi bi-person-plus-fill"></i> Add Seller
              </button>
              <button
                type="button"
                className="control-btn"
                onClick={handleExportPDF}
              >
                <i className="bi bi-file-earmark-pdf"></i> Export PDF
              </button>
            </div>
          </div>

          <div className="sellers-container">
            <div className="sellers-table">
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Store Name</th>
                    <th>Owner</th>
                    <th>License No</th>
                    <th>Status</th>
                    <th>Registered</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSellers.map((seller, index) => (
                    <tr key={seller.id} data-status={seller.status}>
                      <td>{index + 1}</td>
                      <td>{seller.storeName}</td>
                      <td>{seller.owner}</td>
                      <td>{seller.licenseNo}</td>
                      <td>
                        <span className={`status-badge status-${seller.status}`}>
                          {seller.status.charAt(0).toUpperCase() + seller.status.slice(1)}
                        </span>
                      </td>
                      <td>{seller.joined}</td>
                      <td>
                        <button
                          className="action-btn action-view"
                          onClick={() => handleView(seller)}
                        >
                          View
                        </button>
                        <button
                          className="action-btn action-delete"
                          onClick={() => handleDelete(seller.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Add Seller Modal */}
      {showAddModal && (
        <div className="modal" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add Seller</h3>
              <span className="close-btn" onClick={() => setShowAddModal(false)}>&times;</span>
            </div>
            <form onSubmit={handleAddSubmit} className="modal-form">
              <input
                type="text"
                name="storeName"
                placeholder="Store name"
                value={form.storeName}
                onChange={handleAddChange}
                required
              />
              <input
                type="text"
                name="owner"
                placeholder="Owner name"
                value={form.owner}
                onChange={handleAddChange}
                required
              />
              <input
                type="text"
                name="licenseNo"
                placeholder="License number"
                value={form.licenseNo}
                onChange={handleAddChange}
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleAddChange}
              />
              <input
                type="text"
                name="phone"
                placeholder="Phone"
                value={form.phone}
                onChange={handleAddChange}
              />
              <select
                name="status"
                value={form.status}
                onChange={handleAddChange}
              >
                <option value="verified">Verified</option>
                <option value="pending">Pending</option>
                <option value="suspended">Suspended</option>
              </select>
              <div className="form-actions">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-submit">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Seller Modal */}
      {showViewModal && selectedSeller && (
        <div className="modal" onClick={() => setShowViewModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Seller Details</h3>
              <span className="close-btn" onClick={() => setShowViewModal(false)}>&times;</span>
            </div>
            <div className="seller-profile">
              {selectedSeller.image && (
                <img src={selectedSeller.image} alt="Store Logo" />
              )}
              <h4>{selectedSeller.storeName}</h4>
              <p>Owned by <strong>{selectedSeller.owner}</strong></p>
              <div className="seller-stats">
                <div className="seller-stat">
                  <h5>{selectedSeller.products}</h5>
                  <p>Total Products</p>
                </div>
                <div className="seller-stat">
                  <h5>{selectedSeller.revenue}</h5>
                  <p>Total Revenue</p>
                </div>
              </div>
              <p><strong>License No:</strong> {selectedSeller.licenseNo}</p>
              <p><strong>Status:</strong> {selectedSeller.status.charAt(0).toUpperCase() + selectedSeller.status.slice(1)}</p>
              <p><strong>Email:</strong> {selectedSeller.email}</p>
              <p><strong>Phone:</strong> {selectedSeller.phone}</p>
              <p><strong>Registered:</strong> {selectedSeller.joined}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
