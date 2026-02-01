import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Heart, Search, ShoppingCart, User, UploadCloud, Menu, X } from 'lucide-react';
import api from '../api/axios';

const BuyerNavbar = ({ onSearch }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [cartCount, setCartCount] = useState(0);
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('customer_token'));
    const navigate = useNavigate();
    const location = useLocation();

    const isActive = (path) => location.pathname === path ? 'active' : '';

    useEffect(() => {
        const updateState = () => {
            const savedCart = localStorage.getItem('mediEcom_cart');
            if (savedCart) {
                setCartCount(JSON.parse(savedCart).length);
            } else {
                setCartCount(0);
            }
            setIsLoggedIn(!!localStorage.getItem('customer_token'));
        };

        updateState();
        window.addEventListener('storage', updateState);
        const interval = setInterval(updateState, 1000); // Polling as fallback for same-tab changes
        return () => {
            window.removeEventListener('storage', updateState);
            clearInterval(interval);
        };
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('customer_token');
        localStorage.removeItem('customer_user');
        setIsLoggedIn(false);
        navigate('/');
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (onSearch) {
            onSearch(searchQuery);
        } else {
            navigate(`/buyer/dashboard?q=${encodeURIComponent(searchQuery)}`);
        }
    };

    const clearSearch = () => {
        setSearchQuery('');
        if (onSearch) onSearch('');
    };

    return (
        <header className="header" style={{ position: 'sticky', top: 0, zIndex: 1000, backgroundColor: '#fff', borderBottom: '1px solid #eee' }}>
            <div className="header__container">
                <Link to="/buyer/dashboard" className="header__logo">
                    <div className="header__logo-icon">
                        <Heart className="header__heart-icon" />
                    </div>
                    <span className="header__logo-text">MediEcom</span>
                </Link>

                <form className="header__search" onSubmit={handleSearchSubmit}>
                    <div className="header__search-wrapper">
                        <Search className="header__search-icon" size={18} />
                        <input
                            type="search"
                            className="header__search-input"
                            placeholder="Search medicines..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        {searchQuery && (
                            <button type="button" className="header__search-clear" onClick={clearSearch}>
                                <X size={16} />
                            </button>
                        )}
                        <button type="submit" className="header__search-btn">
                            <Search size={16} />
                        </button>
                    </div>
                </form>

                <Link to="/buyer/prescriptions" className="header__upload-pill">
                    <UploadCloud size={18} />
                    <span>Upload Rx</span>
                </Link>

                <div className="header__actions">
                    <div className="bm-action-bar">
                        <Link to="/buyer/wishlist" className={`bm-action ${isActive('/buyer/wishlist')}`} title="Wishlist"><Heart size={20} /></Link>
                        <Link to="/buyer/cart" className={`bm-action ${isActive('/buyer/cart')}`} title="Cart" style={{ position: 'relative' }}>
                            <ShoppingCart size={20} />
                            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
                        </Link>
                        <Link to="/buyer/profile" className={`bm-action ${isActive('/buyer/profile')}`} title="Profile"><User size={20} /></Link>
                        {isLoggedIn ? (
                            <button onClick={handleLogout} className="bm-action" title="Logout">
                                <i className="bi bi-box-arrow-right" style={{ fontSize: '20px' }}></i>
                            </button>
                        ) : (
                            <Link to="/buyer/login" className="bm-action" title="Login"><User size={20} /></Link>
                        )}
                    </div>
                </div>

                <button className="header__mobile-toggle" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {isMobileMenuOpen && (
                <div className="header__mobile-menu">
                    <div className="header__mobile-actions">
                        <div className="bm-action-bar bm-action-bar--mobile">
                            <Link to="/buyer/wishlist" className={`bm-action ${isActive('/buyer/wishlist')}`} onClick={() => setIsMobileMenuOpen(false)}><Heart size={20} /></Link>
                            <Link to="/buyer/cart" className={`bm-action ${isActive('/buyer/cart')}`} onClick={() => setIsMobileMenuOpen(false)}><ShoppingCart size={20} /></Link>
                            <Link to="/buyer/profile" className={`bm-action ${isActive('/buyer/profile')}`} onClick={() => setIsMobileMenuOpen(false)}><User size={20} /></Link>
                            {isLoggedIn && (
                                <button onClick={handleLogout} className="bm-action">
                                    <i className="bi bi-box-arrow-right" style={{ fontSize: '20px' }}></i>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <style>{`
        .cart-badge {
          position: absolute;
          top: -5px;
          right: -5px;
          background: #ef4444;
          color: white;
          border-radius: 50%;
          padding: 2px 6px;
          font-size: 10px;
          font-weight: bold;
          min-width: 18px;
          text-align: center;
        }
        .header__search-clear {
          background: none;
          border: none;
          cursor: pointer;
          color: #999;
          padding: 4px;
          display: flex;
          align-items: center;
        }
        .header__search-clear:hover {
          color: #666;
        }
      `}</style>
        </header>
    );
};

export default BuyerNavbar;
