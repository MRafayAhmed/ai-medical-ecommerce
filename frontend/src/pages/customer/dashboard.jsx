import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import '../../styles/marketplace.css';

const CustomerDashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');
    const [cart, setCart] = useState([]);
    const [showCart, setShowCart] = useState(false);

    const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);
    const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

    const addToCart = (product) => {
        setCart(prev => {
            const existing = prev.find(item => item.id === product.id);
            if (existing) {
                return prev.map(item =>
                    item.id === product.id ? { ...item, qty: item.qty + 1 } : item
                );
            }
            return [...prev, { ...product, qty: 1 }];
        });
        setShowCart(true);
    };

    const updateQty = (id, delta) => {
        setCart(prev => prev.map(item => {
            if (item.id === id) {
                const newQty = Math.max(1, item.qty + delta);
                return { ...item, qty: newQty };
            }
            return item;
        }));
    };

    const removeFromCart = (id) => {
        setCart(prev => prev.filter(item => item.id !== id));
    };

    useEffect(() => {
        const u = localStorage.getItem('customer_user');
        if (!u) {
            navigate('/customer/login');
            return;
        }
        setUser(JSON.parse(u));
        fetchData();
    }, [navigate]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [prodRes, attrRes] = await Promise.all([
                api.get('/medical-inventory'),
                api.get('/medical-inventory/attributes')
            ]);
            // Handle Laravel Pagination: actual data is in prodRes.data.data
            const fetchedProducts = prodRes.data.data || (Array.isArray(prodRes.data) ? prodRes.data : []);
            setProducts(fetchedProducts);
            setCategories(Array.isArray(attrRes.data?.categories) ? attrRes.data.categories : []);
        } catch (err) {
            console.error('Failed to fetch marketplace data', err);
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem('customer_token');
        localStorage.removeItem('customer_user');
        navigate('/');
    };

    const filteredProducts = (products || []).filter(p => {
        if (!p) return false;
        const productName = (p.product_name || "").toLowerCase();
        const genericName = (p.generic_name || "").toLowerCase();
        const search = (searchTerm || "").toLowerCase();

        const matchesSearch = productName.includes(search) || genericName.includes(search);

        // Match by category name
        const matchesCategory = activeCategory === 'All' ||
            (p.category && p.category.name === activeCategory) ||
            (p.category_id && p.category_id.toString() === activeCategory);

        return matchesSearch && matchesCategory;
    });

    const getStockBadge = (qty) => {
        const q = parseInt(qty) || 0;
        if (q > 20) return <span className="badge-stock in-stock">In Stock</span>;
        if (q > 0) return <span className="badge-stock low-stock">Low Stock</span>;
        return <span className="badge-stock out-of-stock">Out of Stock</span>;
    };

    return (
        <div className="marketplace-container">
            {/* Sidebar */}
            <aside className="marketplace-sidebar">
                <div className="sidebar-header">Medi-Ecom</div>
                <div className="sidebar-content">
                    <div className="sidebar-section">
                        <h4>Categories</h4>
                        <div
                            className={`category-item ${activeCategory === 'All' ? 'active' : ''}`}
                            onClick={() => setActiveCategory('All')}
                        >
                            <i className="bi bi-grid-fill"></i>
                            <span>All Products</span>
                        </div>
                        {categories.map(cat => (
                            <div
                                key={cat.id}
                                className={`category-item ${activeCategory === cat.name ? 'active' : ''}`}
                                onClick={() => setActiveCategory(cat.name)}
                            >
                                <i className="bi bi-tag-fill"></i>
                                <span>{cat.name}</span>
                            </div>
                        ))}
                    </div>

                    <div className="sidebar-section">
                        <h4>Account</h4>
                        <div className="category-item" onClick={() => navigate('/customer/profile')}>
                            <i className="bi bi-person-fill"></i>
                            <span>My Profile</span>
                        </div>
                        <div className="category-item" onClick={() => navigate('/customer/orders')}>
                            <i className="bi bi-bag-check-fill"></i>
                            <span>My Orders</span>
                        </div>
                        <div className="category-item" onClick={logout}>
                            <i className="bi bi-box-arrow-right"></i>
                            <span>Logout</span>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="marketplace-main">
                <nav className="marketplace-nav">
                    <div className="search-wrapper">
                        <i className="bi bi-search"></i>
                        <input
                            type="text"
                            className="search-input"
                            placeholder="Search medicines, health products..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="nav-actions">
                        <button className="cart-btn" onClick={() => setShowCart(true)}>
                            <i className="bi bi-cart3"></i>
                            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
                        </button>
                        <div className="user-profile">
                            <span className="user-name" style={{ fontWeight: 600 }}>{user?.name}</span>
                            <div className="user-avatar">{user?.name?.charAt(0)}</div>
                        </div>
                    </div>
                </nav>

                <div className="marketplace-body">
                    <div className="page-header">
                        <h2>{activeCategory} {activeCategory === 'All' ? 'Medicines' : ''}</h2>
                        <p style={{ color: '#64748b' }}>Showing {filteredProducts.length} results</p>
                    </div>

                    {loading ? (
                        <div className="loading-state">
                            <div className="spinner-border text-primary" role="status"></div>
                            <p>Loading marketplace...</p>
                        </div>
                    ) : (
                        <div className="product-grid">
                            {filteredProducts.map(p => (
                                <div key={p.id} className="product-card">
                                    <div className="product-image-box">
                                        <i className="bi bi-capsule"></i>
                                    </div>
                                    <div className="product-details">
                                        <span className="product-category">{p.category?.name || 'Medicine'}</span>
                                        <h3 className="product-name">{p.product_name}</h3>
                                        <p className="product-generic">{p.generic_name}</p>
                                        <div style={{ marginBottom: '12px' }}>{getStockBadge(p.stock)}</div>
                                        <div className="product-footer">
                                            <span className="product-price">Rs. {p.price}</span>
                                            <button className="add-btn" title="Add to Cart" onClick={() => addToCart(p)}>
                                                <i className="bi bi-plus-lg"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {filteredProducts.length === 0 && (
                                <div className="no-results" style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px' }}>
                                    <i className="bi bi-search" style={{ fontSize: '3rem', color: '#cbd5e1' }}></i>
                                    <h3>No products found</h3>
                                    <p>Try matching with another keyword or category.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </main>

            {/* Cart Drawer */}
            <div className={`cart-drawer ${showCart ? 'open' : ''}`}>
                <div className="cart-header">
                    <h3>Your Cart ({cartCount})</h3>
                    <button className="close-cart" onClick={() => setShowCart(false)}>
                        <i className="bi bi-x-lg"></i>
                    </button>
                </div>

                <div className="cart-items">
                    {cart.length === 0 ? (
                        <div className="empty-cart">
                            <i className="bi bi-cart-x"></i>
                            <p>Your cart is empty</p>
                        </div>
                    ) : (
                        cart.map(item => (
                            <div key={item.id} className="cart-item">
                                <div className="item-info">
                                    <span className="item-name">{item.product_name}</span>
                                    <span className="item-price">Rs. {item.price}</span>
                                </div>
                                <div className="item-actions">
                                    <div className="qty-controls">
                                        <button onClick={() => updateQty(item.id, -1)}>-</button>
                                        <span>{item.qty}</span>
                                        <button onClick={() => updateQty(item.id, 1)}>+</button>
                                    </div>
                                    <button className="remove-item" onClick={() => removeFromCart(item.id)}>
                                        <i className="bi bi-trash"></i>
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {cart.length > 0 && (
                    <div className="cart-footer">
                        <div className="cart-summary">
                            <span>Subtotal</span>
                            <span className="total-price">Rs. {cartTotal.toFixed(2)}</span>
                        </div>
                        <button className="checkout-btn" onClick={() => {
                            localStorage.setItem('temp_cart', JSON.stringify(cart));
                            navigate('/customer/checkout');
                        }}>
                            Proceed to Checkout
                        </button>
                    </div>
                )}
            </div>
            {showCart && <div className="cart-overlay" onClick={() => setShowCart(false)}></div>}
        </div>
    );
};

export default CustomerDashboard;
