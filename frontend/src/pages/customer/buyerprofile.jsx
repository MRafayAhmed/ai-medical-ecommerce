import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User,
  LogOut,
  Package,
  MapPin,
  ArrowLeft,
  ChevronRight,
  Shield,
  Heart,
  ShoppingCart,
  UploadCloud,
  Headphones,
  Loader2,
} from 'lucide-react';
import api from '../../api/axios';
import '../../styles/customerhome.css';
import '../../styles/buyermainpage.css';
import '../../styles/buyerprofile.css';
import BuyerNavbar from '../../components/BuyerNavbar';
import BuyerFooter from '../../components/BuyerFooter';

const initialsFromName = (name) => {
  if (!name || !String(name).trim()) return 'U';
  const parts = String(name).trim().split(/\s+/);
  const a = parts[0]?.[0] || '';
  const b = parts.length > 1 ? parts[parts.length - 1][0] : parts[0]?.[1] || '';
  return (a + b).toUpperCase() || 'U';
};

const BuyerProfile = () => {
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('customer_token');
    const raw = localStorage.getItem('customer_user');
    if (!token || !raw) {
      navigate('/buyer/login', { replace: true });
      setAuthChecked(true);
      return;
    }
    try {
      const parsed = JSON.parse(raw);
      setUser(parsed);
    } catch {
      navigate('/buyer/login', { replace: true });
    } finally {
      setAuthChecked(true);
    }
  }, [navigate]);

  useEffect(() => {
    if (!user?.id) return undefined;
    let cancelled = false;
    (async () => {
      try {
        const { data } = await api.get('/profile');
        if (cancelled || !data || typeof data !== 'object') return;
        if (data.id && (data.email || data.name)) {
          setUser(data);
          localStorage.setItem('customer_user', JSON.stringify(data));
        }
      } catch {
        /* keep cached local user */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  const handleLogout = () => {
    localStorage.removeItem('customer_token');
    localStorage.removeItem('customer_user');
    navigate('/buyer/login', { replace: true });
  };

  const avatarLetter = useMemo(() => initialsFromName(user?.name), [user?.name]);

  if (!authChecked) {
    return (
      <div className="bm-page bp-page">
        <BuyerNavbar
          onSearch={(q) => {
            navigate(`/buyer/dashboard?q=${encodeURIComponent(q)}`);
          }}
        />
        <main className="bp-main bp-main--loading" aria-busy="true">
          <div className="bp-loading">
            <Loader2 className="bp-spin" size={36} aria-hidden />
            <span>Loading your profile…</span>
          </div>
        </main>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="bm-page bp-page">
      <BuyerNavbar
        onSearch={(q) => {
          navigate(`/buyer/dashboard?q=${encodeURIComponent(q)}`);
        }}
      />

      <main className="bp-main" id="bp-main">
        <div className="bp-container">
          <nav className="bp-breadcrumb" aria-label="Breadcrumb">
            <Link to="/buyer/dashboard" className="bp-breadcrumb__link">
              Buyer home
            </Link>
            <ChevronRight className="bp-breadcrumb__sep" aria-hidden size={14} />
            <span className="bp-breadcrumb__current">Profile</span>
          </nav>

          <div className="bp-toolbar">
            <button type="button" className="bp-back" onClick={() => navigate(-1)} aria-label="Go back">
              <ArrowLeft size={20} aria-hidden />
            </button>
            <div className="bp-title-block">
              <h1 className="bp-title">My profile</h1>
              <p className="bp-subtitle">Account details and shortcuts across your MediEcom storefront.</p>
            </div>
          </div>

          <div className="bp-layout">
            <aside className="bp-sidebar" aria-label="Account menu">
              <div className="bp-identity">
                <div className="bp-avatar" aria-hidden>
                  {user.name ? (
                    <span>{avatarLetter}</span>
                  ) : (
                    <User size={36} strokeWidth={1.75} />
                  )}
                </div>
                <h2 className="bp-identity__name">{user.name || 'Customer'}</h2>
                <p className="bp-identity__email">{user.email || '—'}</p>
              </div>

              <nav className="bp-nav" aria-label="Profile actions">
                <Link to="/buyer/orders" className="bp-nav__btn">
                  <Package size={20} aria-hidden />
                  My orders
                </Link>
                <Link to="/buyer/support" className="bp-nav__btn">
                  <MapPin size={20} aria-hidden />
                  Support &amp; addresses
                </Link>
                <button type="button" className="bp-nav__btn bp-nav__btn--danger" onClick={handleLogout}>
                  <LogOut size={20} aria-hidden />
                  Log out
                </button>
              </nav>
            </aside>

            <div className="bp-panels">
              <section className="bp-card" aria-labelledby="bp-personal-heading">
                <h2 id="bp-personal-heading" className="bp-card__title">
                  Personal information
                </h2>
                <div className="bp-fields">
                  <div>
                    <span className="bp-field__label">Full name</span>
                    <p className="bp-field__value">{user.name || '—'}</p>
                  </div>
                  <div>
                    <span className="bp-field__label">Email</span>
                    <p className="bp-field__value">{user.email || '—'}</p>
                  </div>
                  <div>
                    <span className="bp-field__label">Account type</span>
                    <p className="bp-field__value">Individual customer</p>
                  </div>
                  {user.phone != null && String(user.phone).trim() !== '' && (
                    <div>
                      <span className="bp-field__label">Phone</span>
                      <p className="bp-field__value">{user.phone}</p>
                    </div>
                  )}
                </div>
              </section>

              <section className="bp-card" aria-labelledby="bp-security-heading">
                <h2 id="bp-security-heading" className="bp-card__title">
                  Security
                </h2>
                <div className="bp-security">
                  <div className="bp-security__icon" aria-hidden>
                    <Shield size={22} />
                  </div>
                  <div className="bp-security__body">
                    <p className="bp-security__headline">Account protection</p>
                    <p className="bp-security__text">
                      Keep your login private. For password resets or suspicious activity, reach out through support—we
                      will verify your identity before making changes.
                    </p>
                  </div>
                  <div className="bp-security__actions">
                    <Link to="/buyer/support" className="bp-btn bp-btn--primary">
                      Security help
                    </Link>
                  </div>
                </div>
              </section>

              <section className="bp-card" aria-labelledby="bp-shortcuts-heading">
                <h2 id="bp-shortcuts-heading" className="bp-card__title">
                  Shortcuts
                </h2>
                <div className="bp-quick">
                  <Link to="/buyer/wishlist" className="bp-quick__link">
                    <Heart size={22} aria-hidden />
                    Wishlist
                    <span className="bp-quick__hint">Saved items</span>
                  </Link>
                  <Link to="/buyer/cart" className="bp-quick__link">
                    <ShoppingCart size={22} aria-hidden />
                    Cart
                    <span className="bp-quick__hint">Review checkout</span>
                  </Link>
                  <Link to="/buyer/prescriptions" className="bp-quick__link">
                    <UploadCloud size={22} aria-hidden />
                    Prescriptions
                    <span className="bp-quick__hint">Upload Rx</span>
                  </Link>
                  <Link to="/buyer/support" className="bp-quick__link">
                    <Headphones size={22} aria-hidden />
                    Support
                    <span className="bp-quick__hint">Get help</span>
                  </Link>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>

      <BuyerFooter />
    </div>
  );
};

export default BuyerProfile;
