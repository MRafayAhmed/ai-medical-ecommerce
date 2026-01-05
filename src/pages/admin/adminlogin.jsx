import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/adminlogin.css';

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login logic here
    console.log('Login attempt:', formData);
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
          <h2 className="login-title">Admin Login</h2>
          
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

            <button type="submit" className="login-btn">
              Login
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