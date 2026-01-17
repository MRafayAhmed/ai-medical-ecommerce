import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api/axios';
import '../../styles/customerauth.css';

const CustomerLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await api.post('/customer/login', { email, password });
            localStorage.setItem('customer_token', response.data.token);
            localStorage.setItem('customer_user', JSON.stringify(response.data.user));
            navigate('/customer/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please check credentials.');
        }
    };

    return (
        <div className="customer-auth-container">
            <div className="customer-auth-card">
                <h2>Customer Login</h2>
                {error && <div className="error-message">{error}</div>}
                <form onSubmit={handleLogin} className="auth-form">
                    <div className="form-group">
                        <input
                            type="email"
                            placeholder="Email Address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="auth-btn">Sign In</button>
                </form>
                <div className="auth-footer">
                    <p>Don't have an account? <Link to="/customer/register">Register here</Link></p>
                    <p><Link to="/">Back to Home</Link></p>
                </div>
            </div>
        </div>
    );
};

export default CustomerLogin;
