import { Link, useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          Re<span>Cart</span>
        </Link>

        <ul className={`nav-menu ${menuOpen ? 'open' : ''}`}>
          <li className="nav-item">
            <Link to="/" className="nav-links" onClick={() => setMenuOpen(false)}>Browse</Link>
          </li>
          {user ? (
            <>
              <li className="nav-item">
                <Link to="/create-listing" className="nav-links" onClick={() => setMenuOpen(false)}>
                  + List Item
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/dashboard" className="nav-links" onClick={() => setMenuOpen(false)}>Dashboard</Link>
              </li>
              <li className="nav-item">
                <div className="nav-user-menu">
                  <div className="nav-avatar" onClick={() => setMenuOpen(!menuOpen)}>
                    {user.name?.[0]?.toUpperCase()}
                  </div>
                  {menuOpen && (
                    <div className="dropdown-menu">
                      <p className="dropdown-name">{user.name}</p>
                      <p className="dropdown-email">{user.email}</p>
                      <hr />
                      <Link to="/dashboard" className="dropdown-item" onClick={() => setMenuOpen(false)}>Dashboard</Link>
                      <button className="dropdown-item danger" onClick={handleLogout}>Logout</button>
                    </div>
                  )}
                </div>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <Link to="/login" className="nav-links" onClick={() => setMenuOpen(false)}>Login</Link>
              </li>
              <li className="nav-item">
                <Link to="/register" className="nav-btn" onClick={() => setMenuOpen(false)}>Sign Up</Link>
              </li>
            </>
          )}
        </ul>

        {/* Mobile hamburger */}
        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
          <span /><span /><span />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
