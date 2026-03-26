import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import '../styles/buyermainpage.css';

const BuyerFooter = () => {
    return (
        <footer style={{
            background: '#ffffff',
            borderTop: '1px solid rgba(2, 6, 23, 0.06)',
            padding: '60px 20px 30px',
            color: '#334155',
            fontFamily: 'Inter, sans-serif'
        }}>
            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '40px',
                marginBottom: '40px'
            }}>
                {/* Brand Section */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <Link to="/buyer/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
                        <img 
                            src="/src/assets/images/farama_logo.png" 
                            alt="FaRaMa Health Logo" 
                            style={{ height: '40px', width: 'auto' }}
                        />
                        <span style={{ 
                            fontSize: '1.5rem', 
                            fontWeight: 900, 
                            background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            letterSpacing: '-0.5px'
                        }}>
                            FaRaMa Health
                        </span>
                    </Link>
                    <p style={{ lineHeight: '1.6', color: '#64748b', fontSize: '0.95rem' }}>
                        Your AI-powered medical and healthcare platform. Connecting you to smart, safe, and reliable medication recommendations effortlessly.
                    </p>
                    <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
                        <a href="#" style={{ color: '#94a3b8', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-primary)'} onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}><Facebook size={20} /></a>
                        <a href="#" style={{ color: '#94a3b8', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-primary)'} onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}><Twitter size={20} /></a>
                        <a href="#" style={{ color: '#94a3b8', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-primary)'} onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}><Instagram size={20} /></a>
                        <a href="#" style={{ color: '#94a3b8', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-primary)'} onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}><Linkedin size={20} /></a>
                    </div>
                </div>

                {/* Quick Links */}
                <div>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', marginBottom: '20px' }}>Quick Links</h4>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <li><Link to="/buyer/dashboard" style={{ color: '#64748b', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-primary)'} onMouseLeave={(e) => e.currentTarget.style.color = '#64748b'}>Home</Link></li>
                        <li><Link to="/products/featured" style={{ color: '#64748b', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-primary)'} onMouseLeave={(e) => e.currentTarget.style.color = '#64748b'}>All Products</Link></li>
                        <li><Link to="/buyer/orders" style={{ color: '#64748b', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-primary)'} onMouseLeave={(e) => e.currentTarget.style.color = '#64748b'}>Track Order</Link></li>
                        <li><Link to="/buyer/wishlist" style={{ color: '#64748b', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-primary)'} onMouseLeave={(e) => e.currentTarget.style.color = '#64748b'}>Wishlist</Link></li>
                    </ul>
                </div>

                {/* Categories Support */}
                <div>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', marginBottom: '20px' }}>Support</h4>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <li><Link to="/buyer/prescriptions" style={{ color: '#64748b', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-primary)'} onMouseLeave={(e) => e.currentTarget.style.color = '#64748b'}>Upload Prescription</Link></li>
                        <li><span style={{ color: '#64748b', cursor: 'pointer', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-primary)'} onMouseLeave={(e) => e.currentTarget.style.color = '#64748b'}>FAQs</span></li>
                        <li><span style={{ color: '#64748b', cursor: 'pointer', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-primary)'} onMouseLeave={(e) => e.currentTarget.style.color = '#64748b'}>Shipping Policy</span></li>
                        <li><span style={{ color: '#64748b', cursor: 'pointer', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-primary)'} onMouseLeave={(e) => e.currentTarget.style.color = '#64748b'}>Returns & Refunds</span></li>
                    </ul>
                </div>

                {/* Contact Us */}
                <div>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', marginBottom: '20px' }}>Contact Us</h4>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <li style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', color: '#64748b' }}>
                            <MapPin size={20} color="var(--color-primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                            <span style={{ fontSize: '0.95rem', lineHeight: '1.5' }}>123 Health Avenue,<br/>Karachi, Pakistan</span>
                        </li>
                        <li style={{ display: 'flex', gap: '12px', alignItems: 'center', color: '#64748b' }}>
                            <Phone size={20} color="var(--color-primary)" style={{ flexShrink: 0 }} />
                            <span style={{ fontSize: '0.95rem' }}>+92 300 1234567</span>
                        </li>
                        <li style={{ display: 'flex', gap: '12px', alignItems: 'center', color: '#64748b' }}>
                            <Mail size={20} color="var(--color-primary)" style={{ flexShrink: 0 }} />
                            <span style={{ fontSize: '0.95rem' }}>support@faramahealth.com</span>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Copyright */}
            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                paddingTop: '24px',
                borderTop: '1px solid rgba(2, 6, 23, 0.06)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '16px'
            }}>
                <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.9rem' }}>
                    &copy; {new Date().getFullYear()} FaRaMa Health. All rights reserved.
                </p>
                <div style={{ display: 'flex', gap: '24px', fontSize: '0.9rem' }}>
                    <span style={{ color: '#94a3b8', cursor: 'pointer', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-primary)'} onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}>Privacy Policy</span>
                    <span style={{ color: '#94a3b8', cursor: 'pointer', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-primary)'} onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}>Terms of Service</span>
                </div>
            </div>
        </footer>
    );
};

export default BuyerFooter;
