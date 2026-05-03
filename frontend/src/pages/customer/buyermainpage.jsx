import { useState, useEffect, useRef, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Menu, X, Search, UploadCloud } from 'lucide-react';
import { User, ShoppingCart, Info } from 'lucide-react';
import '../../styles/customerhome.css';
import '../../styles/buyermainpage.css';
import ProductCard from '../../components/ProductCard';
import BuyerNavbar from '../../components/BuyerNavbar';
import BuyerFooter from '../../components/BuyerFooter';
import { CategorySkeleton, ProductCardSkeleton } from '../../components/Skeletons';
import api from '../../api/axios';
import premiumBanner from '../../assets/images/premium_banner.png';

const defaultCategories = [
  {
    label: 'Medicine',
    to: '/buyer/category/1/medicine',
    items: [
      { label: 'Derma', to: '/buyer/category/1-1/derma' },
      { label: 'Gastro-Intestinal Tract', to: '/buyer/category/1-2/gastro-intestinal-tract' },
      { label: 'Circulatory System', to: '/buyer/category/1-3/circulatory-system' },
      { label: 'Others', to: '/buyer/category/1-4/others' },
      { label: 'Endocrine System', to: '/buyer/category/1-5/endocrine-system' },
      { label: 'Eyes, Nose & Ear', to: '/buyer/category/1-6/eyes-nose-ear' },
      { label: 'Urinary Tract System', to: '/buyer/category/1-7/urinary-tract-system' },
      { label: 'Central Nervous System', to: '/buyer/category/1-8/central-nervous-system' },
      { label: 'Respiratory Tract System', to: '/buyer/category/1-9/respiratory-tract-system' },
      { label: 'Cardio-Vascular System', to: '/buyer/category/1-10/cardio-vascular-system' },
      { label: 'Oral Care', to: '/buyer/category/1-11/oral-care' },
    ],
  },
];

const Buyermainpage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const pageRef = useRef(null);
  const [openCategory, setOpenCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('customer_token'));
  const [wishlistIds, setWishlistIds] = useState(new Set());
  const [recentOrders, setRecentOrders] = useState([]);

  // Wishlist logic remains for product cards

  // Parallel fetch logic for better speed (unifies category, product, and wishlist)


  const fetchRef = useRef(false);

  // Parallel fetch logic for better speed
  const fetchAllData = async (query = '') => {
    // If we're already fetching and it's not a filtered query, skip
    if (fetchRef.current && !query) return;
    if (!query) fetchRef.current = true;

    setLoadingCategories(true);
    setLoadingProducts(true);

    try {
      const url = `/buyer/dashboard${query ? `?q=${encodeURIComponent(query)}` : ''}`;
      const response = await api.get(url);
      const { categories, inventory, wishlist, recentOrders } = response.data;

      // 1. Process Categories
      const cats = Array.isArray(categories.data) ? categories.data : (Array.isArray(categories) ? categories : []);
      const mappedCats = cats.map(cat => ({
        id: cat.id,
        label: cat.name,
        to: `/buyer/category/${cat.id}/${slugify(cat.name)}`,
        image: cat.image ? `http://localhost:8000/storage/${cat.image}` : (findImageForLabel(cat.name) || `https://via.placeholder.com/150?text=${encodeURIComponent(cat.name)}`),
        items: []
      }));
      setCategories(mappedCats);
      setLoadingCategories(false);

      // 2. Process Wishlist
      const wishSet = new Set(wishlist || []);
      setWishlistIds(wishSet);

      // 3. Process Products
      const prodItems = inventory.data ? inventory.data : (Array.isArray(inventory) ? inventory : []);
      const mappedProducts = prodItems.map(item => ({
        id: item.id,
        name: item.product_name,
        image: item.image ? `http://localhost:8000/storage/${item.image}` : ('https://via.placeholder.com/200x200/f8f9fa/333?text=' + encodeURIComponent(item.product_name)),
        price: parseFloat(item.price),
        originalPrice: item.mrp ? parseFloat(item.mrp) : null,
        stock: item.stock,
        isWishlisted: wishSet.has(item.id),
      }));
      setProducts(mappedProducts);
      setLoadingProducts(false);

      // 4. Process Recent Orders
      setRecentOrders(recentOrders || []);

    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setLoadingCategories(false);
      setLoadingProducts(false);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const q = params.get('q') || '';
    setSearchQuery(q);
    fetchAllData(q);
  }, []);

  // Separate effect for authenticated data
  useEffect(() => {
    if (isLoggedIn) {
      const fetchRecentOrders = async () => {
        try {
          const response = await api.get('/buyer/recent-orders');
          setRecentOrders(response.data || []);
        } catch (err) {
          console.error('Error fetching recent orders:', err);
        }
      };
      fetchRecentOrders();
    }
  }, [isLoggedIn]);

  // 1. Memoize category image glob entries once
  const categoryImagesGlob = import.meta.glob('/src/assets/images/category/*.{png,jpg,jpeg,webp}', { eager: true, as: 'url' });
  const imageEntries = useMemo(() => Object.keys(categoryImagesGlob).map((p) => ({
    path: p,
    name: p.split('/').pop().replace(/\.[^.]+$/, ''),
    url: categoryImagesGlob[p],
  })), []);

  const normalize = (s) =>
    s
      .toLowerCase()
      .trim()
      .replace(/&amp;|&/g, 'and')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/-+/g, '-')
      .replace(/(^-|-$)/g, '');

  const findImageForLabel = (label) => {
    if (!label) return null;
    const labelNorm = normalize(label);

    // first try simple equality / substring on normalized names
    for (const entry of imageEntries) {
      const nameNorm = normalize(entry.name);
      if (nameNorm === labelNorm || nameNorm.includes(labelNorm) || labelNorm.includes(nameNorm)) return entry.url;
    }

    // token-based matching: require partial overlap of meaningful tokens
    const labelTokens = labelNorm.split('-').filter(Boolean);
    for (const entry of imageEntries) {
      const nameNorm = normalize(entry.name);
      const nameTokens = nameNorm.split('-').filter(Boolean);
      const common = labelTokens.filter((t) => nameTokens.includes(t)).length;
      const needed = Math.max(1, Math.ceil(labelTokens.length / 2));
      if (common >= needed) return entry.url;
    }

    return null;
  };

  const slugify = (label) =>
    label
      .toLowerCase()
      .replace(/&/g, 'and')
      .replace(/[^\w]+/g, '-')
      .replace(/-+/g, '-')
      .replace(/(^-|-$)/g, '');

  // 2. Memoize fully resolved categories with images
  const displayCategories = useMemo(() => {
    const baseCats = categories.length > 0 ? categories : defaultCategories;
    return baseCats.map(cat => {
      const slug = slugify(cat.label);
      const resolved = findImageForLabel(cat.label);

      // Return a pre-processed category object
      return {
        ...cat,
        slug,
        resolvedImage: resolved || `/assets/categories/${slug}.webp` // Default path if not found
      };
    });
  }, [categories, imageEntries]);

  // Redundant logout removed, handled by BuyerNavbar


  // Redundant logout removed, handled by BuyerNavbar

  const displayProducts = products.length > 0 ? products : [];

  // Toggle wishlist handler with Optimistic UI updates
  const toggleWishlist = async (productId) => {
    if (!isLoggedIn) {
      alert('Please login to add items to your wishlist.');
      navigate('/buyer/login');
      return;
    }

    const isCurrentlyWishlisted = wishlistIds.has(productId);

    // 1. Optimistically update state
    setWishlistIds(prev => {
      const next = new Set(prev);
      if (isCurrentlyWishlisted) next.delete(productId);
      else next.add(productId);
      return next;
    });

    setProducts(prevProducts =>
      prevProducts.map(p =>
        p.id === productId ? { ...p, isWishlisted: !isCurrentlyWishlisted } : p
      )
    );

    try {
      if (isCurrentlyWishlisted) {
        await api.delete(`/wishlist/${productId}`);
      } else {
        await api.post('/wishlist', { inventory_id: productId });
      }
    } catch (err) {
      console.error('Error toggling wishlist:', err);
      // 2. Rollback on failure
      setWishlistIds(prev => {
        const next = new Set(prev);
        if (isCurrentlyWishlisted) next.add(productId);
        else next.delete(productId);
        return next;
      });
      setProducts(prevProducts =>
        prevProducts.map(p =>
          p.id === productId ? { ...p, isWishlisted: isCurrentlyWishlisted } : p
        )
      );
      alert('Failed to update wishlist. Please try again.');
    }
  };

  // Add to cart handler (frontend only - will integrate with backend later)
  const addToCart = (product) => {
    if (!isLoggedIn) {
      alert('Please login to add items to your cart.');
      navigate('/buyer/login');
      return;
    }
    
    if (product.stock <= 0) {
      alert('Sorry, this item is out of stock! Let\'s continue shopping for other items.');
      return;
    }

    // eslint-disable-next-line no-console
    console.log('Adding to cart:', product);
    // TODO: Integrate with cart context/state management
    const savedCart = localStorage.getItem('mediEcom_cart');
    const cart = savedCart ? JSON.parse(savedCart) : [];
    cart.push(product);
    localStorage.setItem('mediEcom_cart', JSON.stringify(cart));

    // alert(`${product.name} added to cart!`);
  };

  const clearSearch = () => {
    setSearchQuery('');
    fetchAllData('');
    navigate('/buyer/dashboard');
  };


  // Categories fallback logic moved to useMemo


  useEffect(() => {
    const el = pageRef.current;
    if (!el) return;

    const update = () => {
      // Prefer centering to the logo element so the pill aligns with it
      const logo = el.querySelector('.header__logo');
      if (logo) {
        const rect = logo.getBoundingClientRect();
        const top = rect.top + rect.height / 2;
        el.style.setProperty('--bm-about-top', `${top}px`);
      } else {
        // Fallback to header center if logo is not available
        const header = el.querySelector('.header');
        if (header) {
          const headerRect = header.getBoundingClientRect();
          const top = headerRect.top + headerRect.height / 2;
          el.style.setProperty('--bm-about-top', `${top}px`);
        }
      }

      // Measure action bar width and publish CSS variable so categories can stop before it
      const actionBar = el.querySelector('.bm-action-bar');
      if (actionBar) {
        const ar = actionBar.getBoundingClientRect();
        // include a small gap to the right (12px)
        const offset = Math.round(ar.width + 12);
        el.style.setProperty('--bm-actionbar-offset', `${offset}px`);
      }
    };

    update();
    let rafId = 0;
    const onResize = () => { cancelAnimationFrame(rafId); rafId = requestAnimationFrame(update); };
    window.addEventListener('resize', onResize);
    window.addEventListener('scroll', update, true);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', update, true);
    };
  }, []);

  // Close dropdowns when clicking outside any category
  useEffect(() => {
    const onDocClick = (e) => {
      // if clicked inside a category element or inside an open dropdown, keep open state
      if (e.target.closest('.bm-category') || e.target.closest('.bm-category-dropdown')) return;
      setOpenCategory(null);
    };
    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, []);

  // On desktop enable hover open (mouse enter/leave) so dropdown appears on hover
  useEffect(() => {
    const root = pageRef.current;
    if (!root) return;

    const supportsHover = window.matchMedia('(hover: hover) and (min-width: 768px)').matches;
    if (!supportsHover) return;

    const items = Array.from(root.querySelectorAll('.bm-category'));
    function onEnter(e) {
      const key = e.currentTarget.getAttribute('data-cat');
      setOpenCategory(key);

      // position dropdown for this category immediately
      const drop = root.querySelector(`[data-drop="${key}"]`);
      if (drop) {
        const rect = e.currentTarget.getBoundingClientRect();
        const left = Math.max(8, rect.left);
        const top = rect.bottom + 8;
        drop.style.left = `${left}px`;
        drop.style.top = `${top}px`;
        drop.style.minWidth = `${Math.max(rect.width, 180)}px`;
      }
    }
    function onLeave(e) {
      // if leaving to a dropdown keep open
      const related = e.relatedTarget;
      if (related && (related.closest && related.closest('.bm-category-dropdown'))) return;
      setOpenCategory(null);
    }

    items.forEach((el) => {
      el.addEventListener('mouseenter', onEnter);
      el.addEventListener('mouseleave', onLeave);
    });

    // cleanup
    return () => {
      items.forEach((el) => {
        el.removeEventListener('mouseenter', onEnter);
        el.removeEventListener('mouseleave', onLeave);
      });
    };
  }, []);

  // When openCategory changes (click or keyboard), position the dropdown so it doesn't get clipped
  useEffect(() => {
    const root = pageRef.current;
    if (!root || !openCategory) return;

    const cat = root.querySelector(`[data-cat="${openCategory}"]`);
    const drop = root.querySelector(`[data-drop="${openCategory}"]`);
    if (!cat || !drop) return;

    const rect = cat.getBoundingClientRect();
    const left = Math.max(8, rect.left);
    let top = rect.bottom + 8;

    // ensure dropdown doesn't go past viewport right edge
    drop.style.minWidth = `${Math.max(rect.width, 180)}px`;
    drop.style.left = `${left}px`;
    drop.style.top = `${top}px`;

    const dr = drop.getBoundingClientRect();
    const viewportRight = window.innerWidth - 12;
    if (dr.right > viewportRight) {
      const shift = dr.right - viewportRight;
      drop.style.left = `${Math.max(8, left - shift)}px`;
    }

  }, [openCategory]);

  const catsRef = useRef(null);
  const scrollCats = (dir = 1) => {
    const el = catsRef.current;
    if (!el) return;
    const amount = Math.round(el.clientWidth * 0.6);
    el.scrollBy({ left: dir * amount, behavior: 'smooth' });
  };

  // Featured products scroll ref and handler
  const featuredRef = useRef(null);
  const scrollFeatured = (dir = 1) => {
    const el = featuredRef.current;
    if (!el) return;
    const amount = Math.round(el.clientWidth * 0.6);
    el.scrollBy({ left: dir * amount, behavior: 'smooth' });
  };


  // Build extra cards from any images in the folder that don't match the
  // existing `categories` list (so we use all remaining images as cards).
  const humanize = (name) =>
    name
      .replace(/[-_]+/g, ' ')
      .replace(/\band\b/g, '&')
      .replace(/\b\w/g, (m) => m.toUpperCase())
      .trim();

  const existingNorms = new Set(displayCategories.map((c) => normalize(c.label)));
  const extraImageCards = imageEntries
    .filter((e) => !existingNorms.has(normalize(e.name)))
    .map((e) => ({
      label: humanize(e.name),
      to: `/buyer/category/extra/${slugify(e.name)}`,
      image: e.url,
      name: e.name,
    }));

  // Debug: log resolved images for categories in dev mode
  if (import.meta.env.DEV) {
    try {
      const map = categories.map((c) => ({ label: c.label, image: findImageForLabel(c.label) }));
      // eslint-disable-next-line no-console
      console.log('Category image mapping:', map, 'available images:', imageEntries.map((i) => i.name));
    } catch (e) {
      // ignore
    }
  }

  // Keep category control buttons fixed to viewport but aligned to the visible card list edges
  useEffect(() => {
    const root = pageRef.current;
    if (!root) return;
    const section = root.querySelector('.bm-category-cards');
    const list = root.querySelector('.bm-cats-list');
    if (!section || !list) return;

    const update = () => {
      const sRect = section.getBoundingClientRect();
      const lRect = list.getBoundingClientRect();

      // vertical center of the section
      const top = Math.round(sRect.top + sRect.height / 2);
      root.style.setProperty('--bm-cats-top', `${top}px`);

      // Prefer the banner image edges so the card row lines up with the banner exactly
      const bannerImg = root.querySelector('.bm-banner-img');
      // increased inset so the left button sits closer to the first card
      const inset = 28;
      // ensure controls never sit flush to the viewport edge
      const minEdge = 24; // px
      if (bannerImg) {
        const bRect = bannerImg.getBoundingClientRect();
        // position buttons with proper inset from banner edges
        const leftRaw = Math.round(bRect.left);
        const rightRaw = Math.round(window.innerWidth - bRect.right);
        const left = Math.max(minEdge, leftRaw - inset);
        const right = Math.max(minEdge, rightRaw - inset);

        // set control positions (button left/right)
        root.style.setProperty('--bm-cats-controls-left', `${left}px`);
        root.style.setProperty('--bm-cats-controls-right', `${right}px`);

        // compute list paddings so cards sit directly adjacent to buttons
        const btnWidth = 44;
        const overlap = 0; // increase to tuck cards under the button
        const wrap = root.querySelector('.bm-cats-wrap');
        if (wrap) {
          // expose button width & overlap so CSS can calculate paddings directly
          root.style.setProperty('--bm-cats-btn-width', `${btnWidth}px`);
          root.style.setProperty('--bm-cats-overlap', `${overlap}px`);
          // clear explicit list shifts to let CSS calc from control positions (fallbacks remain)
          root.style.setProperty('--bm-cats-list-left', `0px`);
          root.style.setProperty('--bm-cats-list-right', `0px`);
          // small translate for edge cases (0 by default)
          root.style.setProperty('--bm-cats-translate-right', `0px`);
        }
      } else {
        // fallback to visible list bounds
        const leftRaw = Math.round(lRect.left);
        const rightRaw = Math.round(window.innerWidth - lRect.right);
        const left = Math.max(minEdge, leftRaw - inset);
        const right = Math.max(minEdge, rightRaw - inset);

        // set control positions using the same variables
        root.style.setProperty('--bm-cats-controls-left', `${left}px`);
        root.style.setProperty('--bm-cats-controls-right', `${right}px`);

        const btnWidth = 44;
        const overlap = 0;
        const wrap = root.querySelector('.bm-cats-wrap');
        if (wrap) {
          // expose button width & overlap so CSS can calculate paddings directly
          root.style.setProperty('--bm-cats-btn-width', `${btnWidth}px`);
          root.style.setProperty('--bm-cats-overlap', `${overlap}px`);
          // clear explicit list shifts to let CSS calc from control positions (fallbacks remain)
          root.style.setProperty('--bm-cats-list-left', `0px`);
          root.style.setProperty('--bm-cats-list-right', `0px`);
          root.style.setProperty('--bm-cats-translate-right', `0px`);
        }
      }
    };

    update();
    let raf = 0;
    const onResize = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(update); };
    const onWindowScroll = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(update); };

    window.addEventListener('resize', onResize);
    window.addEventListener('scroll', onWindowScroll, true);
    // listen to horizontal scroll inside the category list as well
    list.addEventListener('scroll', onWindowScroll, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', onWindowScroll, true);
      list.removeEventListener('scroll', onWindowScroll);
    };
  }, []);

  // Position featured products control buttons similar to category buttons
  useEffect(() => {
    const root = pageRef.current;
    if (!root) return;
    const section = root.querySelector('.bm-featured-products');
    const list = root.querySelector('.bm-featured-list');
    if (!section || !list) return;

    const update = () => {
      const sRect = section.getBoundingClientRect();

      // vertical center of the featured section
      const top = Math.round(sRect.top + sRect.height / 2);
      root.style.setProperty('--bm-featured-top', `${top}px`);

      // Use banner image edges for alignment
      const bannerImg = root.querySelector('.bm-banner-img');
      const inset = 28;
      const minEdge = 24;

      if (bannerImg) {
        const bRect = bannerImg.getBoundingClientRect();
        const leftRaw = Math.round(bRect.left);
        const rightRaw = Math.round(window.innerWidth - bRect.right);
        const left = Math.max(minEdge, leftRaw - inset);
        const right = Math.max(minEdge, rightRaw - inset);

        root.style.setProperty('--bm-featured-controls-left', `${left}px`);
        root.style.setProperty('--bm-featured-controls-right', `${right}px`);
      } else {
        // fallback
        const lRect = list.getBoundingClientRect();
        const leftRaw = Math.round(lRect.left);
        const rightRaw = Math.round(window.innerWidth - lRect.right);
        const left = Math.max(minEdge, leftRaw - inset);
        const right = Math.max(minEdge, rightRaw - inset);

        root.style.setProperty('--bm-featured-controls-left', `${left}px`);
        root.style.setProperty('--bm-featured-controls-right', `${right}px`);
      }
    };

    update();
    let raf = 0;
    const onResize = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(update); };
    const onWindowScroll = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(update); };

    window.addEventListener('resize', onResize);
    window.addEventListener('scroll', onWindowScroll, true);
    list.addEventListener('scroll', onWindowScroll, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', onWindowScroll, true);
      list.removeEventListener('scroll', onWindowScroll);
    };
  }, []);


  return (
    <div className="bm-page" ref={pageRef}>
      <BuyerNavbar onSearch={(q) => {
        setSearchQuery(q);
        fetchAllData(q);
        navigate(`/buyer/dashboard?q=${encodeURIComponent(q)}`);
      }} />

      {/* Categories nav under header */}
      <nav className="bm-categories" aria-label="Medicine categories">
        <div className="header__container">
          {displayCategories.map((c, idx) => (
            <div key={`cat-nav-${c.id || idx}`} className="bm-category-wrap">
              <Link
                to={c.to}
                data-cat={c.to}
                className="bm-category"
                aria-expanded={openCategory === c.to}
                onClick={() => {
                  // desktop: close any open dropdown
                  setOpenCategory(null);
                }}
                onKeyDown={(e) => {
                  // For keyboard, mirror click behavior: Enter/Space toggles on small screens, otherwise allow native navigation
                  if (e.key === 'Enter' || e.key === ' ') {
                    const isMobile = window.matchMedia('(max-width: 767px)').matches;
                    if (isMobile && c.items && c.items.length) {
                      e.preventDefault();
                      setOpenCategory(openCategory === c.to ? null : c.to);
                    }
                  }
                }}
              >
                <span className="bm-category-label">{c.label}</span>
              </Link>

              {c.items && c.items.length > 0 && (
                <div data-drop={c.to} className={`bm-category-dropdown ${openCategory === c.to ? 'bm-open' : ''}`} role="menu" aria-label={`Subcategories for ${c.label}`}>
                  {c.items.map((it, sIdx) => (
                    <Link key={`subcat-${it.to}-${sIdx}`} to={it.to} className="bm-category-dropdown-item" onClick={() => setOpenCategory(null)} role="menuitem">
                      {it.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </nav>

      {/* Banner under categories (uses premium_banner.png from assets/images) */}
      <div className="bm-banner">
        <img src={premiumBanner} alt="Main banner" className="bm-banner-img" />

        {/* Glassmorphic content card (left side) */}
        <div className="bm-banner-card" role="region" aria-label="Promotional">
          <div className="bm-badge">AI-Powered Healthcare Platform</div>
          <h2 className="bm-banner-title">AI-Powered Medical & Healthcare Store</h2>
          <p className="bm-banner-sub">Search products using natural language. Get recommendations, alternatives, and safe medication suggestions — powered by AI.</p>
        </div>
      </div>

      {/* Quick Actions */}
      <section className="bm-quick-actions" aria-label="Quick Actions">
        <div className="header__container">
          <h3 className="bm-qa-title">Quick Actions</h3>
          <div className="bm-qa-grid">
            <Link to="/buyer/prescriptions" className="bm-action-card">
              <span className="bm-action-card-icon"><i className="bi bi-cloud-upload" aria-hidden="true"></i></span>
              <div className="bm-action-card-text">Upload Prescription<br /><small>(AI OCR)</small></div>
            </Link>

            <Link to="/buyer/support" className="bm-action-card">
              <span className="bm-action-card-icon"><i className="bi bi-headset" aria-hidden="true"></i></span>
              <div className="bm-action-card-text">Contact Support</div>
            </Link>

            <Link to="/buyer/orders" className="bm-action-card">
              <span className="bm-action-card-icon"><i className="bi bi-geo-alt" aria-hidden="true"></i></span>
              <div className="bm-action-card-text">Track Order</div>
            </Link>
          </div>
        </div>
      </section>

      {/* Categories cards (image tiles) */}
      <section className="bm-category-cards" aria-label="Popular categories">
        <div className="header__container">
          <h3 className="bm-cats-title">Categories</h3>
          <div className="bm-cats-wrap">
            <div className="bm-cats-list" ref={catsRef}>
              {loadingCategories ? (
                Array(8).fill(0).map((_, i) => <CategorySkeleton key={`cat-skeleton-${i}`} />)
              ) : (
                displayCategories.map((c, idx) => (
                  <Link to={c.to} className="bm-cat-card" key={`cat-card-${c.id || idx}`}>
                    <div className="bm-cat-img-wrap">
                      <img
                        src={c.resolvedImage}
                        alt={c.label}
                        className="bm-cat-img"
                        onError={(e) => {
                          e.currentTarget.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="320" height="220" viewBox="0 0 320 220"><rect width="100%" height="100%" fill="%23f7f9fb"/><text x="50%" y="50%" fill="%23999" font-family="Arial, Helvetica, sans-serif" font-size="14" text-anchor="middle" dominant-baseline="central">Image not available</text></svg>';
                        }}
                      />
                    </div>
                    <div className="bm-cat-label">{c.label}</div>
                  </Link>
                ))
              )}
            </div>

            <div className="bm-cats-controls" role="toolbar" aria-label="Scroll categories">
              <button className="bm-cats-btn prev" onClick={() => scrollCats(-1)} aria-label="Previous categories">
                <i className="bi bi-chevron-left" aria-hidden="true"></i>
              </button>
              <button className="bm-cats-btn next" onClick={() => scrollCats(1)} aria-label="Next categories">
                <i className="bi bi-chevron-right" aria-hidden="true"></i>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Orders Section */}
      {isLoggedIn && recentOrders.length > 0 && (
        <section className="bm-recent-orders" aria-label="Recent Orders">
          <div className="header__container">
            <div className="bm-orders-header">
              <h3 className="bm-orders-title">Recent Orders</h3>
              <Link to="/buyer/orders" className="bm-view-all-btn">VIEW ALL</Link>
            </div>
            <div className="bm-orders-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
              {recentOrders
                .sort((a, b) => new Date(b.order_date) - new Date(a.order_date))
                .slice(0, 4)
                .map((order, idx) => (
                <Link key={`order-card-${order.id}-${idx}`} to="/buyer/orders" className="bm-order-card">
                  <div>
                    <div className="bm-order-number">Order #{order.id}</div>
                    <div className="bm-order-date">{new Date(order.order_date).toLocaleDateString()}</div>
                    <div className={`bm-order-status ${order.status.toLowerCase()}`}>
                      {order.status}
                    </div>
                  </div>
                  <div className="bm-order-footer">
                    <span className="bm-order-total-label">Total</span>
                    <span className="bm-order-total-value">Rs. {Number(order.total_amount).toFixed(2)}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Products Section */}
      <section className="bm-featured-products" aria-label="Featured Products">
        <div className="header__container">
          <div className="bm-featured-header">
            <h3 className="bm-featured-title">Featured Products</h3>
            <Link to="/products/featured" className="bm-view-all-btn">VIEW ALL</Link>
          </div>
         <div className="bm-product-grid">
            {loadingProducts ? (
              Array(4).fill(0).map((_, i) => <ProductCardSkeleton key={`prod-skeleton-${i}`} />)
            ) : (
              displayProducts.map((product) => (
                <ProductCard
                  key={`featured-prod-${product.id}`}
                  product={{
                    ...product,
                    isWishlisted: wishlistIds.has(product.id)
                  }}
                  onToggleWishlist={toggleWishlist}
                  onAddToCart={addToCart}
                />
              ))
            )}
          </div>
        </div>
      </section>

      <main className="bm-main"></main>
      <BuyerFooter />
    </div>
  );
};

export default Buyermainpage;
