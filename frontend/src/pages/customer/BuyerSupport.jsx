import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ChevronRight,
  Headphones,
  Mail,
  Phone,
  MapPin,
  Send,
  Loader2,
  ChevronDown,
  X,
  MessageCircle,
} from 'lucide-react';
import '../../styles/customerhome.css';
import '../../styles/buyermainpage.css';
import '../../styles/buyersupport.css';
import BuyerNavbar from '../../components/BuyerNavbar';
import BuyerFooter from '../../components/BuyerFooter';

const SUPPORT_EMAIL = 'support@faramahealth.com';
const SUPPORT_PHONE = '+92 300 1234567';
const SUPPORT_ADDRESS = '123 Health Avenue, Karachi, Pakistan';

const FAQS = [
  {
    q: 'How do I track my order?',
    a: 'Open My orders from your profile or the quick actions on the dashboard. You will see status updates as your order is prepared and dispatched.',
  },
  {
    q: 'How does prescription upload work?',
    a: 'Use Upload prescription to add a clear photo of your Rx. Our assistant suggests matching products; always confirm dosage and suitability with your pharmacist.',
  },
  {
    q: 'What if an item is out of stock?',
    a: 'You can explore alternatives from product pages or wishlist similar items. Cart quantities are limited to available stock.',
  },
  {
    q: 'How do I get help with my account?',
    a: 'Use the form on this page or email us with the address you registered with. We never ask for your password by email.',
  },
];

const BuyerSupport = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [topic, setTopic] = useState('orders');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [banner, setBanner] = useState(null);
  const [openFaq, setOpenFaq] = useState(0);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('customer_user');
      if (!raw) return;
      const u = JSON.parse(raw);
      if (u?.name) setName(String(u.name));
      if (u?.email) setEmail(String(u.email));
    } catch {
      /* ignore */
    }
  }, []);

  const mailtoHref = useMemo(() => {
    const sub = encodeURIComponent(`[${topic}] Support request`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}\n`
    );
    return `mailto:${SUPPORT_EMAIL}?subject=${sub}&body=${body}`;
  }, [topic, name, email, message]);

  const validate = useCallback(() => {
    const next = {};
    if (!String(name).trim()) next.name = 'Please enter your name.';
    const em = String(email).trim();
    if (!em) next.email = 'Please enter your email.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) next.email = 'Enter a valid email address.';
    if (!String(message).trim()) next.message = 'Please describe how we can help.';
    else if (String(message).trim().length < 12) next.message = 'A bit more detail helps us respond faster.';
    setErrors(next);
    return Object.keys(next).length === 0;
  }, [name, email, message]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    setBanner(null);
    window.setTimeout(() => {
      setSubmitting(false);
      setBanner({
        type: 'success',
        text: 'Thanks — your message is ready to send. We opened your email app; send the draft to reach our team. We typically reply within one business day.',
      });
      setMessage('');
      setErrors({});
    }, 450);
  };

  const openMailClient = () => {
    if (!validate()) return;
    window.location.href = mailtoHref;
  };

  return (
    <div className="bm-page bs-page">
      <BuyerNavbar
        onSearch={(q) => {
          navigate(`/buyer/dashboard?q=${encodeURIComponent(q)}`);
        }}
      />

      <main className="bs-main" id="bs-main">
        <div className="bs-container">
          <nav className="bs-breadcrumb" aria-label="Breadcrumb">
            <Link to="/buyer/dashboard" className="bs-breadcrumb__link">
              Buyer home
            </Link>
            <ChevronRight className="bs-breadcrumb__sep" aria-hidden size={14} />
            <span className="bs-breadcrumb__current">Support</span>
          </nav>

          <header className="bs-hero">
            <p className="bs-eyebrow">
              <Headphones size={16} aria-hidden />
              We are here to help
            </p>
            <h1 className="bs-hero__title">Customer support</h1>
            <p className="bs-hero__lead">
              Questions about orders, prescriptions, or your account? Reach us by phone or email, or send a message
              below. Include your order number when possible so we can assist faster.
            </p>
          </header>

          {banner && (
            <div className={`bs-banner ${banner.type === 'error' ? 'bs-banner--error' : ''}`} role={banner.type === 'error' ? 'alert' : 'status'}>
              <span>{banner.text}</span>
              <button type="button" className="bs-banner__dismiss" onClick={() => setBanner(null)} aria-label="Dismiss">
                <X size={18} />
              </button>
            </div>
          )}

          <div className="bs-grid">
            <a className="bs-card" href={`tel:${SUPPORT_PHONE.replace(/\s/g, '')}`}>
              <div className="bs-card__icon" aria-hidden>
                <Phone size={22} />
              </div>
              <p className="bs-card__label">Call us</p>
              <p className="bs-card__value">{SUPPORT_PHONE}</p>
              <p className="bs-card__hint">Mon–Sat · 9:00 am – 6:00 pm (PKT)</p>
            </a>
            <a className="bs-card" href={`mailto:${SUPPORT_EMAIL}`}>
              <div className="bs-card__icon" aria-hidden>
                <Mail size={22} />
              </div>
              <p className="bs-card__label">Email</p>
              <p className="bs-card__value">{SUPPORT_EMAIL}</p>
              <p className="bs-card__hint">We respond within 24 hours on business days</p>
            </a>
            <div className="bs-card" style={{ cursor: 'default' }}>
              <div className="bs-card__icon" aria-hidden>
                <MapPin size={22} />
              </div>
              <p className="bs-card__label">Visit</p>
              <p className="bs-card__value">{SUPPORT_ADDRESS}</p>
              <p className="bs-card__hint">Service desk for pickups &amp; returns by appointment</p>
            </div>
          </div>

          <div className="bs-split">
            <div className="bs-panel">
              <h2 className="bs-panel__title">Frequently asked questions</h2>
              <p className="bs-panel__intro">Quick answers to common questions. Still stuck? Use the form on the right.</p>
              <ul className="bs-faq">
                {FAQS.map((item, idx) => {
                  const open = openFaq === idx;
                  return (
                    <li key={item.q} className="bs-faq__item" data-open={open}>
                      <button
                        type="button"
                        className="bs-faq__trigger"
                        aria-expanded={open}
                        id={`bs-faq-${idx}`}
                        aria-controls={`bs-faq-panel-${idx}`}
                        onClick={() => setOpenFaq(open ? -1 : idx)}
                      >
                        {item.q}
                        <ChevronDown className="bs-faq__chev" size={20} aria-hidden />
                      </button>
                      {open && (
                        <div className="bs-faq__panel" id={`bs-faq-panel-${idx}`} role="region" aria-labelledby={`bs-faq-${idx}`}>
                          {item.a}
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
              <p className="bs-note bs-inline-links">
                <Link to="/buyer/orders">View your orders</Link>
                {' · '}
                <Link to="/buyer/prescriptions">Prescription help</Link>
              </p>
            </div>

            <div className="bs-panel">
              <h2 className="bs-panel__title-row">
                <MessageCircle size={20} aria-hidden />
                Send a message
              </h2>
              <p className="bs-panel__intro">
                Tell us what you need. After you submit, you can send the same text through your email app in one tap.
              </p>
              <form className="bs-form" onSubmit={handleSubmit} noValidate>
                <div className="bs-field">
                  <label className="bs-label" htmlFor="bs-name">
                    Name
                  </label>
                  <input
                    id="bs-name"
                    className={`bs-input ${errors.name ? 'bs-input--error' : ''}`}
                    value={name}
                    onChange={(ev) => setName(ev.target.value)}
                    autoComplete="name"
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? 'bs-name-err' : undefined}
                  />
                  {errors.name && (
                    <p className="bs-field__error" id="bs-name-err">
                      {errors.name}
                    </p>
                  )}
                </div>
                <div className="bs-field">
                  <label className="bs-label" htmlFor="bs-email">
                    Email
                  </label>
                  <input
                    id="bs-email"
                    type="email"
                    className={`bs-input ${errors.email ? 'bs-input--error' : ''}`}
                    value={email}
                    onChange={(ev) => setEmail(ev.target.value)}
                    autoComplete="email"
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? 'bs-email-err' : undefined}
                  />
                  {errors.email && (
                    <p className="bs-field__error" id="bs-email-err">
                      {errors.email}
                    </p>
                  )}
                </div>
                <div className="bs-field">
                  <label className="bs-label" htmlFor="bs-topic">
                    Topic
                  </label>
                  <select
                    id="bs-topic"
                    className="bs-select"
                    value={topic}
                    onChange={(ev) => setTopic(ev.target.value)}
                  >
                    <option value="orders">Orders &amp; delivery</option>
                    <option value="prescription">Prescription / Rx</option>
                    <option value="account">Account &amp; login</option>
                    <option value="payment">Payment &amp; checkout</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="bs-field">
                  <label className="bs-label" htmlFor="bs-message">
                    Message
                  </label>
                  <textarea
                    id="bs-message"
                    className={`bs-textarea ${errors.message ? 'bs-textarea--error' : ''}`}
                    value={message}
                    onChange={(ev) => setMessage(ev.target.value)}
                    placeholder="Describe your question or issue…"
                    aria-invalid={!!errors.message}
                    aria-describedby={errors.message ? 'bs-message-err' : undefined}
                  />
                  {errors.message && (
                    <p className="bs-field__error" id="bs-message-err">
                      {errors.message}
                    </p>
                  )}
                </div>
                <div className="bs-actions">
                  <button type="submit" className="bs-submit" disabled={submitting}>
                    {submitting ? (
                      <>
                        <Loader2 className="bs-spin" size={20} aria-hidden />
                        Sending…
                      </>
                    ) : (
                      <>
                        <Send size={18} aria-hidden />
                        Prepare message
                      </>
                    )}
                  </button>
                  <button type="button" className="bs-submit bs-submit--neutral" onClick={openMailClient}>
                    Open in email app
                  </button>
                </div>
                <p className="bs-note">
                  This storefront does not store support tickets yet. “Prepare message” confirms your details; use “Open
                  in email app” to send via your own mail client.
                </p>
              </form>
            </div>
          </div>
        </div>
      </main>

      <BuyerFooter />
    </div>
  );
};

export default BuyerSupport;
