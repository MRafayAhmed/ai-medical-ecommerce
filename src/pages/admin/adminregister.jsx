import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/adminregister.css';

const AdminRegister = () => {
  const [form, setForm] = useState({
    full_name: '',
    username: '',
    email: '',
    phone: '',
    password: '',
    password_confirmation: '',
    role: '',
    department: '',
    location: ''
  });

  const [errors, setErrors] = useState([]);
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Basic client-side validation (mirror server-side rules lightly)
    const errs = [];
    if (!form.full_name) errs.push('Full Name is required.');
    if (!form.username) errs.push('Username is required.');
    if (!form.email) errs.push('Email is required.');
    if (!form.password) errs.push('Password is required.');
    if (form.password !== form.password_confirmation) errs.push("Passwords don't match.");

    if (errs.length) {
      setErrors(errs);
      setSuccess('');
      return;
    }

    // Replace this with real API call
    console.log('Register submitted', form);
    setErrors([]);
    setSuccess('Registration submitted (demo). Implement API integration to complete.');
  };

  return (
    <div className="admin-register-container">
      <div className="brand-logo">Medi-Ecom</div>

      <div className="register-container">
        <div className="glass-box">
          <h4>Admin Registration</h4>

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
              <input type="text" name="full_name" className="form-control" value={form.full_name} onChange={handleChange} required />
            </div>

            <div className="mb-3">
              <label>Username</label>
              <input type="text" name="username" className="form-control" value={form.username} onChange={handleChange} required />
            </div>

            <div className="mb-3">
              <label>Email Address</label>
              <input type="email" name="email" className="form-control" value={form.email} onChange={handleChange} required />
            </div>

            <div className="mb-3">
              <label>Phone Number (Optional)</label>
              <input type="text" name="phone" className="form-control" value={form.phone} onChange={handleChange} />
            </div>

            <div className="mb-3">
              <label>Password</label>
              <input type="password" name="password" className="form-control" value={form.password} onChange={handleChange} required />
            </div>

            <div className="mb-3">
              <label>Confirm Password</label>
              <input type="password" name="password_confirmation" className="form-control" value={form.password_confirmation} onChange={handleChange} required />
            </div>

            <div className="mb-3">
              <label>Admin Role / Level</label>
              <select name="role" className="form-control" value={form.role} onChange={handleChange} required>
                <option value="">Select Role</option>
                <option value="Super Admin">Super Admin</option>
                <option value="Moderator">Moderator</option>
                <option value="Content Admin">Content Admin</option>
                <option value="Support Admin">Support Admin</option>
              </select>
            </div>

            <div className="mb-3">
              <label>Department / Team</label>
              <input type="text" name="department" className="form-control" value={form.department} onChange={handleChange} />
            </div>

            <div className="mb-3">
              <label>Branch / Location</label>
              <input type="text" name="location" className="form-control" value={form.location} onChange={handleChange} />
            </div>

            <div className="d-grid">
              <button type="submit" className="btn btn-register">Register</button>
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
