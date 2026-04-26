import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, ClipboardList, Package, Loader2, ArrowLeft, X } from 'lucide-react';
import api from '../../api/axios';
import BuyerFooter from '../../components/BuyerFooter';
import '../../styles/buyermainpage.css';

const BuyerOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [pagination, setPagination] = useState({
        current_page: 1,
        last_page: 1,
        total: 0
    });
    const navigate = useNavigate();

    const fetchOrders = async (page = 1) => {
        setLoading(true);
        try {
            const response = await api.get(`/orders?page=${page}`);
            const responseData = response.data;
            if (responseData.data) {
                setOrders(responseData.data);
                setPagination({
                    current_page: responseData.current_page,
                    last_page: responseData.last_page,
                    total: responseData.total
                });
            } else {
                setOrders(responseData || []);
                setPagination({ current_page: 1, last_page: 1, total: (responseData || []).length });
            }
        } catch (err) {
            console.error('Error fetching orders:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    return (
        <div className="bm-page">
            <header className="header">
                <div className="header__container">
                    <Link to="/buyer/dashboard" className="header__logo">
                        <Heart className="header__heart-icon" />
                        <span className="header__logo-text">MediEcom</span>
                    </Link>
                </div>
            </header>

            <main className="header__container" style={{ paddingTop: '100px', minHeight: '80vh', display: 'block' }}>
                <div style={{ marginBottom: '32px', textAlign: 'center' }}>
                    <h1 style={{ margin: '0 0 16px 0', fontSize: '2.5rem', color: 'var(--text-primary)', fontWeight: 900 }}>My Orders</h1>
                    <button onClick={() => navigate(-1)} className="bm-action" style={{ background: '#f0f2f5', display: 'inline-flex', padding: '8px 16px', borderRadius: '8px', width: 'auto', gap: '8px', color: '#334155' }}>
                        <ArrowLeft size={20} />
                        <span style={{ fontWeight: 600 }}>Back to Shop</span>
                    </button>
                </div>

                {loading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '100px' }}>
                        <Loader2 className="animate-spin" size={48} color="var(--primary-color)" />
                    </div>
                ) : orders.length > 0 ? (
                    <>
                        <div className="bm-orders-grid-3" style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(3, 1fr)',
                            gap: '24px'
                        }}>
                            {orders.map(order => (
                                <div key={order.id} style={{
                                    padding: '24px',
                                    background: 'white',
                                    borderRadius: '16px',
                                    border: '1px solid rgba(2, 6, 23, 0.04)',
                                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.03)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                    transition: 'all 0.2s ease',
                                    cursor: 'default'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-4px)';
                                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.08)';
                                    e.currentTarget.style.borderColor = 'var(--color-primary)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'none';
                                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.03)';
                                    e.currentTarget.style.borderColor = 'rgba(2, 6, 23, 0.04)';
                                }}>
                                    <div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                            <h3 style={{ margin: 0, fontWeight: 800, fontSize: '1.2rem', color: 'var(--text-primary)' }}>Order #{order.id}</h3>
                                            <span style={{
                                                padding: '4px 10px',
                                                borderRadius: '999px',
                                                fontSize: '0.75rem',
                                                fontWeight: 700,
                                                textTransform: 'uppercase',
                                                background: order.status === 'completed' ? '#f0fdf4' : (order.status === 'pending' ? '#fff7ed' : '#fef2f2'),
                                                color: order.status === 'completed' ? '#16a34a' : (order.status === 'pending' ? '#ea580c' : '#dc2626')
                                            }}>{order.status}</span>
                                        </div>
                                        <p style={{ margin: '0 0 16px 0', color: '#64748b', fontSize: '0.9rem' }}>
                                            Ordered: {new Date(order.order_date).toLocaleDateString()}
                                        </p>
                                        <button 
                                            className="bm-view-all-btn" 
                                            style={{ fontSize: '0.8rem', padding: '6px 16px', background: '#f1f5f9', color: '#334155', boxShadow: 'none' }}
                                            onClick={(e) => { e.preventDefault(); setSelectedOrder(order); }}
                                        >
                                            View Details
                                        </button>
                                    </div>
                                    <div style={{
                                        borderTop: '1px solid #f1f5f9',
                                        paddingTop: '16px',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}>
                                        <span style={{ fontSize: '0.9rem', color: '#64748b' }}>Total Amount</span>
                                        <span style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--color-primary)' }}>
                                            Rs. {Number(order.total_amount).toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        {/* Pagination Controls */}
                        {pagination.last_page > 1 && (
                            <div className="bm-pagination" style={{ 
                                display: 'flex', 
                                justifyContent: 'center', 
                                alignItems: 'center', 
                                gap: '20px', 
                                padding: '40px 0',
                                marginTop: '20px',
                                borderTop: '1px solid #eee'
                            }}>
                                <button 
                                    onClick={() => fetchOrders(pagination.current_page - 1)}
                                    disabled={pagination.current_page === 1}
                                    className="bm-pagination-btn"
                                    style={{
                                        padding: '10px 20px',
                                        borderRadius: '8px',
                                        border: '1px solid #ddd',
                                        background: pagination.current_page === 1 ? '#f5f5f5' : 'white',
                                        cursor: pagination.current_page === 1 ? 'not-allowed' : 'pointer',
                                        color: 'var(--primary-color)',
                                        fontWeight: '600'
                                    }}
                                >
                                    Previous
                                </button>
                                
                                <span style={{ fontWeight: '600' }}>
                                    Page {pagination.current_page} of {pagination.last_page} ({pagination.total} Orders)
                                </span>
                                
                                <button 
                                    onClick={() => fetchOrders(pagination.current_page + 1)}
                                    disabled={pagination.current_page === pagination.last_page}
                                    className="bm-pagination-btn"
                                    style={{
                                        padding: '10px 20px',
                                        borderRadius: '8px',
                                        border: '1px solid #ddd',
                                        background: pagination.current_page === pagination.last_page ? '#f5f5f5' : 'white',
                                        cursor: pagination.current_page === pagination.last_page ? 'not-allowed' : 'pointer',
                                        color: 'var(--primary-color)',
                                        fontWeight: '600'
                                    }}
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <div style={{ textAlign: 'center', padding: '100px', background: '#f8f9fa', borderRadius: '16px' }}>
                        <Package size={64} color="#ccc" style={{ marginBottom: '16px' }} />
                        <p style={{ fontSize: '1.2rem', color: '#666' }}>You haven't placed any orders yet.</p>
                        <Link to="/buyer/dashboard" style={{ color: 'var(--primary-color)', fontWeight: 600 }}>Start Shopping</Link>
                    </div>
                )}
            </main>

            {/* Order Details Modal */}
            {selectedOrder && (
                <div style={{
                    position: 'fixed',
                    top: 0, left: 0, width: '100%', height: '100%',
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    display: 'flex', justifyContent: 'center', alignItems: 'center',
                    zIndex: 2000,
                    backdropFilter: 'blur(4px)'
                }}>
                    <div style={{
                        background: 'white',
                        padding: '30px',
                        borderRadius: '16px',
                        width: '90%',
                        maxWidth: '600px',
                        maxHeight: '85vh',
                        overflowY: 'auto',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                            <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800 }}>Order #{selectedOrder.id} Details</h2>
                            <button onClick={() => setSelectedOrder(null)} style={{ background: '#f1f5f9', border: 'none', cursor: 'pointer', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <X size={20} color="#475569" />
                            </button>
                        </div>
                        
                        {/* Delivery Details */}
                        <div style={{ marginBottom: '24px' }}>
                            <h4 style={{ margin: '0 0 12px 0', color: '#475569', fontSize: '1rem' }}>Delivery Information</h4>
                            <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
                                <p style={{ margin: 0, color: '#334155', lineHeight: '1.5' }}>
                                    {selectedOrder.address || 'No address provided'}
                                </p>
                                <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ fontSize: '0.9rem', color: '#64748b' }}>Payment Method</span>
                                    <strong style={{ color: '#0f172a' }}>{selectedOrder.payment_preference || 'Cash'}</strong>
                                </div>
                            </div>
                        </div>

                        {/* Items List */}
                        <div>
                            <h4 style={{ margin: '0 0 12px 0', color: '#475569', fontSize: '1rem' }}>Order Items</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {selectedOrder.items && selectedOrder.items.length > 0 ? selectedOrder.items.map(item => (
                                    <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', border: '1px solid #e2e8f0', borderRadius: '12px', background: '#fff' }}>
                                        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                                            <div style={{ width: '60px', height: '60px', background: '#f8fafc', border: '1px solid #f1f5f9', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                                                {item.inventory?.image ? (
                                                    <img 
                                                        src={item.inventory.image.startsWith('http') ? item.inventory.image : `http://127.0.0.1:8000/storage/${item.inventory.image}`} 
                                                        alt={item.inventory.product_name} 
                                                        style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
                                                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                                    />
                                                ) : (
                                                    <Package size={24} color="#94a3b8" />
                                                )}
                                            </div>
                                            <div>
                                                <p style={{ margin: '0 0 4px 0', fontWeight: 700, color: '#0f172a' }}>{item.inventory?.product_name || 'Medical Product'}</p>
                                                <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b', fontWeight: 500 }}>Qty: {item.qty} × Rs. {Number(item.price_at_order).toFixed(2)}</p>
                                            </div>
                                        </div>
                                        <div style={{ fontWeight: 800, color: 'var(--color-primary)' }}>
                                            Rs. {Number(item.sub_total).toFixed(2)}
                                        </div>
                                    </div>
                                )) : (
                                    <p style={{ color: '#666', fontStyle: 'italic', textAlign: 'center', padding: '20px' }}>No items found for this order.</p>
                                )}
                            </div>
                        </div>
                        
                        <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '2px dashed #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontWeight: 600, color: '#475569', fontSize: '1.1rem' }}>Total Amount</span>
                            <span style={{ fontWeight: 900, fontSize: '1.4rem', color: 'var(--color-primary)' }}>Rs. {Number(selectedOrder.total_amount).toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            )}
            <BuyerFooter />
        </div>
    );
};

export default BuyerOrders;
