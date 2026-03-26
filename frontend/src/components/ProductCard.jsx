import React from 'react';
import { Heart, ShoppingCart } from 'lucide-react';
import { useStock } from '../context/StockContext';

/**
 * ProductCard Component
 * 
 * Reusable product card for the healthcare marketplace.
 * Features: Bottom-aligned "Add to Cart" button, wishlist toggle, and responsive design.
 * 
 * @param {Object} product - Product data (id, name, image, price, originalPrice, isWishlisted)
 * @param {Function} onToggleWishlist - Handler for wishlist heart icon click
 * @param {Function} onAddToCart - Handler for add to cart button click
 */
const ProductCard = ({ product, onToggleWishlist, onAddToCart }) => {
    const { getStock } = useStock();
    
    let currentStock = getStock(product.id);
    if (currentStock === null || currentStock === undefined) {
        currentStock = product.stock;
    }
    
    const isOutOfStock = currentStock <= 0;

    return (
        <div className="bm-product-card">
            {/* Wishlist Button */}
            <button
                className={`bm-wishlist-btn ${product.isWishlisted ? 'active' : ''}`}
                onClick={() => onToggleWishlist(product.id)}
                aria-label={product.isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
            >
                <Heart size={20} />
            </button>

            {/* Product Image */}
            <div className="bm-product-img-wrap">
                <img
                    src={product.image?.startsWith('http') ? product.image : (product.image ? `/storage/${product.image}` : `https://via.placeholder.com/300?text=${encodeURIComponent(product.product_name || product.name || 'Product')}`)}
                    alt={product.name}
                    className="bm-product-img"
                    onError={(e) => {
                        e.currentTarget.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect width="100%" height="100%" fill="%23f7f9fb"/><text x="50%" y="50%" fill="%23999" font-family="Arial" font-size="14" text-anchor="middle" dominant-baseline="central">No Image</text></svg>';
                    }}
                />
            </div>

            {/* Product Information */}
            <div className="bm-product-info">
                <h4 className="bm-product-name">{product.name}</h4>
                <div className="bm-product-pricing">
                    <span className="bm-product-price">Rs. {product.price?.toFixed(2) || '0.00'}</span>
                    {product.originalPrice && (
                        <span className="bm-product-original-price">Rs. {product.originalPrice.toFixed(2)}</span>
                    )}
                </div>

                {/* Add To Cart Button - Always Bottom Aligned via CSS flex-grow on info container */}
                <button
                    className={`bm-add-to-cart-btn ${isOutOfStock ? 'out-of-stock' : ''}`}
                    onClick={() => {
                        if (!isOutOfStock) onAddToCart(product);
                    }}
                    disabled={isOutOfStock}
                    aria-label={isOutOfStock ? `Out of stock` : `Add ${product.name} to cart`}
                    style={isOutOfStock ? { backgroundColor: '#ccc', cursor: 'not-allowed' } : {}}
                >
                    <ShoppingCart size={18} />
                    <span>{isOutOfStock ? 'Out of Stock' : 'Add to Cart'}</span>
                </button>
            </div>
        </div>
    );
};

export default ProductCard;
