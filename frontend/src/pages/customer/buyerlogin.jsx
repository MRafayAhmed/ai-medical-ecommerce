import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import '../../styles/buyerlogin.css';

const BuyerLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const [showPassword, setShowPassword] = useState(false);

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
    console.log('Buyer Login attempt:', formData);
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

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
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

            <button type="submit" className="login-btn">
              Sign In
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