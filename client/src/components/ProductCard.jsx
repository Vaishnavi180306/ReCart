import React from 'react';
import { Link } from 'react-router-dom';
import './ProductCard.css';

const PLACEHOLDER_IMG = 'https://via.placeholder.com/300x200?text=No+Image';

const conditionColors = {
  'New': '#10b981',
  'Like New': '#3b82f6',
  'Used': '#f59e0b',
};

const ProductCard = ({ product }) => {
  const imageUrl = product.images && product.images.length > 0
    ? product.images[0].url
    : PLACEHOLDER_IMG;

  return (
    <Link to={`/product/${product._id}`} className="product-card">
      <div className="product-card-img-wrap">
        <img src={imageUrl} alt={product.title} className="product-card-img" />
        <span
          className="condition-badge"
          style={{ background: conditionColors[product.condition] || '#6b7280' }}
        >
          {product.condition}
        </span>
        {product.isCampusOnly && (
          <span className="campus-badge">🎓 Campus Only</span>
        )}
      </div>
      <div className="product-card-body">
        <h3 className="product-card-title">{product.title}</h3>
        <div className="product-card-meta">
          <span className="product-card-price">
            ₹{product.price.toLocaleString()}
            {product.isNegotiable && <span className="negotiable-tag">Negotiable</span>}
          </span>
        </div>
        <div className="product-card-footer">
          <span className="product-card-category">{product.category}</span>
          <span className="product-card-location">📍 {product.location}</span>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
