import React, { useState, useEffect, useCallback, useId } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Package, Loader2, ArrowLeft, X, ChevronRight } from 'lucide-react';
import api from '../../api/axios';
import '../../styles/customerhome.css';
import '../../styles/buyermainpage.css';
import '../../styles/buyerorders.css';
import BuyerNavbar from '../../components/BuyerNavbar';
import BuyerFooter from '../../components/BuyerFooter';

const API_ORIGIN = 'http://127.0.0.1:8000';

const storageUrl = (path) => {
  if (!path) return null;
  const p = String(path).trim();
  if (p.startsWith('http://') || p.startsWith('https://')) return p;
  return `${API_ORIGIN}/storage/${p.replace(/^\/?storage\/?/, '')}`;
};

const statusTone = (status) => {
  const s = String(status || '').toLowerCase();
  if (s === 'completed' || s === 'delivered') return 'completed';
  if (s === 'pending' || s === 'processing') return 'pending';
  if (s === 'cancelled' || s === 'canceled') return 'cancelled';
  return 'default';
};

const BuyerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    total: 0,
  });
  const navigate = useNavigate();
  const dialogTitleId = useId();

  const fetchOrders = useCallback(async (page = 1) => {
    setLoading(true);
    setLoadError(null);
    try {
      const response = await api.get(`/orders?page=${page}`);
      const responseData = response.data;
      if (responseData.data) {
        setOrders(responseData.data);
        setPagination({
          current_page: responseData.current_page,
          last_page: responseData.last_page,
          total: responseData.total,
        });
      } else {
        const list = Array.isArray(responseData) ? responseData : [];
        setOrders(list);
        setPagination({ current_page: 1, last_page: 1, total: list.length });
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
      setLoadError('We could not load your orders. Check your connection and try again.');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  useEffect(() => {
    if (!selectedOrder) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') setSelectedOrder(null);
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [selectedOrder]);

  const closeModal = () => setSelectedOrder(null);

  const totalLabel = pagination.total === 1 ? '1 order' : `${pagination.total} orders`;

  return (
    <div className="bm-page bo-page">
      <BuyerNavbar
        onSearch={(q) => {
          navigate(`/buyer/dashboard?q=${encodeURIComponent(q)}`);
        }}
      />

      <main className="bo-main" id="bo-main">
        <div className="bo-container">
          <nav className="bo-breadcrumb" aria-label="Breadcrumb">
            <Link to="/buyer/dashboard" className="bo-breadcrumb__link">
              Buyer home
            </Link>
            <ChevronRight className="bo-breadcrumb__sep" aria-hidden size={14} />
            <span className="bo-breadcrumb__current">My orders</span>
          </nav>

          <div className="bo-toolbar">
            <button type="button" className="bo-back" onClick={() => navigate(-1)} aria-label="Go back">
              <ArrowLeft size={20} aria-hidden />
              Back
            </button>
            <div className="bo-head">
              <h1 className="bo-title">Track your orders</h1>
              <p className="bo-subtitle">View status, delivery details, and line items for each purchase.</p>
            </div>
          </div>

          {loadError && (
            <div className="bo-alert" role="alert">
              <span>{loadError}</span>
              <button type="button" className="bo-alert__retry" onClick={() => fetchOrders(pagination.current_page)}>
                Retry
              </button>
            </div>
          )}

          {loading ? (
            <div className="bo-loading" aria-busy="true" aria-live="polite">
              <Loader2 className="bo-spin" size={40} aria-hidden />
              <span>Loading your orders…</span>
            </div>
          ) : orders.length > 0 ? (
            <>
              <ul className="bo-grid">
                {orders.map((order) => {
                  const tone = statusTone(order.status);
                  return (
                    <li key={order.id} className="bo-card">
                      <div>
                        <div className="bo-card__top">
                          <h2 className="bo-card__id">Order #{order.id}</h2>
                          <span className={`bo-status bo-status--${tone}`}>{order.status}</span>
                        </div>
                        <p className="bo-card__date">
                          Placed{' '}
                          {order.order_date
                            ? new Date(order.order_date).toLocaleString(undefined, {
                                dateStyle: 'medium',
                                timeStyle: 'short',
                              })
                            : '—'}
                        </p>
                        <button type="button" className="bo-card__btn" onClick={() => setSelectedOrder(order)}>
                          View details
                        </button>
                      </div>
                      <div className="bo-card__foot">
                        <span className="bo-card__foot-label">Total</span>
                        <span className="bo-card__total">Rs. {Number(order.total_amount || 0).toFixed(2)}</span>
                      </div>
                    </li>
                  );
                })}
              </ul>

              {pagination.last_page > 1 && (
                <nav className="bo-pagination" aria-label="Order list pages">
                  <button
                    type="button"
                    className="bo-page-btn"
                    onClick={() => fetchOrders(pagination.current_page - 1)}
                    disabled={pagination.current_page === 1}
                  >
                    Previous
                  </button>
                  <span className="bo-page-meta">
                    Page {pagination.current_page} of {pagination.last_page} · {totalLabel}
                  </span>
                  <button
                    type="button"
                    className="bo-page-btn"
                    onClick={() => fetchOrders(pagination.current_page + 1)}
                    disabled={pagination.current_page === pagination.last_page}
                  >
                    Next
                  </button>
                </nav>
              )}
            </>
          ) : (
            !loadError && (
              <div className="bo-empty">
                <div className="bo-empty__icon" aria-hidden>
                  <Package size={40} strokeWidth={1.25} />
                </div>
                <h2 className="bo-empty__title">No orders yet</h2>
                <p className="bo-empty__text">When you place an order, it will show up here with tracking details.</p>
                <Link to="/buyer/dashboard" className="bo-empty__cta">
                  Start shopping
                  <ChevronRight size={18} aria-hidden />
                </Link>
              </div>
            )
          )}
        </div>
      </main>

      <BuyerFooter />

      {selectedOrder && (
        <div
          className="bo-modal-overlay"
          role="presentation"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeModal();
          }}
        >
          <div
            className="bo-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby={dialogTitleId}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bo-modal__head">
              <h2 id={dialogTitleId} className="bo-modal__title">
                Order #{selectedOrder.id}
              </h2>
              <button type="button" className="bo-modal__close" onClick={closeModal} aria-label="Close order details">
                <X size={20} />
              </button>
            </div>
            <div className="bo-modal__body">
              <h3 className="bo-modal__section-title">Delivery</h3>
              <div className="bo-modal__box">
                <p className="bo-modal__addr">{selectedOrder.address || 'No delivery address on file.'}</p>
                <div className="bo-modal__row">
                  <span>Payment</span>
                  <strong>{selectedOrder.payment_preference || 'Cash'}</strong>
                </div>
                <div className="bo-modal__row">
                  <span>Status</span>
                  <strong>{selectedOrder.status}</strong>
                </div>
              </div>

              <h3 className="bo-modal__section-title">Items</h3>
              {selectedOrder.items && selectedOrder.items.length > 0 ? (
                <ul className="bo-line-list">
                  {selectedOrder.items.map((item) => {
                    const inv = item.inventory;
                    const name = inv?.product_name || 'Product';
                    const img = inv?.image ? storageUrl(inv.image) : null;
                    const qty = item.qty ?? 0;
                    const unit = Number(item.price_at_order ?? 0);
                    const sub = Number(item.sub_total ?? qty * unit);
                    return (
                      <li key={item.id ?? `${name}-${qty}`} className="bo-line">
                        <div className="bo-line__left">
                          <div className="bo-line__thumb">
                            {img ? (
                              <img
                                src={img}
                                alt=""
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                }}
                              />
                            ) : (
                              <Package size={22} aria-hidden />
                            )}
                          </div>
                          <div>
                            <p className="bo-line__name">{name}</p>
                            <p className="bo-line__meta">
                              Qty {qty} × Rs. {unit.toFixed(2)}
                            </p>
                          </div>
                        </div>
                        <span className="bo-line__price">Rs. {sub.toFixed(2)}</span>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="bo-muted">No line items returned for this order.</p>
              )}

              <div className="bo-modal__total">
                <span className="bo-modal__total-label">Order total</span>
                <span className="bo-modal__total-value">Rs. {Number(selectedOrder.total_amount || 0).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BuyerOrders;
