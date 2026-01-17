import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);
    setSuccess('');

    // Frontend Validation
    const errs = [];
    if (!form.name) errs.push('Full Name is required.');
    if (!form.email) errs.push('Email is required.');
    if (!form.password) errs.push('Password is required.');
    if (form.password.length < 8) errs.push('Password must be at least 8 characters.');
    if (form.password !== form.password_confirmation) errs.push("Passwords don't match.");

    if (errs.length) {
      setErrors(errs);
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/seller/signup', {
        name: form.name,
        email: form.email,
        password: form.password
      });

      if (response.status === 201) {
        setSuccess('Registration successful! Redirecting to login...');
        setForm({ name: '', email: '', password: '', password_confirmation: '' });

        // Redirect after short delay
        setTimeout(() => {
          navigate('/admin/login');
        }, 2000);
      }
    } catch (err) {
      console.error('Registration error:', err);
      if (err.response && err.response.data.errors) {
        // Handle Laravel validation errors
        const serverErrors = Object.values(err.response.data.errors).flat();
        setErrors(serverErrors);
      } else if (err.response && err.response.data.message) {
        setErrors([err.response.data.message]);
      } else {
        setErrors(['Registration failed. Please try again.']);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-register-container">
      <div className="brand-logo">Medi-Ecom</div>

      <div className="register-container">
        <div className="glass-box">
          <h4>Seller Registration</h4>

          {success && <div className="alert alert-success">{success}</div>}

          {errors.length > 0 && (
            <div className="alert alert-danger">
              <ul className="mb-0">
                {errors.map((err, i) => <li key={i}>{err}</li>)}
              </ul>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label>Full Name</label>
              <input
                type="text"
                name="name"
                className="form-control"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
              />
            </div>

            <div className="mb-3">
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                className="form-control"
                value={form.email}
                onChange={handleChange}
                placeholder="name@example.com"
                required
              />
            </div>

            <div className="mb-3">
              <label>Password</label>
              <input
                type="password"
                name="password"
                className="form-control"
                value={form.password}
                onChange={handleChange}
                placeholder="Min 8 characters"
                required
              />
            </div>

            <div className="mb-3">
              <label>Confirm Password</label>
              <input
                type="password"
                name="password_confirmation"
                className="form-control"
                value={form.password_confirmation}
                onChange={handleChange}
                placeholder="Re-enter password"
                required
              />
            </div>

            <div className="d-grid">
              <button type="submit" className="btn btn-register" disabled={loading}>
                {loading ? 'Registering...' : 'Register'}
              </button>
            </div>
          </form>

          <div className="login-link">
            <p>Already have an account? <Link to="/admin/login">Login</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminRegister;

