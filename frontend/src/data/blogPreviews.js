/**
 * Dashboard “Blogs” row — titles and optional image filenames.
 *
 * Add matching files under: frontend/src/assets/images/blogs/
 * (e.g. blog-emergency-contraception.jpg). Supported: png, jpg, jpeg, webp.
 * If a file is missing, a neutral placeholder image is used.
 */

const blogImageModules = import.meta.glob('/src/assets/images/blogs/*.{png,jpg,jpeg,webp}', {
  eager: true,
  as: 'url',
});

const PLACEHOLDER_IMAGES = [
  'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=240&h=240&fit=crop&q=80',
  'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=240&h=240&fit=crop&q=80',
  'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=240&h=240&fit=crop&q=80',
];

export const BLOG_PREVIEW_POSTS = [
  {
    id: 1,
    slug: 'emergency-contraceptive-pill',
    title: 'Emergency Contraceptive Pill: What You Should Know',
    file: 'blog-emergency-contraception.jpg',
  },
  {
    id: 2,
    slug: 'summer-skincare-routine',
    title: 'What Should Be Your Summer Skincare Routine?',
    file: 'blog-summer-skincare.jpg',
  },
  {
    id: 3,
    slug: 'irregular-periods-guide',
    title: 'Irregular Periods: When To Worry And When Not',
    file: 'blog-irregular-periods.jpg',
  },
];

export function resolveBlogImageUrl(file, index = 0) {
  const key = `/src/assets/images/blogs/${file}`;
  if (blogImageModules[key]) return blogImageModules[key];
  return PLACEHOLDER_IMAGES[index % PLACEHOLDER_IMAGES.length];
}

export function getBlogPreviewPosts() {
  return BLOG_PREVIEW_POSTS.map((post, index) => ({
    ...post,
    imageUrl: resolveBlogImageUrl(post.file, index),
  }));
}
