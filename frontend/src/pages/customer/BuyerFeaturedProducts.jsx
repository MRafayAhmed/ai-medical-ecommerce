import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import api from '../../api/axios';
import ProductCard from '../../components/ProductCard';
import BuyerNavbar from '../../components/BuyerNavbar';
import BuyerTopCategoryNav from '../../components/BuyerTopCategoryNav';
import BuyerFooter from '../../components/BuyerFooter';
import '../../styles/buyermainpage.css';

const API_ORIGIN = 'http://127.0.0.1:8000';

function productImageUrl(product) {
  const raw = product.image;
  const hasValidImage = raw && raw !== 'N/A' && raw !== 'null';
  if (raw?.startsWith('http')) return raw;
  if (hasValidImage) return `${API_ORIGIN}/storage/${raw}`;
  return `https://via.placeholder.com/300?text=${encodeURIComponent(product.product_name || product.name || 'Product')}`;
}

export default function BuyerFeaturedProducts() {
  const navigate = useNavigate();
  const pageRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [wishlistIds, setWishlistIds] = useState(new Set());
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    total: 0,
  });
  const isLoggedIn = !!localStorage.getItem('customer_token');

  const fetchWishlist = async () => {
    const token = localStorage.getItem('customer_token');
    if (!token) return;
    try {
      const response = await api.get('/wishlist');
      const items = response.data.data || [];
      setWishlistIds(new Set(items.map((i) => i.id)));
    } catch (err) {
      console.error('Error fetching wishlist:', err);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchData = useCallback(async (query = '', page = 1) => {
    setLoading(true);
    try {
      let url = `/medical-inventory?page=${page}`;
      if (query) url += `&q=${encodeURIComponent(query)}`;
      const productRes = await api.get(url);
      const responseData = productRes.data;
      if (responseData.data) {
        setProducts(responseData.data);
        setPagination({
          current_page: responseData.current_page,
          last_page: responseData.last_page,
          total: responseData.total,
        });
      } else {
        setProducts(responseData || []);
        setPagination({ current_page: 1, last_page: 1, total: (responseData || []).length });
      }
    } catch (err) {
      console.error('Error fetching featured products:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const q = params.get('q') || '';
    setSearchQuery(q);
    fetchData(q, 1);
  }, [fetchData]);

  const addToCart = async (product) => {
    if (product.stock <= 0) {
      alert("Sorry, this item is out of stock! Let's continue shopping for other items.");
      return;
    }
    if (!isLoggedIn) {
      alert('Please login to add items to your cart.');
      navigate('/buyer/login');
      return;
    }
    const userData = localStorage.getItem('customer_user');
    try {
      const user = JSON.parse(userData);
      await api.post('/shopping-carts', {
        user_id: user.id,
        branch_id: 1,
        total_amount: product.price,
        cart_items: [
          {
            item_id: product.id,
            qty: 1,
            price: product.price,
            total_price: product.price,
          },
        ],
      });
      const savedCart = localStorage.getItem('mediEcom_cart');
      const cart = savedCart ? JSON.parse(savedCart) : [];
      cart.push(product);
      localStorage.setItem('mediEcom_cart', JSON.stringify(cart));
    } catch (err) {
      console.error('Error adding to cart:', err);
      if (err.response?.data?.message) alert(err.response.data.message);
      else alert('Failed to add item to cart. Please try again.');
    }
  };

  const toggleWishlist = async (productId) => {
    if (!isLoggedIn) {
      alert('Please login to manage your wishlist.');
      navigate('/buyer/login');
      return;
    }
    const isCurrentlyWishlisted = wishlistIds.has(productId);
    setWishlistIds((prev) => {
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
      setWishlistIds((prev) => {
        const next = new Set(prev);
        if (isCurrentlyWishlisted) next.add(productId);
        else next.delete(productId);
        return next;
      });
      alert('Failed to update wishlist. Please try again.');
    }
  };

  return (
    <div className="bm-page" ref={pageRef}>
      <BuyerNavbar
        onSearch={(q) => {
          setSearchQuery(q);
          fetchData(q, 1);
        }}
      />

      <BuyerTopCategoryNav pageRef={pageRef} />

      <main className="bm-main-container bm-category-page-main" style={{ minHeight: '80vh' }}>
        <header className="bm-category-header">
          <div className="bm-featured-page-actions">
            <Link to="/buyer/dashboard" className="bm-category-back bm-featured-back-link">
              <ArrowLeft size={18} aria-hidden />
              <span>Dashboard</span>
            </Link>
          </div>
          <div className="bm-category-title-row bm-featured-page-title-row">
            <h1 className="bm-dashboard-heading bm-featured-page-title">Featured products</h1>
            {!loading && products.length > 0 && (
              <span className="bm-category-count">({pagination.total} products)</span>
            )}
          </div>
          <p className="bm-featured-page-lead">
            Same catalogue as your dashboard highlights — browse the full list with search and pagination.
          </p>
        </header>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '100px' }}>
            <Loader2 className="animate-spin" size={48} color="var(--color-primary)" />
          </div>
        ) : products.length > 0 ? (
          <>
            <div className="bm-product-grid" style={{ paddingBottom: '40px' }}>
              {products.map((product, idx) => {
                const price = parseFloat(product.price || 0);
                const mrp = product.mrp ? parseFloat(product.mrp) : null;
                return (
                  <ProductCard
                    key={`featured-prod-${product.id || idx}`}
                    product={{
                      ...product,
                      name: product.product_name || product.name,
                      image: productImageUrl(product),
                      price,
                      originalPrice: mrp,
                      isWishlisted: wishlistIds.has(product.id),
                    }}
                    onAddToCart={() => addToCart(product)}
                    onToggleWishlist={() => toggleWishlist(product.id)}
                  />
                );
              })}
            </div>

            {pagination.last_page > 1 && (
              <div
                className="bm-pagination"
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '20px',
                  padding: '40px 0',
                  borderTop: '1px solid #eee',
                }}
              >
                <button
                  type="button"
                  onClick={() => fetchData(searchQuery, pagination.current_page - 1)}
                  disabled={pagination.current_page === 1}
                  className="bm-pagination-btn"
                  style={{
                    padding: '10px 20px',
                    borderRadius: '8px',
                    border: '1px solid #ddd',
                    background: pagination.current_page === 1 ? '#f5f5f5' : 'white',
                    cursor: pagination.current_page === 1 ? 'not-allowed' : 'pointer',
                    color: 'var(--color-primary)',
                    fontWeight: '600',
                  }}
                >
                  Previous
                </button>
                <span style={{ fontWeight: '600' }}>
                  Page {pagination.current_page} of {pagination.last_page}
                </span>
                <button
                  type="button"
                  onClick={() => fetchData(searchQuery, pagination.current_page + 1)}
                  disabled={pagination.current_page === pagination.last_page}
                  className="bm-pagination-btn"
                  style={{
                    padding: '10px 20px',
                    borderRadius: '8px',
                    border: '1px solid #ddd',
                    background: pagination.current_page === pagination.last_page ? '#f5f5f5' : 'white',
                    cursor: pagination.current_page === pagination.last_page ? 'not-allowed' : 'pointer',
                    color: 'var(--color-primary)',
                    fontWeight: '600',
                  }}
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          <div
            style={{
              textAlign: 'center',
              padding: '100px',
              background: '#f8f9fa',
              borderRadius: '16px',
            }}
          >
            <p style={{ fontSize: '1.2rem', color: '#666' }}>No products found.</p>
            <Link to="/buyer/dashboard" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>
              Return to dashboard
            </Link>
          </div>
        )}
      </main>
      <BuyerFooter />
    </div>
  );
}
