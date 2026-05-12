import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import buyerForgotHero from '../../assets/images/main.webp';
import '../../styles/buyerlogin.css';
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
    setTimeout(() => navigate('/buyer/login'), 2500);
  };

  return (
    <div className="buyer-login-container">
      <div className="background-image">
        <img src={buyerForgotHero} alt="" />
      </div>

      <header className="buyer-header">
        <Link to="/" className="back-home-btn">
          ← Back to Home
        </Link>
      </header>

      <div className="login-form-wrapper">
        <div className="login-form-container">
          <h2 className="login-title">Reset password</h2>
          <p className="login-subtitle">
            Enter your email or username. If an account exists, we&apos;ll send reset instructions.
          </p>

          {sent ? (
            <div className="buyer-forgot-sent" role="status">
              If this email is registered, check your inbox — redirecting to sign in…
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-group">
                <label htmlFor="buyer-forgot-email">Email or username</label>
                <input
                  id="buyer-forgot-email"
                  name="email"
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address or username"
                  autoComplete="username"
                  required
                />
              </div>

              <button type="submit" className="login-btn">
                Send reset link
              </button>
            </form>
          )}

          <div className="register-link">
            <p>
              Remembered your password? <Link to="/buyer/login">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyerForgotPass;
