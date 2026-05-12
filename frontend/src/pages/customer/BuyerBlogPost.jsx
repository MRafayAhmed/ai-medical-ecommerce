import { Link, useParams } from 'react-router-dom';
import { getBlogPreviewPosts } from '../../data/blogPreviews';
import '../../styles/buyerblogs.css';

export default function BuyerBlogPost() {
  const { slug } = useParams();
  const posts = getBlogPreviewPosts();
  const post = posts.find((p) => p.slug === slug);

  if (!post) {
    return (
      <div className="bb-page">
        <p className="bb-sub">Article not found.</p>
        <Link to="/buyer/blogs" className="bb-back">← All blogs</Link>
      </div>
    );
  }

  return (
    <div className="bb-page bb-post">
      <Link to="/buyer/blogs" className="bb-back">← All blogs</Link>
      <article className="bb-article">
        <img className="bb-article-hero" src={post.imageUrl} alt="" />
        <h1 className="bb-article-title">{post.title}</h1>
        <p className="bb-article-placeholder">
          Full article content can be loaded from your CMS or API later. This route exists so dashboard links work.
        </p>
      </article>
    </div>
  );
}
