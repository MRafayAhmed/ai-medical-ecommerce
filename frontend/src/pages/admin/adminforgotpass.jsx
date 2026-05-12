import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import adminLoginHero from '../../assets/images/adminlogin.jpg';
import '../../styles/adminlogin.css';
import '../../styles/adminregister.css';

const AdminForgotPass = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');
  const [errors, setErrors] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors([]);
    setStatus('');

    if (!email.trim()) {
      setErrors(['Email is required.']);
      return;
    }

    // TODO: Replace with API call to send reset link
    setStatus('If this email exists in our system, a password reset link has been sent.');
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
          <h2 className="login-title">Reset password</h2>
          <p className="login-subtitle">Enter your work email and we&apos;ll send reset instructions if an account exists.</p>

          {status && (
            <div className="admin-register-success" role="status">
              {status}
            </div>
          )}

          {errors.length > 0 && (
            <div className="login-error-message admin-register-error-list" role="alert">
              <ul>
                {errors.map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="forgot-email">Email</label>
              <input
                id="forgot-email"
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your work email"
                autoComplete="email"
                required
              />
            </div>

            <button type="submit" className="login-btn">
              Send reset link
            </button>
          </form>

          <div className="register-link">
            <p>
              Remembered your password? <Link to="/admin/login">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminForgotPass;
