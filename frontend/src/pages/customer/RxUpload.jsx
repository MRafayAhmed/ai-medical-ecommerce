import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Upload,
  FileText,
  ArrowRight,
  Loader2,
  Sparkles,
  ShoppingCart,
  Search,
  ShieldCheck,
  ImagePlus,
  X,
  ChevronRight,
  Camera,
  Images,
} from 'lucide-react';
import api from '../../api/axios';
import '../../styles/customerhome.css';
import '../../styles/rxupload.css';
import BuyerNavbar from '../../components/BuyerNavbar';
import BuyerFooter from '../../components/BuyerFooter';

const API_ORIGIN = 'http://127.0.0.1:8000';

const storageUrl = (path) => {
  if (!path) return null;
  const p = String(path).trim();
  if (p.startsWith('http://') || p.startsWith('https://')) return p;
  return `${API_ORIGIN}/storage/${p.replace(/^\/?storage\/?/, '')}`;
};

const normalizeRxResponse = (data) => {
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.data)) return data.data;
  if (data && Array.isArray(data.medicines)) return data.medicines;
  return [];
};

const RxUpload = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const previewRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [extractedMeds, setExtractedMeds] = useState(null);
  const [alternatives, setAlternatives] = useState({});
  const [loadingAlternatives, setLoadingAlternatives] = useState({});
  const [banner, setBanner] = useState(null);

  const showBanner = useCallback((type, message) => {
    setBanner(type && message ? { type, message } : null);
  }, []);

  useEffect(() => {
    if (!banner) return undefined;
    const t = window.setTimeout(() => setBanner(null), 5000);
    return () => window.clearTimeout(t);
  }, [banner]);

  useEffect(() => {
    return () => {
      if (previewRef.current) {
        URL.revokeObjectURL(previewRef.current);
        previewRef.current = null;
      }
    };
  }, []);

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (selected) {
      if (previewRef.current) URL.revokeObjectURL(previewRef.current);
      const url = URL.createObjectURL(selected);
      previewRef.current = url;
      setFile(selected);
      setPreview(url);
      setExtractedMeds(null);
      setAlternatives({});
      showBanner(null);
    }
    e.target.value = '';
  };

  const clearFile = () => {
    if (previewRef.current) {
      URL.revokeObjectURL(previewRef.current);
      previewRef.current = null;
    }
    setFile(null);
    setPreview(null);
    setExtractedMeds(null);
    setAlternatives({});
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    showBanner(null);
    const formData = new FormData();
    formData.append('rx_image', file);

    try {
      const response = await api.post('/medical-inventory/analyze-rx', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const list = normalizeRxResponse(response.data);
      setExtractedMeds(list);
      if (list.length === 0) {
        showBanner('info', 'No medicines were detected. Try a clearer photo or a different angle.');
      } else {
        showBanner('success', `Found ${list.length} medicine${list.length === 1 ? '' : 's'}. Review below and add to cart when ready.`);
      }
    } catch (error) {
      console.error('Error analyzing prescription:', error);
      showBanner('error', 'We could not read this prescription. Please check your connection and try again.');
    } finally {
      setUploading(false);
    }
  };

  const fetchAlternatives = async (genericName, index) => {
    setLoadingAlternatives((prev) => ({ ...prev, [index]: true }));
    try {
      const response = await api.get(
        `/medical-inventory/alternatives?generic_name=${encodeURIComponent(genericName)}`
      );
      setAlternatives((prev) => ({
        ...prev,
        [index]: response.data,
      }));
    } catch (error) {
      console.error('Error fetching alternatives', error);
      showBanner('error', 'Could not load alternatives. Try again in a moment.');
    } finally {
      setLoadingAlternatives((prev) => ({ ...prev, [index]: false }));
    }
  };

  const addToCart = (product) => {
    if (product.stock <= 0) {
      showBanner('error', 'That item is out of stock.');
      return;
    }
    const savedCart = localStorage.getItem('mediEcom_cart');
    const cart = savedCart ? JSON.parse(savedCart) : [];
    cart.push(product);
    localStorage.setItem('mediEcom_cart', JSON.stringify(cart));
    const label = product.product_name || product.name || 'Item';
    showBanner('success', `${label} added to your cart.`);
  };

  const handleOrderNow = async (medName) => {
    try {
      const response = await api.get(`/medical-inventory?q=${encodeURIComponent(medName)}`);
      const raw = response.data?.data ?? response.data;
      const items = Array.isArray(raw) ? raw : [];

      if (items.length > 0) {
        const item = items[0];
        const cartItem = {
          id: item.id,
          name: item.product_name,
          image: item.image ? storageUrl(item.image) : `https://via.placeholder.com/200x200?text=${encodeURIComponent(item.product_name)}`,
          price: parseFloat(item.price),
          originalPrice: item.mrp ? parseFloat(item.mrp) : null,
          stock: item.stock,
        };
        addToCart(cartItem);
      } else {
        showBanner('info', `"${medName}" was not found in our catalog. Try Find alternatives or search the shop.`);
      }
    } catch (error) {
      console.error('Error ordering item:', error);
      showBanner('error', 'Something went wrong while searching inventory.');
    }
  };

  return (
    <div className="bm-page rx-page">
      <BuyerNavbar
        onSearch={(q) => {
          navigate(`/buyer/dashboard?q=${encodeURIComponent(q)}`);
        }}
      />

      <main className="rx-main" id="rx-main">
        <div className="rx-container">
          <nav className="rx-breadcrumb" aria-label="Breadcrumb">
            <Link to="/buyer/dashboard" className="rx-breadcrumb__link">
              Buyer home
            </Link>
            <ChevronRight className="rx-breadcrumb__sep" aria-hidden size={14} />
            <span className="rx-breadcrumb__current">Prescription upload</span>
          </nav>

          <header className="rx-hero">
            <div className="rx-hero__copy">
              <p className="rx-eyebrow">
                <Sparkles size={16} aria-hidden />
                AI-assisted
              </p>
              <h1 className="rx-hero__title">Upload your prescription</h1>
              <p className="rx-hero__lead">
                Take a clear photo of your Rx. We will suggest matching products and in-stock alternatives so you can
                shop faster—always double-check doses with your pharmacist.
              </p>
            </div>
            <ul className="rx-steps" aria-label="How it works">
              <li className="rx-step">
                <span className="rx-step__num" aria-hidden>
                  1
                </span>
                <span className="rx-step__text">Upload a sharp image (JPG, PNG, or WEBP)</span>
              </li>
              <li className="rx-step">
                <span className="rx-step__num" aria-hidden>
                  2
                </span>
                <span className="rx-step__text">Run analysis to extract medicine names</span>
              </li>
              <li className="rx-step">
                <span className="rx-step__num" aria-hidden>
                  3
                </span>
                <span className="rx-step__text">Order or explore alternatives, then checkout</span>
              </li>
            </ul>
          </header>

          {banner && (
            <div
              className={`rx-banner rx-banner--${banner.type}`}
              role={banner.type === 'error' ? 'alert' : 'status'}
            >
              <span className="rx-banner__text">{banner.message}</span>
              <button type="button" className="rx-banner__dismiss" onClick={() => showBanner(null)} aria-label="Dismiss">
                <X size={18} />
              </button>
            </div>
          )}

          <div className="rx-layout">
            <section className="rx-card rx-card--upload" aria-labelledby="rx-upload-heading">
              <div className="rx-card__head">
                <h2 id="rx-upload-heading" className="rx-card__title">
                  <ImagePlus size={22} strokeWidth={2} aria-hidden />
                  Prescription image
                </h2>
                <p className="rx-card__subtitle">Good lighting and full page in frame work best.</p>
              </div>

              <div className={`rx-dropzone ${file ? 'rx-dropzone--filled' : ''}`}>
                <input
                  type="file"
                  id="rx-file-desktop"
                  tabIndex={-1}
                  accept="image/jpeg,image/png,image/webp,image/*"
                  onChange={handleFileChange}
                />
                <input
                  type="file"
                  id="rx-file-camera"
                  tabIndex={-1}
                  accept="image/jpeg,image/png,image/webp,image/*"
                  capture="environment"
                  onChange={handleFileChange}
                />
                <input
                  type="file"
                  id="rx-file-gallery"
                  tabIndex={-1}
                  accept="image/jpeg,image/png,image/webp,image/*"
                  onChange={handleFileChange}
                />

                {preview ? (
                  <>
                    <label htmlFor="rx-file-desktop" className="rx-dropzone__label rx-dropzone__label--fill rx-dropzone__label--desktop-only">
                      <img src={preview} alt="Preview of selected prescription" className="rx-dropzone__preview" />
                      <span className="rx-dropzone__hint">Tap to replace image</span>
                    </label>
                    <label htmlFor="rx-file-gallery" className="rx-dropzone__label rx-dropzone__label--fill rx-dropzone__label--mobile-only">
                      <img src={preview} alt="Preview of selected prescription" className="rx-dropzone__preview" />
                      <span className="rx-dropzone__hint">Tap to replace image</span>
                    </label>
                  </>
                ) : (
                  <>
                    <label htmlFor="rx-file-desktop" className="rx-dropzone__label rx-dropzone__label--desktop-only">
                      <span className="rx-dropzone__placeholder">
                        <Upload className="rx-dropzone__icon" strokeWidth={1.5} aria-hidden />
                        <span className="rx-dropzone__title">Drop an image or click to browse</span>
                        <span className="rx-dropzone__meta">JPG · PNG · WEBP · max 10 MB typical</span>
                      </span>
                    </label>
                    <div className="rx-dropzone__split-mobile" role="group" aria-label="Choose prescription photo source">
                      <label htmlFor="rx-file-camera" className="rx-dropzone__half rx-dropzone__half--camera">
                        <Camera className="rx-dropzone__half-icon" strokeWidth={1.75} aria-hidden />
                        <span className="rx-dropzone__half-title">Camera</span>
                        <span className="rx-dropzone__half-meta">Take a photo</span>
                      </label>
                      <span className="rx-dropzone__split-rule" aria-hidden />
                      <label htmlFor="rx-file-gallery" className="rx-dropzone__half rx-dropzone__half--gallery">
                        <Images className="rx-dropzone__half-icon" strokeWidth={1.75} aria-hidden />
                        <span className="rx-dropzone__half-title">Gallery</span>
                        <span className="rx-dropzone__half-meta">Choose a file</span>
                      </label>
                    </div>
                  </>
                )}
              </div>

              {file && (
                <div className="rx-upload-actions">
                  <button type="button" className="rx-btn rx-btn--ghost" onClick={clearFile}>
                    Remove
                  </button>
                  <button
                    type="button"
                    className="rx-btn rx-btn--primary rx-btn--grow"
                    onClick={handleUpload}
                    disabled={uploading}
                    aria-busy={uploading}
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="rx-spin" aria-hidden size={20} />
                        Analyzing…
                      </>
                    ) : (
                      <>
                        <Sparkles size={18} aria-hidden />
                        Analyze prescription
                      </>
                    )}
                  </button>
                </div>
              )}
            </section>

            <section className="rx-card rx-card--results" aria-labelledby="rx-results-heading">
              <div className="rx-card__head rx-card__head--row">
                <div>
                  <h2 id="rx-results-heading" className="rx-card__title">
                    <FileText size={22} strokeWidth={2} aria-hidden />
                    Detected medicines
                  </h2>
                  <p className="rx-card__subtitle">Search inventory, add to cart, or compare alternatives.</p>
                </div>
                <Link to="/buyer/dashboard" className="rx-btn rx-btn--outline rx-btn--compact">
                  Browse shop
                  <ArrowRight size={16} aria-hidden />
                </Link>
              </div>

              {extractedMeds === null && (
                <div className="rx-empty" role="region" aria-live="polite">
                  <div className="rx-empty__icon" aria-hidden>
                    <Search size={28} strokeWidth={1.25} />
                  </div>
                  <h3 className="rx-empty__title">No analysis yet</h3>
                  <p className="rx-empty__text">
                    Upload a prescription image above, then run analysis. Your matches and alternatives will show up
                    here.
                  </p>
                </div>
              )}

              {extractedMeds !== null && extractedMeds.length === 0 && (
                <div className="rx-empty rx-empty--muted" role="status">
                  <div className="rx-empty__icon" aria-hidden>
                    <FileText size={28} strokeWidth={1.25} />
                  </div>
                  <h3 className="rx-empty__title">Nothing detected</h3>
                  <p className="rx-empty__text">
                    Try again with a brighter photo, less glare, and all lines readable. If the problem continues, use
                    manual search from the dashboard.
                  </p>
                </div>
              )}

              {extractedMeds !== null && extractedMeds.length > 0 && (
                <ul className="rx-med-list">
                  {extractedMeds.map((med, idx) => (
                    <li key={`${med.name}-${med.generic}-${idx}`} className="rx-med">
                      <div className="rx-med__top">
                        <div className="rx-med__icon" aria-hidden>
                          <FileText size={22} />
                        </div>
                        <div className="rx-med__body">
                          <h3 className="rx-med__name">{med.name}</h3>
                          <div className="rx-med__tags">
                            {med.generic && (
                              <span className="rx-tag rx-tag--success">{med.generic}</span>
                            )}
                            {med.dosage && <span className="rx-tag rx-tag--muted">{med.dosage}</span>}
                          </div>
                        </div>
                      </div>

                      <div className="rx-med__actions">
                        <button type="button" className="rx-btn rx-btn--primary" onClick={() => handleOrderNow(med.name)}>
                          <ShoppingCart size={18} aria-hidden />
                          Match & add
                        </button>
                        <button
                          type="button"
                          className="rx-btn rx-btn--outline"
                          onClick={() => fetchAlternatives(med.generic, idx)}
                          disabled={!med.generic || loadingAlternatives[idx]}
                        >
                          {loadingAlternatives[idx] ? (
                            <>
                              <Loader2 className="rx-spin" size={18} aria-hidden />
                              Loading…
                            </>
                          ) : (
                            'Find alternatives'
                          )}
                        </button>
                      </div>

                      {alternatives[idx] && (
                        <div className="rx-alts rx-fade-in">
                          <h4 className="rx-alts__title">
                            Alternatives for <strong>{med.generic}</strong>
                          </h4>
                          {alternatives[idx].length > 0 ? (
                            <ul className="rx-alt-grid">
                              {alternatives[idx].map((alt) => (
                                <li key={alt.id} className="rx-alt-card">
                                  <div className="rx-alt-card__img">
                                    <img
                                      src={alt.image ? storageUrl(alt.image) : 'https://via.placeholder.com/120'}
                                      alt=""
                                    />
                                  </div>
                                  <div className="rx-alt-card__body">
                                    <p className="rx-alt-card__name">{alt.product_name}</p>
                                    <p className="rx-alt-card__price">Rs. {Number(alt.price).toFixed(2)}</p>
                                    <button
                                      type="button"
                                      className="rx-btn rx-btn--dark rx-btn--block"
                                      onClick={() =>
                                        addToCart({
                                          id: alt.id,
                                          name: alt.product_name,
                                          image: alt.image ? storageUrl(alt.image) : `https://via.placeholder.com/200x200?text=${encodeURIComponent(alt.product_name)}`,
                                          price: parseFloat(alt.price),
                                          originalPrice: alt.mrp ? parseFloat(alt.mrp) : null,
                                          stock: alt.stock,
                                        })
                                      }
                                    >
                                      Add to cart
                                    </button>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="rx-alts__empty">No in-stock alternatives found for this generic.</p>
                          )}
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              )}

              <p className="rx-disclaimer">
                <ShieldCheck size={18} aria-hidden className="rx-disclaimer__icon" />
                AI results may be incomplete. Always follow your doctor&apos;s instructions and confirm with a licensed
                pharmacist before taking new medication.
              </p>
            </section>
          </div>
        </div>
      </main>

      <BuyerFooter />
    </div>
  );
};

export default RxUpload;
