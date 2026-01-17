import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/adminforgotpass.css';

const AdminForgotPass = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');
  const [errors, setErrors] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors([]);
    setStatus('');

    if (!email) {
      setErrors(['Email is required.']);
      return;
    }

    // TODO: Replace with API call to send reset link
    setStatus('If this email exists in our system, a password reset link has been sent.');
  };

  return (
    <div className="admin-forgot-container">
      <div className="brand-logo">Medi-Ecom</div>

      <div className="forgot-wrapper">
        <div className="glass-box">
          <h4>Reset Password</h4>

          {status && <div className="alert alert-success">{status}</div>}
          {errors.length > 0 && (
            <div className="alert alert-danger">
              <ul className="mb-0">{errors.map((err, i) => <li key={i}>{err}</li>)}</ul>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                className="form-control"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="d-grid">
              <button type="submit" className="btn btn-register">Send Reset Link</button>
            </div>
          </form>

          <div className="login-link">
            <p>Remembered? <Link to="/admin/login">Login</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminForgotPass;
