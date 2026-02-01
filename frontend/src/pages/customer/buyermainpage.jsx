import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Menu, X, Search, UploadCloud } from 'lucide-react';
import { User, ShoppingCart, Info } from 'lucide-react';
import '../../styles/customerhome.css';
import '../../styles/buyermainpage.css';
import ProductCard from '../../components/customer/ProductCard';

const Buyermainpage = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const pageRef = useRef(null);
  const [openCategory, setOpenCategory] = useState(null);

  // Featured Products State (mock data - backend ready structure)
  const [featuredProducts, setFeaturedProducts] = useState([
    {
      id: 1,
      name: 'Bonanza Notorious Intense 100ml',
      image: 'https://via.placeholder.com/200x200/f8f9fa/333?text=Bonanza+Notorious',
      price: 3174.00,
      originalPrice: 5290.00,
      isWishlisted: false,
    },
    {
      id: 2,
      name: 'Bonanza Perfume No.9 60ml',
      image: 'https://via.placeholder.com/200x200/f8f9fa/333?text=Perfume+No.9',
      price: 3450.00,
      originalPrice: 4500.00,
      isWishlisted: false,
    },
    {
      id: 3,
      name: 'Bonanza Musk Royale 100ml',
      image: 'https://via.placeholder.com/200x200/f8f9fa/333?text=Musk+Royale',
      price: 7290.00,
      originalPrice: 9500.00,
      isWishlisted: false,
    },
    {
      id: 4,
      name: 'Duphaston Tablets 10mg (1 Strip = 10 Tablets)',
      image: 'https://via.placeholder.com/200x200/f8f9fa/333?text=Duphaston',
      price: 593.80,
      originalPrice: 625.00,
      isWishlisted: false,
    },
    {
      id: 5,
      name: 'Methycobal Tablets 500mcg (1 Strip = 10 Tablets)',
      image: 'https://via.placeholder.com/200x200/f8f9fa/333?text=Methycobal',
      price: 299.30,
      originalPrice: 315.01,
      isWishlisted: false,
    },
    {
      id: 6,
      name: 'Cilavit Uc-ii Tablets (1 Bottle = 20 Tablets)',
      image: 'https://via.placeholder.com/200x200/f8f9fa/333?text=Cilavit',
      price: 3372.50,
      originalPrice: 3550.00,
      isWishlisted: false,
    },
    {
      id: 7,
      name: 'Panadol Extra Tablets (1 Strip = 10 Tablets)',
      image: 'https://via.placeholder.com/200x200/f8f9fa/333?text=Panadol',
      price: 45.00,
      originalPrice: 50.00,
      isWishlisted: false,
    },
    {
      id: 8,
      name: 'Brufen 400mg Tablets (1 Strip = 10 Tablets)',
      image: 'https://via.placeholder.com/200x200/f8f9fa/333?text=Brufen',
      price: 120.00,
      originalPrice: 140.00,
      isWishlisted: false,
    },
  ]);

  // Sync featured products with saved wishlist on mount
  useEffect(() => {
    const saved = localStorage.getItem('mediEcom_wishlist');
    if (saved) {
      const savedList = JSON.parse(saved);
      const savedIds = new Set(savedList.map(p => p.id));
      setFeaturedProducts(prev => prev.map(p => ({
        ...p,
        isWishlisted: savedIds.has(p.id)
      })));
    }
  }, []);

  // Listen for wishlist updates from other pages
  useEffect(() => {
    const handleUpdate = () => {
      const saved = localStorage.getItem('mediEcom_wishlist');
      if (saved) {
        const savedIds = new Set(JSON.parse(saved).map(p => p.id));
        setFeaturedProducts(prev => prev.map(p => ({
          ...p,
          isWishlisted: savedIds.has(p.id)
        })));
      }
    };
    window.addEventListener('wishlistUpdated', handleUpdate);
    return () => window.removeEventListener('wishlistUpdated', handleUpdate);
  }, []);

  // Toggle wishlist handler
  const toggleWishlist = (productId) => {
    setFeaturedProducts((prevProducts) => {
      const updated = prevProducts.map((product) =>
        product.id === productId
          ? { ...product, isWishlisted: !product.isWishlisted }
          : product
      );

      // Save to localStorage for sync with Wishlist page
      const wishlistedItems = updated.filter(p => p.isWishlisted);
      localStorage.setItem('mediEcom_wishlist', JSON.stringify(wishlistedItems));

      return updated;
    });
  };

  // Add to cart handler (frontend only - will integrate with backend later)
  const addToCart = (product) => {
    // eslint-disable-next-line no-console
    console.log('Adding to cart:', product);
    // TODO: Integrate with cart context/state management
    alert(`${product.name} added to cart!`);
  };


  // Categories list for the quick nav under the header (with sample sub-items)
  const categories = [
    {
      label: 'Medicine',
      to: '/category/medicine',
      items: [
        { label: 'Derma', to: '/category/medicine/derma' },
        { label: 'Gastro-Intestinal Tract', to: '/category/medicine/gastro-intestinal-tract' },
        { label: 'Circulatory System', to: '/category/medicine/circulatory-system' },
        { label: 'Others', to: '/category/medicine/others' },
        { label: 'Endocrine System', to: '/category/medicine/endocrine-system' },
        { label: 'Eyes, Nose & Ear', to: '/category/medicine/eyes-nose-ear' },
        { label: 'Urinary Tract System', to: '/category/medicine/urinary-tract-system' },
        { label: 'Central Nervous System', to: '/category/medicine/central-nervous-system' },
        { label: 'Respiratory Tract System', to: '/category/medicine/respiratory-tract-system' },
        { label: 'Cardio-Vascular System', to: '/category/medicine/cardio-vascular-system' },
        { label: 'Oral Care', to: '/category/medicine/oral-care' },
      ],
    },
    {
      label: 'Baby & Mother Care',
      to: '/category/baby-mother',
      items: [
        { label: 'Baby Diapers & Wipes', to: '/category/baby-mother/diapers-wipes' },
        { label: 'Baby Bath & Body', to: '/category/baby-mother/bath-body' },
        { label: 'New Mommy Aids', to: '/category/baby-mother/new-mommy-aids' },
        { label: 'Baby Food & Milk', to: '/category/baby-mother/food-milk' },
        { label: 'Baby Appliances', to: '/category/baby-mother/appliances' },
        { label: 'Baby Essentials', to: '/category/baby-mother/essentials' },
      ],
    },

    {
      label: 'Nutritions & Supplements',
      to: '/category/nutrition',
      items: [
        { label: 'Multivitamins', to: '/category/nutrition/multivitamins' },
        { label: 'Nutritional Drinks', to: '/category/nutrition/nutritional-drinks' },
      ],
    },
    {
      label: 'Foods & Beverages',
      to: '/category/foods',
      items: [
        { label: 'Honey & Oils', to: '/category/foods/honey-oils' },
        { label: 'Beverages', to: '/category/foods/beverages' },
        { label: 'Chocolate & Confectionary', to: '/category/foods/chocolate-confectionary' },
        { label: 'Biscuits & Wafers', to: '/category/foods/biscuits-wafers' },
        { label: 'Package Food', to: '/category/foods/package-food' },
        { label: 'Tea & Coffee', to: '/category/foods/tea-coffee' },
        { label: 'Snacks', to: '/category/foods/snacks' },
        { label: 'Breakfast & Cereals', to: '/category/foods/breakfast-cereals' },
      ],
    },
    {
      label: 'Devices & Support',
      to: '/category/devices',
      items: [
        { label: 'Cells & Batteries', to: '/category/devices/cells-batteries' },
        { label: 'Other Appliances', to: '/category/devices/other-appliances' },
        { label: 'BP Monitors', to: '/category/devices/bp-monitors' },
        { label: 'Diabetes Apparatus', to: '/category/devices/diabetes-apparatus' },
        { label: 'Supports & Braces', to: '/category/devices/supports-braces' },
        { label: 'Mobility Equipments', to: '/category/devices/mobility-equipments' },
        { label: 'Medicine Accessories', to: '/category/devices/medicine-accessories' },
        { label: 'Thermometer', to: '/category/devices/thermometer' },
        { label: 'Steamers, Nebulizers & Vaporizers', to: '/category/devices/steamers-nebulizers-vaporizers' },
        { label: 'Body Massagers', to: '/category/devices/body-massagers' },
        { label: 'Weighing Scales', to: '/category/devices/weighing-scales' },
      ],
    },

    {
      label: 'Personal Care',
      to: '/category/personal-care',
      items: [
        { label: 'Men Grooming', to: '/category/personal-care/men-grooming' },
        { label: 'Skin Care', to: '/category/personal-care/skin-care' },
        { label: 'Hair Care', to: '/category/personal-care/hair-care' },
        { label: 'Sexual Wellness', to: '/category/personal-care/sexual-wellness' },
        { label: 'Corona Essentials', to: '/category/personal-care/corona-essentials' },
        { label: 'Adult Diapers & Wipes', to: '/category/personal-care/adult-diapers-wipes' },
        { label: 'Feminine Care', to: '/category/personal-care/feminine-care' },
        { label: 'Makeup', to: '/category/personal-care/makeup' },
        { label: 'Hand & Foot Care', to: '/category/personal-care/hand-foot-care' },
        { label: 'Appliances', to: '/category/personal-care/appliances' },
        { label: 'Personal Grooming', to: '/category/personal-care/personal-grooming' },
        { label: 'Body Care', to: '/category/personal-care/body-care' },
        { label: 'Dental Care', to: '/category/personal-care/dental-care' },
      ],
    },

    {
      label: 'OTC And Health Need',
      to: '/category/otc',
      items: [
        { label: 'First Aid', to: '/category/otc/first-aid' },
        { label: 'Acidity & Indigestion', to: '/category/otc/acidity-indigestion' },
        { label: 'Pain & Fever', to: '/category/otc/pain-fever' },
        { label: 'Cough & Cold', to: '/category/otc/cough-cold' },
        { label: 'Diarrhea & Vomiting', to: '/category/otc/diarrhea-vomiting' },
      ],
    },
  ];

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


  // Load all category images using Vite's glob so we can reliably find files regardless of filename quirks
  const categoryImages = import.meta.glob('/src/assets/images/category/*.{png,jpg,jpeg,webp}', { eager: true, as: 'url' });
  const imageEntries = Object.keys(categoryImages).map((p) => ({
    path: p,
    name: p.split('/').pop().replace(/\.[^.]+$/, ''),
    url: categoryImages[p],
  }));

  const normalize = (s) =>
    s
      .toLowerCase()
      .trim()
      .replace(/&amp;|&/g, 'and')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/-+/g, '-')
      .replace(/(^-|-$)/g, '');

  const findImageForLabel = (label) => {
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
      // if label is small, one token match is enough; otherwise require half the tokens to match
      const needed = Math.max(1, Math.ceil(labelTokens.length / 2));
      if (common >= needed) return entry.url;
    }

    // fallback: any long token of the label appearing in filename
    for (const entry of imageEntries) {
      const nameNorm = normalize(entry.name);
      if (labelTokens.some((t) => t.length > 2 && nameNorm.includes(t))) return entry.url;
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

  // Build extra cards from any images in the folder that don't match the
  // existing `categories` list (so we use all remaining images as cards).
  const humanize = (name) =>
    name
      .replace(/[-_]+/g, ' ')
      .replace(/\band\b/g, '&')
      .replace(/\b\w/g, (m) => m.toUpperCase())
      .trim();

  const existingNorms = new Set(categories.map((c) => normalize(c.label)));
  const extraImageCards = imageEntries
    .filter((e) => !existingNorms.has(normalize(e.name)))
    .map((e) => ({
      label: humanize(e.name),
      to: `/category/${slugify(e.name)}`,
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
      <header className="header">
        <div className="header__container">
          <Link to="/" className="header__logo" aria-label="MediEcom Home">
            <div className="header__logo-icon">
              <Heart className="header__heart-icon" />
            </div>
            <span className="header__logo-text">MediEcom</span>
          </Link>

          {/* Header search - inline with logo and action bar on desktop */}
          <form
            className="header__search"
            onSubmit={(e) => {
              e.preventDefault();
              if (!searchQuery) return;
              navigate(`/customer/home?q=${encodeURIComponent(searchQuery)}`);
            }}
            role="search"
          >
            <div className="header__search-wrapper">
              <Search className="header__search-icon" aria-hidden="true" />
              <input
                type="search"
                className="header__search-input"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search products"
              />
              <button type="submit" className="header__search-btn" aria-label="Search">
                <Search size={16} />
              </button>
            </div>
          </form>

          <Link to="/buyer/prescriptions" className="header__upload-pill" aria-label="Upload Prescription">
            <UploadCloud size={18} />
            <span>Upload Rx</span>
          </Link>

          <div className="header__actions">
            <div className="bm-action-bar" role="toolbar" aria-label="Quick actions">
              <Link to="/buyer/profile" className="bm-action" aria-label="Profile"><User size={20} /></Link>
              <Link to="/buyer/wishlist" className="bm-action" aria-label="Wishlist"><Heart size={20} /></Link>
              <Link to="/buyer/cart" className="bm-action" aria-label="Cart"><ShoppingCart size={20} /></Link>
              <Link to="/customer/home" className="bm-action bm-action--info" aria-label="About" title="About Us"><Info size={20} /></Link>
            </div>
          </div>

          <button
            className="header__mobile-toggle"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-expanded={isMobileMenuOpen}
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="header__mobile-menu">
            <nav aria-label="Mobile navigation">
              <div className="header__mobile-actions">
                <div className="bm-action-bar bm-action-bar--mobile">
                  <Link to="/buyer/prescriptions" className="bm-action" onClick={() => setIsMobileMenuOpen(false)} aria-label="Upload Prescription"><UploadCloud size={20} /></Link>
                  <Link to="/buyer/profile" className="bm-action" onClick={() => setIsMobileMenuOpen(false)} aria-label="Profile"><User size={20} /></Link>
                  <Link to="/buyer/wishlist" className="bm-action" onClick={() => setIsMobileMenuOpen(false)} aria-label="Wishlist"><Heart size={20} /></Link>
                  <Link to="/buyer/cart" className="bm-action" onClick={() => setIsMobileMenuOpen(false)} aria-label="Cart"><ShoppingCart size={20} /></Link>
                  <Link to="/customer/home" className="bm-action bm-action--info" onClick={() => setIsMobileMenuOpen(false)} aria-label="About" title="About Us"><Info size={20} /></Link>
                </div>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Categories nav under header */}
      <nav className="bm-categories" aria-label="Medicine categories">
        <div className="header__container">
          {categories.map((c) => (
            <div key={c.to} className="bm-category-wrap">
              <Link
                to={c.to}
                data-cat={c.to}
                className="bm-category"
                aria-expanded={openCategory === c.to}
                onClick={(e) => {
                  // On mobile/small screens, clicking should toggle dropdown; on desktop let it navigate to the category page (view all)
                  const isMobile = window.matchMedia('(max-width: 767px)').matches;
                  if (isMobile && c.items && c.items.length) {
                    e.preventDefault();
                    setOpenCategory(openCategory === c.to ? null : c.to);
                  } else {
                    // desktop: close any open dropdown and allow navigation
                    setOpenCategory(null);
                  }
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
                  {c.items.map((it) => (
                    <Link key={it.to} to={it.to} className="bm-category-dropdown-item" onClick={() => setOpenCategory(null)} role="menuitem">
                      {it.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </nav>

      {/* Banner under categories (uses main.webp from assets/images) */}
      <div className="bm-banner">
        <img src="/src/assets/images/main.webp" alt="Main banner" className="bm-banner-img" />

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
              {categories.map((c) => {
                const slug = slugify(c.label);
                // Try public assets first (support multiple common folders)
                const publicWebp = `/assets/categories/${slug}.webp`;
                const publicPng = `/assets/categories/${slug}.png`;
                const publicWebpAlt = `/assets/images/category/${slug}.webp`;
                const publicPngAlt = `/assets/images/category/${slug}.png`;

                // Also try src folder locations (if images are inside src)
                const srcWebp = `/src/assets/images/categories/${slug}.webp`;
                const srcPng = `/src/assets/images/categories/${slug}.png`;
                const srcWebpAlt = `/src/assets/images/category/${slug}.webp`;
                const srcPngAlt = `/src/assets/images/category/${slug}.png`;

                const sources = [publicWebp, publicPng, publicWebpAlt, publicPngAlt, srcWebp, srcPng, srcWebpAlt, srcPngAlt];

                const resolved = findImageForLabel(c.label);
                const initialSrc = resolved || sources[0];
                return (
                  <Link to={c.to} className="bm-cat-card" key={c.to}>
                    <div className="bm-cat-img-wrap">
                      <img
                        src={initialSrc}
                        alt={c.label}
                        className="bm-cat-img"
                        data-err-idx={resolved ? 0 : 0}
                        onError={(e) => {
                          const el = e.currentTarget;
                          const idx = Number(el.dataset.errIdx || '0');
                          const next = idx + 1;
                          if (next < sources.length) {
                            el.dataset.errIdx = next.toString();
                            el.src = sources[next];
                            return;
                          }
                          // final fallback: simple inline SVG placeholder
                          el.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="320" height="220" viewBox="0 0 320 220"><rect width="100%" height="100%" fill="%23f7f9fb"/><text x="50%" y="50%" fill="%23999" font-family="Arial, Helvetica, sans-serif" font-size="14" text-anchor="middle" dominant-baseline="central">Image not available</text></svg>';
                        }}
                      />
                    </div>
                    <div className="bm-cat-label">{c.label}</div>
                  </Link>
                );
              })}
              {extraImageCards.map((e) => (
                <Link to={e.to} className="bm-cat-card" key={`img-${e.name}`}>
                  <div className="bm-cat-img-wrap">
                    <img
                      src={e.image}
                      alt={e.label}
                      className="bm-cat-img"
                      onError={(ev) => {
                        const el = ev.currentTarget;
                        el.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="320" height="220" viewBox="0 0 320 220"><rect width="100%" height="100%" fill="%23f7f9fb"/><text x="50%" y="50%" fill="%23999" font-family="Arial, Helvetica, sans-serif" font-size="14" text-anchor="middle" dominant-baseline="central">Image not available</text></svg>';
                      }}
                    />
                  </div>
                  <div className="bm-cat-label">{e.label}</div>
                </Link>
              ))}
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

      {/* Featured Products Section */}
      <section className="bm-featured-products" aria-label="Featured Products">
        <div className="header__container">
          <div className="bm-featured-header">
            <h3 className="bm-featured-title">Featured Products</h3>
            <Link to="/products/featured" className="bm-view-all-btn">VIEW ALL</Link>
          </div>
          <div className="bm-featured-wrap">
            <div className="bm-featured-list" ref={featuredRef}>
              {featuredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onToggleWishlist={toggleWishlist}
                  onAddToCart={addToCart}
                />
              ))}
            </div>

            {/* Navigation Controls */}
            <div className="bm-featured-controls" role="toolbar" aria-label="Scroll featured products">
              <button className="bm-featured-btn prev" onClick={() => scrollFeatured(-1)} aria-label="Previous products">
                <i className="bi bi-chevron-left" aria-hidden="true"></i>
              </button>
              <button className="bm-featured-btn next" onClick={() => scrollFeatured(1)} aria-label="Next products">
                <i className="bi bi-chevron-right" aria-hidden="true"></i>
              </button>
            </div>
          </div>
        </div>
      </section>

      <main className="bm-main"></main>
    </div>
  );
};

export default Buyermainpage;
