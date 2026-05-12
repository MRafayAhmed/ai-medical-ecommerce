/**
 * Brand logos on the buyer dashboard (`src/assets/images/brand/`).
 * Order: first entries appear first (matches a single “hero” row on wide screens).
 */

const brandImageModules = import.meta.glob('/src/assets/images/brand/*.{png,jpg,jpeg,webp}', {
  eager: true,
  as: 'url',
});

/** Preferred order (filenames). Unknown files are appended alphabetically. */
const BRAND_ORDER = [
  'ferozsons.png',
  'pharmaevo.png',
  'sandoz.png',
  'highnoon.png',
  'gsk.png',
  'abbott.png',
  'searle.png',
  'dermatechno.png',
  'lci.png',
  'valour pharma.png',
  'ali gohar company.png',
  'atcopharma.png',
  'chiesi.png',
  'getz.png',
  'Npharma.png',
];

function slugifyFilename(filename) {
  const base = String(filename).replace(/\.[^.]+$/, '');
  return base
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^\w]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function humanizeFilename(filename) {
  const base = String(filename)
    .replace(/\.[^.]+$/, '')
    .replace(/[-_]+/g, ' ')
    .trim();
  return base.replace(/\b\w/g, (m) => m.toUpperCase()).trim();
}

export function getDashboardBrands() {
  const keys = Object.keys(brandImageModules);
  const orderedKeys = [];
  const usedKeys = new Set();

  for (const file of BRAND_ORDER) {
    const full = `/src/assets/images/brand/${file}`;
    if (brandImageModules[full]) {
      orderedKeys.push(full);
      usedKeys.add(full);
    }
  }

  const rest = keys
    .filter((k) => !usedKeys.has(k))
    .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));

  orderedKeys.push(...rest);

  return orderedKeys.map((key) => {
    const file = key.split('/').pop();
    return {
      id: file,
      slug: slugifyFilename(file),
      name: humanizeFilename(file),
      url: brandImageModules[key],
    };
  });
}
