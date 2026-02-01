import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Loader2, ArrowRight } from 'lucide-react';
import api from '../../api/axios';
import ProductCard from '../../components/ProductCard';
import BuyerNavbar from '../../components/BuyerNavbar';
import '../../styles/customerhome.css';
import '../../styles/buyermainpage.css';
import '../../styles/buyerwishlist.css';

const BuyerWishlist = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);
    const pageRef = useRef(null);
    const navigate = useNavigate();

    // Layout effect to match main page header spacing
    // Layout effect removed: BuyerNavbar handles its own sizing

    // Load wishlist from API on mount
    const fetchWishlist = async () => {
        const token = localStorage.getItem('customer_token');
        if (!token) {
            setLoading(false);
            return;
        }
        setLoading(true);
        try {
            const response = await api.get('/wishlist');
            const items = response.data.data || [];

            // Map the inventory items to the structure expected by ProductCard
            const mapped = items.map(item => ({
                id: item.id,
                name: item.product_name,
                image: item.image ? `http://127.0.0.1:8000/storage/${item.image}` : `https://via.placeholder.com/300?text=${encodeURIComponent(item.product_name)}`,
                price: parseFloat(item.price),
                originalPrice: item.mrp ? parseFloat(item.mrp) : null,
                isWishlisted: true
            }));

            setWishlist(mapped);
        } catch (err) {
            console.error('Error fetching wishlist:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWishlist();
    }, []);

    const removeFromWishlist = async (productId) => {
        try {
            await api.delete(`/wishlist/${productId}`);
            setWishlist(prev => prev.filter(item => item.id !== productId));
        } catch (err) {
            console.error('Error removing from wishlist:', err);
            alert('Failed to remove item. Please try again.');
        }
    };

    const addToCart = (product) => {
        console.log('Adding to cart:', product);
        alert(`${product.name} added to cart!`);
    };

    return (
        <div className="bm-page bw-page" ref={pageRef}>
            {/* Reused Header from main page */}
            <BuyerNavbar onSearch={(q) => {
                setSearchQuery(q);
                navigate(`/buyer/dashboard?q=${encodeURIComponent(q)}`);
            }} />

            {/* Wishlist Content */}
            <main className="bw-container">
                {loading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '100px' }}>
                        <Loader2 className="animate-spin" size={48} color="var(--primary-color)" />
                    </div>
                ) : wishlist.length > 0 ? (
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
