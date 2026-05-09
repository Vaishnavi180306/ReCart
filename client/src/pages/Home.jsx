import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchProducts } from '../services/api';
import ProductCard from '../components/ProductCard';
import './Home.css';

const CATEGORIES = ['All', 'Books', 'Electronics', 'Furniture', 'Clothing', 'Other'];
const CONDITIONS = ['All', 'New', 'Like New', 'Used'];

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState('All');
  const [condition, setCondition] = useState('All');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const loadProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (keyword) params.append('keyword', keyword);
      if (category !== 'All') params.append('category', category);
      if (condition !== 'All') params.append('condition', condition);
      if (minPrice) params.append('minPrice', minPrice);
      if (maxPrice) params.append('maxPrice', maxPrice);
      const query = params.toString() ? `?${params.toString()}` : '';
      const { data } = await fetchProducts(query);
      setProducts(data);
    } catch (err) {
      console.error('Failed to load products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [category, condition]);

  const handleSearch = (e) => {
    e.preventDefault();
    loadProducts();
  };

  return (
    <div className="home-page">
      {/* Hero */}
      <section className="hero">
        <div className="hero-content">
          <span className="hero-badge">🎓 Student Marketplace</span>
          <h1>Buy & Sell on Campus</h1>
          <p>Find great deals from students at your college. Safe, simple, and student-first.</p>
          <form className="search-bar" onSubmit={handleSearch}>
            <input
              id="search-input"
              type="text"
              placeholder="Search books, electronics, furniture..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            <button id="search-btn" className="btn btn-primary" type="submit">Search</button>
          </form>
        </div>
      </section>

      <div className="home-body">
        {/* Filters Sidebar */}
        <aside className="filter-sidebar">
          <h3>Filter By</h3>

          <div className="filter-group">
            <label>Category</label>
            <div className="filter-pills">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  className={`pill ${category === cat ? 'active' : ''}`}
                  onClick={() => setCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-group">
            <label>Condition</label>
            <div className="filter-pills">
              {CONDITIONS.map((cond) => (
                <button
                  key={cond}
                  className={`pill ${condition === cond ? 'active' : ''}`}
                  onClick={() => setCondition(cond)}
                >
                  {cond}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-group">
            <label>Price Range</label>
            <div className="price-inputs">
              <input
                type="number"
                placeholder="Min ₹"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              />
              <span>–</span>
              <input
                type="number"
                placeholder="Max ₹"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
            </div>
            <button className="btn btn-primary" style={{ marginTop: '0.75rem', width: '100%' }} onClick={loadProducts}>
              Apply
            </button>
          </div>
        </aside>

        {/* Product Grid */}
        <main className="product-grid-area">
          <div className="grid-header">
            <h2>{loading ? 'Loading...' : `${products.length} Items Found`}</h2>
            <Link to="/create-listing" className="btn btn-primary" id="create-listing-btn">
              + List an Item
            </Link>
          </div>

          {loading ? (
            <div className="loading-grid">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="skeleton-card" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="empty-state">
              <p>😕 No items found. Try a different search or be the first to list!</p>
              <Link to="/create-listing" className="btn btn-primary" style={{ marginTop: '1rem' }}>
                List an Item
              </Link>
            </div>
          ) : (
            <div className="product-grid">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Home;
