import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Auth.css';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', college: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form.name, form.email, form.password, form.college);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">ReCart</div>
        <h2>Create an account</h2>
        <p className="auth-subtitle">Join your campus marketplace</p>

        {error && <div className="auth-error">{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input id="reg-name" type="text" name="name" placeholder="Your name" value={form.name} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>College Email</label>
            <input id="reg-email" type="email" name="email" placeholder="your@college.edu" value={form.email} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>College Name</label>
            <input id="reg-college" type="text" name="college" placeholder="e.g. MIT, IIT Delhi" value={form.college} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input id="reg-password" type="password" name="password" placeholder="Create a password" value={form.password} onChange={handleChange} required />
          </div>
          <button id="reg-submit" className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
