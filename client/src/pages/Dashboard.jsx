import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { deleteProduct } from '../services/api';
import axios from 'axios';
import './Dashboard.css';

const API_URL = 'http://localhost:5000/api';

const TABS = ['listings', 'wishlist', 'chats', 'profile'];

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [tab, setTab] = useState('listings');
  const [listings, setListings] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(false);

  const headers = { Authorization: `Bearer ${user?.token}` };

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadTab(tab);
  }, [tab, user]);

  const loadTab = async (t) => {
    setLoading(true);
    try {
      if (t === 'listings') {
        const { data } = await axios.get(`${API_URL}/users/my-listings`, { headers });
        setListings(data);
      } else if (t === 'wishlist') {
        const { data } = await axios.get(`${API_URL}/users/wishlist`, { headers });
        setWishlist(data);
      } else if (t === 'chats') {
        const { data } = await axios.get(`${API_URL}/messages/conversations`, { headers });
        setConversations(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteListing = async (id) => {
    if (!window.confirm('Delete this listing?')) return;
    try {
      await deleteProduct(id);
      setListings((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      alert('Failed to delete');
    }
  };

  const handleRemoveWishlist = async (productId) => {
    try {
      await axios.put(`${API_URL}/users/wishlist/${productId}`, {}, { headers });
      setWishlist((prev) => prev.filter((p) => p._id !== productId));
    } catch (err) {
      console.error(err);
    }
  };

  if (!user) return null;

  const trustLevel = user.trustScore >= 80 ? 'Excellent' : user.trustScore >= 50 ? 'Good' : 'New';

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        {/* Sidebar */}
        <aside className="dashboard-sidebar">
          <div className="dash-profile-card">
            <div className="dash-avatar">
              {user.name?.[0]?.toUpperCase()}
            </div>
            <h3>{user.name}</h3>
            <p className="dash-email">{user.email}</p>
            <p className="dash-college">🏫 {user.college}</p>
            <div className="trust-score-bar">
              <span>Trust Score</span>
              <div className="trust-bar-bg">
                <div className="trust-bar-fill" style={{ width: `${user.trustScore || 5}%` }} />
              </div>
              <span className={`trust-label ${trustLevel.toLowerCase()}`}>{trustLevel}</span>
            </div>
          </div>

          <nav className="dash-nav">
            {TABS.map((t) => (
              <button
                key={t}
                className={`dash-nav-btn ${tab === t ? 'active' : ''}`}
                onClick={() => setTab(t)}
              >
                {t === 'listings' && '📦'}
                {t === 'wishlist' && '❤️'}
                {t === 'chats' && '💬'}
                {t === 'profile' && '⚙️'}
                <span>{t.charAt(0).toUpperCase() + t.slice(1)}</span>
              </button>
            ))}
            <button className="dash-nav-btn danger" onClick={() => { logout(); navigate('/'); }}>
              🚪 <span>Logout</span>
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="dashboard-main">
          {loading ? (
            <div className="dash-loading">Loading...</div>
          ) : (
            <>
              {/* My Listings */}
              {tab === 'listings' && (
                <section>
                  <div className="dash-section-header">
                    <h2>My Listings</h2>
                    <Link to="/create-listing" className="btn btn-primary">+ New Listing</Link>
                  </div>
                  {listings.length === 0 ? (
                    <div className="dash-empty">
                      <p>You haven't listed anything yet.</p>
                      <Link to="/create-listing" className="btn btn-primary">List your first item</Link>
                    </div>
                  ) : (
                    <div className="dash-list">
                      {listings.map((item) => (
                        <div key={item._id} className="dash-list-item">
                          <img
                            src={item.images?.[0]?.url || 'https://via.placeholder.com/80'}
                            alt={item.title}
                            className="dash-list-img"
                          />
                          <div className="dash-list-info">
                            <Link to={`/product/${item._id}`} className="dash-list-title">{item.title}</Link>
                            <p className="dash-list-price">₹{item.price.toLocaleString()}</p>
                            <span className={`status-pill ${item.status.toLowerCase()}`}>{item.status}</span>
                          </div>
                          <button className="btn-icon danger" title="Delete" onClick={() => handleDeleteListing(item._id)}>🗑</button>
                        </div>
                      ))}
                    </div>
                  )}
                </section>
              )}

              {/* Wishlist */}
              {tab === 'wishlist' && (
                <section>
                  <h2>My Wishlist</h2>
                  {wishlist.length === 0 ? (
                    <div className="dash-empty"><p>Your wishlist is empty. Browse and save items!</p></div>
                  ) : (
                    <div className="dash-list">
                      {wishlist.map((item) => (
                        <div key={item._id} className="dash-list-item">
                          <img
                            src={item.images?.[0]?.url || 'https://via.placeholder.com/80'}
                            alt={item.title}
                            className="dash-list-img"
                          />
                          <div className="dash-list-info">
                            <Link to={`/product/${item._id}`} className="dash-list-title">{item.title}</Link>
                            <p className="dash-list-price">₹{item.price.toLocaleString()}</p>
                          </div>
                          <button className="btn-icon" title="Remove" onClick={() => handleRemoveWishlist(item._id)}>✕</button>
                        </div>
                      ))}
                    </div>
                  )}
                </section>
              )}

              {/* Chats */}
              {tab === 'chats' && (
                <section>
                  <h2>My Chats</h2>
                  {conversations.length === 0 ? (
                    <div className="dash-empty"><p>No conversations yet.</p></div>
                  ) : (
                    <div className="dash-list">
                      {conversations.map((convo, i) => {
                        const other = convo._id?.otherUser;
                        const prod = convo._id?.product;
                        const lastMsg = convo.lastMessage;
                        return (
                          <Link
                            key={i}
                            to={`/chat/${other?._id}/${prod?._id}`}
                            className="dash-list-item clickable"
                          >
                            <div className="dash-chat-avatar">
                              {other?.name?.[0]?.toUpperCase() || '?'}
                            </div>
                            <div className="dash-list-info">
                              <p className="dash-list-title">{other?.name || 'Unknown'}</p>
                              <p className="dash-chat-product">Re: {prod?.title || 'Unknown Item'}</p>
                              <p className="dash-chat-preview">{lastMsg?.content}</p>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </section>
              )}

              {/* Profile Settings */}
              {tab === 'profile' && (
                <section>
                  <h2>Profile Settings</h2>
                  <div className="profile-info-grid">
                    <div className="profile-info-item">
                      <label>Name</label>
                      <p>{user.name}</p>
                    </div>
                    <div className="profile-info-item">
                      <label>Email</label>
                      <p>{user.email}</p>
                    </div>
                    <div className="profile-info-item">
                      <label>College</label>
                      <p>{user.college}</p>
                    </div>
                    <div className="profile-info-item">
                      <label>Trust Score</label>
                      <p>{user.trustScore || 0}/100</p>
                    </div>
                    <div className="profile-info-item">
                      <label>Verified</label>
                      <p>{user.isVerified ? '✓ Verified' : 'Not yet verified'}</p>
                    </div>
                  </div>
                </section>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
