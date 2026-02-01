import React from 'react';
import { Heart, ShoppingCart } from 'lucide-react';

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
                    src={product.image}
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
                    className="bm-add-to-cart-btn"
                    onClick={() => onAddToCart(product)}
                    aria-label={`Add ${product.name} to cart`}
                >
                    <ShoppingCart size={18} />
                    <span>Add to Cart</span>
                </button>
            </div>
        </div>
    );
};

export default ProductCard;
