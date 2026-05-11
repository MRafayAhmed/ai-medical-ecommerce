import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import '../styles/skeletons.css';

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

const CATEGORY_NAV_LIMIT = 11;

function slugify(label) {
  return String(label || '')
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^\w]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/(^-|-$)/g, '');
}

/**
 * Same strip as the buyer dashboard: horizontal category links under BuyerNavbar.
 * Pass `categories` + `loadingCategories` from Buyermainpage to avoid a duplicate /buyer/dashboard fetch.
 * Omit both on CategoryPage (and similar) to load categories from the dashboard API once.
 */
export default function BuyerTopCategoryNav({ pageRef, categories: categoriesProp, loadingCategories: loadingProp }) {
  const useParent = Array.isArray(categoriesProp) && typeof loadingProp === 'boolean';

  const [internalCats, setInternalCats] = useState([]);
  const [internalLoading, setInternalLoading] = useState(true);

  const categories = useParent ? categoriesProp : internalCats;
  const loadingCategories = useParent ? loadingProp : internalLoading;

  useEffect(() => {
    if (useParent) return undefined;
    let cancelled = false;
    (async () => {
      setInternalLoading(true);
      try {
        const response = await api.get('/buyer/dashboard');
        const { categories: catPayload } = response.data;
        const raw = Array.isArray(catPayload?.data)
          ? catPayload.data
          : Array.isArray(catPayload)
            ? catPayload
            : [];
        const mapped = raw.map((cat) => ({
          id: cat.id,
          label: cat.name,
          to: `/buyer/category/${cat.id}/${slugify(cat.name)}`,
          image: null,
          items: [],
        }));
        if (!cancelled) setInternalCats(mapped);
      } catch (e) {
        console.error('BuyerTopCategoryNav: failed to load categories', e);
        if (!cancelled) setInternalCats([]);
      } finally {
        if (!cancelled) setInternalLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [useParent]);

  const displayCategories = useMemo(() => {
    const baseCats =
      categories.length > 0
        ? categories
        : loadingCategories
          ? []
          : defaultCategories;
    return baseCats.map((cat) => ({
      ...cat,
      slug: slugify(cat.label),
    }));
  }, [categories, loadingCategories]);

  const navDisplayCategories = useMemo(
    () => displayCategories.slice(0, CATEGORY_NAV_LIMIT),
    [displayCategories],
  );

  const [openCategory, setOpenCategory] = useState(null);

  useEffect(() => {
    const onDocClick = (e) => {
      if (e.target.closest('.bm-category') || e.target.closest('.bm-category-dropdown')) return;
      setOpenCategory(null);
    };
    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, []);

  useEffect(() => {
    const root = pageRef?.current;
    if (!root) return undefined;

    const supportsHover = window.matchMedia('(hover: hover) and (min-width: 768px)').matches;
    if (!supportsHover) return undefined;

    const items = Array.from(root.querySelectorAll('.bm-categories .bm-category'));
    function onEnter(e) {
      const key = e.currentTarget.getAttribute('data-cat');
      setOpenCategory(key);
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
      const related = e.relatedTarget;
      if (related && related.closest && related.closest('.bm-category-dropdown')) return;
      setOpenCategory(null);
    }

    items.forEach((el) => {
      el.addEventListener('mouseenter', onEnter);
      el.addEventListener('mouseleave', onLeave);
    });

    return () => {
      items.forEach((el) => {
        el.removeEventListener('mouseenter', onEnter);
        el.removeEventListener('mouseleave', onLeave);
      });
    };
  }, [pageRef, navDisplayCategories.length, loadingCategories]);

  useEffect(() => {
    const root = pageRef?.current;
    if (!root || !openCategory) return;

    const cat = root.querySelector(`[data-cat="${openCategory}"]`);
    const drop = root.querySelector(`[data-drop="${openCategory}"]`);
    if (!cat || !drop) return;

    const rect = cat.getBoundingClientRect();
    const left = Math.max(8, rect.left);
    const top = rect.bottom + 8;

    drop.style.minWidth = `${Math.max(rect.width, 180)}px`;
    drop.style.left = `${left}px`;
    drop.style.top = `${top}px`;

    const dr = drop.getBoundingClientRect();
    const viewportRight = window.innerWidth - 12;
    if (dr.right > viewportRight) {
      const shift = dr.right - viewportRight;
      drop.style.left = `${Math.max(8, left - shift)}px`;
    }
  }, [openCategory, pageRef]);

  return (
    <nav className="bm-categories" aria-label="Medicine categories">
      <div className="header__container">
        {loadingCategories && categories.length === 0 ? (
          Array.from({ length: CATEGORY_NAV_LIMIT }, (_, idx) => (
            <div key={`cat-nav-skel-${idx}`} className="bm-category-wrap">
              <div
                className="bm-category bm-category--skeleton pulse"
                style={{ width: `${56 + ((idx * 7) % 5) * 14}px` }}
                aria-hidden
              />
            </div>
          ))
        ) : (
          navDisplayCategories.map((c, idx) => (
            <div key={`cat-nav-${c.id || idx}`} className="bm-category-wrap">
              <Link
                to={c.to}
                data-cat={c.to}
                className="bm-category"
                aria-expanded={openCategory === c.to}
                onClick={() => {
                  setOpenCategory(null);
                }}
                onKeyDown={(e) => {
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
                <div
                  data-drop={c.to}
                  className={`bm-category-dropdown ${openCategory === c.to ? 'bm-open' : ''}`}
                  role="menu"
                  aria-label={`Subcategories for ${c.label}`}
                >
                  {c.items.map((it, sIdx) => (
                    <Link
                      key={`subcat-${it.to}-${sIdx}`}
                      to={it.to}
                      className="bm-category-dropdown-item"
                      onClick={() => setOpenCategory(null)}
                      role="menuitem"
                    >
                      {it.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </nav>
  );
}
