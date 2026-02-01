import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Heart, Search, ShoppingCart, User, ArrowLeft, Loader2, X } from 'lucide-react';
import api from '../../api/axios';
import ProductCard from '../../components/ProductCard';
import BuyerNavbar from '../../components/BuyerNavbar';
import '../../styles/buyermainpage.css';

const CategoryPage = () => {
    const { categoryId, categoryName } = useParams();
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [category, setCategory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [wishlistIds, setWishlistIds] = useState(new Set());
    const isLoggedIn = !!localStorage.getItem('customer_token');

    // Cart count now handled by BuyerNavbar

    const fetchWishlist = async () => {
        const token = localStorage.getItem('customer_token');
        if (!token) return;
        try {
            const response = await api.get('/wishlist');
            const items = response.data.data || [];
            setWishlistIds(new Set(items.map(i => i.id)));
        } catch (err) {
            console.error('Error fetching wishlist:', err);
        }
    };

    useEffect(() => {
        fetchWishlist();
    }, []);

    const [searchQuery, setSearchQuery] = useState('');

    const fetchData = async (query = '') => {
        setLoading(true);
        try {
            let url = `/medical-inventory?category_id=${categoryId}`;
            if (query) url += `&q=${encodeURIComponent(query)}`;
            const productRes = await api.get(url);
            setProducts(productRes.data.data || productRes.data || []);

            if (!category) {
                const catRes = await api.get(`/categories/${categoryId}`);
                setCategory(catRes.data.data || catRes.data);
            }
        } catch (err) {
            console.error('Error fetching category data:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (categoryId) fetchData();
    }, [categoryId]);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchData(searchQuery);
    };

    const clearSearch = () => {
        setSearchQuery('');
        fetchData('');
    };

    const addToCart = async (product) => {
        if (!isLoggedIn) {
            alert('Please login to add items to your cart.');
            navigate('/buyer/login');
            return;
        }

        const userData = localStorage.getItem('customer_user');

        const savedCart = localStorage.getItem('mediEcom_cart');
        const cart = savedCart ? JSON.parse(savedCart) : [];
        cart.push(product);
        localStorage.setItem('mediEcom_cart', JSON.stringify(cart));

        try {
            const user = JSON.parse(userData);
            await api.post('/shopping-carts', {
                user_id: user.id,
                branch_id: 1,
                total_amount: product.price,
                cart_items: [{
                    item_id: product.id,
                    qty: 1,
                    price: product.price,
                    total_price: product.price
                }]
            });
            alert(`${product.product_name || product.name} added to cart!`);
        } catch (err) {
            console.error('Error syncing cart:', err);
            alert(`${product.product_name || product.name} added to cart (local only).`);
        }
    };

    const toggleWishlist = async (productId) => {
        if (!isLoggedIn) {
            alert('Please login to manage your wishlist.');
            navigate('/buyer/login');
            return;
        }

        const isCurrentlyWishlisted = wishlistIds.has(productId);

        try {
            if (isCurrentlyWishlisted) {
                await api.delete(`/wishlist/${productId}`);
                setWishlistIds(prev => {
                    const next = new Set(prev);
                    next.delete(productId);
                    return next;
                });
            } else {
                await api.post('/wishlist', { inventory_id: productId });
                setWishlistIds(prev => new Set(prev).add(productId));
            }
        } catch (err) {
            console.error('Error toggling wishlist:', err);
            alert('Failed to update wishlist. Please try again.');
        }
    };

    return (
        <div className="bm-page">
            <BuyerNavbar onSearch={(q) => {
                setSearchQuery(q);
                fetchData(q);
            }} />

            <main className="header__container" style={{ paddingTop: '100px', minHeight: '80vh' }}>
                <div style={{ marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <button
                        onClick={() => navigate(-1)}
                        className="bm-back-btn"
                        style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '8px 0',
                            color: '#000',
                            fontWeight: 600
                        }}
                    >
                        <ArrowLeft size={24} color="#000" />
                        <span>Back</span>
                    </button>
                    <h1 style={{ margin: 0, fontSize: '2rem', color: 'var(--text-primary)' }}>
                        {category ? category.name : categoryName || 'Category'}
                    </h1>
                </div>

                {loading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '100px' }}>
                        <Loader2 className="animate-spin" size={48} color="var(--primary-color)" />
                    </div>
                ) : products.length > 0 ? (
                    <div className="bm-product-grid" style={{ paddingBottom: '40px' }}>
                        {products.map(product => {
                            const price = parseFloat(product.price || 0);
                            const mrp = product.mrp ? parseFloat(product.mrp) : null;
                            return (
                                <ProductCard
                                    key={product.id}
                                    product={{
                                        ...product,
                                        name: product.product_name || product.name,
                                        image: product.image?.startsWith('http') ? product.image : (product.image ? `http://127.0.0.1:8000/storage/${product.image}` : `https://via.placeholder.com/300?text=${encodeURIComponent(product.product_name || product.name || 'Product')}`),
                                        price: price,
                                        originalPrice: mrp,
                                        isWishlisted: wishlistIds.has(product.id)
                                    }}
                                    onAddToCart={() => addToCart(product)}
                                    onToggleWishlist={() => toggleWishlist(product.id)}
                                />
                            );
                        })}
                    </div>
                ) : (
                    <div style={{ textAlign: 'center', padding: '100px', background: '#f8f9fa', borderRadius: '16px' }}>
                        <p style={{ fontSize: '1.2rem', color: '#666' }}>No products found in this category.</p>
                        <Link to="/buyer/dashboard" style={{ color: 'var(--primary-color)', fontWeight: 600 }}>Return to Dashboard</Link>
                    </div>
                )}
            </main>
        </div>
    );
};

export default CategoryPage;
