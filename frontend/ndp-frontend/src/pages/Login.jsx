import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthService from '../services/AuthService';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await AuthService.login(username, password);
      AuthService.setToken(response.data.token);
      AuthService.setUser(response.data);
      navigate('/');
    } catch (err) {
      setError('Invalid username or password.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="row justify-content-center align-items-center min-vh-75">
      <div className="col-md-6 col-lg-4">
        <div className="card">
          <div className="card-header bg-primary text-white text-center">
            <h4 className="mb-0">
              <span className="me-2">👋</span> Welcome Back!
            </h4>
          </div>
          <div className="card-body p-4">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label fw-bold">Username</label>
                <div className="input-group">
                  <span className="input-group-text">👤</span>
                  <input
                    type="text"
                    className="form-control"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                    required
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <label className="form-label fw-bold">Password</label>
                <div className="input-group">
                  <span className="input-group-text">🔒</span>
                  <input
                    type="password"
                    className="form-control"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                  />
                </div>
              </div>
              
              {error && (
                <div className="alert alert-danger py-2">
                  ⚠️ {error}
                </div>
              )}
              
              <button
                type="submit"
                className="btn btn-primary w-100 py-2"
                disabled={loading}
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>
            
            <div className="text-center mt-4">
              <Link to="/register" className="text-decoration-none">
                Don't have an account? <strong>Register here</strong>
              </Link>
              <br />
              <Link to="/forgot-password" className="text-decoration-none text-muted small">
                Forgot password?
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
