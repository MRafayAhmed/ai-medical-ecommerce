import React from 'react';
import { Link } from 'react-router-dom';
import HomeLogoMark from './HomeLogoMark';
import '../styles/home.css';

/**
 * Full marketing footer from the public landing page (/).
 * On storefront pages wrap with `.buyer-shell-footer` (see BuyerFooter) for light theme overrides.
 */
function HomeLandingFooter({ id = 'site-footer' }) {
  return (
    <footer className="home-landing__footer-site" id={id}>
      <div className="home-landing__container home-landing__footer-site-main">
        <div className="home-landing__footer-col home-landing__footer-col--brand">
          <Link to="/" className="home-landing__footer-logo-lockup" aria-label="Medi-Ecom — home">
            <HomeLogoMark variant="footer" />
            <span className="home-landing__footer-logo-type">
              <span className="home-landing__footer-logo-type-strong">Medi</span>
              <span className="home-landing__footer-logo-type-rest">-Ecom</span>
            </span>
          </Link>
          <p className="home-landing__footer-about">
            Your AI-powered medical and healthcare platform. Connecting you to smart, safe, and reliable medication
            guidance and trusted suppliers — with clarity at every step.
          </p>
          <div className="home-landing__footer-social" aria-label="Social media">
            <a className="home-landing__footer-social-link" href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <i className="bi bi-facebook" aria-hidden="true" />
            </a>
            <a className="home-landing__footer-social-link" href="https://www.twitter.com" target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)">
              <i className="bi bi-twitter-x" aria-hidden="true" />
            </a>
            <a className="home-landing__footer-social-link" href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <i className="bi bi-instagram" aria-hidden="true" />
            </a>
            <a className="home-landing__footer-social-link" href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <i className="bi bi-linkedin" aria-hidden="true" />
            </a>
          </div>
        </div>

        <nav className="home-landing__footer-col" aria-labelledby="footer-quick-heading">
          <h2 id="footer-quick-heading" className="home-landing__footer-heading">
            Quick links
          </h2>
          <ul className="home-landing__footer-links">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/buyer/dashboard">All products</Link>
            </li>
            <li>
              <Link to="/buyer/orders">Track order</Link>
            </li>
            <li>
              <Link to="/buyer/wishlist">Wishlist</Link>
            </li>
          </ul>
        </nav>

        <nav className="home-landing__footer-col" aria-labelledby="footer-support-heading">
          <h2 id="footer-support-heading" className="home-landing__footer-heading">
            Support
          </h2>
          <ul className="home-landing__footer-links">
            <li>
              <Link to="/buyer/prescriptions">Upload prescription</Link>
            </li>
            <li>
              <Link to="/buyer/support">FAQs</Link>
            </li>
            <li>
              <Link to="/buyer/support">Shipping policy</Link>
            </li>
            <li>
              <Link to="/buyer/support">Returns &amp; refunds</Link>
            </li>
          </ul>
        </nav>

        <div className="home-landing__footer-col" aria-labelledby="footer-contact-heading">
          <h2 id="footer-contact-heading" className="home-landing__footer-heading">
            Contact us
          </h2>
          <ul className="home-landing__footer-contact">
            <li>
              <span className="home-landing__footer-contact-icon" aria-hidden="true">
                <i className="bi bi-geo-alt" />
              </span>
              <span>Health Avenue, Clifton — Karachi, Pakistan</span>
            </li>
            <li>
              <span className="home-landing__footer-contact-icon" aria-hidden="true">
                <i className="bi bi-telephone" />
              </span>
              <a href="tel:+923001234567">+92 300 1234567</a>
            </li>
            <li>
              <span className="home-landing__footer-contact-icon" aria-hidden="true">
                <i className="bi bi-envelope" />
              </span>
              <a href="mailto:support@mediecom.com">support@mediecom.com</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="home-landing__footer-site-bar">
        <div className="home-landing__container home-landing__footer-site-bar-inner">
          <p className="home-landing__footer-bar-copy">© {new Date().getFullYear()} Medi-Ecom. All rights reserved.</p>
          <div className="home-landing__footer-bar-legal">
            <Link to="/buyer/support">Privacy policy</Link>
            <span className="home-landing__footer-bar-dot" aria-hidden="true">
              ·
            </span>
            <Link to="/buyer/support">Terms of service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default HomeLandingFooter;
