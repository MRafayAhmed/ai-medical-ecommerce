import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Shared storefront footer (buyer shell). Minimal legal row until full marketing footer is wired.
 */
const SiteFooter = () => (
  <footer
    style={{
      marginTop: 'auto',
      padding: '1rem clamp(1rem, 3vw, 2rem)',
      borderTop: '1px solid var(--color-border, #e2e8f0)',
      background: 'var(--color-bg-light, #f8fafc)',
      fontSize: '0.8125rem',
      color: 'var(--color-text-secondary, #64748b)',
      textAlign: 'center',
    }}
  >
    <p style={{ margin: 0 }}>
      © {new Date().getFullYear()} Medi-Ecom ·{' '}
      <Link to="/buyer/support" style={{ color: 'var(--color-primary-dark, #0f766e)', fontWeight: 600 }}>
        Support
      </Link>
    </p>
  </footer>
);

export default SiteFooter;
