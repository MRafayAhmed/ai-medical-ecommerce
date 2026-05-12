import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { getDashboardBrands } from '../../data/brandLogos';
import '../../styles/buyerbrands.css';

export default function BuyerBrands() {
  const brands = getDashboardBrands();

  useEffect(() => {
    const raw = window.location.hash?.replace(/^#/, '');
    if (!raw) return;
    const id = decodeURIComponent(raw);
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, []);

  return (
    <div className="bbr-page">
      <header className="bbr-header">
        <Link to="/buyer/dashboard" className="bbr-back">
          ← Back to dashboard
        </Link>
        <h1 className="bbr-title">Brands</h1>
        <p className="bbr-sub">Partner and featured brands. Add or replace logos in <code>src/assets/images/brand/</code>.</p>
      </header>

      <div className="bbr-grid">
        {brands.map((b) => (
          <div key={b.id} id={b.slug} className="bbr-card">
            <img className="bbr-logo" src={b.url} alt={b.name} loading="lazy" />
            <span className="bbr-name">{b.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
