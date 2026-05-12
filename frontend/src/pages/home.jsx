import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import HomeLogoMark from '../components/HomeLogoMark';
import HomeLandingFooter from '../components/HomeLandingFooter';
import '../styles/home.css';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-landing">
      <header className="home-landing__nav" role="banner">
        <div className="home-landing__nav-inner">
          <Link to="/" className="home-landing__brand" aria-label="Medi-Ecom — home">
            <HomeLogoMark />
            <div className="home-landing__brand-text">
              <span className="home-landing__brand-name">
                <span className="home-landing__brand-name-strong">Medi</span>
                <span className="home-landing__brand-name-rest">-Ecom</span>
              </span>
              <span className="home-landing__brand-tag">Healthcare marketplace</span>
            </div>
          </Link>
          <nav className="home-landing__nav-actions" aria-label="Account">
            <button type="button" className="home-landing__btn home-landing__btn--ghost" onClick={() => navigate('/buyer/login')}>
              Login
            </button>
            <button type="button" className="home-landing__btn home-landing__btn--solid" onClick={() => navigate('/buyer/register')}>
              Join now
            </button>
          </nav>
        </div>
      </header>

      <main className="home-landing__main">
        <section className="home-landing__hero" aria-labelledby="home-hero-heading">
          <div className="home-landing__hero-bg" aria-hidden="true" />
          <div className="home-landing__hero-overlay" aria-hidden="true" />
          <div className="home-landing__hero-inner">
            <p className="home-landing__eyebrow">Trusted access to medicines &amp; medical supplies</p>
            <h1 id="home-hero-heading" className="home-landing__title">
              Your health journey, organised and secure
            </h1>
            <p className="home-landing__lead">
              Browse verified listings, compare options, and manage prescriptions with clear guidance — built for
              families and professionals across Karachi and beyond.
            </p>
            <div className="home-landing__hero-cta">
              <button type="button" className="home-landing__btn home-landing__btn--primary home-landing__btn--lg" onClick={() => navigate('/buyer/dashboard')}>
                Browse marketplace
              </button>
              <button type="button" className="home-landing__btn home-landing__btn--outline home-landing__btn--lg" onClick={() => navigate('/buyer/register')}>
                Create an account
              </button>
            </div>
          </div>
        </section>

        <section className="home-landing__strip" aria-label="Highlights">
          <div className="home-landing__container home-landing__strip-inner">
            <div className="home-landing__stat">
              <strong className="home-landing__stat-value">24/7</strong>
              <span className="home-landing__stat-label">Self-service catalogue</span>
            </div>
            <div className="home-landing__stat">
              <strong className="home-landing__stat-value">Verified</strong>
              <span className="home-landing__stat-label">Supplier &amp; product records</span>
            </div>
            <div className="home-landing__stat">
              <strong className="home-landing__stat-value">Secure</strong>
              <span className="home-landing__stat-label">Checkout &amp; account access</span>
            </div>
            <div className="home-landing__stat">
              <strong className="home-landing__stat-value">Guided</strong>
              <span className="home-landing__stat-label">Prescription &amp; support workflows</span>
            </div>
          </div>
        </section>

        <section id="features" className="home-landing__section" aria-labelledby="features-heading">
          <div className="home-landing__container">
            <div className="home-landing__section-head">
              <h2 id="features-heading" className="home-landing__h2">
                Built for clarity and compliance
              </h2>
              <p className="home-landing__sub">
                Medi-Ecom combines a modern storefront with the careful handling expected in healthcare commerce.
              </p>
            </div>
            <ul className="home-landing__feature-grid">
              <li className="home-landing__feature-card">
                <span className="home-landing__feature-icon" aria-hidden="true">
                  <i className="bi bi-grid-1x2" />
                </span>
                <h3 className="home-landing__h3">Structured catalogue</h3>
                <p>Categories, filters, and consistent product information help you find what you need without guesswork.</p>
              </li>
              <li className="home-landing__feature-card">
                <span className="home-landing__feature-icon" aria-hidden="true">
                  <i className="bi bi-stars" />
                </span>
                <h3 className="home-landing__h3">AI-assisted discovery</h3>
                <p>Natural-language search and suggestions support informed choices alongside professional medical advice.</p>
              </li>
              <li className="home-landing__feature-card">
                <span className="home-landing__feature-icon" aria-hidden="true">
                  <i className="bi bi-file-earmark-medical" />
                </span>
                <h3 className="home-landing__h3">Prescription handling</h3>
                <p>Upload and track prescription-related orders where required, with clear status at every step.</p>
              </li>
              <li className="home-landing__feature-card">
                <span className="home-landing__feature-icon" aria-hidden="true">
                  <i className="bi bi-shield-lock" />
                </span>
                <h3 className="home-landing__h3">Privacy by design</h3>
                <p>Your account, orders, and health-related documents are treated with strict access controls.</p>
              </li>
            </ul>
          </div>
        </section>

        <section className="home-landing__section home-landing__section--muted" aria-labelledby="how-heading">
          <div className="home-landing__container">
            <div className="home-landing__section-head">
              <h2 id="how-heading" className="home-landing__h2">
                How it works
              </h2>
              <p className="home-landing__sub">Three straightforward steps from discovery to fulfilment.</p>
            </div>
            <ol className="home-landing__steps">
              <li className="home-landing__step">
                <span className="home-landing__step-num">1</span>
                <div>
                  <h3 className="home-landing__h3">Explore the marketplace</h3>
                  <p>Search or browse categories, save items to your wishlist, and review pricing before you commit.</p>
                </div>
              </li>
              <li className="home-landing__step">
                <span className="home-landing__step-num">2</span>
                <div>
                  <h3 className="home-landing__h3">Complete checkout</h3>
                  <p>Add items to your cart, confirm delivery details, and pay through our secure checkout flow.</p>
                </div>
              </li>
              <li className="home-landing__step">
                <span className="home-landing__step-num">3</span>
                <div>
                  <h3 className="home-landing__h3">Track and support</h3>
                  <p>Monitor orders from your dashboard, upload prescriptions when prompted, and reach support if you need help.</p>
                </div>
              </li>
            </ol>
          </div>
        </section>

        <section className="home-landing__section" aria-labelledby="customers-heading">
          <div className="home-landing__container home-landing__split">
            <div className="home-landing__role-card">
              <div className="home-landing__role-icon" aria-hidden="true">
                <i className="bi bi-person-badge" />
              </div>
              <h2 id="customers-heading" className="home-landing__h2 home-landing__h2--left">
                For customers
              </h2>
              <p className="home-landing__role-text">
                Create a free account to unlock the full marketplace, wishlist, cart, order history, and prescription tools
                aligned with local regulations.
              </p>
              <button type="button" className="home-landing__btn home-landing__btn--primary home-landing__btn--block" onClick={() => navigate('/buyer/dashboard')}>
                Start browsing
              </button>
            </div>
            <aside className="home-landing__aside">
              <h3 className="home-landing__h3">Clinical notice</h3>
              <p>
                Medi-Ecom provides a commerce platform only. It does not replace diagnosis or treatment by a qualified clinician.
                Prescription-only medicines require a valid prescription where applicable by law. Always read labels and patient
                information leaflets.
              </p>
              <h3 className="home-landing__h3 home-landing__h3--spaced">Operations</h3>
              <p>
                Typical fulfilment and cut-off times are shown at checkout. For wholesale, integration, or administrative access,
                use the partner portal.
              </p>
              <button type="button" className="home-landing__btn home-landing__btn--outline-dark home-landing__btn--block home-landing__btn--mt" onClick={() => navigate('/admin/login')}>
                Partner / admin portal login
              </button>
            </aside>
          </div>
        </section>
      </main>

      <HomeLandingFooter />
    </div>
  );
};

export default Home;
