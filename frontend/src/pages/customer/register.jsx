import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api/axios';
import '../../styles/customerauth.css';

const CustomerRegister = () => {
    const [form, setForm] = useState({
        name: '',
        username: '',
        email: '',
        password: '',
        phone_number: '',
        gender: 'Male',
        date_of_birth: '',
        address: '',
        city: '',
        cnic: '',
        postal_code: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        try {
            // Basic validation for username
            if (!form.username) {
                setError('Username is required');
                return;
            }
            await api.post('/customer/register', form);
            alert('Registration successful! Please login.');
            navigate('/customer/login');
        } catch (err) {
            setError(err.response?.data?.message || err.response?.data?.error || 'Registration failed.');
            console.error(err);
        }
    };

    return (
        <div className="customer-auth-container">
            <div className="customer-auth-card" style={{ maxWidth: '500px' }}>
                <h2>Create Account</h2>
                {error && <div className="error-message">{error}</div>}
                <form onSubmit={handleRegister} className="auth-form">
                    <div className="form-row" style={{ display: 'flex', gap: '10px' }}>
                        <div className="form-group" style={{ flex: 1 }}>
                            <input name="name" placeholder="Full Name" value={form.name} onChange={handleChange} required />
                        </div>
                        <div className="form-group" style={{ flex: 1 }}>
                            <input name="username" placeholder="Username" value={form.username} onChange={handleChange} required />
                        </div>
                    </div>

                    <div className="form-group">
                        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
                    </div>

                    <div className="form-group">
                        <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required />
                    </div>

                    <div className="form-row" style={{ display: 'flex', gap: '10px' }}>
                        <div className="form-group" style={{ flex: 1 }}>
                            <input name="phone_number" placeholder="Phone Number" value={form.phone_number} onChange={handleChange} />
                        </div>
                        <div className="form-group" style={{ flex: 1 }}>
                            <input name="cnic" placeholder="CNIC" value={form.cnic} onChange={handleChange} />
                        </div>
                    </div>

                    <div className="form-row" style={{ display: 'flex', gap: '10px' }}>
                        <div className="form-group" style={{ flex: 1 }}>
                            <input name="date_of_birth" type="date" value={form.date_of_birth} onChange={handleChange} />
                        </div>
                        <div className="form-group" style={{ flex: 1 }}>
                            <select name="gender" value={form.gender} onChange={handleChange} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }}>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-row" style={{ display: 'flex', gap: '10px' }}>
                        <div className="form-group" style={{ flex: 1 }}>
                            <input name="city" placeholder="City" value={form.city} onChange={handleChange} />
                        </div>
                        <div className="form-group" style={{ flex: 1 }}>
                            <input name="postal_code" placeholder="Postal Code" value={form.postal_code} onChange={handleChange} />
                        </div>
                    </div>

                    <div className="form-group">
                        <input name="address" placeholder="Address" value={form.address} onChange={handleChange} />
                    </div>

                    <button type="submit" className="auth-btn">Register</button>
                </form>
                <div className="auth-footer">
                    <p>Already have an account? <Link to="/customer/login">Login here</Link></p>
                </div>
            </div>
        </div>
    );
};

export default CustomerRegister;
