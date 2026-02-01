import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, User, LogOut, Package, Shield, MapPin, ArrowLeft } from 'lucide-react';
import api from '../../api/axios';
import '../../styles/buyermainpage.css';

const BuyerProfile = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const userData = localStorage.getItem('customer_user');
        if (userData) {
            setUser(JSON.parse(userData));
        } else {
            navigate('/buyer/login');
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('customer_token');
        localStorage.removeItem('customer_user');
        navigate('/buyer/login');
    };

    if (!user) return null;

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
                    <h1 style={{ margin: 0, fontSize: '2rem' }}>My Profile</h1>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '32px' }}>
                    {/* Left: Sidebar */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div style={{
                            padding: '24px',
                            background: 'white',
                            borderRadius: '12px',
                            border: '1px solid #eee',
                            textAlign: 'center',
                            marginBottom: '16px'
                        }}>
                            <div style={{
                                width: '80px',
                                height: '80px',
                                background: 'var(--primary-color)',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 16px auto',
                                color: 'white'
                            }}>
                                <User size={40} />
                            </div>
                            <h2 style={{ margin: '0 0 4px 0' }}>{user.name || 'User'}</h2>
                            <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>{user.email}</p>
                        </div>

                        <button onClick={() => navigate('/buyer/orders')} style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '12px 16px',
                            background: 'white',
                            border: '1px solid #eee',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            textAlign: 'left'
                        }}>
                            <Package size={20} /> My Orders
                        </button>
                        <button style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '12px 16px',
                            background: 'white',
                            border: '1px solid #eee',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            textAlign: 'left'
                        }}>
                            <MapPin size={20} /> Addresses
                        </button>
                        <button onClick={handleLogout} style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '12px 16px',
                            background: '#fff5f5',
                            border: '1px solid #fed7d7',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            color: '#c53030',
                            textAlign: 'left',
                            fontWeight: 600
                        }}>
                            <LogOut size={20} /> Logout
                        </button>
                    </div>

                    {/* Right: Details */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div style={{ padding: '32px', background: 'white', borderRadius: '12px', border: '1px solid #eee' }}>
                            <h3 style={{ margin: '0 0 24px 0', borderBottom: '1px solid #eee', paddingBottom: '12px' }}>Personal Information</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                                <div>
                                    <label style={{ fontSize: '0.8rem', color: '#666', fontWeight: 600 }}>Full Name</label>
                                    <p style={{ fontSize: '1.1rem', margin: '4px 0 0 0' }}>{user.name}</p>
                                </div>
                                <div>
                                    <label style={{ fontSize: '0.8rem', color: '#666', fontWeight: 600 }}>Email Address</label>
                                    <p style={{ fontSize: '1.1rem', margin: '4px 0 0 0' }}>{user.email}</p>
                                </div>
                                <div>
                                    <label style={{ fontSize: '0.8rem', color: '#666', fontWeight: 600 }}>Customer Type</label>
                                    <p style={{ fontSize: '1.1rem', margin: '4px 0 0 0' }}>Individual</p>
                                </div>
                            </div>
                        </div>

                        <div style={{ padding: '32px', background: 'white', borderRadius: '12px', border: '1px solid #eee' }}>
                            <h3 style={{ margin: '0 0 24px 0', borderBottom: '1px solid #eee', paddingBottom: '12px' }}>Security</h3>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                <Shield size={24} color="var(--primary-color)" />
                                <div>
                                    <p style={{ margin: 0, fontWeight: 600 }}>Account Security</p>
                                    <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>Your account is protected with standard encryption.</p>
                                </div>
                                <button className="bm-view-all-btn" style={{ marginLeft: 'auto', fontSize: '0.8rem' }}>Change Password</button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default BuyerProfile;
