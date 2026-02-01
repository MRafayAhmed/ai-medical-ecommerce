import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/home.css';

const Home = () => {
    const navigate = useNavigate();

    return (
        <div className="landing-page">
            <div className="landing-overlay"></div>

            <nav className="landing-nav" style={{ justifyContent: 'space-between', padding: '20px 5%' }}>
                <div className="nav-logo" style={{ fontSize: '1.8rem', fontWeight: 800 }}>Medi-Ecom</div>
                <div className="nav-auth" style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                    <button onClick={() => navigate('/buyer/login')} style={{ background: 'transparent', border: 'none', color: 'white', fontWeight: 600, cursor: 'pointer' }}>Login</button>
                    <button onClick={() => navigate('/buyer/register')} style={{ padding: '10px 24px', borderRadius: '30px', background: 'var(--primary-color, #22c55e)', border: 'none', color: 'white', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 15px rgba(34, 197, 94, 0.3)' }}>Join Now</button>
                </div>
            </nav>

            <div className="landing-content">
                <div className="landing-header" style={{ textAlign: 'center', marginBottom: '60px' }}>
                    <h1 style={{ fontSize: '4rem', fontWeight: 900, marginBottom: '10px' }}>Your Health, Simplified.</h1>
                    <p style={{ fontSize: '1.4rem', opacity: 0.9 }}>Browse Thousands of Medical Supplies & Prescription Medicines from Karachi's Top Suppliers.</p>
                </div>

                <div className="landing-actions" style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '80px' }}>
                    <button onClick={() => navigate('/buyer/dashboard')} className="btn btn-primary" style={{ padding: '20px 40px', fontSize: '1.2rem', borderRadius: '40px' }}>
                        Browse Marketplace
                    </button>
                </div>

                <div className="role-cards" style={{ display: 'flex', justifyContent: 'center', gap: '30px' }}>
                    <div className="role-card customer-card" style={{ maxWidth: '400px', textAlign: 'center', padding: '40px', background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', borderRadius: '24px' }}>
                        <div className="card-icon" style={{ fontSize: '3rem', marginBottom: '20px' }}><i className="bi bi-person-circle"></i></div>
                        <h2>For Customers</h2>
                        <p>Access Karachi's healthcare marketplace. Browse, compare, and save items for later.</p>
                        <button className="btn btn-primary" style={{ width: '100%', marginTop: '20px' }} onClick={() => navigate('/buyer/dashboard')}>Start Browsing</button>
                    </div>
                </div>

                <div style={{ marginTop: '50px', display: 'flex', justifyContent: 'center' }}>
                    <button onClick={() => navigate('/admin/login')} style={{ background: 'none', border: '1px solid rgba(255,255,255,0.3)', color: 'rgba(255,255,255,0.6)', padding: '10px 20px', borderRadius: '8px', fontSize: '0.9rem' }}>
                        Partner/Admin Portal Login
                    </button>
                </div>

                <div className="landing-footer">
                    <p>© 2026 Medi-Ecom. Transforming Healthcare Access.</p>
                </div>
            </div>
        </div>
    );
};

export default Home;
