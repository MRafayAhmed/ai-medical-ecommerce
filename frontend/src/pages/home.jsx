import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/home.css';

const Home = () => {
    const navigate = useNavigate();

    return (
        <div className="landing-page">
            <div className="landing-overlay"></div>

            <nav className="landing-nav">
                <div className="nav-logo">Medi-Ecom</div>
                <div className="nav-auth">
                    <div className="nav-dropdown">
                        <button className="nav-btn-outline">Register <i className="bi bi-chevron-down"></i></button>
                        <div className="dropdown-menu">
                            <button onClick={() => navigate('/customer/register')}>As Customer</button>
                            <button onClick={() => navigate('/admin/register')}>As Seller</button>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="landing-content">
                <div className="landing-header">
                    <h1>Medi-Ecom</h1>
                    <p>Your Trusted Digital Pharmacy Platform</p>
                </div>

                <div className="role-cards">
                    <div className="role-card customer-card">
                        <div className="card-icon"><i className="bi bi-person-circle"></i></div>
                        <h2>Customer Portal</h2>
                        <p>Purchase medicines and manage your health.</p>
                        <div className="card-actions">
                            <button className="btn btn-primary" onClick={() => navigate('/customer/login')}>Customer Login</button>
                        </div>
                    </div>

                    <div className="role-card admin-card">
                        <div className="card-icon"><i className="bi bi-shield-lock-fill"></i></div>
                        <h2>Admin / Seller</h2>
                        <p>Manage inventory and business operations.</p>
                        <div className="card-actions">
                            <button className="btn btn-secondary" onClick={() => navigate('/admin/login')}>Seller/Admin Login</button>
                        </div>
                    </div>
                </div>

                <div className="landing-footer">
                    <p>© 2026 Medi-Ecom. Transforming Healthcare Access.</p>
                </div>
            </div>
        </div>
    );
};

export default Home;
