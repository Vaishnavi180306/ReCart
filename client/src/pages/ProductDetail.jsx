import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchProduct, deleteProduct } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import './ProductDetail.css';

const PLACEHOLDER_IMG = 'https://via.placeholder.com/600x400?text=No+Image';

const ProductDetail = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await fetchProduct(id);
        setProduct(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this listing?')) return;
    try {
      await deleteProduct(id);
      navigate('/');
    } catch (err) {
      alert('Failed to delete listing.');
    }
  };

  if (loading) return <div className="detail-loading">Loading...</div>;
  if (!product) return <div className="detail-loading">Product not found.</div>;

  const images = product.images && product.images.length > 0
    ? product.images.map((i) => i.url)
    : [PLACEHOLDER_IMG];

  const isSeller = user && product.seller && user._id === product.seller._id;

  return (
    <div className="product-detail-page">
      <div className="product-detail-container">
        {/* Image Gallery */}
        <div className="detail-gallery">
          <div className="detail-main-img-wrap">
            <img src={images[activeImg]} alt={product.title} className="detail-main-img" />
          </div>
          {images.length > 1 && (
            <div className="detail-thumbs">
              {images.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt={`thumb-${i}`}
                  className={`detail-thumb ${activeImg === i ? 'active' : ''}`}
                  onClick={() => setActiveImg(i)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="detail-info">
          <div className="detail-badges">
            <span className="badge-condition">{product.condition}</span>
            {product.isCampusOnly && <span className="badge-campus">🎓 Campus Only</span>}
            {product.acceptsExchange && <span className="badge-exchange">🔄 Open to Exchange</span>}
          </div>

          <h1 className="detail-title">{product.title}</h1>

          <div className="detail-price">
            ₹{product.price.toLocaleString()}
            {product.isNegotiable && <span className="negotiable-tag">Negotiable</span>}
          </div>

          <p className="detail-description">{product.description}</p>

          <div className="detail-meta">
            <div className="meta-item">
              <span className="meta-label">Category</span>
              <span>{product.category}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Location</span>
              <span>📍 {product.location}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Status</span>
              <span className={`status-badge ${product.status === 'Available' ? 'available' : 'sold'}`}>
                {product.status}
              </span>
            </div>
          </div>

          {/* Seller Info */}
          {product.seller && (
            <div className="seller-card">
              <div className="seller-avatar">
                {product.seller.name?.[0]?.toUpperCase()}
              </div>
              <div>
                <p className="seller-name">
                  {product.seller.name}
                  {product.seller.isVerified && <span className="verified-badge">✓ Verified</span>}
                </p>
                <p className="seller-college">🏫 {product.seller.college}</p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="detail-actions">
            {isSeller ? (
              <button className="btn btn-danger" onClick={handleDelete}>
                🗑 Delete Listing
              </button>
            ) : (
              <button
                className="btn btn-primary"
                onClick={() => user ? navigate(`/chat/${product.seller._id}/${product._id}`) : navigate('/login')}
              >
                💬 Chat with Seller
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
