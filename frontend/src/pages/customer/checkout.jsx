import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import '../../styles/checkout.css';

const CheckoutPage = () => {
    const navigate = useNavigate();
    const [cart, setCart] = useState([]);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        address: '',
        payment_preference: 'Cash'
    });

    useEffect(() => {
        const c = localStorage.getItem('temp_cart');
        const u = localStorage.getItem('customer_user');

        if (!c || !u) {
            navigate('/customer/dashboard');
            return;
        }

        setCart(JSON.parse(c));
        setUser(JSON.parse(u));
    }, [navigate]);

    const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const orderData = {
            user_id: user.id,
            total_amount: cartTotal,
            address: form.address,
            payment_preference: form.payment_preference,
            items: cart.map(item => ({
                inventory_id: item.id,
                qty: item.qty,
                price: item.price
            }))
        };

        try {
            await api.post('/orders', orderData);
            localStorage.removeItem('temp_cart');
            alert('Order placed successfully!');
            navigate('/customer/dashboard');
        } catch (err) {
            console.error('Checkout failed', err);
            alert('Failed to place order. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="checkout-container">
            <div className="checkout-content">
                <div className="checkout-header">
                    <button className="back-btn" onClick={() => navigate('/customer/dashboard')}>
                        <i className="bi bi-arrow-left"></i> Back to Shop
                    </button>
                    <h1>Checkout</h1>
                </div>

                <div className="checkout-grid">
                    <div className="checkout-form-section">
                        <form onSubmit={handleSubmit} className="checkout-form">
                            <h3>Delivery Details</h3>
                            <div className="form-group">
                                <label>Delivery Address</label>
                                <textarea
                                    required
                                    placeholder="Enter your full address"
                                    value={form.address}
                                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                                ></textarea>
                            </div>

                            <h3>Payment Method</h3>
                            <div className="payment-options">
                                <label className="payment-option">
                                    <input
                                        type="radio"
                                        name="payment"
                                        value="Cash"
                                        checked={form.payment_preference === 'Cash'}
                                        onChange={(e) => setForm({ ...form, payment_preference: e.target.value })}
                                    />
                                    <span>Cash on Delivery</span>
                                </label>
                                <label className="payment-option">
                                    <input
                                        type="radio"
                                        name="payment"
                                        value="Card"
                                        checked={form.payment_preference === 'Card'}
                                        onChange={(e) => setForm({ ...form, payment_preference: e.target.value })}
                                    />
                                    <span>Credit / Debit Card</span>
                                </label>
                            </div>

                            <button type="submit" className="place-order-btn" disabled={loading}>
                                {loading ? 'Processing...' : `Place Order (Rs. ${cartTotal.toFixed(2)})`}
                            </button>
                        </form>
                    </div>

                    <div className="order-summary-section">
                        <div className="summary-card">
                            <h3>Order Summary</h3>
                            <div className="summary-items">
                                {cart.map(item => (
                                    <div key={item.id} className="summary-item">
                                        <div className="item-name-qty">
                                            <span>{item.product_name}</span>
                                            <small>x{item.qty}</small>
                                        </div>
                                        <span className="item-price">Rs. {(item.price * item.qty).toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="summary-footer">
                                <div className="total-row">
                                    <span>Total Amount</span>
                                    <span className="final-price">Rs. {cartTotal.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
