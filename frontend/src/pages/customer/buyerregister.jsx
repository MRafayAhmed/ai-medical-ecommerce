import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../styles/buyerregister.css';

const BuyerRegister = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    full_name: '',
    gender: '',
    dob: '',
    email: '',
    phone: '',
    address: '',
    city: ''
  });

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setFormData(prev => ({ ...prev, [name]: files && files[0] }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };



  const handleSubmit = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    // TODO: replace with actual API call
    console.log('Register data:', formData);
    // Redirect to login after "register"
    navigate('/buyer/login');
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
          

          <div className="register-container">

            <form id="multiStepForm" onSubmit={handleSubmit}>



              {/* Personal & Contact Information */}
              <div>
                <div className="input-field"><label htmlFor="full_name">Full Name</label><input id="full_name" name="full_name" type="text" value={formData.full_name} onChange={handleChange} required /></div>
                <div className="input-field"><label htmlFor="gender">Gender</label>
                  <select id="gender" name="gender" value={formData.gender} onChange={handleChange} required>
                    <option value="" disabled hidden>Select Gender</option>
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </div>
                <div className="input-field"><label htmlFor="dob">Date of Birth</label><input id="dob" name="dob" type="date" value={formData.dob} onChange={handleChange} required /></div>

                <div className="input-field"><label htmlFor="email">Email Address</label><input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required /></div>
                <div className="input-field"><label htmlFor="phone">Phone Number</label><input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} required /></div>
                <div className="input-field"><label htmlFor="address">Residential Address</label><input id="address" name="address" type="text" value={formData.address} onChange={handleChange} /></div>
                <div className="input-field"><label htmlFor="city">City</label><input id="city" name="city" type="text" value={formData.city} onChange={handleChange} /></div>

              </div>

              <div className="btn-container">
                <button type="submit" className="btn">Submit</button>
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
