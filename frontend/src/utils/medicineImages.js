/**
 * Resolve a local medicine image for a product based on its category.
 *
 * Images live under `src/assets/images/medicine/`:
 *   - `1.png` … `10.png` are used for the generic `Medicine` category
 *     (cycled deterministically by product id so the same product
 *     always gets the same picture).
 *   - Named files (`suppliments.png`, `personalcare.png`, `derma.png`,
 *     `antibiotic.png`, `cardiccare.png`, `ance.png`) are mapped to
 *     their respective categories / sub-categories.
 *   - Anything we can't classify falls back to the numbered set so the
 *     UI never shows a broken / placeholder tile.
 *
 * The backend response shape is preserved — we only read existing
 * fields (`category`, `category_name`, `category_id`, `id`).
 */

const medicineImagesGlob = import.meta.glob(
  '/src/assets/images/medicine/*.{png,jpg,jpeg,webp}',
  { eager: true, as: 'url' }
);

const byFile = {};
for (const path in medicineImagesGlob) {
  const file = path.split('/').pop().toLowerCase();
  byFile[file] = medicineImagesGlob[path];
}

function pickByName(base) {
  return (
    byFile[`${base}.png`] ||
    byFile[`${base}.jpg`] ||
    byFile[`${base}.jpeg`] ||
    byFile[`${base}.webp`] ||
    null
  );
}

const numbered = [];
for (let i = 1; i <= 10; i++) {
  const url = pickByName(String(i));
  if (url) numbered.push(url);
}

/**
 * Normalised-category-name → image-file-stem
 * Keys are lowercased, with `&` → `and`, non-alphanumerics → single hyphen.
 */
const CATEGORY_TO_BASENAME = {
  supplements: 'suppliments',
  suppliments: 'suppliments',
  'personal-care': 'personalcare',
  personalcare: 'personalcare',
  derma: 'derma',
  dermatology: 'derma',
  antibiotic: 'antibiotic',
  antibiotics: 'antibiotic',
  'cardio-vascular-system': 'cardiccare',
  'cardiovascular-system': 'cardiccare',
  cardiovascular: 'cardiccare',
  'cardiac-care': 'cardiccare',
  acne: 'ance',
  ance: 'ance',
};

function normalize(s) {
  return String(s || '')
    .toLowerCase()
    .trim()
    .replace(/&amp;|&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function extractCategoryName(product) {
  if (!product) return '';
  if (product.category && typeof product.category === 'object') {
    return product.category.name || product.category.title || '';
  }
  if (typeof product.category === 'string') return product.category;
  if (typeof product.category_name === 'string') return product.category_name;
  return '';
}

function pickNumberedFor(product) {
  if (!numbered.length) return null;
  const idSource =
    Number(product?.id) ||
    Number(product?.inventory_id) ||
    Number(product?.product_id) ||
    0;
  const idx = ((idSource % numbered.length) + numbered.length) % numbered.length;
  return numbered[idx];
}

/**
 * Returns a URL for a local medicine image that matches the product's
 * category, or `null` when no local asset is available.
 */
export function getMedicineImage(product) {
  const key = normalize(extractCategoryName(product));

  // Generic "Medicine" cycles through 1–10.
  if (key === 'medicine') return pickNumberedFor(product);

  // Mapped sub-categories use named files.
  const baseName = CATEGORY_TO_BASENAME[key];
  if (baseName) {
    const url = pickByName(baseName);
    if (url) return url;
  }

  // Fallback: the numbered set keeps tiles looking medicine-y even for
  // categories we haven't explicitly mapped yet.
  return pickNumberedFor(product);
}

export default getMedicineImage;
