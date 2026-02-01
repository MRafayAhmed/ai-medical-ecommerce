import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Search, UploadCloud, User, ShoppingCart, Info, Menu, X, ArrowRight } from 'lucide-react';
import ProductCard from '../../components/customer/ProductCard';
import '../../styles/customerhome.css';
import '../../styles/buyermainpage.css';
import '../../styles/buyerwishlist.css';

const BuyerWishlist = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [wishlist, setWishlist] = useState([]);
    const pageRef = useRef(null);
    const navigate = useNavigate();

    // Layout effect to match main page header spacing
    useEffect(() => {
        const el = pageRef.current;
        if (!el) return;

        const update = () => {
            const logo = el.querySelector('.header__logo');
            if (logo) {
                const rect = logo.getBoundingClientRect();
                const top = rect.top + rect.height / 2;
                el.style.setProperty('--bm-about-top', `${top}px`);
            }

            const actionBar = el.querySelector('.bm-action-bar');
            if (actionBar) {
                const ar = actionBar.getBoundingClientRect();
                const offset = Math.round(ar.width + 12);
                el.style.setProperty('--bm-actionbar-offset', `${offset}px`);
            }
        };

        update();
        window.addEventListener('resize', update);
        window.addEventListener('scroll', update, true);
        return () => {
            window.removeEventListener('resize', update);
            window.removeEventListener('scroll', update, true);
        };
    }, []);

    // Load wishlist from localStorage on mount
    useEffect(() => {
        const savedWishlist = localStorage.getItem('mediEcom_wishlist');
        if (savedWishlist) {
            setWishlist(JSON.parse(savedWishlist));
        }
    }, []);

    // Update localStorage whenever wishlist changes
    useEffect(() => {
        localStorage.setItem('mediEcom_wishlist', JSON.stringify(wishlist));
    }, [wishlist]);

    const removeFromWishlist = (productId) => {
        setWishlist(prev => prev.filter(item => item.id !== productId));
        // Trigger a custom event to notify other pages if needed
        window.dispatchEvent(new Event('wishlistUpdated'));
    };

    const addToCart = (product) => {
        console.log('Adding to cart:', product);
        alert(`${product.name} added to cart!`);
    };

    return (
        <div className="bm-page bw-page" ref={pageRef}>
            {/* Reused Header from main page */}
            <header className="header">
                <div className="header__container">
                    <Link to="/" className="header__logo" aria-label="MediEcom Home">
                        <div className="header__logo-icon">
                            <Heart className="header__heart-icon" />
                        </div>
                        <span className="header__logo-text">MediEcom</span>
                    </Link>

                    <form
                        className="header__search"
                        onSubmit={(e) => {
                            e.preventDefault();
                            if (!searchQuery) return;
                            navigate(`/customer/home?q=${encodeURIComponent(searchQuery)}`);
                        }}
                        role="search"
                    >
                        <div className="header__search-wrapper">
                            <Search className="header__search-icon" aria-hidden="true" />
                            <input
                                type="search"
                                className="header__search-input"
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                aria-label="Search products"
                            />
                            <button type="submit" className="header__search-btn" aria-label="Search">
                                <Search size={16} />
                            </button>
                        </div>
                    </form>

                    {/* Upload Rx Button hidden to keep layout positions same as main page */}
                    <div className="header__upload-pill" style={{ visibility: 'hidden', pointerEvents: 'none' }}>
                        <UploadCloud size={18} />
                        <span>Upload Rx</span>
                    </div>

                    <div className="header__actions">
                        <div className="bm-action-bar" role="toolbar" aria-label="Quick actions">
                            <Link to="/buyer/profile" className="bm-action" aria-label="Profile"><User size={20} /></Link>
                            <Link to="/buyer/wishlist" className="bm-action active" aria-label="Wishlist"><Heart size={20} /></Link>
                            <Link to="/buyer/cart" className="bm-action" aria-label="Cart"><ShoppingCart size={20} /></Link>
                            <Link to="/customer/home" className="bm-action bm-action--info" aria-label="About" title="About Us"><Info size={20} /></Link>
                        </div>
                    </div>

                    <button
                        className="header__mobile-toggle"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        aria-expanded={isMobileMenuOpen}
                        aria-label="Toggle mobile menu"
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {isMobileMenuOpen && (
                    <div className="header__mobile-menu">
                        <nav aria-label="Mobile navigation">
                            <div className="header__mobile-actions">
                                <div className="bm-action-bar bm-action-bar--mobile">
                                    <Link to="/buyer/prescriptions" className="bm-action" onClick={() => setIsMobileMenuOpen(false)} aria-label="Upload Prescription"><UploadCloud size={20} /></Link>
                                    <Link to="/buyer/profile" className="bm-action" onClick={() => setIsMobileMenuOpen(false)} aria-label="Profile"><User size={20} /></Link>
                                    <Link to="/buyer/wishlist" className="bm-action active" onClick={() => setIsMobileMenuOpen(false)} aria-label="Wishlist"><Heart size={20} /></Link>
                                    <Link to="/buyer/cart" className="bm-action" onClick={() => setIsMobileMenuOpen(false)} aria-label="Cart"><ShoppingCart size={20} /></Link>
                                    <Link to="/customer/home" className="bm-action bm-action--info" onClick={() => setIsMobileMenuOpen(false)} aria-label="About" title="About Us"><Info size={20} /></Link>
                                </div>
                            </div>
                        </nav>
                    </div>
                )}
            </header>

            {/* Wishlist Content */}
            <main className="bw-container">
                <h1 className="bw-header-title">My Wishlist</h1>

                {wishlist.length > 0 ? (
                    <div className="bw-grid">
                        {wishlist.map((product) => (
                            <ProductCard
                                key={product.id}
                                product={{ ...product, isWishlisted: true }}
                                onToggleWishlist={() => removeFromWishlist(product.id)}
                                onAddToCart={addToCart}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="bw-empty-state">
                        <div className="bw-empty-icon">
                            <Heart size={80} strokeWidth={1} />
                        </div>
                        <p className="bw-empty-text">Your wishlist is empty</p>
                        <Link to="/" className="bw-discover-btn">
                            <span>Discover More</span>
                            <ArrowRight size={20} />
                        </Link>
                    </div>
                )}

                {wishlist.length > 0 && (
                    <div style={{ textAlign: 'center', marginTop: '40px' }}>
                        <Link to="/" className="bw-discover-btn">
                            <span>Discover More</span>
                            <ArrowRight size={20} />
                        </Link>
                    </div>
                )}
            </main>

            {/* Simple Footer or reused components could go here */}
        </div>
    );
};

export default BuyerWishlist;
