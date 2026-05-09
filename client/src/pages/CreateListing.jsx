import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { createProduct } from '../services/api';
import './CreateListing.css';

const CATEGORIES = ['Books', 'Electronics', 'Furniture', 'Clothing', 'Other'];
const CONDITIONS = ['New', 'Like New', 'Used'];

const CreateListing = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    condition: '',
    location: '',
    isNegotiable: false,
    acceptsExchange: false,
    isCampusOnly: false,
  });
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
    const previewUrls = files.map((f) => URL.createObjectURL(f));
    setPreviews(previewUrls);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => formData.append(k, v));
      images.forEach((img) => formData.append('images', img));
      await createProduct(formData);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create listing.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-listing-page">
      <div className="create-listing-container">
        <h2>📦 List an Item</h2>
        <p className="create-listing-sub">Fill in the details to sell or exchange your item.</p>

        {error && <div className="auth-error">{error}</div>}

        <form className="create-listing-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Title *</label>
              <input name="title" type="text" placeholder="e.g. Engineering Mathematics Book" value={form.title} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Price (₹) *</label>
              <input name="price" type="number" placeholder="0" value={form.price} onChange={handleChange} required min="0" />
            </div>
          </div>

          <div className="form-group">
            <label>Description *</label>
            <textarea name="description" rows="4" placeholder="Describe your item, its condition, any damage, etc." value={form.description} onChange={handleChange} required />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Category *</label>
              <select name="category" value={form.category} onChange={handleChange} required>
                <option value="">Select category</option>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Condition *</label>
              <select name="condition" value={form.condition} onChange={handleChange} required>
                <option value="">Select condition</option>
                {CONDITIONS.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Location *</label>
            <input name="location" type="text" placeholder="e.g. North Campus, Hostel Block A" value={form.location} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Images (up to 5)</label>
            <div className="image-upload-area" onClick={() => document.getElementById('image-input').click()}>
              {previews.length > 0 ? (
                <div className="image-previews">
                  {previews.map((src, i) => (
                    <img key={i} src={src} alt={`preview-${i}`} className="preview-thumb" />
                  ))}
                </div>
              ) : (
                <div className="upload-placeholder">
                  <span>📷</span>
                  <p>Click to upload images</p>
                </div>
              )}
              <input id="image-input" type="file" multiple accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
            </div>
          </div>

          <div className="toggle-group">
            <label className="toggle-label">
              <input type="checkbox" name="isNegotiable" checked={form.isNegotiable} onChange={handleChange} />
              <span>Price is Negotiable</span>
            </label>
            <label className="toggle-label">
              <input type="checkbox" name="acceptsExchange" checked={form.acceptsExchange} onChange={handleChange} />
              <span>Open to Exchange</span>
            </label>
            <label className="toggle-label">
              <input type="checkbox" name="isCampusOnly" checked={form.isCampusOnly} onChange={handleChange} />
              <span>Campus Only Listing</span>
            </label>
          </div>

          <button className="btn btn-primary" type="submit" disabled={loading} style={{ marginTop: '1.5rem', width: '100%', height: '50px' }}>
            {loading ? 'Publishing...' : 'Publish Listing'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateListing;
