import React, { useEffect, useState } from 'react';
import AdminNavbar from './adminnavbar';
import '../../styles/adminproduct.css';

export default function AdminProduct() {
  const [products, setProducts] = useState([]);
  const [filter, setFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [form, setForm] = useState({
    name: '',
    generic: '',
    category: '',
    seller: '',
    price: '',
    stock: 0,
    status: 'instock',
    image: '',
    description: ''
  });

  const initializeSampleData = () => {
    const sample = [
      { id: 1, name: 'Panadol Extra', generic: 'Paracetamol', category: 'Fever & Pain Relief', seller: 'MedPlus Store', price: '$4.50', stock: 500, status: 'instock', image: '', description: 'Painkiller used for fever and headache.' },
      { id: 2, name: 'Augmentin 625mg', generic: 'Amoxicillin + Clavulanic Acid', category: 'Antibiotics', seller: 'HealthMart', price: '$9.00', stock: 35, status: 'lowstock', image: '', description: 'Antibiotic used for bacterial infections.' },
      { id: 3, name: 'Vitamin C 500mg', generic: 'Ascorbic Acid', category: 'Supplements', seller: 'Vita Supplements', price: '$6.00', stock: 0, status: 'outofstock', image: '', description: 'Immune support supplement.' }
    ];
    setProducts(sample);
    localStorage.setItem('admin_products', JSON.stringify(sample));
  };

  // Load products on mount
  useEffect(() => {
    const saved = localStorage.getItem('admin_products');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) setProducts(parsed);
        else initializeSampleData();
      } catch (e) { console.error('Error parsing products', e); initializeSampleData(); }
    } else initializeSampleData();
  }, []);

  // persist
  useEffect(() => { if (products.length > 0) localStorage.setItem('admin_products', JSON.stringify(products)); }, [products]);

  const filtered = products.filter(p => filter === 'all' || p.status === filter);

  const handleAddChange = (e) => { const { name, value } = e.target; setForm(prev => ({ ...prev, [name]: value })); };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.seller.trim()) { alert('Product name and seller are required'); return; }
    const id = products.length ? Math.max(...products.map(p => p.id)) + 1 : 1;
    const newP = { ...form, id, stock: Number(form.stock || 0) };
    setProducts(prev => [...prev, newP]);
    setForm({ name: '', generic: '', category: '', seller: '', price: '', stock: 0, status: 'instock', image: '', description: '' });
    setShowAddModal(false);
  };

  const handleDelete = (id) => { if (confirm('Delete this product?')) setProducts(prev => prev.filter(p => p.id !== id)); };

  const handleView = (product) => { setSelectedProduct(product); setShowViewModal(true); };

  const handleExport = () => {
    const content = document.querySelector('.products-container');
    if (!content) return alert('Nothing to export');
    const styles = `body{font-family:Inter, Arial, sans-serif; color:#2c3e50; margin:20px} h2{color:#2c3e50} table{width:100%; border-collapse:collapse; margin-top:12px} th,td{padding:10px; border:1px solid #e6eef8; text-align:left} th{background:#0056b3; color:white}`;
    const win = window.open('', '_blank');
    try {
      win.document.open();
      win.document.write('<!doctype html><html><head><title>Products Export</title>');
      win.document.write('<meta charset="utf-8">');
      win.document.write('<style>' + styles + '</style>');
      win.document.write('</head><body>');
      win.document.write('<h2>Products — Export</h2>');
      const table = content.querySelector('table');
      if (table) win.document.write(table.outerHTML); else win.document.write(content.innerHTML);
      win.document.write('</body></html>');
      win.document.close(); win.focus(); setTimeout(() => { try { win.print(); } catch (e) { console.error(e); } try { win.close(); } catch (e) {} }, 500);
    } catch (err) { console.error('Export failed', err); try { win.close(); } catch (e) {} alert('Export failed in this browser.'); }
  };

  return (
    <div className="admin-products">
      <AdminNavbar />
      <div className="main-content">
        <div className="page-inner">
          <div className="page-controls">
            <div>
              <h2>Manage Products</h2>
              <p className="page-sub">Manage and review listed products, stock levels, and sellers.</p>
            </div>
            <div className="filters">
              <select value={filter} onChange={(e) => setFilter(e.target.value)} className="control-select">
                <option value="all">All</option>
                <option value="instock">In Stock</option>
                <option value="lowstock">Low Stock</option>
                <option value="outofstock">Out of Stock</option>
              </select>
              <button className="control-btn" onClick={() => setShowAddModal(true)}><i className="bi bi-plus-lg" /> Add Product</button>
              <button className="control-btn" onClick={handleExport}><i className="bi bi-file-earmark-pdf" /> Export PDF</button>
            </div>
          </div>

          <div className="products-container">
            <div className="products-table">
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Product Name</th>
                    <th>Generic Name</th>
                    <th>Category</th>
                    <th>Seller</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((p, idx) => (
                    <tr key={p.id} data-status={p.status}>
                      <td>{idx + 1}</td>
                      <td>{p.name}</td>
                      <td>{p.generic}</td>
                      <td>{p.category}</td>
                      <td>{p.seller}</td>
                      <td>{p.price}</td>
                      <td>{p.stock}</td>
                      <td><span className={`status-badge status-${p.status}`}>{p.status === 'instock' ? 'In Stock' : p.status === 'lowstock' ? 'Low Stock' : 'Out of Stock'}</span></td>
                      <td>
                        <button className="action-btn action-view" onClick={() => handleView(p)}>View</button>
                        <button className="action-btn action-delete" onClick={() => handleDelete(p.id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {showAddModal && (
        <div className="modal" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add Product</h3>
              <span className="close-btn" onClick={() => setShowAddModal(false)}>&times;</span>
            </div>
            <form onSubmit={handleAddSubmit} className="modal-form">
              <input name="name" placeholder="Product name" value={form.name} onChange={handleAddChange} required />
              <input name="generic" placeholder="Generic name" value={form.generic} onChange={handleAddChange} />
              <input name="category" placeholder="Category" value={form.category} onChange={handleAddChange} />
              <input name="seller" placeholder="Seller" value={form.seller} onChange={handleAddChange} required />
              <input name="price" placeholder="Price" value={form.price} onChange={handleAddChange} />
              <input name="stock" type="number" placeholder="Stock" value={form.stock} onChange={handleAddChange} />
              <select name="status" value={form.status} onChange={handleAddChange}>
                <option value="instock">In Stock</option>
                <option value="lowstock">Low Stock</option>
                <option value="outofstock">Out of Stock</option>
              </select>
              <textarea name="description" placeholder="Description" value={form.description} onChange={handleAddChange} />
              <div className="form-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowAddModal(false)}>Cancel</button>
                <button type="submit" className="btn-submit">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showViewModal && selectedProduct && (
        <div className="modal" onClick={() => setShowViewModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Product Details</h3>
              <span className="close-btn" onClick={() => setShowViewModal(false)}>&times;</span>
            </div>
            <div className="product-detail">
              {selectedProduct.image && <img src={selectedProduct.image} alt="Product" />}
              <h4>{selectedProduct.name}</h4>
              <p><strong>Generic:</strong> {selectedProduct.generic}</p>
              <p><strong>Category:</strong> {selectedProduct.category}</p>
              <p><strong>Seller:</strong> {selectedProduct.seller}</p>
              <p><strong>Price:</strong> {selectedProduct.price}</p>
              <p><strong>Stock:</strong> {selectedProduct.stock}</p>
              <p><strong>Status:</strong> {selectedProduct.status}</p>
              <p><strong>Description:</strong> {selectedProduct.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
