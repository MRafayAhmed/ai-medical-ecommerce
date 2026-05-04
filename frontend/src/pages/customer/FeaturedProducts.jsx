import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import BuyerNavbar from '../../components/BuyerNavbar';
import BuyerFooter from '../../components/BuyerFooter';
import ProductCard from '../../components/ProductCard';
import { ProductCardSkeleton } from '../../components/Skeletons';

const FeaturedProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedLetter, setSelectedLetter] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('customer_token'));
    const [wishlistIds, setWishlistIds] = useState(new Set());
    const navigate = useNavigate();

    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

    const fetchProducts = async (letter = null) => {
        setLoading(true);
        try {
            const url = letter ? `/products/featured?letter=${letter}` : '/products/featured';
            const res = await api.get(url);
            
            // Laravel pagination usually returns items in data.data
            const prodItems = res.data.data || (Array.isArray(res.data) ? res.data : []);
            
            const mappedProducts = prodItems.map(item => ({
                id: item.id,
                name: item.product_name,
                image: item.image ? `http://127.0.0.1:8000/storage/${item.image}` : ('https://via.placeholder.com/200x200/f8f9fa/333?text=' + encodeURIComponent(item.product_name)),
                price: parseFloat(item.price),
                originalPrice: item.mrp ? parseFloat(item.mrp) : null,
                stock: item.stock,
            }));
            
            setProducts(mappedProducts);
        } catch (err) {
            console.error('Error fetching featured products:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchWishlist = async () => {
        if (!isLoggedIn) return;
        try {
            const res = await api.get('/wishlist');
            const ids = new Set((res.data || []).map(item => item.inventory_id));
            setWishlistIds(ids);
        } catch (err) {
            console.error('Error fetching wishlist:', err);
        }
    };

    useEffect(() => {
        fetchProducts(selectedLetter);
        fetchWishlist();
    }, [selectedLetter]);

    const handleLetterClick = (letter) => {
        if (selectedLetter === letter) {
            setSelectedLetter(null); // Deselect to show all
        } else {
            setSelectedLetter(letter);
        }
    };

    const toggleWishlist = async (productId) => {
        if (!isLoggedIn) {
            alert('Please login to add items to your wishlist.');
            navigate('/buyer/login');
            return;
        }

        const isCurrentlyWishlisted = wishlistIds.has(productId);

        // Optimistic UI updates
        setWishlistIds(prev => {
            const next = new Set(prev);
            if (isCurrentlyWishlisted) next.delete(productId);
            else next.add(productId);
            return next;
        });

        try {
            if (isCurrentlyWishlisted) {
                await api.delete(`/wishlist/${productId}`);
            } else {
                await api.post('/wishlist', { inventory_id: productId });
            }
        } catch (err) {
            console.error('Error toggling wishlist:', err);
            // Rollback on failure
            setWishlistIds(prev => {
                const next = new Set(prev);
                if (isCurrentlyWishlisted) next.add(productId);
                else next.delete(productId);
                return next;
            });
            alert('Failed to update wishlist.');
        }
    };

    const addToCart = (product) => {
        if (!isLoggedIn) {
            alert('Please login to add items to your cart.');
            navigate('/buyer/login');
            return;
        }
        
        if (product.stock <= 0) {
            alert('Sorry, this item is out of stock!');
            return;
        }

        const savedCart = localStorage.getItem('mediEcom_cart');
        const cart = savedCart ? JSON.parse(savedCart) : [];
        cart.push(product);
        localStorage.setItem('mediEcom_cart', JSON.stringify(cart));
        // alert(`${product.name} added to cart!`);
    };

    return (
        <div className="featured-products-page">
            <BuyerNavbar onSearch={(q) => navigate(`/buyer/dashboard?q=${encodeURIComponent(q)}`)} />
            
            <div style={{ background: '#f8fafc', padding: '40px 0', borderBottom: '1px solid #e2e8f0' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px', textAlign: 'center' }}>
                    <h1 style={{ fontSize: '32px', fontWeight: '800', color: '#0f172a', marginBottom: '10px' }}>
                        Browse Medicines by Alphabet
                    </h1>
                    <p style={{ color: '#64748b', fontSize: '16px', marginBottom: '30px' }}>
                        Find your required medication by selecting its starting letter.
                    </p>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
                        {letters.map(letter => (
                            <button
                                key={letter}
                                onClick={() => handleLetterClick(letter)}
                                style={{
                                    width: '40px',
                                    height: '40px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderRadius: '8px',
                                    border: '1px solid',
                                    borderColor: selectedLetter === letter ? '#0b5fb8' : '#e2e8f0',
                                    background: selectedLetter === letter ? '#0b5fb8' : 'white',
                                    color: selectedLetter === letter ? 'white' : '#0f172a',
                                    fontWeight: '700',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                {letter}
                            </button>
                        ))}
                        <button
                            onClick={() => setSelectedLetter(null)}
                            style={{
                                padding: '0 16px',
                                height: '40px',
                                borderRadius: '8px',
                                border: '1px solid #e2e8f0',
                                background: selectedLetter === null ? '#0b5fb8' : 'white',
                                color: selectedLetter === null ? 'white' : '#0f172a',
                                fontWeight: '700',
                                cursor: 'pointer'
                            }}
                        >
                            All
                        </button>
                    </div>
                </div>
            </div>

            <div style={{ maxWidth: '1200px', margin: '40px auto', padding: '0 20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                    <h2 style={{ fontSize: '24px', fontWeight: '700' }}>
                        {selectedLetter ? `Medicines starting with "${selectedLetter}"` : 'All Featured Medicines'}
                    </h2>
                    <span style={{ color: '#64748b', fontSize: '14px' }}>
                        Showing {products.length} products
                    </span>
                </div>

                {loading ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '24px' }}>
                        {Array(8).fill(0).map((_, i) => <ProductCardSkeleton key={`skeleton-${i}`} />)}
                    </div>
                ) : products.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '80px 20px', background: '#f8fafc', borderRadius: '16px' }}>
                        <i className="bi bi-search" style={{ fontSize: '48px', color: '#cbd5e1' }}></i>
                        <h3 style={{ marginTop: '20px', fontSize: '20px', color: '#475569' }}>No medicines found starting with "{selectedLetter}"</h3>
                        <button 
                            onClick={() => setSelectedLetter(null)}
                            style={{ marginTop: '15px', color: '#0b5fb8', background: 'none', border: 'none', fontWeight: '600', cursor: 'pointer' }}
                        >
                            Show all medicines
                        </button>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '24px' }}>
                        {products.map((product) => (
                            <ProductCard
                                key={product.id}
                                product={{
                                    ...product,
                                    isWishlisted: wishlistIds.has(product.id)
                                }}
                                onToggleWishlist={toggleWishlist}
                                onAddToCart={addToCart}
                            />
                        ))}
                    </div>
                )}
            </div>

            <BuyerFooter />
        </div>
    );
};

export default FeaturedProducts;
