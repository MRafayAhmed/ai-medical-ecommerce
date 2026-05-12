import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import api from '../../api/axios';
import '../../styles/buyerlogin.css';

/** Normalize axios `response.data` (object, JSON string, or accidental HTML). */
function parseLoginPayload(raw) {
  if (raw == null) return {};
  if (typeof raw === 'string') {
    const t = raw.trim();
    if (t.startsWith('<') || t.startsWith('<!')) return { __nonJson: 'html' };
    try {
      const parsed = JSON.parse(t);
      return typeof parsed === 'object' && parsed !== null ? parsed : {};
    } catch {
      return {};
    }
  }
  return typeof raw === 'object' ? raw : {};
}

function extractLoginToken(payload) {
  if (!payload || typeof payload !== 'object') return null;
  const nested = payload.data && typeof payload.data === 'object' ? payload.data : null;
  return (
    (typeof payload.token === 'string' && payload.token) ||
    (typeof payload.access_token === 'string' && payload.access_token) ||
    (typeof payload.plainTextToken === 'string' && payload.plainTextToken) ||
    (nested && typeof nested.token === 'string' && nested.token) ||
    (nested && typeof nested.access_token === 'string' && nested.access_token) ||
    null
  );
}

function extractLoginUser(payload) {
  if (!payload || typeof payload !== 'object') return {};
  const nested = payload.data && typeof payload.data === 'object' ? payload.data : null;
  return payload.user ?? nested?.user ?? {};
}

const BuyerLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/customer/login', {
        email: formData.email.trim(),
        password: formData.password
      });

      const payload = parseLoginPayload(response.data);
      const token = extractLoginToken(payload);
      const user = extractLoginUser(payload);

      if (token) {
        localStorage.setItem('customer_token', token);
        localStorage.setItem('customer_user', JSON.stringify(user));
        navigate('/buyer/dashboard');
      } else if (payload.__nonJson === 'html') {
        setError(
          'The server returned a web page instead of JSON. Check that the API URL is http://127.0.0.1:8000/api and the POST path is /customer/login.'
        );
      } else {
        setError(
          payload.message ||
            'Login returned 200 but no token in the response. In DevTools → Network, open the POST customer/login row and confirm the JSON body includes "token".'
        );
      }
    } catch (err) {
      const msg = err.response?.data?.message
        || err.response?.data?.error
        || err.message
        || 'Login failed. Please check your credentials.';
      setError(msg);
      console.error('Buyer Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="buyer-login-container">
      {/* Background Image */}
      <div className="background-image">
        <img src="/src/assets/images/cus_login.PNG" alt="Customer Login Background" />
      </div>

      {/* Header */}
      <header className="buyer-header">
        <Link to="/" className="back-home-btn">
          ← Back to Home
        </Link>
      </header>

      {/* Login Form */}
      <div className="login-form-wrapper">
        <div className="login-form-container">
          <h2 className="login-title">Welcome Back</h2>
          <p className="login-subtitle">Sign in to your account</p>

          {error && <div className="login-error-message" role="alert">{error}</div>}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="email">Email or username</label>
              <input
                type="text"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email address or username"
                autoComplete="username"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="password-input-container">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
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
                <label htmlFor="rememberMe">Remember Me</label>
              </div>
              <Link to="/buyer/forgot-password" className="forgot-password">Forgot Password?</Link>
            </div>

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div className="register-link">
            <p>Don't have an account? <Link to="/buyer/register">Create Account</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyerLogin;