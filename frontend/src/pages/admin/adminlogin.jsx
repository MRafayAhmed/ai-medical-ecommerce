import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import api from '../../api/axios';
import adminLoginHero from '../../assets/images/adminlogin.jpg';
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
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/seller/login', {
        email: formData.email.trim(),
        password: formData.password
      });

      if (response.status === 200) {
        const { token, user } = response.data;

        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));

        navigate('/admin/dashboard');
      }
    } catch (err) {
      console.error('Login error:', err);
      if (err.response) {
        setError(err.response.data.message || 'Invalid credentials');
      } else if (err.request) {
        setError('No response from server. Please check your connection.');
      } else {
        setError('An error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-container">
      <div className="background-image">
        <img src={adminLoginHero} alt="" />
      </div>

      <header className="admin-login-header">
        <Link to="/" className="back-home-btn">
          ← Back to Home
        </Link>
      </header>

      <div className="login-form-wrapper">
        <div className="login-form-container">
          <h2 className="login-title">Staff login</h2>
          <p className="login-subtitle">Sign in to the Medi-Ecom admin portal</p>

          {error && (
            <div className="login-error-message" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your work email"
                autoComplete="email"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="password-input-container">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
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
                <label htmlFor="rememberMe">Remember me</label>
              </div>
              <Link to="/admin/forgot-password" className="forgot-password">
                Forgot password?
              </Link>
            </div>

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <div className="register-link">
            <p>
              Need an account?{' '}
              <Link to="/admin/setup/register">Create seller account</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
