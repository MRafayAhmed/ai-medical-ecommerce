import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import api from '../../api/axios';
import adminLoginHero from '../../assets/images/adminlogin.jpg';
import '../../styles/adminlogin.css';
import '../../styles/adminregister.css';

const AdminRegister = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: ''
  });
  const [errors, setErrors] = useState([]);
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);
    setSuccess('');

    const errs = [];
    if (!form.name.trim()) errs.push('Full name is required.');
    if (!form.email.trim()) errs.push('Email is required.');
    if (!form.password) errs.push('Password is required.');
    if (form.password.length < 8) errs.push('Password must be at least 8 characters.');
    if (form.password !== form.password_confirmation) errs.push('Passwords do not match.');

    if (errs.length) {
      setErrors(errs);
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/seller/signup', {
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password
      });

      if (response.status === 201) {
        setSuccess('Registration successful. Redirecting to login…');
        setForm({ name: '', email: '', password: '', password_confirmation: '' });
        setTimeout(() => {
          navigate('/admin/login');
        }, 2000);
      }
    } catch (err) {
      console.error('Registration error:', err);
      if (err.response?.data?.errors) {
        setErrors(Object.values(err.response.data.errors).flat());
      } else if (err.response?.data?.message) {
        setErrors([err.response.data.message]);
      } else {
        setErrors(['Registration failed. Please try again.']);
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
          <h2 className="login-title">Create seller account</h2>
          <p className="login-subtitle">Register to access the Medi-Ecom admin portal</p>

          {success && (
            <div className="admin-register-success" role="status">
              {success}
            </div>
          )}

          {errors.length > 0 && (
            <div className="login-error-message admin-register-error-list" role="alert">
              <ul>
                {errors.map((msg, i) => (
                  <li key={i}>{msg}</li>
                ))}
              </ul>
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="admin-reg-name">Full name</label>
              <input
                id="admin-reg-name"
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                placeholder="Your name"
                autoComplete="name"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="admin-reg-email">Email</label>
              <input
                id="admin-reg-email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="name@example.com"
                autoComplete="email"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="admin-reg-password">Password</label>
              <div className="password-input-container">
                <input
                  id="admin-reg-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={handleChange}
                  placeholder="At least 8 characters"
                  autoComplete="new-password"
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

            <div className="form-group">
              <label htmlFor="admin-reg-password2">Confirm password</label>
              <div className="password-input-container">
                <input
                  id="admin-reg-password2"
                  name="password_confirmation"
                  type={showPassword2 ? 'text' : 'password'}
                  value={form.password_confirmation}
                  onChange={handleChange}
                  placeholder="Re-enter password"
                  autoComplete="new-password"
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword2(!showPassword2)}
                  aria-label={showPassword2 ? 'Hide confirm password' : 'Show confirm password'}
                >
                  {showPassword2 ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? 'Creating account…' : 'Create account'}
            </button>
          </form>

          <div className="register-link">
            <p>
              Already have an account? <Link to="/admin/login">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminRegister;
