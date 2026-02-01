import React, { useState, useEffect } from 'react';
import { X, ShoppingBag, CreditCard, Truck, CheckCircle, ArrowRight, Loader2 } from 'lucide-react';
import api from '../api/axios';

const CheckoutSidebar = ({ isOpen, onClose, cart, user, onOrderSuccess }) => {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [shouldRender, setShouldRender] = useState(isOpen);
    const [form, setForm] = useState({
        address: '',
        payment_preference: 'Cash'
    });

    // Handle transition out
    useEffect(() => {
        if (isOpen) {
            setShouldRender(true);
            setStep(1);
        } else {
            const timer = setTimeout(() => setShouldRender(false), 400);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!shouldRender && !isOpen) return null;

    const cartTotal = cart.reduce((sum, item) => sum + (parseFloat(item.price || 0) * (item.qty || 1)), 0);

    const handlePlaceOrder = async () => {
        if (!user) {
            alert("User data not found. Please log in again.");
            return;
        }
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
            // Clear local cart immediately 
            localStorage.removeItem('mediEcom_cart');
            setStep(3);
            setTimeout(() => {
                onOrderSuccess();
            }, 2500); // Slightly longer for the success animation
        } catch (err) {
            console.error('Checkout failed', err);
            alert('Failed to place order. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const rotationStyles = `
        @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
        .spin-loader {
            animation: spin 1s linear infinite;
        }
    `;

    return (
        <>
            <style>{rotationStyles}</style>
            {/* Backdrop */}
            <div
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'rgba(0,0,0,0.6)',
                    backdropFilter: 'blur(8px)',
                    zIndex: 9999,
                    opacity: isOpen ? 1 : 0,
                    visibility: isOpen ? 'visible' : 'hidden',
                    transition: 'opacity 0.4s ease, visibility 0.4s ease'
                }}
                onClick={onClose}
            />

            {/* Sidebar Overlay */}
            <div style={{
                position: 'fixed',
                top: 0,
                right: isOpen ? 0 : '-100%',
                width: '100%',
                maxWidth: '500px',
                height: '100%',
                background: 'white',
                zIndex: 10000,
                boxShadow: '-15px 0 50px rgba(0,0,0,0.2)',
                transition: 'right 0.5s cubic-bezier(0.165, 0.84, 0.44, 1)',
                display: 'flex',
                flexDirection: 'column',
                fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
            }}>
                {/* Header */}
                <div style={{
                    padding: '30px 24px',
                    borderBottom: '1px solid #f0f2f5',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: 'linear-gradient(135deg, #a5d6a7, #81c784)',
                    color: '#000',
                    position: 'relative'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <div style={{ background: 'rgba(255,255,255,0.2)', padding: '10px', borderRadius: '12px' }}>
                            <ShoppingBag size={24} />
                        </div>
                        <div>
                            <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-0.5px', color: '#000' }}>Finalize Order</h2>
                            <p style={{ margin: 0, fontSize: '0.85rem', color: '#000', opacity: 0.7 }}>Secure Checkout</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'rgba(0,0,0,0.1)',
                            border: 'none',
                            color: '#000',
                            borderRadius: '50%',
                            width: '40px',
                            height: '40px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'background 0.2s'
                        }}
                        onMouseEnter={(e) => e.target.style.background = 'rgba(0,0,0,0.2)'}
                        onMouseLeave={(e) => e.target.style.background = 'rgba(0,0,0,0.1)'}
                    >
                        <X size={24} />
                    </button>

                    {/* Decorative pattern */}
                    <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '4px', background: 'rgba(255,255,255,0.1)' }} />
                </div>

                {/* Progress Indicator */}
                <div style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '40px', background: '#f8fafc' }}>
                    {[
                        { step: 1, label: 'Shipping' },
                        { step: 2, label: 'Payment' },
                        { step: 3, label: 'Review' }
                    ].map(item => (
                        <div key={item.step} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                            <div style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '50%',
                                background: step >= item.step ? '#81c784' : '#e2e8f0',
                                color: '#000',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '14px',
                                fontWeight: 700,
                                transition: 'all 0.3s ease',
                                boxShadow: step >= item.step ? '0 0 0 4px rgba(46, 125, 50, 0.1)' : 'none'
                            }}>
                                {step > item.step ? <CheckCircle size={18} /> : item.step}
                            </div>
                            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: step >= item.step ? '#2e7d32' : '#94a3b8' }}>{item.label}</span>
                        </div>
                    ))}
                </div>

                {/* Content Area */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '32px 24px' }}>
                    {step === 1 && (
                        <div>
                            <h3 style={{ marginBottom: '24px', fontSize: '1.25rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <Truck size={24} color="#2e7d32" />
                                Where should we deliver?
                            </h3>
                            <div style={{ marginBottom: '32px' }}>
                                <label style={{ display: 'block', marginBottom: '10px', fontWeight: 600, color: '#475569', fontSize: '0.95rem' }}>Shipping Address</label>
                                <textarea
                                    style={{
                                        width: '100%',
                                        height: '140px',
                                        padding: '16px',
                                        borderRadius: '16px',
                                        border: '2px solid #e2e8f0',
                                        fontSize: '1rem',
                                        outline: 'none',
                                        transition: 'all 0.2s',
                                        resize: 'none',
                                        background: '#fcfdfd'
                                    }}
                                    onFocus={(e) => e.target.style.borderColor = '#2e7d32'}
                                    onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                                    placeholder="e.g. House #123, Street Name, Area, City"
                                    value={form.address}
                                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                                />
                            </div>

                            <div style={{ padding: '24px', background: '#f1f5f9', borderRadius: '20px', border: '1px dashed #cbd5e1' }}>
                                <h4 style={{ margin: '0 0 16px 0', fontSize: '1rem' }}>Order Highlights</h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    {cart.slice(0, 3).map(item => (
                                        <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                                            <span style={{ color: '#64748b' }}>{item.product_name || item.name} (x{item.qty})</span>
                                            <span style={{ fontWeight: 600 }}>Rs. {(parseFloat(item.price) * item.qty).toFixed(2)}</span>
                                        </div>
                                    ))}
                                    {cart.length > 3 && (
                                        <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontStyle: 'italic' }}>+ {cart.length - 3} more items</div>
                                    )}
                                </div>
                                <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontWeight: 600 }}>Total Payable</span>
                                    <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#2e7d32' }}>Rs. {cartTotal.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div>
                            <h3 style={{ marginBottom: '24px', fontSize: '1.25rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <CreditCard size={24} color="#2e7d32" />
                                Payment Preference
                            </h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                {[
                                    { id: 'Cash', label: 'Cash on Delivery', sub: 'Pay securely at your doorstep', icon: '🚚' },
                                    { id: 'Card', label: 'Card Payment', sub: 'Fast & Secure via SSL', icon: '💳' }
                                ].map(opt => (
                                    <label key={opt.id} style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '16px',
                                        padding: '20px',
                                        borderRadius: '20px',
                                        border: '2px solid',
                                        borderColor: form.payment_preference === opt.id ? '#2e7d32' : '#e2e8f0',
                                        background: form.payment_preference === opt.id ? '#f0fdf4' : 'white',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                        boxShadow: form.payment_preference === opt.id ? '0 4px 12px rgba(46, 125, 50, 0.1)' : 'none'
                                    }}>
                                        <input
                                            type="radio"
                                            name="payment"
                                            value={opt.id}
                                            checked={form.payment_preference === opt.id}
                                            onChange={(e) => setForm({ ...form, payment_preference: e.target.value })}
                                            style={{ margin: 0, width: '20px', height: '20px', accentColor: '#2e7d32' }}
                                        />
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontWeight: 700, fontSize: '1.1rem', color: '#1e293b' }}>{opt.label}</div>
                                            <div style={{ fontSize: '0.85rem', color: '#64748b' }}>{opt.sub}</div>
                                        </div>
                                        <span style={{ fontSize: '1.5rem' }}>{opt.icon}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div style={{ textAlign: 'center', padding: '40px 0' }}>
                            <div style={{
                                width: '100px',
                                height: '100px',
                                borderRadius: '50%',
                                background: '#f0fdf4',
                                color: '#16a34a',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 30px',
                                boxShadow: '0 10px 25px rgba(22, 163, 74, 0.2)'
                            }}>
                                <CheckCircle size={60} />
                            </div>
                            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '15px', color: '#1e293b' }}>Order Success!</h2>
                            <p style={{ color: '#64748b', fontSize: '1.1rem', lineHeight: 1.6, maxWidth: '300px', margin: '0 auto' }}>
                                Your healthcare essentials are on their way! Redirecting you to your orders...
                            </p>
                        </div>
                    )}
                </div>

                {/* Action Bar */}
                {step < 3 && (
                    <div style={{ padding: '24px', borderTop: '1px solid #f0f2f5', background: '#fcfdfd' }}>
                        {step === 1 ? (
                            <button
                                onClick={() => setStep(2)}
                                disabled={!form.address.trim()}
                                style={{
                                    width: '100%',
                                    padding: '20px',
                                    borderRadius: '16px',
                                    background: '#81c784',
                                    color: '#000',
                                    border: 'none',
                                    fontWeight: 700,
                                    fontSize: '1.1rem',
                                    cursor: form.address.trim() ? 'pointer' : 'not-allowed',
                                    opacity: form.address.trim() ? 1 : 0.6,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '12px',
                                    boxShadow: '0 8px 20px rgba(46, 125, 50, 0.25)',
                                    transition: 'transform 0.2s, background 0.2s'
                                }}
                                onMouseEnter={(e) => { if (form.address) e.target.style.transform = 'translateY(-2px)'; }}
                                onMouseLeave={(e) => { e.target.style.transform = 'translateY(0)'; }}
                            >
                                Continue to Payment
                                <ArrowRight size={20} />
                            </button>
                        ) : (
                            <div style={{ display: 'flex', gap: '16px' }}>
                                <button
                                    onClick={() => setStep(1)}
                                    style={{
                                        flex: 1,
                                        padding: '20px',
                                        borderRadius: '16px',
                                        background: '#f1f5f9',
                                        color: '#000',
                                        border: 'none',
                                        fontWeight: 700,
                                        cursor: 'pointer',
                                        transition: 'background 0.2s'
                                    }}
                                >
                                    Back
                                </button>
                                <button
                                    onClick={handlePlaceOrder}
                                    disabled={loading}
                                    style={{
                                        flex: 2,
                                        padding: '20px',
                                        borderRadius: '16px',
                                        background: 'linear-gradient(135deg, #a5d6a7, #81c784)',
                                        color: '#000',
                                        border: '1px solid #2e7d32',
                                        fontWeight: 700,
                                        fontSize: '1.1rem',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '12px',
                                        boxShadow: '0 8px 25px rgba(46, 125, 50, 0.3)'
                                    }}
                                >
                                    {loading ? (
                                        <Loader2 className="spin-loader" size={24} color="#000" />
                                    ) : (
                                        `Confirm & Pay Rs. ${cartTotal.toFixed(2)}`
                                    )}
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </>
    );
};

export default CheckoutSidebar;
