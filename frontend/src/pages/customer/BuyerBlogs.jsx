import { Link } from 'react-router-dom';
import { getBlogPreviewPosts } from '../../data/blogPreviews';
import '../../styles/buyerblogs.css';

export default function BuyerBlogs() {
  const posts = getBlogPreviewPosts();

  return (
    <div className="bb-page">
      <header className="bb-header">
        <Link to="/buyer/dashboard" className="bb-back">
          ← Back to dashboard
        </Link>
        <h1 className="bb-title">Blogs</h1>
        <p className="bb-sub">Health tips and articles. Replace images in <code>src/assets/images/blogs/</code> anytime.</p>
      </header>

      <ul className="bb-list">
        {posts.map((post) => (
          <li key={post.id} className="bb-list-item">
            <Link to={`/buyer/blogs/${post.slug}`} className="bb-card">
              <img className="bb-card-thumb" src={post.imageUrl} alt="" width={96} height={96} />
              <span className="bb-card-title">{post.title}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
