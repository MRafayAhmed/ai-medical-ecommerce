import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, ClipboardList, Package, Loader2, ArrowLeft } from 'lucide-react';
import api from '../../api/axios';
import '../../styles/buyermainpage.css';

const BuyerOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await api.get('/orders');
                setOrders(response.data.data || response.data || []);
            } catch (err) {
                console.error('Error fetching orders:', err);
            } finally {
                setLoading(false);
            }
        };
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

            <main className="header__container" style={{ paddingTop: '100px', minHeight: '80vh' }}>
                <div style={{ marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <button onClick={() => navigate(-1)} className="bm-action" style={{ background: '#f0f2f5' }}>
                        <ArrowLeft size={20} />
                    </button>
                    <h1 style={{ margin: 0, fontSize: '2rem' }}>My Orders</h1>
                </div>

                {loading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '100px' }}>
                        <Loader2 className="animate-spin" size={48} color="var(--primary-color)" />
                    </div>
                ) : orders.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {orders.map(order => (
                            <div key={order.id} style={{
                                padding: '24px',
                                background: 'white',
                                borderRadius: '12px',
                                border: '1px solid #eee',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <div>
                                    <h3 style={{ margin: '0 0 8px 0' }}>Order #{order.id}</h3>
                                    <p style={{ margin: 0, color: '#666' }}>Date: {new Date(order.order_date).toLocaleDateString()}</p>
                                    <p style={{ margin: 0, color: '#666' }}>Status: <span style={{
                                        color: order.status === 'completed' ? 'green' : (order.status === 'pending' ? 'orange' : 'red'),
                                        fontWeight: 600,
                                        textTransform: 'capitalize'
                                    }}>{order.status}</span></p>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <p style={{ fontSize: '1.2rem', fontWeight: 700, margin: '0 0 8px 0' }}>Rs. {Number(order.total_amount).toFixed(2)}</p>
                                    <button className="bm-view-all-btn" style={{ fontSize: '0.8rem' }}>View Details</button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div style={{ textAlign: 'center', padding: '100px', background: '#f8f9fa', borderRadius: '16px' }}>
                        <Package size={64} color="#ccc" style={{ marginBottom: '16px' }} />
                        <p style={{ fontSize: '1.2rem', color: '#666' }}>You haven't placed any orders yet.</p>
                        <Link to="/buyer/dashboard" style={{ color: 'var(--primary-color)', fontWeight: 600 }}>Start Shopping</Link>
                    </div>
                )}
            </main>
        </div>
    );
};

export default BuyerOrders;
