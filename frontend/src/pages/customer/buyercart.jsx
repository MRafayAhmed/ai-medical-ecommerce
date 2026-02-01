import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, Trash2, Plus, Minus, ArrowLeft, Loader2, Package } from 'lucide-react';
import api from '../../api/axios';
import '../../styles/buyermainpage.css';
import CheckoutSidebar from '../../components/CheckoutSidebar';
import BuyerNavbar from '../../components/BuyerNavbar';

const BuyerCart = () => {
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const savedCart = localStorage.getItem('mediEcom_cart');
        if (savedCart) {
            // Group items by ID and sum quantities
            const rawCart = JSON.parse(savedCart);
            const grouped = rawCart.reduce((acc, item) => {
                const existing = acc.find(i => i.id === item.id);
                if (existing) {
                    existing.qty = (existing.qty || 1) + 1;
                } else {
                    acc.push({ ...item, qty: 1 });
                }
                return acc;
            }, []);
            setCart(grouped);
        }

        const u = localStorage.getItem('customer_user');
        if (u) setUser(JSON.parse(u));
    }, []);

    const updateQty = (id, delta) => {
        const updated = cart.map(item => {
            if (item.id === id) {
                const newQty = Math.max(1, (item.qty || 1) + delta);
                return { ...item, qty: newQty };
            }
            return item;
        });
        setCart(updated);
        saveCart(updated);
    };

    const removeItem = (id) => {
        const updated = cart.filter(item => item.id !== id);
        setCart(updated);
        saveCart(updated);
    };

    const saveCart = (updatedCart) => {
        // Flatten for simple localStorage storage (compatible with current logic)
        const flattened = updatedCart.flatMap(item => Array(item.qty).fill({ ...item, qty: undefined }));
        localStorage.setItem('mediEcom_cart', JSON.stringify(flattened));
    };

    const cartTotal = cart.reduce((sum, item) => sum + (parseFloat(item.price || 0) * (item.qty || 1)), 0);

    const handleCheckout = () => {
        if (cart.length === 0) return;
        setIsCheckoutOpen(true);
    };

    const handleOrderSuccess = () => {
        localStorage.removeItem('mediEcom_cart');
        setCart([]);
        setIsCheckoutOpen(false);
        navigate('/buyer/orders');
    };

    return (
        <div className="bm-page">
            <BuyerNavbar />

            <main className="header__container" style={{ paddingTop: '100px', minHeight: '80vh', paddingBottom: '40px' }}>
                <div style={{ marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <button onClick={() => navigate(-1)} className="bm-action" style={{ background: '#f0f2f5' }}>
                        <ArrowLeft size={20} />
                    </button>
                    <h1 style={{ margin: 0, fontSize: '2rem' }}>Shopping Cart</h1>
                </div>

                {cart.length > 0 ? (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '32px' }}>
                        {/* Cart Items List */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {cart.map(item => (
                                <div key={item.id} style={{
                                    padding: '20px',
                                    background: 'white',
                                    borderRadius: '12px',
                                    border: '1px solid #eee',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '20px'
                                }}>
                                    <img
                                        src={item.image || `https://via.placeholder.com/80?text=${encodeURIComponent(item.product_name || item.name)}`}
                                        alt={item.product_name || item.name}
                                        style={{ width: '80px', height: '80px', borderRadius: '8px', objectFit: 'cover', background: '#f8f9fa' }}
                                    />
                                    <div style={{ flex: 1 }}>
                                        <h3 style={{ margin: '0 0 4px 0', fontSize: '1.1rem' }}>{item.product_name || item.name}</h3>
                                        <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>Rs. {parseFloat(item.price || 0).toFixed(2)} / unit</p>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#f0f2f5', padding: '4px', borderRadius: '8px' }}>
                                        <button onClick={() => updateQty(item.id, -1)} style={{ border: 'none', background: 'none', cursor: 'pointer', padding: '4px' }}><Minus size={16} /></button>
                                        <span style={{ fontWeight: 600, minWidth: '24px', textAlign: 'center' }}>{item.qty}</span>
                                        <button onClick={() => updateQty(item.id, 1)} style={{ border: 'none', background: 'none', cursor: 'pointer', padding: '4px' }}><Plus size={16} /></button>
                                    </div>
                                    <div style={{ textAlign: 'right', minWidth: '100px' }}>
                                        <p style={{ fontWeight: 700, margin: 0 }}>Rs. {(parseFloat(item.price || 0) * item.qty).toFixed(2)}</p>
                                        <button onClick={() => removeItem(item.id)} style={{ border: 'none', background: 'none', color: '#ff4d4d', cursor: 'pointer', padding: '4px', marginTop: '4px' }}><Trash2 size={18} /></button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Order Summary */}
                        <div style={{ position: 'sticky', top: '120px', height: 'fit-content' }}>
                            <div style={{ padding: '24px', background: 'white', borderRadius: '16px', border: '1px solid #eee', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                                <h3 style={{ margin: '0 0 20px 0' }}>Order Summary</h3>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', color: '#666' }}>
                                    <span>Subtotal ({cart.length} items)</span>
                                    <span>Rs. {cartTotal.toFixed(2)}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', color: '#666' }}>
                                    <span>Delivery Fee</span>
                                    <span style={{ color: '#22c55e', fontWeight: 600 }}>FREE</span>
                                </div>
                                <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '20px 0' }} />
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', fontSize: '1.2rem', fontWeight: 700 }}>
                                    <span>Total</span>
                                    <span style={{ color: 'var(--primary-color)' }}>Rs. {cartTotal.toFixed(2)}</span>
                                </div>
                                <button
                                    onClick={handleCheckout}
                                    className="bm-add-to-cart-btn"
                                    style={{ width: '100%', padding: '16px', fontSize: '1.1rem', justifyContent: 'center' }}
                                >
                                    Proceed to Checkout
                                </button>
                                <p style={{ textAlign: 'center', marginTop: '16px', color: '#999', fontSize: '0.8rem' }}>Secure Checkout Powered by MediEcom</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div style={{ textAlign: 'center', padding: '100px', background: '#f8f9fa', borderRadius: '16px' }}>
                        <ShoppingCart size={64} color="#ccc" style={{ marginBottom: '16px' }} />
                        <p style={{ fontSize: '1.2rem', color: '#666' }}>Your cart is empty.</p>
                        <Link to="/buyer/dashboard" style={{ color: 'var(--primary-color)', fontWeight: 600 }}>Start Shopping</Link>
                    </div>
                )}
            </main>

            <CheckoutSidebar
                isOpen={isCheckoutOpen}
                onClose={() => setIsCheckoutOpen(false)}
                cart={cart}
                user={user}
                onOrderSuccess={handleOrderSuccess}
            />
        </div>
    );
};

export default BuyerCart;
