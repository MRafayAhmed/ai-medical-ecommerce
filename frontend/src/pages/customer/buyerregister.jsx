import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import '../../styles/buyerregister.css';

const BuyerRegister = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    gender: '',
    date_of_birth: '',
    email: '',
    phone_number: '',
    address: '',
    city: '',
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.post('/customer/register', {
        name: formData.name,
        gender: formData.gender,
        date_of_birth: formData.date_of_birth,
        email: formData.email,
        phone_number: formData.phone_number,
        address: formData.address,
        city: formData.city,
        username: formData.username,
        password: formData.password
      });

      // Redirect to login after successful registration
      navigate('/buyer/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please check your information.');
      console.error('Buyer Register error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-frame">
      <svg xmlns="http://www.w3.org/2000/svg" width="0" height="0" style={{ position: 'absolute', opacity: 0, pointerEvents: 'none' }}>
        <filter id="sharpen">
          <feConvolveMatrix order="3" kernelMatrix="0 -1 0 -1 5 -1 0 -1 0" divisor="1" />
        </filter>
      </svg>

      <div className="outer-card">
        <div className="left-visual" aria-hidden="true">
          <Link to="/buyer/login" className="back-home" aria-label="Back to login">
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" style={{ width: 16, height: 16 }}>
              <path d="M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12z" fill="currentColor"></path>
            </svg>
            <span>Back to login</span>
          </Link>

          <div className="art" aria-hidden="true">
            <img src="/src/assets/images/cus_login.PNG" alt="Artwork" className="login-art tuned" />
          </div>

          <Link to="/buyer/login" className="back-home-mobile" aria-label="Back to login">
            &larr; Login
          </Link>
        </div>

        <main className="glass" role="main" aria-labelledby="register-title">
          <h1 id="register-title">CREATE YOUR BUYER ACCOUNT</h1>
          
          {error && <div className="register-error-message" style={{ color: '#ff4d4d', marginBottom: '1rem', textAlign: 'center', fontSize: '14px' }}>{error}</div>}


          <div className="register-container">

            <form id="multiStepForm" onSubmit={handleSubmit}>



              {/* Personal & Contact Information */}
              <div>
                <div className="input-field"><label htmlFor="name">Full Name</label><input id="name" name="name" type="text" value={formData.name} onChange={handleChange} required /></div>
                <div className="input-field"><label htmlFor="gender">Gender</label>
                  <select id="gender" name="gender" value={formData.gender} onChange={handleChange} required>
                    <option value="" disabled hidden>Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="input-field"><label htmlFor="date_of_birth">Date of Birth</label><input id="date_of_birth" name="date_of_birth" type="date" value={formData.date_of_birth} onChange={handleChange} required /></div>

                <div className="input-field"><label htmlFor="email">Email Address</label><input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required /></div>
                <div className="input-field"><label htmlFor="phone_number">Phone Number</label><input id="phone_number" name="phone_number" type="tel" value={formData.phone_number} onChange={handleChange} required /></div>
                <div className="input-field"><label htmlFor="address">Residential Address</label><input id="address" name="address" type="text" value={formData.address} onChange={handleChange} /></div>
                <div className="input-field"><label htmlFor="city">City</label><input id="city" name="city" type="text" value={formData.city} onChange={handleChange} /></div>
                <div className="input-field"><label htmlFor="username">Username</label><input id="username" name="username" type="text" value={formData.username} onChange={handleChange} required /></div>
                <div className="input-field"><label htmlFor="password">Password</label><input id="password" name="password" type="password" value={formData.password} onChange={handleChange} required /></div>

              </div>

               <div className="btn-container">
                <button type="submit" className="btn" disabled={loading}>
                  {loading ? 'Creating Account...' : 'Submit'}
                </button>
              </div>


              <div style={{ textAlign: 'center', marginTop: 12, fontSize: 14, color: '#6b7780' }}>Already have an account? <Link to="/buyer/login" style={{ color: 'var(--accent-b)', fontWeight: 700 }}>Login</Link></div>

            </form>
          </div>

        </main>
      </div>
    </div>
  );
};

export default BuyerRegister;
