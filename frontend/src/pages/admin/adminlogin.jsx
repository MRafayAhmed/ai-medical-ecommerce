import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import '../../styles/adminlogin.css';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error when user types
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Using the Seller Login endpoint as requested
      const response = await api.post('/seller/login', {
        email: formData.email,
        password: formData.password
      });

      if (response.status === 200) {
        const { token, user } = response.data;

        // Store token and user info
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));

        console.log('Login successful:', user);

        // Redirect to dashboard
        navigate('/admin/dashboard');
      }
    } catch (err) {
      console.error('Login error:', err);
      if (err.response) {
        // Server responded with non-2xx status
        setError(err.response.data.message || 'Invalid credentials');
      } else if (err.request) {
        // Request made but no response
        setError('No response from server. Please check your connection.');
      } else {
        // Other errors
        setError('An error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-container">
      {/* Background Animation */}
      <div className="background-animation">
        <div className="neural-network"></div>
        <div className="data-particles"></div>
      </div>

      {/* Header */}
      <header className="admin-header">
        <div className="brand-logo">
          <h1>Medi-Ecom</h1>
        </div>
      </header>

      {/* Login Form */}
      <div className="login-form-wrapper">
        <div className="login-form-container">
          <h2 className="login-title">Seller Login</h2>

          {error && <div className="error-message" style={{ color: 'red', marginBottom: '10px', textAlign: 'center' }}>{error}</div>}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
              />
            </div>

            <div className="form-options">
              <div className="remember-me">
                <input
                  type="checkbox"
                  id="rememberMe"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                />
                <label htmlFor="rememberMe">Remember Me</label>
              </div>
              <Link to="/admin/forgot-password" className="forgot-password">Forgot Password?</Link>
            </div>

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="register-link">
            <p>Don't have an account? <Link to="/admin/register">Register</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
