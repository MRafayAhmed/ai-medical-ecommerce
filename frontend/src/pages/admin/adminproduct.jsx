import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import AdminNavbar from './adminnavbar';
import '../../styles/adminproduct.css';

export default function AdminProduct() {
  const [products, setProducts] = useState([]);
  const [filter, setFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    product_name: '',
    generic_name: '',
    category_id: '',
    brand_id: '',
    branch_id: '',
    price: '',
    mrp: '',
    discount: '',
    stock: '',
    dosage: '',
    pack_size: '',
    description: ''
  });

  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [branches, setBranches] = useState([]);

  // Fetch products and auxiliary data
  const fetchData = async () => {
    try {
      const [prodRes, attrRes] = await Promise.all([
        api.get('/medical-inventory'),
        api.get('/medical-inventory/attributes')
      ]);

      if (prodRes.data && prodRes.data.data) setProducts(prodRes.data.data);
      else setProducts(prodRes.data || []);

      if (attrRes.data) {
        setBrands(attrRes.data.brands || []);
        setCategories(attrRes.data.categories || []);
        setBranches(attrRes.data.branches || []);
      }

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filtered = products.filter(p => {
    if (filter === 'all') return true;
    const stock = Number(p.stock);
    if (filter === 'instock') return stock > 10;
    if (filter === 'lowstock') return stock > 0 && stock <= 10;
    if (filter === 'outofstock') return stock === 0;
    return true;
  });

  const [editId, setEditId] = useState(null);

  // ... (fetchData and filter logic remain same)

  const handleAddChange = (e) => { const { name, value } = e.target; setForm(prev => ({ ...prev, [name]: value })); };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...form,
        product_name: form.product_name,
        generic_name: form.generic_name,
        category_name: form.category_name,
        price: Number(form.price),
        mrp: Number(form.mrp),
        stock: Number(form.stock),
        discount: Number(form.discount || 0)
      };

      if (editId) {
        await api.put(`/medical-inventory/${editId}`, payload);
      } else {
        await api.post('/medical-inventory', payload);
      }

      setShowAddModal(false);
      resetForm();
      fetchData(); // Refresh list
    } catch (error) {
      console.error('Failed to save product', error);
      alert('Failed to save product. Check console.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({
      product_name: '', generic_name: '', category_id: '', brand_id: '', branch_id: '',
      price: '', mrp: '', discount: '', stock: '', dosage: '', pack_size: '', description: ''
    });
    setEditId(null);
  };

  const handleEdit = (product) => {
    setEditId(product.id);
    setForm({
      product_name: product.product_name,
      generic_name: product.generic_name || '',
      category_id: product.category_id || '',
      brand_id: product.brand_id || '',
      branch_id: product.branch_id || '',
      price: product.price,
      mrp: product.mrp,
      discount: product.discount,
      stock: product.stock,
      dosage: product.dosage || '',
      pack_size: product.pack_size || '',
      description: product.description || ''
    });
    setShowAddModal(true);
  };

  // ... (handleDelete, handleView, handleExport remain same)

  // In return statement, update modal close handler and title
  // And table actions

  const handleDelete = async (id) => {
    if (confirm('Delete this product?')) {
      try {
        await api.delete(`/medical-inventory/${id}`);
        fetchData(); // Refresh list to confirm deletion
      } catch (error) {
        console.error('Failed to delete product', error);
        alert('Failed to delete product.');
      }
    }
  };

  const handleView = async (product) => {
    try {
      const response = await api.get(`/medical-inventory/${product.id}`);
      setSelectedProduct(response.data);
      setShowViewModal(true);
    } catch (error) {
      console.error('Failed to fetch product details', error);
      alert('Failed to load product details.');
    }
  };

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
      win.document.close(); win.focus(); setTimeout(() => { try { win.print(); } catch (e) { console.error(e); } try { win.close(); } catch (e) { } }, 500);
    } catch (err) { console.error('Export failed', err); try { win.close(); } catch (e) { } alert('Export failed in this browser.'); }
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
                    <th>Brand</th>
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
                      <td>{p.product_name}</td>
                      <td>{p.generic_name}</td>
                      <td>{p.category ? p.category.name : p.category_id}</td>
                      <td>{p.brand ? p.brand.name : p.brand_id}</td>
                      <td>{p.price}</td>
                      <td>{p.stock}</td>
                      <td>
                        <span className={`status-badge ${p.stock <= 0 ? 'status-outofstock' : p.stock < 10 ? 'status-lowstock' : 'status-instock'}`}>
                          {p.stock <= 0 ? 'Out of Stock' : p.stock < 10 ? 'Low Stock' : 'In Stock'}
                        </span>
                      </td>
                      <td>
                        <button className="action-btn action-view" onClick={() => handleView(p)}><i className="bi bi-eye"></i> View</button>
                        <button className="action-btn action-edit" onClick={() => handleEdit(p)}><i className="bi bi-pencil-square"></i> Edit</button>
                        <button className="action-btn action-delete" onClick={() => handleDelete(p.id)}><i className="bi bi-trash"></i> Delete</button>
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
        <div className="modal" onClick={() => { setShowAddModal(false); resetForm(); }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editId ? 'Edit Product' : 'Add Product'}</h3>
              <span className="close-btn" onClick={() => { setShowAddModal(false); resetForm(); }}>&times;</span>
            </div>
            <form onSubmit={handleAddSubmit} className="modal-form">
              <div className="form-row">
                <div className="input-group">
                  <label>Product Name</label>
                  <input name="product_name" placeholder="E.g. Paracetamol" value={form.product_name} onChange={handleAddChange} required />
                </div>
                <div className="input-group">
                  <label>Generic Name</label>
                  <input name="generic_name" placeholder="E.g. Acetaminophen" value={form.generic_name} onChange={handleAddChange} />
                </div>
              </div>
              <div className="form-row">
                <div className="input-group">
                  <label>Category</label>
                  <select name="category_id" value={form.category_id} onChange={handleAddChange} required>
                    <option value="">Select Category</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="input-group">
                  <label>Brand</label>
                  <select name="brand_id" value={form.brand_id} onChange={handleAddChange} required>
                    <option value="">Select Brand</option>
                    {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="input-group">
                  <label>Branch</label>
                  <select name="branch_id" value={form.branch_id} onChange={handleAddChange} required>
                    <option value="">Select Branch</option>
                    {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                  </select>
                </div>
                <div className="input-group">
                  <label>Pack Size</label>
                  <input name="pack_size" placeholder="E.g. 10x10" value={form.pack_size} onChange={handleAddChange} />
                </div>
              </div>
              <div className="form-row">
                <div className="input-group">
                  <label>Dosage</label>
                  <input name="dosage" placeholder="E.g. 500mg" value={form.dosage} onChange={handleAddChange} />
                </div>
                <div className="input-group">
                  <label>Stock Quantity</label>
                  <input name="stock" type="number" placeholder="0" value={form.stock} onChange={handleAddChange} required />
                </div>
              </div>
              <div className="form-row">
                <div className="input-group">
                  <label>Price</label>
                  <input name="price" type="number" placeholder="0.00" value={form.price} onChange={handleAddChange} required />
                </div>
                <div className="input-group">
                  <label>MRP</label>
                  <input name="mrp" type="number" placeholder="0.00" value={form.mrp} onChange={handleAddChange} required />
                </div>
              </div>
              <div className="form-row">
                <div className="input-group">
                  <label>Discount (%)</label>
                  <input name="discount" type="number" placeholder="0" value={form.discount} onChange={handleAddChange} />
                </div>
              </div>
              <div className="input-group">
                <label>Description</label>
                <textarea name="description" placeholder="Product details..." value={form.description} onChange={handleAddChange} />
              </div>

              <div className="form-actions">
                <button type="button" className="btn-cancel" onClick={() => { setShowAddModal(false); resetForm(); }}>Cancel</button>
                <button type="submit" className="btn-submit" disabled={loading}>{loading ? 'Saving...' : 'Save'}</button>
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
              <div className="detail-row">
                <h4>{selectedProduct.product_name}</h4>
                <span className={`status-badge ${selectedProduct.stock <= 0 ? 'status-outofstock' : selectedProduct.stock < 10 ? 'status-lowstock' : 'status-instock'}`}>
                  {selectedProduct.stock <= 0 ? 'Out of Stock' : selectedProduct.stock < 10 ? 'Low Stock' : 'In Stock'}
                </span>
              </div>
              <div className="detail-grid">
                <p><strong>Generic Name:</strong> {selectedProduct.generic_name || 'N/A'}</p>
                <p><strong>Brand:</strong> {selectedProduct.brand ? selectedProduct.brand.name : 'N/A'}</p>
                <p><strong>Category:</strong> {selectedProduct.category ? selectedProduct.category.name : 'N/A'}</p>
                <p><strong>Branch:</strong> {selectedProduct.branch ? selectedProduct.branch.name : 'N/A'}</p>

                <p><strong>Price:</strong> {selectedProduct.price}</p>
                <p><strong>MRP:</strong> {selectedProduct.mrp}</p>
                <p><strong>Discount:</strong> {selectedProduct.discount}%</p>
                <p><strong>Stock:</strong> {selectedProduct.stock}</p>

                <p><strong>Dosage:</strong> {selectedProduct.dosage || 'N/A'}</p>
                <p><strong>Pack Size:</strong> {selectedProduct.pack_size || 'N/A'}</p>
              </div>
              <div className="detail-description">
                <strong>Description:</strong>
                <p>{selectedProduct.description || 'No description available.'}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
