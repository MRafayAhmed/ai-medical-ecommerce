import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../styles/buyerforgotpass.css';

const BuyerForgotPass = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: call API to send reset email
    console.log('Forgot password request for:', email);
    setSent(true);
    // optionally redirect after a moment
    setTimeout(() => navigate('/buyer/login'), 2500);
  };

  return (
    <div className="buyer-forgot-container">
      <div className="background-image">
        <img src="/src/assets/images/cus_login.PNG" alt="Background" />
      </div>

      <header className="buyer-header">
        <Link to="/" className="back-home-btn">← Back to Home</Link>
      </header>

      <div className="forgot-form-wrapper">
        <div className="forgot-form-container">
          <h2 className="forgot-title">Forgot your password?</h2>
          <p className="forgot-subtitle">Enter your account email and we'll send a reset link.</p>

          {!sent ? (
            <form onSubmit={handleSubmit} className="forgot-form">
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                />
              </div>

              <button type="submit" className="forgot-btn">Send Reset Link</button>
            </form>
          ) : (
            <div className="sent-note">A reset link has been sent — redirecting to login...</div>
          )}

          <div className="register-link">
            <p>Remembered? <Link to="/buyer/login">Sign in</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyerForgotPass;
