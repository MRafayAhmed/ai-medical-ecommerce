import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Trash2, Plus, Minus, ArrowLeft, Package, ChevronRight, X } from 'lucide-react';
import '../../styles/customerhome.css';
import '../../styles/buyermainpage.css';
import '../../styles/buyercart.css';
import CheckoutSidebar from '../../components/CheckoutSidebar';
import BuyerNavbar from '../../components/BuyerNavbar';
import BuyerFooter from '../../components/BuyerFooter';
import { useStock } from '../../context/StockContext';

const loadGroupedCart = () => {
  const raw = localStorage.getItem('mediEcom_cart');
  if (!raw) return [];
  try {
    const rawCart = JSON.parse(raw);
    if (!Array.isArray(rawCart)) return [];
    return rawCart.reduce((acc, item) => {
      const existing = acc.find((i) => i.id === item.id);
      if (existing) {
        existing.qty = (existing.qty || 1) + 1;
      } else {
        acc.push({ ...item, qty: 1 });
      }
      return acc;
    }, []);
  } catch {
    return [];
  }
};

const BuyerCart = () => {
  const [cart, setCart] = useState([]);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [stockAlert, setStockAlert] = useState(null);
  const navigate = useNavigate();
  const { getStock } = useStock();

  const refreshCart = useCallback(() => {
    setCart(loadGroupedCart());
  }, []);

  useEffect(() => {
    refreshCart();
    const u = localStorage.getItem('customer_user');
    if (u) {
      try {
        setUser(JSON.parse(u));
      } catch {
        setUser(null);
      }
    }
  }, [refreshCart]);

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === 'mediEcom_cart' || e.key === null) refreshCart();
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [refreshCart]);

  const updateQty = (id, delta) => {
    const updated = cart.map((item) => {
      if (item.id === id) {
        const stock = getStock(item.id) ?? item.stock;
        const limit = stock !== undefined && stock !== null ? stock : Infinity;
        const newQty = Math.min(limit, Math.max(1, (item.qty || 1) + delta));
        return { ...item, qty: newQty };
      }
      return item;
    });
    setCart(updated);
    saveCart(updated);
    setStockAlert(null);
  };

  const removeItem = (id) => {
    const updated = cart.filter((item) => item.id !== id);
    setCart(updated);
    saveCart(updated);
    setStockAlert(null);
  };

  const saveCart = (updatedCart) => {
    const flattened = updatedCart.flatMap((item) => Array(item.qty).fill({ ...item, qty: undefined }));
    localStorage.setItem('mediEcom_cart', JSON.stringify(flattened));
  };

  const cartTotal = useMemo(
    () => cart.reduce((sum, item) => sum + parseFloat(item.price || 0) * (item.qty || 1), 0),
    [cart]
  );

  const lineCount = cart.length;
  const unitCount = useMemo(() => cart.reduce((s, item) => s + (item.qty || 1), 0), [cart]);

  const handleCheckout = () => {
    if (cart.length === 0) return;

    const outOfStockItems = cart.filter((item) => {
      const stock = getStock(item.id) ?? item.stock;
      return stock !== undefined && stock !== null && item.qty > stock;
    });

    if (outOfStockItems.length > 0) {
      const names = outOfStockItems.map((i) => i.product_name || i.name).join(', ');
      setStockAlert(`Some items exceed available stock: ${names}. Reduce quantity or remove them to continue.`);
      return;
    }

    setStockAlert(null);
    setIsCheckoutOpen(true);
  };

  const handleOrderSuccess = () => {
    localStorage.removeItem('mediEcom_cart');
    setCart([]);
    setIsCheckoutOpen(false);
    navigate('/buyer/orders');
  };

  const displayName = (item) => item.product_name || item.name || 'Product';

  return (
    <div className="bm-page bc-page">
      <BuyerNavbar
        onSearch={(q) => {
          navigate(`/buyer/dashboard?q=${encodeURIComponent(q)}`);
        }}
      />

      <main className="bc-main" id="bc-main">
        <div className="bc-container">
          <nav className="bc-breadcrumb" aria-label="Breadcrumb">
            <Link to="/buyer/dashboard" className="bc-breadcrumb__link">
              Buyer home
            </Link>
            <ChevronRight className="bc-breadcrumb__sep" aria-hidden size={14} />
            <span className="bc-breadcrumb__current">Shopping cart</span>
          </nav>

          <div className="bc-toolbar">
            <button type="button" className="bc-back" onClick={() => navigate(-1)} aria-label="Go back">
              <ArrowLeft size={20} aria-hidden />
            </button>
            <div className="bc-title-block">
              <h1 className="bc-title">Shopping cart</h1>
              <p className="bc-subtitle">
                {lineCount > 0
                  ? `${unitCount} ${unitCount === 1 ? 'item' : 'items'} in your cart · Review before checkout`
                  : 'Your saved items will appear here'}
              </p>
            </div>
          </div>

          {stockAlert && (
            <div className="bc-alert" role="alert">
              <span className="bc-alert__text">{stockAlert}</span>
              <button type="button" className="bc-alert__dismiss" onClick={() => setStockAlert(null)} aria-label="Dismiss">
                <X size={18} />
              </button>
            </div>
          )}

          {cart.length > 0 ? (
            <div className="bc-layout">
              <section aria-labelledby="bc-items-heading">
                <div className="bc-items-head">
                  <h2 id="bc-items-heading" className="bc-items-heading">
                    Your items
                  </h2>
                  <span className="bc-items-meta">
                    {lineCount} product{lineCount === 1 ? '' : 's'} · {unitCount} unit{unitCount === 1 ? '' : 's'}
                  </span>
                </div>

                <ul className="bc-lines">
                  {cart.map((item) => {
                    const stock = getStock(item.id) ?? item.stock;
                    const maxStock = stock !== undefined && stock !== null ? stock : Infinity;
                    const isAtMax = item.qty >= maxStock;

                    return (
                      <li key={item.id} className="bc-line">
                        <div className="bc-line__row">
                          <div className="bc-line__thumb">
                            <img
                              src={item.image || `https://via.placeholder.com/120?text=${encodeURIComponent(displayName(item))}`}
                              alt=""
                            />
                          </div>
                          <div className="bc-line__info">
                            <h3 className="bc-line__name">{displayName(item)}</h3>
                            <p className="bc-line__unit">Rs. {parseFloat(item.price || 0).toFixed(2)} each</p>
                            {isAtMax && maxStock < Infinity && (
                              <p className="bc-line__warn">Maximum available quantity in stock</p>
                            )}
                          </div>
                        </div>

                        <div className="bc-line__qty">
                          <button
                            type="button"
                            className="bc-qty-btn"
                            onClick={() => updateQty(item.id, -1)}
                            aria-label={`Decrease quantity of ${displayName(item)}`}
                          >
                            <Minus size={16} aria-hidden />
                          </button>
                          <span className="bc-qty-val" aria-live="polite">
                            {item.qty}
                          </span>
                          <button
                            type="button"
                            className="bc-qty-btn"
                            disabled={isAtMax}
                            onClick={() => updateQty(item.id, 1)}
                            aria-label={`Increase quantity of ${displayName(item)}`}
                          >
                            <Plus size={16} aria-hidden />
                          </button>
                        </div>

                        <div className="bc-line__side">
                          <p className="bc-line__total">Rs. {(parseFloat(item.price || 0) * item.qty).toFixed(2)}</p>
                          <button
                            type="button"
                            className="bc-line__remove"
                            onClick={() => removeItem(item.id)}
                            aria-label={`Remove ${displayName(item)} from cart`}
                          >
                            <Trash2 size={16} aria-hidden />
                            Remove
                          </button>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </section>

              <aside className="bc-summary" aria-labelledby="bc-summary-heading">
                <h2 id="bc-summary-heading" className="bc-summary__title">
                  Order summary
                </h2>
                <div className="bc-summary__row">
                  <span>
                    Subtotal ({unitCount} {unitCount === 1 ? 'item' : 'items'})
                  </span>
                  <span>Rs. {cartTotal.toFixed(2)}</span>
                </div>
                <div className="bc-summary__row">
                  <span>Delivery</span>
                  <span className="bc-summary__free">FREE</span>
                </div>
                <hr className="bc-summary__hr" />
                <div className="bc-summary__row bc-summary__row--emphasis">
                  <span>Total</span>
                  <span className="bc-summary__total">Rs. {cartTotal.toFixed(2)}</span>
                </div>
                <button type="button" className="bc-checkout" onClick={handleCheckout}>
                  Proceed to checkout
                  <Package size={18} aria-hidden />
                </button>
                <p className="bc-summary__note">Secure checkout · You can confirm address and payment in the next step</p>
              </aside>
            </div>
          ) : (
            <div className="bc-empty">
              <div className="bc-empty__icon" aria-hidden>
                <ShoppingCart size={40} strokeWidth={1.25} />
              </div>
              <h2 className="bc-empty__title">Your cart is empty</h2>
              <p className="bc-empty__text">Browse medicines on your dashboard and tap Add to cart to build your order.</p>
              <Link to="/buyer/dashboard" className="bc-empty__cta">
                Start shopping
                <ChevronRight size={18} aria-hidden />
              </Link>
            </div>
          )}
        </div>
      </main>

      <BuyerFooter />

      <CheckoutSidebar
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cart={cart}
        user={user}
        onOrderSuccess={handleOrderSuccess}
      />
    </div>
  );
};

export default BuyerCart;
